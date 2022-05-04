function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: false, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.query, options);
    if (error) {
        // next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);

        next(error.details[0]);

        // let errList = []
        // error.details.forEach((err)=>{
        //     errList.push({"message":err.message})
        // })
        // next(errList)

    } else {
        req.query = value;
        next();
    }
}

module.exports = validateRequest;