// class ErrorHandler extends Error{
//     constructor(message,statusCode){
//         super(message);
//         this.statusCode = statusCode
//         console.log('ErrorHandler constructor called with:', message, statusCode);

//         Error.captureStackTrace(this,this.constructor);

//     }
    
// }
// utilities/ErrorHandler.js
const ErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
  
    res.status(statusCode).json({
      success: false,
      message,
    });
  };
  
  module.exports = ErrorHandler;
  

module.exports = ErrorHandler