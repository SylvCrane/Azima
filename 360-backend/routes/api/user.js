const router = require('express').Router();
const User = require('../../models/User');

router.post('/user', (req, res) => {
    User.create(req.body)
        .then(user => res.json({ msg: 'User added successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to add user'}));
});

router.get('/user/:id', (req, res) => {
    User.findById(req.params.id, req.body)
        .then(user => res.json({msg: 'User updated successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to update user'}));
});

router.put('/user/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
        .then(user => res.json({msg: 'User updated successfully'}))
        .catch(err => res.status(400).json({error: 'Unable to update user'}));
});

router.delete('/user/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, req.body)
        .then(user => res.json({msg: 'House successfully deleted'}))
        .catch(err => res.status(404).json({error: 'No such user'}));
});