// const functions = require('firebase-functions');

// // // Create and Deploy Your First Cloud Functions
// // // https://firebase.google.com/docs/functions/write-firebase-functions
// //
// // exports.helloWorld = functions.https.onRequest((request, response) => {
// //  response.send("Hello from Firebase!");
// // });

// const stripe=require('stripe')('sk_test_51GqD62IPfg23ynjHA1m3UKMfFVfX8CdfvGzCMs2z08DTw62Lr7tPvT5gjQstuFWge39AXTbdJYUbDpMibrJtQaRR00Fa0ewJRn');
// exports.completePaymentWithStripe= functions.https.onRequest((request, response)=>{
//     stripe.charges.create({
//        amount:request.body.amount,
//        currency:request.body.currency,
//        source:'tok_mastercard'
//     }).then(charge=>{
//         console.log("charge : ", charge);
//         response.send(charge);
//     }).catch(error=>{
//         console.log("Error : ", error);
//     });
// })
