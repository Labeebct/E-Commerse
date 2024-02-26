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



async function deliveredMsg(findUser) {
    

   try {
        const info = await transporter.sendMail({
        from: 'ctlabeebthaliyil@gmail.com', 
        to: findUser.email,
        subject: "Your order has been DELVERED",
        text: `
        Dear ${findUser.username},

        We are excited to inform you that your order from Labio Mart has been successfully delivered!

        If you have any questions or concerns regarding your order, feel free to contact our customer support team at support@labiomart.com.

        Thank you for choosing Labio Mart for your shopping needs. We look forward to serving you again soon!

        Best regards,
        labeeb ct
        LABIO MART Team
                `
      });
      

  
    } catch (error) {
        console.log(error.message);
    }
}



async function sippedMsg(findUser) {
    
    
  try {
        const info = await transporter.sendMail({
        from: 'ctlabeebthaliyil@gmail.com', 
        to: findUser.email,
        subject: "your order has been SHIPPED",
        text:`
        Dear ${findUser.username},

        We're excited to let you know that your order from Labio Mart has been shipped!
      
        You can track your shipment using the tracking number provided. If you have any questions or concerns regarding your order's shipment, please don't hesitate to contact our customer support team at support@labiomart.com.
      
        Thank you for shopping with Labio Mart. We appreciate your business!
      
        Best regards,
        Labeeb ct
        Labio Mart Team
        `
    });

    } catch (error) {
        console.log(error.message);
    }
}




module.exports = { deliveredMsg , sippedMsg }