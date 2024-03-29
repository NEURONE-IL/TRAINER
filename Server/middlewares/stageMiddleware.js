const Joi = require('joi');
const { isValidObjectId } = require('mongoose');

const schema = Joi.object({
    
    title: Joi.string()
        .required(),      
    
    description: Joi.string()
        .required(),
    
    step: Joi.number()
        .required(),

    flow: Joi.any()
        .required(),

    type: Joi.string()
        .required(),

    externalId: Joi.string()
        .required(),

    externalName: Joi.string()
        .required(),

    module: Joi.any(),

    assistant: Joi.any()

});

const editSchema = Joi.object({
    
    title: Joi.string(),
    
    description: Joi.string(),
    
    step: Joi.number(),

    flow: Joi.any(),

    type: Joi.string(),
    
    externalId: Joi.string(),

    externalName: Joi.string(),

    module: Joi.any(),

    assistant: Joi.any(),

    userEdit: Joi.string(),

});

verifyBody = async (req, res, next) => {
    try {
        const validation = await schema.validateAsync(req.body);
        next();
    }
    catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
};

verifyEditBody = async (req, res, next) => {
    try {
        const validation = await editSchema.validateAsync(req.body);
        next();
    }
    catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
};

const stageMiddleware = {
    verifyBody,
    verifyEditBody
};

module.exports = stageMiddleware;