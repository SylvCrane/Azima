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
            const verify = JWT.verify(token, secret);
            // res.redirect(`http://localhost:3000/account/reset-password/${id}/${token}`);
            // res.send("Verified");
            // return res.json({
            //     status: "success",
            //     email: verify.email,
            //     message: "Token valid",
            //   });
            res.redirect(`http://localhost:3000/account/reset-password/${id}/${token}`);

        } catch (error) {
            console.log(error);
            return res.json({ status: 'error', message: 'Invalid or inspired token' });
        }
    } catch (error) {
        console.log(error);
        return res.json({ status: 'error', message: 'Server error' });
    }
});

router.post('/account/reset-password/:id/:token', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const existingUser = await user.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ status: 'error', error: 'user_not_found' });
        }

        const secret = JWT_SECRET + existingUser.password;

        try {
            JWT.verify(token, secret);
            const encryptedPassword = await bcrypt.hash(password, 10);
            await user.updateOne(
                { email: email },
                { $set: { password: encryptedPassword } }
            );

            return res.json({ status: 'ok', message: 'Password updated successfully' });
        } catch (error) {
            console.log(error);
            return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;