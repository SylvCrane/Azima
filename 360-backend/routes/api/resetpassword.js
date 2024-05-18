const router = require('express').Router();
const dotenv = require('dotenv');
dotenv.config();
const JWT = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const user = require('../../models/UserDetails');
const bcrypt = require('bcryptjs');


router.get('/account/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params;

    try {
        const existingUser = await user.findOne({ _id: id });
        if (!existingUser) {
            return res.status(404).json({ status: 'error', error: 'user_not_found' });
        }
        const secret = JWT_SECRET + existingUser.password;
        try {
            JWT.verify(token, secret);
            res.redirect(`http://localhost:3000/account/reset-password/${id}/${token}`);
            // res.json({ email: verify.email, status: "Verified" });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ status: 'error', message: 'no_update' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

router.post('/account/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const existingUser = await user.findOne({ _id: id });
        if (!existingUser) {
            return res.json({ status: 'error', error: 'user_not_found' });
        }

        const secret = JWT_SECRET + existingUser.password;

        try {
            JWT.verify(token, secret);
            const encryptedPassword = await bcrypt.hash(password, 10);
            await user.updateOne(
                { _id: id },
                { $set: { password: encryptedPassword } } // Ensure the field name matches your schema
            );

            return res.json({ status: 'ok', message: 'Password updated successfully' });
        } catch (error) {
            console.log(error);
            return res.json({ status: 'error', message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.log(error);
        return res.json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;