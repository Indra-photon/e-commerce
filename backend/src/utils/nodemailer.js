import nodemailer from 'nodemailer'
import {User} from '../models/user.models.js'
import bcrypt from "bcrypt"
import { randomBytes } from 'crypto';

export const sendEmail = async ({email, emailType, userId }) => {
    try {
        // Generate a random token instead of hashing userId
        const resetToken = randomBytes(32).toString('hex');
        
        // Store the hashed version in the database
        const hashedToken = await bcrypt.hash(resetToken, 10)
        //console.log(`Hashed token from nodemailer ${hashedToken}`);
        
        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            } )
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            } )
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
            user: "73b90c061b6a80",
            pass: "5c31a390ddd49c"
            }
        });

        const mailOptions = {
            from: 'indranilmaiti1@gmail.com',
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}${
                emailType === "VERIFY" ? "/verifyemail" : "/reset-password"
            }?token=${hashedToken}">here</a> to ${
                emailType === "VERIFY" ? "verify your email" : "reset your password"
            } or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}${
                emailType === "VERIFY" ? "/verifyemail" : "/reset-password"
            }?token=${hashedToken}
            </p>`
        }

        const mailresponse = await transport.sendMail(mailOptions)
        return mailresponse
    } catch (error) {
        throw new Error (error.message)
    }
}