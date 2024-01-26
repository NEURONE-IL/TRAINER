const Joi = require("joi");
const User = require("../models/user");
const Role = require("../models/role");

const schema = Joi.object({
  password: Joi.string().pattern(/^(?=.*\d).{4,32}$/),

  repeat_password: Joi.ref("password"),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "cl"] }
  }),

  tutor_names: Joi.string().required(),

  tutor_last_names: Joi.string().required(),

  names: Joi.string().required(),

  last_names: Joi.string().required(),

  tutor_phone: Joi.string().required(),

  relation: Joi.string().required(),

  birthday: Joi.date().required(),

  course: Joi.string().required(),

  institution: Joi.string().required(),

  institution_commune: Joi.number().required(),

  institution_region: Joi.number().required()
});

const simpleSchema = Joi.object({
  password: Joi.string().pattern(/^(?=.*\d).{4,32}$/),

  repeat_password: Joi.ref("password"),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "cl"] }
  }),

  names: Joi.string().required(),

  last_names: Joi.string().required()
});

const adminSchema = Joi.object({
  password: Joi.string().pattern(/^(?=.*\d).{4,32}$/),

  repeat_password: Joi.ref("password"),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "cl"] }
  }),

  names: Joi.string().required(),

  last_names: Joi.string().required()
});

const schemaMultiple = Joi.object({
  paramEmailPrefix: Joi.string().required(),

  paramEmailSubfix: Joi.string().required(),

  paramName: Joi.string().required(),

  paramInstitution: Joi.string().required(),

  paramBirthdayYear: Joi.number().required(),

  paramCourse: Joi.string().required(),

  paramCommune: Joi.number().required(),

  paramRegion: Joi.number().required(),

  paramStart: Joi.number().required(),

  paramUsers: Joi.number().required(),

  paramAdminId: Joi.string().required()
});

verifyBody = async (req, res, next) => {
  try {
    const validation = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      ok: false,
      err
    });
  }
};

verifyBodySimple = async (req, res, next) => {
  try {
    const validation = await simpleSchema.validateAsync(req.body);
    next();
  } catch (err) {
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
  } catch (err) {
    return res.status(400).json({
      ok: false,
      err
    });
  }
};

verifyBodyMultiple = async (req, res, next) => {
  try {
    console.log(req.body);
    const validation = await schemaMultiple.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      ok: false,
      err
    });
  }
};

uniqueEmail = async (req, res, next) => {
  await User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err
      });
    }
    if (user) {
      return res.status(403).json({
        ok: false,
        message: "EMAIL_ALREADY_USED"
      });
    } else {
      next();
    }
  });
};

uniqueEmailMultiple = async (req, res, next) => {
  let emailUsado = false;
  let emailEnConflicto;

  for (
    let i = req.body.paramStart;
    i < req.body.paramStart + req.body.paramUsers;
    i++
  ) {
    let id = "";

    if (i < 10) {
      id += "00" + i;
    } else if (i >= 10 && i < 100) {
      id += "0" + i;
    } else {
      id += i;
    }

    let email = (req.body.paramEmailPrefix + id + '@' + req.body.paramEmailSubfix).toLowerCase();

    if (!emailUsado) {
      await User.findOne({ email: email }, (err, user) => {
        if (err) {
          return res.status(404).json({
            ok: false,
            err
          });
        }
        if (user) {
          emailUsado = true;
          emailEnConflicto = email;
        }
      });
    }
  }

  if (emailUsado) {
    console.log('in')
    return res.status(422).json({
      ok: false,
      message: "EMAIL_ALREADY_USED_MULTIPLE",
      email: emailEnConflicto
    });
  } else {
    next();
  }
};

isAdmin = async (req, res, next) => {
  User.findById(req.user).exec((err, user) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err
      });
    }

    Role.findOne({ _id: user.role }, (err, role) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }

      if (role.name === "admin") {
        next();
        return;
      }

      res.status(403).send({ message: "ADMIN_ROLE_REQUIRED" });
      return;
    });
  });
};

const authMiddleware = {
  verifyBody,
  verifyBodySimple,
  verifyBodyAdmin,
  verifyBodyMultiple,
  uniqueEmail,
  uniqueEmailMultiple,
  isAdmin
};

module.exports = authMiddleware;
