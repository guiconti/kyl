var mongoose = require('mongoose');
var User = mongoose.model('User');

var encrypt = require(process.cwd() + '/app/utils/encrypter');

exports.validateToken = function (req, res, next){
    
    try {
        
        // Check if we had some error in the file upload HAVE TO BUILD IT AGAIN
        if(req.fileValidationError){
            
            res.status(400);
            res.json({
                type: false,
                data: req.fileValidationError
            });
        
        // If the file upload goes ok continue    
        } else {
        
            var token = req.headers["auth"];
            
            // Check token type consistency
            if (!_.isString(token)){
                res.status(400);
                res.json({
                    type: false,
                    data: "Invalid Token"
                });
            } else {
                
                // Decrypt the token
                encrypt.decryptToken(token).then(function(token){
                    
                    // Look for the ID token
                    User.findById(token.id, function (err, user){
                        
                        // If the token find gives an error
                        // Handle this error better (look for connect failure)
                        if (err){
                            res.status(500);
                            res.json({
                                type: false,
                                data: "Error occured: " + err     
                            });
                            
                        // Case the token is not found    
                        } else if (!user){
                            res.status(401);
                            res.json({
                                type: false,
                                data: "Invalid Token"    
                            });
                            
                        // Case the token is found    
                        } else {

                            // If the token password has changed or it expired
                            if (!(user.password == token.password)){

                                res.status(401);
                                res.json({
                                    type: false,
                                    data: "Invalid Token" // Actually expired
                                });

                            // If everything is ok move on   
                            } else {
                                
                                // Put our user in the req 
                                req.user = user;
                                next();
                                
                                // ********* E-MAIL VALIDATION NO LONGE REQUIRED TO USE APP ********
                                /*
                                req.user = user;
                                
                                // Check email validation
                                if(!user.emailValidation) {
                                    
                                    res.status(401);
                                    res.json({
                                        type: false,
                                        data: "Please confirm your e-mail"
                                    });
                                    
                                } else {
                                    
                                    // Move on with the API
                                    next(); 
                                
                                }*/
                            } 
                        }
                        
                    });
                    
                // Reject call    
                }, function(){
                    res.status(401);
                    res.json({
                        type: false,
                        data: "Invalid Token"
                    });
                });
                
            }
        
        }

        
    } catch (e) {
        console.log(e);
    }
    
    
    
}