var mongoose = require('mongoose');
var User = mongoose.model('User');

// Utils functions
var encrypt = require(process.cwd() + '/app/utils/encrypter');
var emailHandler = require(process.cwd() + '/app/utils/emailHandler');

var fs = require('fs');

/*
30/07/16 
This function is responsible to receive informations about the new user via a post request.
Then do validations about each information type so we don't receive bad info. Then we check if
the email is unique so we can create a new user in our DB
*/
exports.createUser = function(req, res){

    // Select the infos that we want
    var body = _.pick(req.body, 'name', 'lastName', 'email', 'password');

    //Regex so we can validate the email field
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Check if the name field is consistent
    if (!_.isString(body.name) || body.name.trim().length == 0){
        res.status(400);
        res.json({
            type: false,
            data: "Name value incorrect."
        });

    // Check if the last name field is consistent
    } else if (!_.isString(body.lastName) || body.lastName.trim().length == 0){
        res.status(400);
        res.json({
            type: false,
            data: "Last name value incorrect."
        });

    // Check if the email field is consistent
    } else if (!_.isString(body.email) || !regex.test(body.email.trim())){
        res.status(400);
        res.json({
            type: false,
            data: "Email value incorrect."
        })
    
    // Check if the password field is consistent
    // ***** ADD PASSWORD STRENGTH VALIDATION *****    
    } else if (!_.isString(body.password) || body.password.trim().length == 0){
        res.status(400);
        res.json({
            type: false,
            data: "Password value incorrect"
        })

    // Case everything is ok we move on
    } else {

        // Check if we already have an user with this email registered.
        /* 
        The findOne Mongo Method search the DB for one entry and then callback a function
        with a err parameter if the search fails and/or the entry if it finds.
        */
        User.findOne({email:body.email.trim()}, function(err, user){
            
            // Case our search fails after every validation
            if (err){   
                res.status(500);
                res.json({
                    type: false,
                    data: "An unexpected error occured."
                });
            
            // Check if we already have an entry
            } else if (user){
                res.status(400);
                res.json({
                    type: false,
                    data: "Email is already in use."
                })

            // If we dont have this email in the DB already we can finally insert
            } else {
                body.name = body.name.trim();
                body.lastName = body.lastName.trim();
                body.email = body.email.trim();
                // Encrypt the password see the util/encrypter.js for the the function below
                body.password = encrypt.passwordEncrypt(body.password);

                // Here we will start to see if some optional fields are valid
                // Check if we have a description value a if it`s not incorrect
                if (body.hasOwnProperty('description') && (!_.isString(body.description) || body.description.trim().length == 0)){

                    return (
                        res.status(400).json({
                        type: false,
                        data: "Description value is incorrect."
                    }));
                
                // If we pass the condition above it means that if we have a description property we can insert
                } else if(body.hasOwnProperty('description')){

                    body.description = body.description.trim();

                }

                var UserModel = new User(body);

                // Try to create our new user
                UserModel.save(function(err, user){

                    if(err){
                        res.status(500);
                        res.json({
                            type: false,
                            data: "An unexpected error occurred."
                        });
                    } else {

                        // Get the user data and create a JSON so we can use later to generate the token
                        var userData = JSON.stringify({
                            id: user.id,
                            password: user.password
                        });
                        
                        // Here we create or user token with the function generate token that returns a promise

                        var token = encrypt.generateToken(userData).then(function(token) {

                            // Pass to our user the token and his/her ID
                            res.header('Auth', token);
                            req.params.id = user.id;
                            
                            // Quick response to the user
                            res.status(200);
                            res.json({
                                type: true,
                                data: "Welcome " + user.name + ".",
                                id: user.id 
                            });

                            next();

                        }, function(err){

                            // Log the error here

                            // Something went wrong with our encryptation
                            res.status(500);
                            res.json({
                                type: false,
                                data: "An unexpected error occurred."
                            });
                        });
                    }
                });
            }
        });
    }
}

exports.loginUser = function(req, res){

    // Pick the values used to log in
    var body = _.pick(req.body, 'email', 'password');

    if (!_.isString(body.email) || body.email.trim().length == 0){

        res.status(400);
        res.json({
            type: false,
            data: "Email value incorrect."
        });

    } else if (!_.isString(body.password) || body.password.trim().length == 0){

        res.status(400);
        res.json({
            type: false,
            data: "Password value incorrect."
        });

    } else {

        // Look of this user in our DB
        User.findOne({email: body.email}, function(err, user){

            if (err){

                res.status(500);
                res.json({
                    type: false,
                    data: "An unexpected error occured."
                });

            } else if(!user){

                res.status(404);
                res.json({
                    type: false,
                    data: "User not found."
                })

            } else {

                // Check if the password are valid. First we pass the no encrypted password
                // And in the second parameter our encrypted password from the DB
                if (encrypt.compareEncrypt(body.password, user.password)) {

                    // Get our user data and generates a new token
                    var userData = JSON.stringify({
                        id: user.id,
                        password: user.password
                    });
                    
                    // Make an expiration date for the token maybe  
                    // Give the user a new token
                    var token = encrypt.generateToken(userData).then(function(token) {
                    
                        res.header('Auth', token);
                            
                        // Log the user
                        res.status(200);
                        res.json({
                            type: true,
                            data: "Welcome back " + user.name + " " + user.lastName
                        });
                    
                    }, function(err){

                        res.status(500);
                        res.json({
                            type: false,
                            data: "An unexpected error occured."
                        });

                    });
                
                // If the password doesn`t match
                } else {
                    
                    res.status(401);
                    res.json({
                        type: false,
                        data: "Incorrect password."
                    });

                }

            }

        });

    }

}

/*
31/07/2016
Funtion responsible to view a user by its ID
Before this function get called a token validation occurs and the user that is accessing this
info is added to the req var
*/
exports.viewUser = function(req, res){

    User.findById(req.params.id, function(err, user){

        if(err){

            res.status(500);
            res.json({
                type: false,
                data: "An unexpected error occured."
            });

        } else if (!user){

            res.status(404);
            res.json({
                type: false,
                data: "User not found."
            });

        } else {

            res.status(200);
            res.json({
                type: true,
                data: user
            });

        }
    });
}