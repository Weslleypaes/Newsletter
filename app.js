// *** Constant Require Section:
 
const express = require("express");
require('dotenv').config();
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
 
const app = express();
 
// *** Body Parser ***
app.use(bodyParser.urlencoded({extended: true}));
 
// *** Pasta static ***
app.use(express.static("public"));
 
// ***  HTML File ***
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});
 
// *** Signup rota ***
app.post("/", function(req, res){
 
    const firstName = req.body.fName;
	const lastName = req.body.lName;
	const email = req.body.email;
 
    // *** Dados que serão enviados ***
    const data = {
        members: [
            {
              email_address: email,
              status: 'subscribed',
              merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
              }
            }
          ]
    }
 
    // *** Transformando os dados ***
    const jsonData = JSON.stringify(data);
 
    // *** url = "https://<data center>.api.mailchimp.com/3.0/lists/{listID}";
    const url = "https://us21.api.mailchimp.com/3.0/lists/"+ process.env.LISTid
 
    const options = {
        method: "POST",
        auth: "weslley:"+ process.env.APIkey
    };
    
    // *** Solicitando e mandando os dados para mailchimp ***
    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));

            if(response.statusCode !== 200){
                res.sendFile(__dirname+'/failure.html');
                console.log('Try again. The process failed');
                console.log(response.statusCode);
            }else {
                res.sendFile(__dirname+'/success.html');
                console.log('Success');
                console.log(response.statusCode);
            }
            // console.log(response.statusCode)
        });
    });
 
    request.write(jsonData);
    request.end();
 
});

app.post('/failure', function(req, res){
    res.redirect('/');
});
 
app.listen(3000, function(){
    console.log("Server started on port: 3000!");
});

