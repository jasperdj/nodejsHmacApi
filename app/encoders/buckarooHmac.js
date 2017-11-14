var cryptoJs = require("crypto-js");


module.exports = function(requestUri, websiteKey, secretKey, content, httpMethod) {
    var nonce = getNonce();
    var timeStamp = getTimeStamp();
    content = content ? content : "";
    var url = encodeURIComponent(requestUri).toLowerCase();
    return "hmac " + websiteKey + ":" + getHash(websiteKey, secretKey, httpMethod, nonce, timeStamp, url, content) + ":" + nonce + ":" + timeStamp;
}

function getEncodedContent(content) {
    if (content) {
        var md5 = cryptoJs.MD5(content);
        var base64 = cryptoJs.enc.Base64.stringify(md5);
        return base64;
    }

    return content;
}

function getHash(websiteKey, secretKey, httpMethod, nonce, timeStamp, requestUri, content) {
    var encodedContent = getEncodedContent(content);

    var rawData = websiteKey + httpMethod + requestUri + timeStamp + nonce + encodedContent;
    var hash = cryptoJs.HmacSHA256(rawData, secretKey);
    var hashInBase64 =  cryptoJs.enc.Base64.stringify(hash);

    return hashInBase64;
}

function getTimeStamp() {
    return Math.floor((new Date).getTime() / 1000);
}

function getNonce() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
