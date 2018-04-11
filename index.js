var cmLexSdk = require('./lib/lex-sdk');

module.exports.handler = cmLexSdk.LambdaHandler;
module.exports.CreateStateHandler = cmLexSdk.CreateStateHandler;
module.exports.StateString = cmLexSdk.StateString;

