const nodemailer = require("nodemailer");



const sendingEmail = process.env.GMAIL
const appPassword = process.env.APP_PASSWORD


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: sendingEmail ,
    pass: appPassword,
  },
});



async function userIssue(message) {
    

   try {
        const info = await transporter.sendMail({
        from: message.email, 
        to: 'ctlabeebthaliyil@gmail.com',
        subject: `${message.username} Reported: ${message.subject}`,
        text:`
        An issue reported by one of our users. Details are provided below:
        User Name: ${message.username}
        User Email: ${message.email}
        Issue Title: ${message.subject}
        Description: ${message.message}

        Better to Take Necessory action.
      `

      });
      

  
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {userIssue}