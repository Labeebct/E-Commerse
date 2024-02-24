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



async function blockMessage(findUser) {
    

   try {
        const info = await transporter.sendMail({
        from: 'ctlabeebthaliyil@gmail.com', 
        to: findUser.email,
        subject: "Your LabioMart Account has Been BLOCKED",
        text: 
        `Dear ${findUser.username} ,

        We regret to inform you that your access to LabioMart has been blocked.
        
        Upon reviewing your account activity, we have detected unusual behavior that violates our terms of service or security policies. As a result, we have taken the necessary steps to protect our platform and our users by temporarily blocking your access.
        
        Please note that this action is taken to ensure the integrity and security of LabioMart for all users. We take such matters seriously to maintain a safe and trustworthy environment for our community.
        
        If you believe that your account has been blocked in error or if you have any questions regarding this action, please don't hesitate to contact our support team at [support email] or by replying to this email. Our team will be happy to assist you in resolving this matter as soon as possible.
        
        Thank you for your understanding and cooperation.
        
        Best regards,
        labeeb ct
        LabioMart Customer Support Team`

      });
      

  
    } catch (error) {
        console.log(error.message);
    }
}



async function unblockMsg(findUser) {
    
    
  try {
        const info = await transporter.sendMail({
        from: 'ctlabeebthaliyil@gmail.com', 
        to: findUser.email,
        subject: "Your LabioMart Account has Been Successfully UNBLOCKED",
        text:
        `Dear ${findUser.username} ,

        We are pleased to inform you that your LabioMart account has been successfully unblocked.

        After a thorough review of your account activity, we have reinstated your access to LabioMart. We apologize for any inconvenience this temporary block may have caused and appreciate your patience and understanding during this process.

        We value you as a member of our community and are committed to providing you with the best possible experience on our platform. If you have any further questions or concerns, please don't hesitate to reach out to our support team at [support email]. We are here to assist you with any assistance you may need.

        Thank you for choosing LabioMart. We look forward to serving you again soon!

        Best regards,
        labeeb ct
        LabioMart Customer Support Team
        `

    });

    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {blockMessage,unblockMsg}