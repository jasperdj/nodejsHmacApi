const hmacHeader = require('./app/encoders/buckarooHmac');

const express = require('express');
const bodyParser = require('body-parser');

const flatfile = require('flat-file-db');
const db = flatfile.sync('./app/databases/db.json');

const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const routes = require('./app/routes/index');
routes(app, db);

app.post('/getSecretCookie', (req, res) => {
    console.log(req.body);
    const requestVariables = getRequestVariables(req);
    if (authenticationIsValid(requestVariables)) {
        res.send('Here is your cookie: ' + req.body.cookieName);
    } else {
        res.send(401);
    }
});

app.post('/transaction', (req, res) => {
    console.log(req.body);
    res.contentType('application/json');
    res.send('{ "Key": "4E8BD922192746C3918BF4077CXXXXXX", "Status": { "Code": { "Code": 791, "Description": "Pending processing" }, "SubCode": { "Code": "S002", "Description": "An additional action is required: RedirectToIdeal" }, "DateTime": "2017-03-28T11:23:42" }, "RequiredAction": { "RedirectURL": "https://testcheckout.buckaroo.nl/html/redirect.ashx?r=904A6432D283440ABD4418BF16XXXXXX", "RequestedInformation": null, "PayRemainderDetails": null, "Name": "Redirect", "TypeDeprecated": 0 }, "Services": [ { "Name": "ideal", "Action": null, "Parameters": [ { "Name": "consumerIssuer", "Value": "ABN AMRO" }, { "Name": "transactionId", "Value": "0000000000000001" } ] } ], "CustomParameters": null, "AdditionalParameters": null, "RequestErrors": null, "Invoice": "testinvoice 123", "ServiceCode": "ideal", "IsTest": true, "Currency": "EUR", "AmountDebit": 10, "TransactionType": "C021", "MutationType": 1, "RelatedTransactions": null, "ConsumerMessage": null, "Order": null, "IssuingCountry": null, "StartRecurrent": false, "Recurring": false, "CustomerName": null, "PayerHash": null, "PaymentKey": "644545E2409D4223AC09E880ADXXXXXX" }')
});

app.listen(port, () => {
    console.log('We are live on ' + port);
});

function getRequestVariables(req) {
    var requestUri = encodeURI(req.headers.host + req.url);
    var content = req.body;
    var httpMethod =req.method;
    var authHeader = splitAuthenticationHeader(req.headers['authentication']);
    return {requestUri, content, httpMethod, authHeader};
}


function splitAuthenticationHeader(authenticationHeaderString) {
    var hmacPattern = /hmac ([^:]+):([^:]+):([^:]+):([^:]+)/g;
    var match = hmacPattern.exec(authenticationHeaderString);
    var websiteKey = match[1];
    var hmacHash = match[2];
    var cnonce = match[3];
    var timestamp = match[4];
    var rawString = authenticationHeaderString;

    return {websiteKey, hmacHash, cnonce, timestamp, rawString};
}

function authenticationIsValid(requestVariables) {
    const user = db.get('user');
    const generatedMac = hmacHeader(requestVariables.requestUri, requestVariables.authHeader.websiteKey, user.secretKey,
        requestVariables.content, requestVariables.httpMethod);

    return generatedMac.trim() === requestVariables.authHeader.rawString.trim();
}