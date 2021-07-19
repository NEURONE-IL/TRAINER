const Joi = require('joi');
const User = require('../models/user');
const Role = require('../models/role');

const schema = Joi.object({
    password: Joi.string()
        .pattern(/^(?=.*\d).{4,32}$/),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments:2, tlds: { allow: ['com', 'net', 'cl'] } }),

    names: Joi.string()
        .required(),

    last_names: Joi.string()
        .required()
});

const adminSchema = Joi.object({
    password: Joi.string()
        .pattern(/^(?=.*\d).{4,32}$/),
    
    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments:2, tlds: { allow: ['com', 'net', 'cl'] } }),
    
    names: Joi.string()
        .required(),
    
    last_names: Joi.string()
        .required(),

    is_admin: Joi.boolean()
        .required()
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

verifyBodyAdmin = async (req, res, next) => {
    try {
        const validation = await adminSchema.validateAsync(req.body);
        next();
    }
    catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
};

uniqueEmail = async(req, res, next) => {
    await User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(user){
            return res.status(403).json({
                ok: false,
                message: 'EMAIL_ALREADY_USED'
            });
        }
        else{
            next();
        }
    })
}

isAdmin = async(req, res, next) => {
    User.findById(req.user)
        .exec((err, user) => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                });
            }

            Role.findOne({ _id: user.role }, 
                (err, role) => {
                    if(err){
                        return res.status(404).json({
                            ok: false,
                            err
                        });
                    }

                    if(role.name === 'admin'){
                        next();
                        return;
                    }

                    res.status(403).send({ message: 'ADMIN_ROLE_REQUIRED' });
                    return;
                }
            );
        });
}

const authMiddleware = {
    verifyBody,
    verifyBodyAdmin,
    uniqueEmail,
    isAdmin
};

module.exports = authMiddleware;