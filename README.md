# lex-sdk
Lex-ASK (Alexa-SDK for nodejs を真似たLex用のSDK)


## インストール
```
$ npm install lex-sdk
```

## サンプル

```js
'use strict';

var Lex = require('lex-sdk');

exports.handler = function(event, context, callback) {

    console.log(JSON.stringify(event));

    var lex = Lex.handler(event, context);
    lex.resources = languageStrings;
    lex.registerHandlers(handlers);
    lex.execute();
};

const languageStrings = {
  'en-US': {
    'translation': {
      'HELLO_MESSAGE' : 'hello',
      'WELCOME_MESSAGE' : 'welcome！'
    }
  }
};

const handlers = {
    'MyIntent': function () {
        const intent = this.event.currentIntent;

        if (this.event.invocationSource === 'DialogCodeHook') {

            if( /*スロット変更したい場合*/ ) {
                slots[`name`] = null;
                this.emit(':elicitSlot', intent.name, slots,violatedSlot, message);
            } else {
                // slot値を変更する場合
                //this.emit(':delegate', slots);
                this.emit(':delegate');
            }
        } else { // FulfillmentCodeHook
            this.emit(':close', 'Fulfilled',`Thanks, your order.`);
        }
    }
}
```