class DatabaseException extends Error{
    errorCode;
    status;
    message;

    constructor (errorCode, status, message) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
        this.message = message;
    }
}

class NotFoundException extends DatabaseException {
    constructor (message){
        super(404, "Not found.", message);
    }
}

class DuplicateEntryException extends DatabaseException {
    constructor (message){
        super(400, "Bad request.", message);
    }
}

class ForeignKeyViolationException extends DatabaseException {
    constructor (message){
        super(400, "Bad request", message);
    }
}

/* class UpdateFailedException extends DatabaseException {
    constructor (message, data){
        super(ErrorCodes.UpdateFailedException, message, data, true, ErrorStatusCodes.UpdateFailedException);
    }
} */

class CreateFailedException extends DatabaseException {
    constructor (message){
        super(400, "Bad request", message);
    }
}

class ValidationException extends DatabaseException {
    constructor (message){
        super(400, "Bad request",  message);
    }
}

module.exports = {
    NotFoundException,
    DuplicateEntryException,
    ForeignKeyViolationException,
    ValidationException,
    //UpdateFailedException,
    CreateFailedException
};