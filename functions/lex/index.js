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
  //'ja-JP': {
    'translation': {
      'HELLO_MESSAGE' : 'Hellow',
      'WELCOME_MESSAGE' : 'Welcome!'
    }
  }
};

const handlers = {
  'OrderFlowers': function () {
    const intent = this.event.currentIntent;
    const invocationSource = this.event.invocationSource;
    let slots = intent.slots;
    const flowerType = slots.FlowerType;
    const pickupTime = slots.PickupTime;
    const pickupDate = slots.PickupDate;

    if (invocationSource === 'DialogCodeHook') {

        // FlowrTypeのバリデーション
        const flowerTypeKey = 'FlowerType';
        const flowerTypes = ['lilies', 'roses', 'tulips'];
        if (flowerType && flowerTypes.indexOf(flowerType.toLowerCase()) === -1) { // ゆり、バラ、チューリップからしか指定できない
            slots[flowerTypeKey] = null;
            const message = `We do not have ${flowerType}, would you like a different type of flower?  Our most popular flowers are roses`;
            this.emit(':elicitSlot', intent.name, slots, flowerTypeKey, message);
            return;
        }

        // PickupDateのバリデーション
        const pickupDateKey = 'PickupDate';
        if (pickupDate) {
            try {
                const dateComponents = pickupDate.split(/\-/);
                let dt = new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2]);
                if(dt <  new Date()) { // 受け取りは、明日以降しか指定できない
                    slots[pickupDateKey] = null;
                    const message = 'You can pick up the flowers from tomorrow onwards.  What day would you like to pick them up?';
                    this.emit(':elicitSlot', intent.name, slots, pickupDateKey, message);
                    return;
                }
            } catch (err) { // 無効な値
                slots[pickupDateKey] = null;
                const message = 'I did not understand that, what date would you like to pick the flowers up?';
                this.emit(':elicitSlot', intent.name, slots, pickupDateKey, message);
                return;
            }
        }

        // PickupTimeのバリデーション
        const pickupTimeKey = 'PickupTime';
        if (pickupTime) {
            if (pickupTime.length !== 5) {// 無効な値
                slots[pickupTimeKey] = null;
                this.emit(':elicitSlot', intent.name, slots, pickupTimeKey, null);
                return;
            }
            const hour = parseInt(pickupTime.substring(0, 2), 10);
            const minute = parseInt(pickupTime.substring(3), 10);
            if (isNaN(hour) || isNaN(minute)) { // 無効な値
                slots[pickupTimeKey] = null;
                this.emit(':elicitSlot', intent.name, slots, pickupTimeKey, null);
                return;
            }
            if (hour < 10 || hour > 16) { // 午前10時から午後5時までしか営業していない
                slots[pickupTimeKey] = null;
                const message = 'Our business hours are from ten a m. to five p m. Can you specify a time during this range?';
                this.emit(':elicitSlot', intent.name, slots, pickupTimeKey, message);
                return;
            }
        }
    
        if (flowerType) {
            this.event.sessionAttributes['Price'] = flowerType.length * 5; //SessionAttributeで値を保存する
        }
        this.emit(':delegate');
        //this.emit(':delegate', intent.slots); //スロットを上書きする場合
    } else {
        this.emit(':close', 'Fulfilled', `Thanks, your order for ${flowerType} has been placed and will be ready for pickup by ${pickupTime} on ${pickupDate}`);
    }
  },
  'Unhandled': function () {
    // 処理されていないハンドラーはエラーとする
    const intent = this.event.currentIntent;
    throw new Error(`${intent.name} is not supported`);
  }
};

