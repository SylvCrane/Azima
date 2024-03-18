const router = require('express').Router();
const House = require('../../models/House');
let Image = require('../../models/Image');
const Portal = require('../../models/Portal');

const multer = require('multer');
const upload = multer(); 


const imageRouter = require('./image');
router.post('/house', (req, res) => {
    House.create(req.body)
        .then(house => res.json({ msg: 'House added successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to add house'}));
});

router.use('/house/:houseId/images', (req, res, next) => {
    req.houseId = req.params.houseId;
    next();
}, imageRouter);

router.use('/house/:houseId/portals', (req, res, next) => {
    req.houseId = req.params.houseId;
    next();
}, require('./portal')); 


router.get('/house/:id', (req, res) => {
    House.findById(req.params.id, req.body)
        .then(house => res.json({msg: 'House updated successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to update house'}));
});

router.get('/house/puller/:houseID', (req, res) => {
    House.find( { "houseID" : req.params.houseID} )
        .then(house => res.json({msg: 'House updated successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to update house'}));
});


router.put('/house/:id', (req, res) => {
    House.findByIdAndUpdate(req.params.id, req.body)
        .then(house => res.json({msg: 'House updated successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to update house'}));
});

/*
Notes:
    - Should delete every photo associated with the house
    - Import method from other route?
*/
router.delete('/house/:id', (req, res) => {
    House.findByIdAndRemove(req.params.id, req.body)
        .then(house => res.json({msg: 'House successfully deleted'}))
        .catch(err => res.status(404).json({error: 'No such house'}));
})

module.exports = router;