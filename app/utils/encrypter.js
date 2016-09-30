// Our super mega blaster secret key, no one will never know muahahaha
var secretKey = 'Br@v0S41tY1stH3b35Ts@1TY';
var tokenSecretKey = 'T|-|15!S|3r@v0tOk3|\|!z3R'

var emailSecretKey = 'T@!#7S*(J!J@#JsqD323XklsXCN!@#';

var crypto = require('crypto-js');
var jwt = require('jsonwebtoken');

// Not Async
/*
31/07/2016
This function is responsible to encrypt a password that it receives from a parameter.
The parameter it receives should be an string or a number
It uses a secret key to salty the password so it becomes encrypted via the AES algorithm
The AES algorithm is provided by the crypto package, so we don`t implement it.
After the encryptation it returns the encrypted password as a string
*/
exports.passwordEncrypt = function(cookerPassword){
    
    // Encrypt Message with a salty key
    var encryptedPassword = crypto.AES.encrypt(cookerPassword, secretKey);
    
    // Return our encrypt key as a String
    return encryptedPassword.toString();
    
};

// Not Async
/*
Compare if a not encrypted password is equal to a encrypted password
The function receives two parameter. The first is the not encrypted password
the second is the encrypted password that we want to compare
*/
exports.compareEncrypt = function(notEncrypted, encrypted){
    
    // Decrypt message
    try {
    var bytes = crypto.AES.decrypt(encrypted, secretKey);
    var decryptedMessage = bytes.toString(crypto.enc.Utf8);

    
    // Verify decripted message
    if (decryptedMessage == notEncrypted){
        return true;
    } else {
        return false;
    }

    } catch (e){

        // Should log the error or something
        
        return false;
    }
    
};

/*
31/07/2016
This function is responsible to generate a valid token for the user 
The function receives a parameter userData that expected a JSON object with the data about the user
The function returns a promise with the token case the encryptation succeeds
*/
exports.generateToken = function(userData){

    return new Promise(function (resolve, reject) {
        
        try {
        
            // Encrypts our user JSON object
            var encryptedData = crypto.AES.encrypt(userData, secretKey).toString();
            
            // Get our token encrypted data 
            var token = jwt.sign({
                token: encryptedData
            }, tokenSecretKey);
            
            resolve(token);
            
        } catch (e){
            reject();
        }
    
    });
    
};

// Validate token
exports.decryptToken = function(token){
    
    return new Promise(function (resolve, reject) {
        
        try {
        
            var decodedJWT = jwt.verify(token, tokenSecretKey);
            var bytes = crypto.AES.decrypt(decodedJWT.token, secretKey);
            var tokenData = JSON.parse(bytes.toString(crypto.enc.Utf8));
            
            resolve(tokenData);
            
        } catch (e) {
            reject();
        }    
        
    });
           
};

// *********** REUSE PASSWORD ENCRYPTER ************** //

exports.createEmailToken = function(id){
    
    return new Promise(function (resolve, reject) {
    
        try {
            
            // Encrypt Menssage
            var encryptedId = crypto.AES.encrypt(id, emailSecretKey);
            
            // Return our encrypt key to be inserted in the DB
            resolve (encryptedId.toString());
            
        } catch(e) {
            return (e);
        }
    
    });

}

exports.decryptEmailToken = function(token){
    
    return new Promise(function (resolve, reject) {
    
        try {
            
            // Decrypt message
            var bytes = crypto.AES.decrypt(token, emailSecretKey);
            var decryptedMessage = bytes.toString(crypto.enc.Utf8);
            
            // Return our id
            resolve (decryptedMessage);
            
        } catch(e) {
            reject (e);
        }
    
    });

    
}