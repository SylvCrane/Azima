const router = require('express').Router();
const Portal = require('../../models/Portal'); // Adjust the path to your actual Portal model

// Route to add a new portal
router.post('/', (req, res) => {
    // Create the portal data including the houseID from the parent route
    let portalData = {
        ...req.body,
        houseID: req.houseId // Use the houseId passed from the parent route
    };

    Portal.create(portalData)
        .then(portal => res.json({ msg: 'Portal added successfully' }))
        .catch(err => res.status(404).json({ error: 'Unable to add portal' }));
});

router.get('/', (req, res) => {
    Portal.find()
        .then(portals => res.json(portals))
        .catch(err => 
            console.error(err));
});

router.get('/:houseID', (req, res) => {
    Portal.find( { "houseID" : req.params.houseID} )
        .then(image => res.json(image))
        .catch(() => res.status(404).json({ noimagefound: 'No Portal Found'}));
});

router.delete('/:houseID', (req, res) => {
    Portal.deleteMany({ houseID: req.params.houseID })
        .then(result => {
            if(result.deletedCount === 0) {
                // No documents found and deleted
                return res.status(404).json({ msg: 'No portals found to delete' });
            }
            // Successfully deleted one or more documents
            res.json({ msg: 'Portals deleted successfully' });
        })
        .catch(err => res.status(400).json({ error: 'Unable to delete portals', details: err.message }));
});

module.exports = router;