const express = require('express');
const router = express.Router();

const imageStorage = require('../middlewares/imageStorage');

router.get('/:filename', async (req, res) => {
    imageStorage.gfs.find({ filename: req.params.filename}).toArray((err, files) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(!files || files.length === 0){
            return res.status(404).json({
                err: 'NO_FILES'
            })
        }
        if(files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png'){
            imageStorage.gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        }else{
            return res.status(404).json({
                err: 'NO_IMAGE'
            })
        }
    })
});

router.get('', async (req, res) => {
    imageStorage.gfs.find().toArray((err, files) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(!files || files.length === 0){
            return res.status(404).json({
                err: 'NO_FILES'
            })
        }
        return res.json(files);
    })
});

module.exports = router;