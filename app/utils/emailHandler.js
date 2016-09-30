// Our nodemailer
var nodemailer = require('nodemailer');

// Our Email object
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'guibasconti@gmail.com', // Email
        pass: 'grx12345' // Email Password
    }
});

var emailText = 'Text from Bravo! app';

// Send an email
exports.sendEmail = function(userData){

    return new Promise(function (resolve, reject) {
        
        try {
            
            var mailOptions = {
                from: 'guibasconti@gmail.com', // sender address
                to: userData.email, // list of receivers
                subject: 'Bravo email', // Subject line
                text: userData.token //, // plaintext body
                // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                
                if(error){
                    
                    reject(error);  
                    
                } else {
                    
                    resolve(info.response);
                    
                };
            });

        } catch (e){
            console.log(e);
            reject();
        }
    
    });
    
};