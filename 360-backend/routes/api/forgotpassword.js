const router = require('express').Router();
const dotenv = require('dotenv');
dotenv.config();
const JWT = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const user = require('../../models/UserDetails');
const azimaEmail = process.env.EMAIL;
const sendEmail = require('../../utils/sendEmail');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.json({ status: 'error', error: 'user_not_found' });
        }

        const secret = JWT_SECRET + existingUser.password;
        const token = JWT.sign({ email: existingUser.email, id: existingUser._id }, secret, { expiresIn: '20m' });
        const link = `http://localhost:8082/account/reset-password/${existingUser._id}/${token}`;
        console.log(link);

        const subject = 'Password Reset';
        const message = `Click on the link to reset your password with Azima: ${link}`;
        const sent_from = azimaEmail;
        const reply_to = azimaEmail;

        try {
            await sendEmail(subject, message, existingUser.email, sent_from, reply_to);
            return res.json({
                status: 'ok',
                email: existingUser.email,
                message: 'Password reset link sent to your email account',
            });
        } catch (error) {
            return res.json({ status: 'error', message: 'Failed to send email. Try again later' });
        }
    } catch (error) {
        console.log(error);
        return res.json({ status: 'error', message: error.message });
    }
});

// for reset password page 


module.exports = router;