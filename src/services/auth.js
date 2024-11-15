import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    throw createHttpError(
      500,
      'Server configuration error: token secrets are missing',
    );
  }

  const accessToken = jwt.sign({ userId: user._id }, accessTokenSecret, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId: user._id }, refreshTokenSecret, {
    expiresIn: '30d',
  });

  await Session.findOneAndDelete({ userId: user._id });

  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  await session.save();

  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret) {
    throw createHttpError(
      500,
      'Server configuration error: access token secret is missing',
    );
  }

  const accessToken = jwt.sign({ userId: session.userId }, accessTokenSecret, {
    expiresIn: '15m',
  });

  await Session.findOneAndDelete({ userId: session.userId });

  const newSession = new Session({
    userId: session.userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: session.refreshTokenValidUntil,
  });
  await newSession.save();

  return accessToken;
};

export const logoutSession = async (refreshToken) => {
  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Invalid session');
  }
};
