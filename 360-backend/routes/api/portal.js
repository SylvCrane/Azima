const router = require('express').Router();
const Portal = require('../../models/Portal'); // Adjust the path to your actual Portal model

// Route to add a new portal
router.post('/portal', (req, res) => {
    Portal.create(req.body)
        .then(portal => res.json({ msg: 'Portal added successfully' }))
        .catch(err => {
            console.error(err); // Log the full error
            res.status(400).json({ error: 'Unable to add portal', details: err.message });
        });
});
router.get('/', (req, res) => {
    Portal.find()
        .then(images => res.json(images))
        .catch(err => 
            console.error(err));
});

module.exports = router;