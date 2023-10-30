const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');


const sendEmail = asyncHandler(async(data,req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
        
          user: process.env.Mail_ID,
          pass: process.env.MP
        }
      });
      
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Hey 👻" <add@gmail.com>', // sender address
          to: data.to, // list of receivers
          subject:data.subject, // Subject line
          text: data.text, // plain text body
          html: data.html, // html body
        });
    
});

module.exports = sendEmail;