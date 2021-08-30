const Joi = require('joi');
const Module = require('../models/module');

const schema = Joi.object({
    
    name: Joi.string()
        .required(),

    description: Joi.string()
        .required(),

    code: Joi.string()
        .required(),  
        
    flow: Joi.any()
    .required(),
});

const editSchema = Joi.object({
    
    name: Joi.string(),

    description: Joi.string(),

    code: Joi.string(),
    
    flow: Joi.any()
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

const moduleMiddleware = {
    verifyBody,
    verifyEditBody
};

module.exports = moduleMiddleware;