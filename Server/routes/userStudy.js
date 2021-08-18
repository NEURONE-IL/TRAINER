const express = require('express');
const router = express.Router();
const UserStudy = require('../models/userStudy');

const verifyToken = require('../middlewares/verifyToken');

router.get('/stagesByStudent/:student_id', [verifyToken], async (req, res) => {
    const _id = req.params.student_id;
    UserStudy.findOne({user: _id}, (err, userStudy) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        let stages = userStudy.stages;
        res.status(200).json({stages});
    });
});

module.exports = router;