const Joi = require('joi');
const Flow = require('../models/flow');

const schema = Joi.object({
    
    name: Joi.string()
        .required(),

    description: Joi.string()
        .required(),

    sorted: Joi.boolean()
        .required(),    
});

const editSchema = Joi.object({
    
    name: Joi.string(),

    description: Joi.string(),

    sorted: Joi.boolean()    
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

const flowMiddleware = {
    verifyBody,
    verifyEditBody
};

module.exports = flowMiddleware;