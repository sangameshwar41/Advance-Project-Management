
function errorHandler(error, req, res, next) {
    console.log("Error: " + error.message);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Internal Server Error"
    });
    
}

module.exports = errorHandler;
