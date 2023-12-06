
const { USER_EXISTS, USER_NOT_FOUND, ERROR_500, ROUTE_NOT_FOUND } = require("../../constants/messages.constant");
const STATUS = require("../../constants/status.constant");
const BaseError = require("./BaseError");

class USER_EXISTS_ERROR extends BaseError {
  constructor(
    name,
    statusCode = STATUS.CONFLICT,
    description = USER_EXISTS.message,
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

class USER_404_ERROR extends BaseError {
  constructor(
    name,
    statusCode = STATUS.NOT_FOUND,
    description = USER_NOT_FOUND.message,
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

class SERVER_ERROR extends BaseError {
  constructor(
    name,
    statusCode = STATUS.INTERNAL_SERVER,
    description = ERROR_500.message,
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

class VALIDATION_ERROR extends BaseError {
  constructor(
    name,
    statusCode = STATUS.BAD,
    description = "Validation error",
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

class ROUTE_404_ERROR extends BaseError{
  constructor(name, statusCode = STATUS.NOT_FOUND, description= ROUTE_NOT_FOUND.message, isOperational= true){
    super(name, statusCode, description, isOperational)
  }
}

module.exports = {
  SERVER_ERROR,
  USER_EXISTS_ERROR,
  USER_404_ERROR,
  VALIDATION_ERROR,
  ROUTE_404_ERROR
};
