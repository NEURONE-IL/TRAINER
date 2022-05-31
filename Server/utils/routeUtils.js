const Token = require("../models/token");
const UserFlow = require("../models/userFlow");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const fs = require("fs");

/*Creates user flow progress*/
async function generateProgress(modules, stages, user, flow) {
    let map = new Map();
    let progress = [];
    
    /*Push all stages into progress array*/
    stages.forEach((stage, index) => {
        let active;
        if(!flow.sorted || index == 0){
            active = true;
        }
        let stageObj = {
            stage: stage, 
            percentage: 0,
            active: active,
            completed: false
        }
        if(!map.get(stage.module.toString())){
            map.set(stage.module.toString(), [stageObj])
        }
        else{
            map.get(stage.module.toString()).push(stageObj)
        }     
    });
    modules.forEach((module, index) => {
        let active;
        if(!flow.sorted || index == 0){
            active = true;
        }
        let moduleObj = {
            module: module,
            completed: false,
            active: active,
            stages: map.get(module._id.toString())
        }
        progress.push(moduleObj)
    }) 
  
    const userFlow = new UserFlow({
        user: user,
        flow: flow,
        modules: progress
    });
  
    return new Promise((resolve, reject) => {
        userFlow.save((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
}
exports.generateProgress = generateProgress;

function fetchAndUpdateStages(userFlow, step) {
    /*If there is any stage with the same step that the completed one currently active, the next step stages remain inactive.*/
    if(userFlow.stages.find(stage => stage.stage.step === step && stage.active)){
        return userFlow;
    }
    /*Sets the new step increasing in 1 the current one.*/
    var newStep = step + 1;
    var changeFlag = false;
    /*Sets as active the stages where the step matches the new one, if there is not any stage that matches the condition, increases the
    new step in 1 until find a stage until 10.*/
    do{
        userFlow.stages.forEach((stage) => {
            if(stage.stage.step === newStep){
                stage.active = true;
                changeFlag = true;
            }
        });
        newStep++;
    } while (!changeFlag && newStep < 10);
    /*If the new step increases until 10 and there is no more stages active, the userFlow is finished.*/
    if(!userFlow.stages.find(stage => stage.active)){
        userFlow.finished = true;
    };
    return userFlow;
}
exports.fetchAndUpdateStages = fetchAndUpdateStages;

/* Sends user confirmation email
   Adapted from: https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb*/
function sendConfirmationEmail(user, userData, res, req) {
    /*Create a verification token*/
    const token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
    });
  
    /*Save the verification token*/
    token.save((err) => {
        if (err) {
            return res.status(500).send({ msg: "TOKEN_ERROR" });
        }
  
        /*Generate email data*/
        const { mailHTML, mailText } = generateEmailData(req, token, userData);
  
        /*Send the email*/
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDEMAIL_USER,
                pass: process.env.SENDEMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: {
				name: 'TRAINER',
				address: 'neurone@informatica.usach.cl'
			},
            to: user.email,
			subject: "Bienvenido a Trainer - Confirma tu cuenta para participar",
            text: mailText,
            html: mailHTML,
        };
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log( err.message );
            }
        });
    });
}
exports.sendConfirmationEmail = sendConfirmationEmail;
  
/*Reads email template and adds custom data*/
function generateEmailData(req, token, userData) {
    const emailTemplateFile = "assets/confirmationEmail.html";
    const link =
        "https://" +
        req.headers.host +
        "/confirmation/" +
        token.token;
    let mailHTML = null;
    let mailText =
        "Hola,\n\n" +
        "Por favor, verifique su correo ingresando al siguiente link: \nhttps://" +
        link +
        ".\n";
  
    /*Load email template*/
    mailHTML = fs.readFileSync(emailTemplateFile, "utf8", (err, data) => {
        if (err) {
            console.log(err);
        }
        mailHTML = data.toString();
    });
    /*Add custom text to email*/
    mailHTML = addTextToEmail(mailHTML, userData, link);
    return { mailHTML, mailText };
  }
  
/*Add translated text and user data to email*/
function addTextToEmail(mailHTML, userData, link) {
    mailHTML = mailHTML.replace(
        "[CONFIRMATION_EMAIL.PREHEADER_TEXT]",
        "Confirme su cuenta:"
    );
    mailHTML = mailHTML.replace(
        "[CONFIRMATION_EMAIL.TITLE]",
        "Hola " + userData.tutor_names.split(" ")[0] + "."
    );
    mailHTML = mailHTML.replace(
        "[CONFIRMATION_EMAIL.TEXT]",
        "Gracias por registrar a " +
            userData.names.split(" ")[0] +
            " en NEURONE-TRAINER, " +
            "antes de ingresar al ecosistema de juegos debe confirmar su correo.\n" +
            "Al realizar este paso, también está confirmando que leyó y acepta el consentimiento informado " +
            "presentado en el registro."
    );
    mailHTML = mailHTML.replace(
        "[CONFIRMATION_EMAIL.CONFIRM]",
        "Confirmar cuenta"
    );
    mailHTML = mailHTML.replace(
        "[CONFIRMATION_EMAIL.IF_BUTTON_DOESNT_WORK_TEXT]",
        "Si el botón no funciona, use el siguiente link:"
    );
    mailHTML = mailHTML.replace(/%CONFIRMATION_EMAIL.LINK%/g, link);
    mailHTML = mailHTML.replace(
        "[CONFIRMATION_EMAIL.IF_LINK_DOESNT_WORK_TEXT]",
        "Si el enlace tampoco funciona, por favor cópielo y péguelo en una nueva pestaña de su navegador de internet"
    );
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.GREETINGS]", "¡Saludos!");
    return mailHTML;
}

/*RESET PASSWORD EMAIL*/
  
/* Sends reset password email
   Adapted from: https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb*/
function sendResetPasswordEmail(user, res, req) {
    /*Create a verification token*/
    const token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
    });
  
    /*Save the verification token*/
    token.save((err) => {
        if (err) {
            return res.status(500).send({ msg: "TOKEN_ERROR" });
        }
  
        /*Generate email data*/
        const { mailHTML, mailText } = generateEmailDataRP(req, token, user);
  
        /*Send the email*/
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
            user: process.env.SENDEMAIL_USER,
            pass: process.env.SENDEMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: {
				name: 'TRAINER',
				address: 'neurone@informatica.usach.cl'
			},
            to: user.email,
			subject: "Recupere su contraseña",
            text: mailText,
            html: mailHTML,
        };		
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                return res.status(500).send({ msg: err.message });
            }
        });
    });
}
exports.sendResetPasswordEmail = sendResetPasswordEmail;
  
/*Reads email template and adds custom data*/
function generateEmailDataRP(req, token, user) {
    const emailTemplateFile = "assets/resetPassword.html";
    const link =
        "https://" +
        req.headers.host +
        "/user/resetPassword/" +
        token.token;
    let mailHTML = null;
    let mailText =
        "Hola,\n\n" +
        "Por favor, recupere su contraseña ingresando siguiente link: \nhttps://" +
        link +
        ".\n";
  
    /*Load email template*/
    mailHTML = fs.readFileSync(emailTemplateFile, "utf8", (err, data) => {
        if (err) {
            console.log(err);
        }
        mailHTML = data.toString();
    });
    /*Add custom text to email*/
    mailHTML = addTextToEmailRP(mailHTML, user, link);
    return { mailHTML, mailText };
  }
  
/*Add translated text and user to email*/
function addTextToEmailRP(mailHTML, userData, link) {
    mailHTML = mailHTML.replace(
        "[RESET_PASSWORD.PREHEADER_TEXT]",
        "Recupere su contraseña:"
    );
    mailHTML = mailHTML.replace(
        "[RESET_PASSWORD.TITLE]",
        "Hola " + userData.names + "."
    );
    mailHTML = mailHTML.replace(
        "[RESET_PASSWORD.TEXT]",
        "Para recuperar su contraseña debe acceder al siguiente link:"
    );
    mailHTML = mailHTML.replace(
        "[RESET_PASSWORD.CONFIRM]",
        "Recuperar contraseña"
    );
    mailHTML = mailHTML.replace(
        "[RESET_PASSWORD.IF_BUTTON_DOESNT_WORK_TEXT]",
        "Si el botón no funciona, use el siguiente link:"
    );
    mailHTML = mailHTML.replace(/%RESET_PASSWORD.LINK%/g, link);
    mailHTML = mailHTML.replace(
        "[RESET_PASSWORD.IF_LINK_DOESNT_WORK_TEXT]",
        "Si el enlace tampoco funciona, por favor cópielo y péguelo en una nueva pestaña de su navegador de internet"
    );
    mailHTML = mailHTML.replace("[RESET_PASSWORD.GREETINGS]", "¡Saludos!");
    return mailHTML;
}  
  