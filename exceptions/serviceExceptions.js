class ServiceException extends Error {
    errorCode;
    status;
    message;

    constructor (errorCode, status, message="Ooops, something went wrong.") {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
        this.message = message;
    }
}

class InternalServerException extends ServiceException {
    constructor (message){
        super(500, "Internal Server Error", message);
    }
}

class InvalidEndpointException extends ServiceException {
    constructor (message){
        super(503, "Endpoint Not Found",  message);
    }
}

/* module.exports = class UnimplementedException extends ServiceException {
    constructor (data){
        super(501, "Service Not Implemented Yet.", "El servicio no está implementado por ahora.", data);
    }
} */

/* class HealthCheckFailedException extends ServiceException {
    constructor (data){
        super(ErrorCodes.HealthCheckFailedException, "API failed to run", data, ErrorStatusCodes.HealthCheckFailedException);
    }
} */

module.exports = {
    InternalServerException,
    InvalidEndpointException,
    //UnimplementedException,
    //HealthCheckFailedException
};