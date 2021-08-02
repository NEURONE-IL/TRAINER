const Joi = require('joi');
const Study = require('../models/study');

const schema = Joi.object({
    
    name: Joi.string()
        .required(),

    description: Joi.string()
        .required(),

    domain: Joi.string()
        .required(),

    type: Joi.string()
        .required(),    
});

const editSchema = Joi.object({
    
    name: Joi.string(),

    description: Joi.string(),

    domain: Joi.string(),

    type: Joi.string()    
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

const studyMiddleware = {
    verifyBody,
    verifyEditBody
};

module.exports = studyMiddleware;