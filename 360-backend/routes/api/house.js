
const { Router } = require('express');
const House = require('../../models/House');
const multer = require('multer');
const imageRouter = require('./image');
const portalRouter = require('./portal');

const router = Router();
const upload = multer();

router.post('/house', (req, res) => {
    console.log(req.body);  // Log incoming request data
    House.create(req.body)
        .then(() => res.json({ msg: 'House added successfully' }))
        .catch((error) => {
            console.error('Error adding house:', error);  // Log the error
            res.status(400).json({ error: 'Unable to add house', details: error.message });
        });
});

router.use('/house/:houseId/images', (req, res, next) => {
    req.houseId = req.params.houseId;
    next();
}, imageRouter);

router.use('/house/:houseId/portals', (req, res, next) => {
    req.houseId = req.params.houseId;
    next();
}, portalRouter);

router.get('/house/:id', (req, res) => {
    House.findById(req.params.id, req.body)
        .then(() => res.json({ msg: 'House updated successfully' }))
        .catch(() => res.status(400).json({ error: 'House not found' }));
});

router.get('/house/puller/:houseID', (req, res) => {
    House.find({ "houseID": req.params.houseID })
        .then(house => res.json(house))
        .catch(() => res.status(400).json({ error: 'House not found' }));
});
router.get('/house', (req, res) => {
    House.find({})
        .then(houses => res.json(houses))
        .catch(err => {
            console.error('Error fetching all houses:', err);
            res.status(500).json({ error: 'Internal server error', details: err.message });
        });
});
router.put('/house/:id', (req, res) => {
    House.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json({ msg: 'House updated successfully' }))
        .catch(() => res.status(400).json({ error: 'Unable to update house' }));
});

/*
Notes:
    - Should delete every photo associated with the house
    - Import method from other route?
*/
router.delete('/house/:id', (req, res) => {
    House.findByIdAndRemove(req.params.id, req.body)
        .then(() => res.json({ msg: 'House successfully deleted' }))
        .catch(() => res.status(404).json({ error: 'No such house' }));
});

router.put('/house/portals/:houseID', (req, res) => {
    const { houseID } = req.params;
    const portalData = req.body;

    // Ensure you're querying by the correct field (e.g., 'houseID' if that's what your model uses)
    House.findOneAndUpdate({ houseID }, { $push: { portals: { $each: portalData } } }, { new: true })
        .then(house => {
            if (!house) {
                return res.status(404).json({ error: 'House not found' });
            }
            res.json({ msg: 'Portals added/updated successfully', house });
        })
        .catch(err => res.status(400).json({ error: 'Unable to update house with portals', details: err.message }));
});
router.put('/house/update/:houseID', (req, res) => {
    const { houseID } = req.params;
    const updateData = req.body;

    // Remove the portals field from updateData if it exists to ensure it's not updated here
    delete updateData.portals;

    // Update the house document with the provided data
    House.findOneAndUpdate({ houseID }, updateData, { new: true })
        .then(house => {
            if (!house) {
                return res.status(404).json({ error: 'House not found' });
            }
            res.json({ msg: 'House updated successfully', house });
        })
        .catch(err => res.status(400).json({ error: 'Unable to update house', details: err.message }));
});

module.exports = router;
