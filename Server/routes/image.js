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
        if(files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'video/mp4' || files[0].contentType === 'video/avi'){
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

router.post('',  [imageStorage.upload.single('file')], async (req, res) => {
    console.log("Router!! are we here?");
    console.log(req.file); 
    if(req.file){
        let image_url = process.env.ROOT+'/api/image/'+req.file.filename;
        res.status(200).json({
            url: image_url
        });
    }
    else{
        return res.status(404).json({
            err: 'NO_FILES'
        })
    }
});

module.exports = router;