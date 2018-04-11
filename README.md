# lex-sdk
Lex-SDK (Alexa-SDK for nodejs を真似たLex用のSDK)


## インストール
```
$ npm install lex-sdk
```

## サンプル

```js
'use strict';

var Lex = require('lex-sdk');

exports.handler = function(event, context, callback) {
    var lex = Lex.handler(event, context);
    lex.resources = languageStrings;
    lex.registerHandlers(handlers);
    lex.execute();
};

const languageStrings = {
  'en-US': {
    'translation': {
      'WORNG_MESSAGE' : 'Slot value is wrong',
      'THANKS_MESSAGE' : 'Thanks, your order.'
    }
  }
};

const handlers = {
    'MyIntent': function () {
        const intent = this.event.currentIntent;

        if (this.event.invocationSource === 'DialogCodeHook') {

            if( /*スロット変更したい場合*/ ) {
                slots[`name`] = null;
                this.emit(':elicitSlot', intent.name, slots,violatedSlot, this.t('WORNG_MESSAGE'));
            } else {
                // slot値を変更する場合
                //this.emit(':delegate', slots);
                this.emit(':delegate');
            }
        } else { // FulfillmentCodeHook
            this.emit(':close', 'Fulfilled',this.t('THANKS_MESSAGE'));
        }
    },
    'Unhandled': function () {
        // 処理されていないハンドラーはエラーとする
        const intent = this.event.currentIntent;
        throw new Error(`${intent.name} is not supported`);
    }
}
```
