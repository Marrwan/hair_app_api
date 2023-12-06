const { VALIDATION_ERROR } = require("../errors/ApiError");

const validateRequest = (request, schema, property) => {
    let {error} = schema.validate(request[property]);
    if(error){
        
        throw new VALIDATION_ERROR("validation error", 201,  error)  // can be error.message
    }

}

module.exports = validateRequest;