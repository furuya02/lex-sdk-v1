'use strict';

module.exports = (function () {
    return {
        ':close': function(fulfillmentState, message) {
            if(this.isOverridden()) {
                return;
            }

            let sessionAttributes = this.handler._event.sessionAttributes;
            message = { contentType: 'PlainText', content: message };

            this.handler.response = {
                sessionAttributes,
                dialogAction: {
                    type: 'Close',
                    fulfillmentState,
                    message,
                },
            };

            this.emit(':responseReady');
        },
        ':delegate': function(slots) {
            if(this.isOverridden()) {
                return;
            }
            if(!slots) {
                slots = this.handler._event.currentIntent.slots;

            }

            let sessionAttributes = this.handler._event.sessionAttributes;

            this.handler.response = {
                sessionAttributes,
                dialogAction: {
                    type: 'Delegate',
                    slots,
                },
            };
            this.emit(':responseReady');
        },
        ':elicitSlot': function (intentName, slots, slotToElicit, message) {
            if(this.isOverridden()) {
                return;
            }

            const sessionAttributes = this.handler._event.sessionAttributes;
            message = { contentType: 'PlainText', content: message};

            this.handler.response = {
                sessionAttributes,
                dialogAction: {
                    type: 'ElicitSlot',
                    intentName,
                    slots,
                    slotToElicit,
                    message,
                },
            };
            this.emit(':responseReady');
        },
        ':responseReady': function () {
            if (this.isOverridden()) {
                return;
            }

            if(this.handler.state) {
                this.handler.response.sessionAttributes.STATE = this.handler.state;
            }

            if(typeof this.callback === 'undefined') {
                this.context.succeed(this.handler.response);
            } else {
                this.callback(null, this.handler.response);
            }
        }
    };
})();

