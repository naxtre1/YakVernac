const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');

admin.initializeApp();

const stripe = require('stripe')('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');
exports.completePaymentWithStripe = functions.https.onRequest((request, response) => {

    stripe.charges.create({
        amount: request.body.amount,
        currency: request.body.currency,
        // source: 'tok_mastercard',
        source: request.body.token.tokenId
    }).then(async (charge) => {
        console.log("called : ", charge);
        let now = new Date();
        console.log("called1 : ");
        let futureMonth = moment().add(request.body.months, 'M').format('DD-MM-YYYY');
        console.log("called2 : ");
        let dayOfEnd = now.setMonth(now.getMonth() + request.body.months);
        console.log("called3 : ", request.body.uid);

        admin.firestore().collection('user').doc(request.body.uid).collection("payment").add({
            amount: charge.amount,
            balanceTransaction: charge.balance_transaction,
            created: charge.created,
            currency: charge.currency,
            id: charge.id,
            premium: true,
            until: dayOfEnd,
            untilNice: futureMonth,
            months: request.body.months
        });

        console.log("called4 : ", request.body.uid);

        admin.firestore().collection('user').doc(request.body.uid).update({
            premium: true,
            until: dayOfEnd,
            untilNice: futureMonth,
            amount: charge.amount,
            months: request.body.months,
            created: charge.created,
        });

        console.log("charge : ", charge);
        response.send(charge);
    }).catch(error => {
        console.log("Error : ", error);
    });

    console.log('test success');
})