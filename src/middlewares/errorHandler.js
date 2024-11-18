const errorHandler = (err, req, res, next) => {

  console.error('[Error Handler] Error:', err);  
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: 'Something went wrong',
    data: err.message || 'Unknown error',
  });
};

export default errorHandler;
