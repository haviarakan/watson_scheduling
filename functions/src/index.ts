// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
'use strict';

import { parentPort } from "worker_threads";

//import functions from 'firebase-functions';
// import { InvokeFunctionExpr } from '@angular/compiler';
// import { QuerySnapshot, DocumentReference, Transaction } from '@google-cloud/firestore';
// import { document } from 'firebase-functions/lib/providers/firestore';
// import { async, send, timeout } from 'q';
// import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
// import { Content } from '@angular/compiler/src/render3/r3_ast';
// import { start } from 'repl';
// import { promise } from 'selenium-webdriver';
// import { Router } from 'express';
// import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';
// import { URLSearchParams, resolve } from 'url';
// import { parseDate } from 'tough-cookie';
// import { Response } from 'selenium-webdriver/http';
// import request = require('request');
// import { url } from 'inspector';
// import { moment } from 'ngx-bootstrap/chronos/test/chain';
// import { generate } from 'rxjs';
// import { messaging } from 'firebase';
// import { Message } from 'firebase-functions/lib/providers/pubsub';
// import { query } from '@angular/core/src/render3/query';
// import { whenRendered } from '@angular/core/src/render3';
// import { AnalyticsEventBuilder } from 'firebase-functions/lib/providers/analytics';
// import { elementStylingApply } from '@angular/core/src/render3/instructions';
// import { unusedValueExportToPlacateAjd } from '@angular/core/src/render3/interfaces/definition';
// import { notEqual } from 'assert';
// import { endianness } from 'os';
// import { Result } from 'range-parser';


// import {  }from '@google-cloud/bigquery';
// The Firebase Admin SDK to access the Firebase Realtime Database.
const functions =require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const postmarkTransport = require('nodemailer-postmark-transport');
const postmarkKey = functions.config().watson.postmarkkey;
console.log(postmarkKey);
const mailTransport = nodemailer.createTransport(postmarkTransport({
        auth: {
                apiKey: postmarkKey
        }
}));

const fromAddress=functions.config().watson.fromaddress;
console.log(fromAddress);

const batchsize=functions.config().watson.batchsize;


//var invoiceid=functions.config().watson.invoiceid;

//console.log(invoiceid);

//const bigquery = require('@google-cloud/bigquery');
const {BigQuery} = require('@google-cloud/bigquery');


const cors= require('cors')({origin:true});



admin.initializeApp();

async function sendcustomeremail1(data)
{
// ASt some point, it has to be sent as one batch of 250 [postmark limit] instead of
// iterating one by one
var count=0;
  await admin.firestore().collection('Customers').get()

  .then(querySnapshot => {
    querySnapshot.forEach(async function (customer)
    {
      var customerdata = customer.data();
      console.log("I am here in sendcustomeremail");
      console.log(customerdata.email);
      const mailOptions = {
          from: 'testenv@soexcellence.com',
          to: customerdata.email,
          templateId: data.templateid,
          templateModel: data.fieldsvalue,
        };
        count=count+1;
      mailOptions.templateModel.subject="test"+count;
      await mailTransport.sendMail(mailOptions)
              .then(() => console.log('test1 sent to ' + customerdata.name))
              .catch((error) => console.error('There was an error while sending the email:' + customerdata.name + customerdata.email , error));
    });
  });
}

async function testemail(data)
{
var count=0;
      const mailOptions = {
          from:'testenv@soexcellence.com',
          to: data.email,
          templateId: data.templateid,
          templateModel: data.fieldsvalue,
        };
        count=count+1;
      mailOptions.templateModel.subject = "test" + count;
      console.log(data);
      await mailTransport.sendMail(mailOptions)
              .then(() => console.log('testemail sent to ' + data.email))
              .catch((error) => console.error('There was an error while sending the email:', error));
}

async function sendtoken(data)
{
  console.log(data);
  console.log(data.tokennumber);
  
  await admin.firestore().collection('Participants').where('id', '==', data.participantid).orderBy('name')
  .get()
  .then(function(querySnapshot) {
    console.log("this is inside participant data");
    querySnapshot.forEach(async function (Participant)
    {
    
      var participant=Participant.data();
      var validityarray = [];
      var validitystring= participant.validty;
      validityarray = validitystring.split('-');
      console.log(validityarray);
    
      var newvaliditystring = validityarray[2]+'-'+validityarray[1]+'-'+validityarray[0];  
      console.log(participant);
          const mailOptions = {
              from:'support@intl.soexcellence.com',
              cc:'tokens@antanoharini.com',
              to: data.email,
              templateId:'14644209',
              templateModel: {
            name:data.name,
            type:data.type,
            tokennumber:data.tokennumber,
            email:data.email,
            city:data.city,
            consultationtaken:participant.consultation_taken,
            reviewtaken:participant.review_taken,
            totalconsultation:participant.total_consultations,
            totalreview:participant.total_review,
            validty:newvaliditystring,

          }
        };
        console.log("this is participant collections ")
      
      await mailTransport.sendMail(mailOptions)
              .then(() => console.log('testemail sent to ' + data.email))
              .catch((error) => console.error('There was an error while sending the email:', error));
      })
      
            })
          }


          async function sendexcetoken(data)
          {
            console.log(data);
            console.log(data.tokennumber);
            
                    const mailOptions = {
                        from:'support@intl.soexcellence.com',
                        cc:'tokens@antanoharini.com',
                        to: data.email,
                        templateId:'14399260',
                        templateModel: {
                      name:data.name,
                      type:data.type,
                      tokennumber:data.tokennumber,
                      email:data.email,
                      city:data.city,
          
                    }
                  };
                  console.log("this is participant collections ")
                
                await mailTransport.sendMail(mailOptions)
                        .then(() => console.log('testemail sent to ' + data.email))
                        .catch((error) => console.error('There was an error while sending the email:', error));

                    }
          
                    async function canceltoken(data)
                    {
                      console.log(data);
                      await admin.firestore().collection('Token').where('id', '==', data).orderBy('name')
                     .get()
                     .then(function(querySnapshot) {
                    console.log("this is inside participant data");
                    querySnapshot.forEach(async function (doc)
                    {
                      console.log(doc);
                      var doc=doc.data();
                      var name=doc.name;
                      var type=doc.type;
                      var token=doc.tokennumber;
                      var email=doc.email;
                      var city=doc.city;
                     
                              const mailOptions = {
                                  from:'support@intl.soexcellence.com',
                                //  cc:'tokens@antanoharini.com',
                                  to:doc.email,
                                  templateId:'14399260',
                                  templateModel: {
                                name:doc.name,
                                type:doc.type,
                                tokennumber:doc.token,
                                email:doc.email,
                                city:doc.city,
                    
                              }
                            };
                            console.log("this is participant collections ")
                          
                          await mailTransport.sendMail(mailOptions)
                                  .then(() => console.log('testemail sent to ' + doc.email))
                                  .catch((error) => console.error('There was an error while sending the email:', error));
          
                              })
                            })
                          }
          async function sendformtoken(data)
          {
            console.log(data);
            console.log(data.tokennumber);
            
                    const mailOptions = {
                        from:'support@intl.soexcellence.com',
                        cc:'support@soexcellence.com',
                        to: data.email,
                        templateId:'15536496',
                        templateModel: {
                      name:data.name,
                      type:data.type,
                      email:data.email,
                      city:data.city,
                      event:data.event
                      
                    }
                  };
                  console.log("this is participant collections ")
                
                await mailTransport.sendMail(mailOptions)
                        .then(() => console.log('testemail sent to ' + data.email))
                        .catch((error) => console.error('There was an error while sending the email:', error));
                
                    }
          

async function invoicemail(data)
{
 console.log(data);

      console.log("sendinvoice");
      console.log(data.email);
      const mailOptions={
            from:'A&HBilling@intl.soexcellence.com',
            to:data.email,
            cc:'invoices@antanoharini.com',
            templateId:data.templateid,
            templateModel:{
              billingname:data.billingaddress,
              date:data.date,
              purchasedate:data.purchasedate,
              product:data.product,
              invoicenumber:data.invoiceid,
              fee:data.fee,
              tax:data.gst,
              total:data.receipt,
            }
        
      };

      await mailTransport.sendMail(mailOptions)
              .then(() => console.log('test sendinvoice'))
              .catch((error) => console.error('There was an error while sending the email:', error));
  
}




function sendSlack(message){
  var IncomingWebhook = require('@slack/client').IncomingWebhook;
   var URL = "https://hooks.slack.com/services/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";
   var webhook = new IncomingWebhook(URL);
  console.log("this is teslaslack function");
  webhook.send(message,function(error,header,statuscode,body){
    if(error){
      console.log('error:',error);
    }
    else{
      console.log('received',statuscode,'from slack');
    }
  })
}

function sendSlackform(formmessage){
  var IncomingWebhook = require('@slack/client').IncomingWebhook;
   var URL = "https://hooks.slack.com/services/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";
   var webhook = new IncomingWebhook(URL);
  console.log("this is teslaslack function");
  webhook.send(formmessage,function(error,header,statuscode,body){
    if(error){
      console.log('error:',error);
    }
    else{
      console.log('received',statuscode,'from slack');
    }
  })
}

async function salesemail(data)
 {
   console.log("testing this salesemail functions");
   console.log("content :",data.name,data.email,data.phonenumber,data.product);
   
   const salemailOptions = {
    from:'testenv@soexcellence.com',
    to: data.email,
    templateId: "9357284",
    templateModel: {
      name : data.name,
      email: data.email,
      phonenumber : data.phonenumber,
      product: data.product
    }
  };
      
      //  console.log(data);
      await mailTransport.sendMail(salemailOptions)
              .then(() => console.log('testemail sent to ' + data.email))
              .catch((error) => console.error('There was an error while sending the email:', error));
}


async function salesonboardedemail(data)
 {
   console.log("testing this salesonboardedemail functions");
   console.log("content :",data.name,data.email,data.phonenumber,data.product);
   
   const saleonboardedmail = {
    from:'testenv@soexcellence.com',
    to: data.email,
    templateId: "9344665",
    templateModel: {
      name : data.name,
      email: data.email,
      phonenumber : data.phonenumber,
      product: data.product
    }
  };
      
      //  console.log(data);
      await mailTransport.sendMail(saleonboardedmail)
              .then(() => console.log('testemail sent to ' + data.email))
              .catch((error) => console.error('There was an error while sending the email:', error));
}




/*
var accountSid = 'AC5ccbb2b1b188e6d1e0330f5981c73d14';
var authToken = '4febd659f9010b80af2643ff28e07a53';
var client = require('twilio')(accountSid, authToken);

async function whatsapp(getMessage){
  console.log(getMessage);
  await client.messages
  .create(
    {
    from:"whatsapp:+14155238886",
    body: "Hello world"+getMessage ,
    to: "whatsapp:+918973099723"
  });
  console.log("this is to use the whatsapp message");
}
*/


function sendSlackupdates(eventmessage){
  var IncomingWebhook = require('@slack/client').IncomingWebhook;
var link = "https://hooks.slack.com/services/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";
var webhook = new IncomingWebhook(link);
  console.log("this is eventslack function");
  webhook.send(eventmessage,function(error,header,statuscode,body){
    if(error){
      console.log('error:',error);
    }
    else{
      console.log('received',statuscode,'from slack');
    }
  })
}


var accountSid = 'ACafd20456fa82d147cb7325146fa988c4';
var authToken = 'dcf817fe7ca255973c19297b7c4767d7';
var client = require('twilio')(accountSid, authToken);


async function sms(sendsms){
  client.messages
  .create({from:"+12015142180",to: "+919677117165",body: "Hello world" + sendsms })
  .then(message=>console.log(message.sid));
  console.log("this is the sms message");
}


async function sendBatchEmail(mailbatch){
  console.log("test mail");
  var postmark = require("postmark");
  var client = new postmark.ServerClient("27eab63f-ecbc-4b21-a199-531f45ce1e20");
  await client.sendEmailBatchWithTemplates(mailbatch, function (error, info) {
      if (error) {
          console.log('There was an error (2):', error);
          return;
      }
      else {
          console.log("mail sent sucess%",info);
         
      }
    });
  
   
  }




/*
   const mailOptions=[
    {
      "From": "testenv@soexcellence.com",
	    "To": "test1@soexcellence.com",
      "templateID":maildata.templateid,
      "templateModel":{
        "Subject":maildata.subject,
        "HtmlBody":maildata.message
            }
    },
   {
    "From": "testenv@soexcellence.com",
    "To": "test2@soexcellence.com",
    "templateID":maildata.templateid,
    "templateModel":{
      "Subject":maildata.subject,
      "HtmlBody":maildata.message
          }
   }
  ]
   
   */

















/*
async function message(data)
{

  await admin.firestore().collection('Token').where('city', '==', data.city).orderBy('name')
  .get()
  .then(function(querySnapshot) {
    console.log("this is inside participant data");
    querySnapshot.forEach(async function (tokenDoc)
    {
    
  var token=tokenDoc.data();
    
  console.log(token);
      const mailOptions = {
          from:'testenv@soexcellence.com',
          to: token.email,
          templateId:'14279095',
          templateModel: {
            name:token.name,
            type:token.type,
            tokennumber:token.tokennumber,
            email:token.email,
           message:data.message,
          }
        }
      await mailTransport.sendMail(mailOptions)
              .then(() => console.log('testemail sent to ' + token.email))
                 .catch((error) => console.error('There was an error while sending the email:', error));
})
    })
  }
  */

/*
async function getdate(data)
{
 console.log(data.startdate);
 console.log(data.enddate);

}

*/
 
/*
async function sendinvoice(paymentid)
{
  return;
  var email;
  var fee;
  var invoicenumber;
  var gst;
  var billingaddress;
  var date;
  var total;
  var participantid;
  var invoicecounterdoc;
  var invoicedoc;
  await admin.firestore().collection('PaymentInvoices').doc(paymentid)
  .get()
  .then(querySnapshot => {
    if(!querySnapshot.data())
    {
      sendinvoiceemail(paymentid);
    }
    else
    {
      await admin.firestore().collection('defaults').doc(counters)
      .get()
      .then(querySnapshot2 => {
        this.invoicenumber = querySnapshot2.invoiceid;
        querySnapshot2.ref.update({
          invoiceid: this.invoicenumber + 1,
          //this.invoicecounterdoc = querySnapshot2;
        })
      });
      await admin.firestore().collection('ParticipantPayments').doc(paymentid)
      .get()
      .then(querySnapshot1 => {
        total = querySnapshot1.receipt;
        fee = querySnapshot1.fee;
        gst = querySnapshot1.gst;
        date = querySnapshot1.date;
        participantid = querySnapshot1.participantid;
      });
      await admin.firestore().collection('Participants').doc(paymentid)
      .get()
      .then(querySnapshot2 => {
        email = querySnapshot2.email;
        billingaddress = querySnapshot2.billingaddress;
        if(!billingaddress)
        {
          billingaddress = querySnapshot2.name;
        }
      });

      invoicedoc = admin.firestore().collection('PaymentInvoices').doc(paymentid);
      const batch = admin.firestore.batch();
       batch.set(invoicecounterdoc.ref,{
         invoiceid: invoicenumber + 1
      });
        batch.set(invoicedoc.ref, {
          id: paymentid,
          email: email,
          fee: fee,
          invoicenumber: invoicenumber,
          gst: gst,
          billingaddress: billingaddress,
          date: date,
          total: total,
          participantid: participantid
        });
        await batch.commit();
        return sendinvoiceemail(paymentid);
    }
  })
}

*/

/* function sendinvoiceemail(paymentid)
{
  await admin.firestore().collection('PaymentInvoices').doc(paymentid)
  .get()
  .then(querySnapshot => {
    console.log("Sending Invoice");
    var invoice = querySnapshot.data();
    const mailOptions = {
        from: 'billing@intl.soexcellence.com',
        to: invoice.email,
        templateId: 4987782,
        templateModel: {
          "fee": invoice.fee,
          "invoicenumber": invoice.invoiceid,
          "tax": invoice.gst,
          "billingname": invoice.billingaddress,
          "date": invoice.date,
          "total": invoice.total
        }
};
return mailTransport.sendMail(mailOptions)
        .then(() => console.log('Invoice email sent'))
        .catch((error) => console.error('There was an error while sending the email:', error))

});
}
*/
async function aggregate(participantid, invoiceflag)
{
  console.log("I am the Aggregator")
  var paymentcount = 0;
  var totalpayment = 0;
  var totalpurchasevalue = 0;
  var lastpaymentdate = new Date;
  var recentpurchase = "";
  var lastpaymentamount = 0;
  var installmentamount = 0;
  await admin.firestore().collection('ParticipantPayments').where('participantid', '==', participantid).orderBy('date', "asc")
  .get()
  .then(function(querySnapshot) {
      querySnapshot.forEach(function (paymentDoc)
      {
        var payment = paymentDoc.data();
      paymentcount++;
      totalpayment += payment.fee;
      lastpaymentdate = payment.date;
      lastpaymentamount = payment.fee;
      console.log(paymentcount);
      console.log(totalpayment);
        });
    });
    await admin.firestore().collection('ParticipantPurchases').where('participantid', '==', participantid).orderBy('purchasedate','asc')
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function (purchaseDoc)
        {
          var purchase = purchaseDoc.data();
          totalpurchasevalue += purchase.fee;
          recentpurchase = purchase.product;
          console.log("Recent Purchase: "+ recentpurchase);
          });
      });
      console.log("Over here 2");

    await admin.firestore().collection('Participants').doc(participantid)
    .get()
    .then(async querySnapshot => {
      if(!querySnapshot.data())
      {
        console.log("Participant id error");
        console.log(participantid);
        return null;
      }
      else
      {
      installmentamount = querySnapshot.data().pp_installmentamount;

        var installmentsdue = Math.ceil((totalpurchasevalue - totalpayment) / (installmentamount/1.18));
        if(!installmentsdue)
        {
          installmentsdue = 0;
        }
    await admin.firestore().collection('Participants').doc(participantid).update({
    pp_totalpurchasevalue: totalpurchasevalue,
    pp_totalpaid: totalpayment,
    pp_balance: totalpurchasevalue - totalpayment,
    pp_installmentspaid: paymentcount,
    pp_lastpayment: lastpaymentdate,
    pp_installmentsdue: installmentsdue,
    recentpurchase: recentpurchase,
    checkvariable: 30

  });
  }
  });

}

exports.payment_gstfix = functions.https.onRequest(async (req, res) => {

  await admin.firestore().collection('ParticipantPayments').get()
  .then(function(querySnapshot) {
      querySnapshot.forEach(function (paymentDoc)
      {
        var payment = paymentDoc.data();
      if(payment.gst != payment.receipt - payment.fee)
        {
         paymentDoc.ref.update({
           gst: payment.receipt - payment.fee
         });
          console.log("Adjusted Payment");
        }
        });
        return 0;
    });
});

exports.payment_aggregatefix1 = functions.https.onRequest(async (req, res) => {

  await admin.firestore().collection('Participants').get()
  .then(function (querySnapshot) {
      querySnapshot.forEach(function (participantDoc)
      {

        var participant = participantDoc.data();
        if(participant.checkvariable!=30)
        {
          console.log("Aggregating" + participant.name);

        if(participant.id)
        {
        console.log(participant.id);
        aggregate(participant.id, false);

        }
        else{
          console.log("id missing");
        }

      }
      else{
        console.log("Already Done" + participant.name);
      }

      });
      return 0;
    });
  //  res.status(200).send("Super :)");
});

/*const express = require('express');
let app = express();
app.use(cors());
app.options('*', cors());
*/

//this is function called when token is generated.
exports.slack_triggers = functions.firestore.document('Token/{tokenid}')
.onCreate(snapshot=> {
  if(snapshot.data().sent){
    console.log("alldata token slack");
var Name= snapshot.data().name;
var Type = snapshot.data().type;
var City = snapshot.data().city;
var Tokennumber = snapshot.data().tokennumber;
var Consultationtaken=snapshot.data().consultation_taken;
var Reviewtaken=snapshot.data().review_taken;
var Totalconsultation=snapshot.data().total_consultations;
var Totalreview=snapshot.data().total_Review;
var Validty=snapshot.data().validty;


var message="*Name*: "+ Name+"\n "+"*Type*: "+Type +"\n"+"*Token *: "+ Tokennumber +"\n" + "*City *: "+ City +"\n"+"*Consultation_taken*:"+Consultationtaken +"\n"+"*Review_taken *: "+Reviewtaken+"\n"+"*Total_consultation*: "+Totalconsultation+"\n"+"*Total_review *: "+Totalreview+"\n"+"Validity: "+Validty;
  
sendSlack(message);
  }
if(snapshot.data().exception){
  console.log("exception slack");
  var Name= snapshot.data().name;
var Type = snapshot.data().type;
var City = snapshot.data().city;
var Tokennumber = snapshot.data().tokennumber;
var message="*Name*: "+ Name+"\n "+"*Type*: "+Type +"\n"+"*Token *: "+ Tokennumber +"\n" + "*City *: "+ City ;

sendSlack(message);
}
})



exports.slackform_triggers = functions.firestore.document('form/{formid}')
.onCreate(snapshot=> {
var Name= snapshot.data().name;
var Type = snapshot.data().type;
var City = snapshot.data().city;
var Tokennumber = snapshot.data().tokennumber;
var Question1 = snapshot.data().question1;
var Question2 = snapshot.data().question2;

var formmessage="*Name*: "+ Name+"\n "+"*Type*: "+Type +"\n" + "*City*: "+ City +"\n" + "*What were the Action Items mentioned in the previous Review with Antano & Harini? Please Provide an update on How much you have completed them. *:"+ Question1 +"\n"+"*Are there any Unforseen dire situational changes in your life that needs urgent attention? If yes, please provide information briefly* :" +Question2;
sendSlackform(formmessage);
})



/*
exports.twilio_triggers = functions.firestore.document('Message/{messageid}')
.onCreate(snapshot=> {
{

  // Requiring the values to send
  
var city = snapshot.data().city; //Remember to replace your number enable on Twilio Sandbox
var getMessage   = "Welcome , to Twilio App! Thank you for your interest, our team will contact you ASAP! ;)"+city ;

whatsapp(getMessage);
}
})
*/
exports.smstwilio_triggers = functions.firestore.document('Message/{messageid}')
.onCreate(snapshot=> {
{

 
var message=snapshot.data().message;
var city = snapshot.data().city;
var sendsms  = "Hi" + message ;

sms(sendsms);
}
})

//this function is to send slack update while the queue management system move the token .
exports.slackupdates_triggers = functions.firestore.document('Token/{tokenid}')
.onUpdate((change,context)=> {
  if(change.after.data().currentstage){
  console.log("nextsatge:",change.after.data().currentstage);
  console.log("name:",change.before.data().name);
var currentstage=change.after.data().currentstage;
var name= change.before.data().name;

var eventmessage= "*Stage *: " +currentstage +"\n" + "*Name*: "+ name ;

  sendSlackupdates(eventmessage);
}

})


//function to send email for token cancelled people.it is called from cometovenue screen
exports.queuecancel1_triggers = functions.firestore.document('Token/{tokenid}')
.onUpdate((change,context)=> {
  console.log("status:",change.after.data().status);
  console.log("tokennumber:",change.before.data().tokennumber);
  console.log("email:",change.before.data().email);
  console.log("city:",change.before.data().city);
  console.log("type:",change.before.data().type);
  console.log("name:",change.before.data().name);
  console.log("tokenid:",change.before.data().id);
var status=change.after.data().status;
var name=change.before.data().name;
var type=change.before.data().type;
var token=change.before.data().tokennumber;
var email=change.before.data().email;
var city=change.before.data().city;
var data=change.before.data().id;

if(change.after.data().cancel){
  canceltoken(data);
}

})


exports.issuecheck = functions.https.onRequest((request,response)=>{ 
  console.log("hello world");
});


//function is called when the emailfilter page sendemail button clicked and create a batchmail 
exports.emaillist=functions.firestore.document('emaillist/{emaillistid}')
.onCreate(async(data)=>{
  console.log("check1");
  var email;
    var arr = [];
    var milestone;
    var eitstatus;
    var status;
  
    console.log("Inside emaillist function");
    for (var i = 0; i < data.get('snapshot').length; i++) {
        email = data.get('snapshot')[i].email;
        
      var  firstname=data.get('snapshot')[i].firstname;
      var  name=data.get('snapshot')[i].name;
      
        console.log(name);

      const mailOptions = {
          From: fromAddress,
          To: email,
          templateId: data.data().templateid,
          templateModel: {
              firstname:firstname,
              name:name,
              Subject: data.data().subject,
              HtmlBody: data.data().message,
          }
      };
      arr.push(mailOptions);
    }       
    
  console.log(arr);
 console.log("check2 array created");
  var batch=[];
  var j;
  console.log(arr.length);
  console.log("batchsize",batchsize);
  var batchid=data.data().id;
  for(var i=0;i<arr.length;i++){
  batch.push(arr[i]);
  if(i%batchsize==0){
  console.log("if",batch,i);
  j=i/batchsize;
  await admin.firestore().collection('Batchmail').doc(batchid + j).set({
    id:batchid+j,
    batch:batch,
    batchnumber:i,
   })
   batch=[];
   console.log("if creating Document with", batchsize , "record batch of",j);
  
  }
   
  else if(i+1==arr.length){
  var k=j+1
    console.log("else if",batch,i);
     await admin.firestore().collection('Batchmail').doc(batchid + k).set({
      id:batchid,
      batch:batch,
      batchnumber:i,
   })
   batch=[];
   console.log("elseif creating Document with", batchsize, "record batch of",k);
  }
  }

  })

  exports.batchmail_trigger = functions.firestore.document('Batchmail/{batchid}')
  .onCreate(data=>{
    {
      var mailbatch=[];
         for(var i=0;i<data.data().batch.length;i++){
           mailbatch.push(data.data().batch[i]);
          }
          console.log("mailbatch",mailbatch);
       sendBatchEmail(mailbatch);
         mailbatch=[];
         return;
    }
    })


/*
//batch email to all the watson customers 
exports.sendbatchmail_trigger =functions.firestore.document('mail/{mailid}')
.onCreate(data=>{
  {
    
    var arr=[];
    admin.firestore().collection('Participants')
  .get()
 .then(async snapshot => {
   snapshot.forEach(snapshot => {
    if(snapshot.data().pp_status!="Closed Lost"){
      var email=snapshot.data().email;
 // console.log("fetch email id ",email);
     //console.log("fetching data email");
   const mailOptions={
    From:fromAddress,
    To:email,
    templateId:data.data().templateid,
    templateModel:{
     Subject:data.data().subject,
     HtmlBody:data.data().message,
    }
  }
  arr.push(mailOptions);
    }
  })
  const batch = admin.db.firestore().batch();
var batchid=data.data().id;
var batcharr=[];
var j;
console.log(arr.length);
console.log("batchsize",batchsize);
for(var i=0;i<arr.length;i++){
batcharr.push(arr[i]);
if(i%batchsize==0){
console.log("if",batcharr,i);
j=i/batchsize;
 const batchemail= await admin.firestore().collection('Batchmail').doc(batchid + j).ref
 batch.set(batchemail,{
  id:batchid+j,
  batch:batcharr,
  batchnumber:i,
 })
 batcharr=[];
 console.log("if creating Document with", batchsize , "record batch of",j);

}
 
else if(i+1==arr.length){
var k=j+1
  console.log("else if",batcharr,i);
   await admin.firestore().collection('Batchmail').doc(batchid + k).set({
    id:batchid,
    batch:batcharr,
    batchnumber:i,
 })
 batcharr=[];
 console.log("elseif creating Document with", batchsize, "record batch of",k);
}
}
})
}
  
  })


  exports.batchmail_trigger = functions.firestore.document('Batchmail/{batchid}')
.onUpdate((change,context)=>{
  {
    var mailbatch=[];
       for(var i=0;i<change.before.data().batch.length;i++){
         mailbatch.push(change.before.data().batch[i]);
        }
        console.log("mailbatch",mailbatch);
     //sendBatchEmail(mailbatch);
       mailbatch=[];
  }
  })
*/
/*
exports.particiapant_testing200 = functions.runWith({timeoutSeconds:360}).https.onRequest(async (req, res) => {
  console.log("this is to generate participantcollection");
 var i;
  for(i=10;i<490;i++){
      const db=admin.firestore();
   const ref=admin.firestore().collection('/Participants/').doc();
   ref.set({
     checkvariable:30,   
    email:"test"+i+"@soexcellence.com",
    firstname:"test"+i,
    firstpurchasedate:"01-04-2019",
    eit_status:"started",
    lastname:" ",
    name:"test"+i,
    phone:9999999999,
    recentpurchase:"uP!",
    pp_paymentday:2,
    pp_installmentamount:23260,
    pp_balance:91000,
    pp_status:"Active PaymentPlan",
    pp_lastpayment:"2020-04-01",
    pp_installmentsdue:37441,
    pp_frequency:"monthly",
    pp_installmentspaid:23000,
    pp_totalpaid:10000,
    pp_totalpurchasevalue:2450000,
    id:ref.id
  });
 console.log(i);

 }


 });*/
    /*
    
   
 return sendBatchEmail(arr);
  })

  })*/
 
/*
   if(!10){
  
    console.log(batch);

    batchemail(batch);
   }
  
   else{
    console.log("success fetching data");
    batchemail(batch);
   }
      }); 
    })
    */
  
  
export const emailrequest = functions.https.onRequest(async(request,response)=>{ 

console.log("email:" ,request.query.email);
var useremailid=request.query.email;

await admin.firestore().collection('Participants').where("email","==",useremailid).get()
.then(async querySnapshot=> {
    querySnapshot.forEach(doc=>
      {
console.log("status",doc.data().pp_status);
var status=doc.data().pp_status;
      if(status!="Missing PP" && status!="Closed Lost" && status!="Suspended") 
        {
        console.log("true");
        response.send(true);
      }
      else{
        console.log("false");
        response.send(false);
      }
    })
  
    })
});

exports.sale_onboardingtrigger = functions.firestore.document('saleinitiation/{saleId}')
.onUpdate((change,context) => {
  console.log(change.after.data().onboardingstatus);
  
  if(change.after.data().onboardingstatus == 'OnBoarded'){
    console.log("the on boarded data",change.after.data().onboardingstatus);
  var onboardeddata = change.after.data();
 
  // console.log(onboardeddata);
  console.log(" onboarding Email trigger Started");


 salesonboardedemail(change.after.data());

  }
})

exports.sale_triggers = functions.firestore.document('saleinitiation/{saleId}')
.onUpdate((change,context) => {
  console.log("this is trigger functions"); 
  console.log("Resending payment plan mail : ",change.after.data().resendpaymentplanmail);
  console.log("sending payment plan confirmation mail to client : ",change.after.data().saleconfirmedstatus);
  console.log("sending mail if client is onboarded : ",change.after.data().onboardingstatus);
  
  
  ///
  if(change.after.data().resendpaymentplanmail === true && change.after.data().onboardingstatus === 'Ready For OnBoarding' ){
    console.log("the resending payment plan data",change.after.data().resendpaymentplanmail);
    // var data = change.after.data();
    var saleid = change.after.data().id
    // console.log(data);
    console.log("resending payment plan confirmation mail started");

   salesemail(change.after.data());
    console.log("resending payment plan confirmation mail started");
    admin.firestore().collection("saleinitiation").doc(saleid).update({
      resendpaymentplanmail: false
    })
      console.log("resend payment plan updated to false");

  }
  ////
  
  if(change.after.data().saleconfirmedstatus == 'Sale Confirmed' && change.after.data().onboardingstatus === 'Ready For OnBoarding' ){
      console.log("the data",change.after.data().saleconfirmedstatus);
    var data = change.after.data();
   
     console.log("client Name :",data.name);
     console.log("client Email : ",data.email);
     console.log("client product : ",data.product);
     console.log("Email Sent for payment plan confirmation");
     salesemail(change.after.data());

   //Adding the sale details to the Participants Collection.
  //  const feespaid = Math.ceil(change.after.data().tokenamount/1.18);
  //  const ref=admin.firestore().collection('/Participants/').doc();
  //  ref.set({
  //   // checkvariable:30,   
  //   // email:change.before.data().email,
  //   // firstname:change.before.data().clientname,
  //   // firstpurchasedate:change.before.data().saledate,
  //   // eit_status:"",
  //   // lastname:change.before.data().clientname,1q
  //   // name:change.before.data().clientname,
  //   // phone:change.before.data().phonenumber,
  //   // recentpurchase:change.after.data().product,
  //   // pp_paymentday:change.after.data().EMI_Date,
  //   // pp_installmentamount:change.after.data().EMI_Amount,
  //   // pp_balance:"",
  //   // pp_status:"Active PaymentPlan",
  //   // pp_lastpayment:"2020-04-01",
  //   // pp_installmentsdue:37441,
  //   // pp_frequency:"monthly",
  //   // pp_installmentspaid:23000,
  //   // pp_totalpaid:10000,
  //   // pp_totalpurchasevalue:2450000,
  //   // id:ref.id
  //  id: ref.id,
  //  firstname: change.before.data().firstname,
  //  lastname: change.before.data().lastname,
  //  name:change.before.data().firstname+''+change.before.data().lastname,
  //  email: change.before.data().email,
  //  phone: change.before.data().phonenumber,
  //  firstpurchasedate: change.before.data().saledate,
  //  recentpurchase: change.after.data().product,
  //  pp_totalpurchasevalue: change.after.data().closedprice,
  //  pp_totalpaid: feespaid,
  //  pp_balance: change.after.data().closedprice - feespaid,
  //  pp_frequency: "monthly",
  //  pp_installmentamount: change.after.data().emiamount,
  //  pp_installmentspaid: 0,
  //  pp_paymentday: change.after.data().emistartdate,
  //  pp_lastpayment: "",
  //  pp_installmentsdue: Math.ceil((change.after.data().closedprice - feespaid) / ( change.after.data().emiamount / 1.18)),
  //  pp_status:"Active PaymentPlan",
  //  })
   }
  
   });

// exports.sale_triggers = functions.firestore.document('saleinitiation/{saleId}')
//  .onCreate(async (snapshot, context) => {
//    if(!snapshot.data().sent)
//    {
//     await salesemail(snapshot.data());
//     console.log("trigger Sent");
//    let ref= snapshot.data().sale;
//      ref.update({
//     sent: true
//      });
//     }
//   });


exports.startlabs_userverification = functions.https.onRequest((request,response)=>{ 
  response.header("Access-Control-Allow-Origin", "*")
  console.log("hello Startlab");
  console.log(request.query);

  var email = request.query['email'];
  var number = parseInt(request.query['number']);
  
   admin.firestore().collection('Participants').where("email", "==",email).where("phone","==",number).get()
  .then(val=>{
    response.send(val.size != 0);

  })
 
});
exports.startlabs_userdata= functions.https.onRequest((request,response)=>{ 
  response.header("Access-Control-Allow-Origin", "*")
  // var email = request.query['email'];
  var email = request.query['email'];

  var dataToSend = {}
  admin.firestore().collection('Participants').where("email","==",email).get()
  .then(async function (querySnapshot) {
    if(querySnapshot.size!=0){
      querySnapshot.forEach(function (Doc)
      {
        
        console.log(Doc.data());
    
        dataToSend['name'] = Doc.data().name,
        dataToSend['email'] = Doc.data().email,
        dataToSend['product'] = Doc.data().recentpurchase,
        dataToSend['totalpurchased'] = Doc.data().pp_totalpurchasevalue,
        dataToSend['totalpaid'] = Doc.data().pp_totalpaid,
        dataToSend['balance'] = Doc.data().pp_balance, 
        dataToSend['totalconsultation'] = Doc.data().total_consultations,
        dataToSend['totalreview'] = Doc.data().total_review,
        dataToSend['consultationtaken'] = Doc.data().consultation_taken,
        dataToSend['reviewtaken'] = Doc.data().review_taken,
        dataToSend['first_consultation']=Doc.data().first_consultation,
        dataToSend['recent_consultation']=Doc.data().recent_consultation,
        dataToSend['validty']=Doc.data().validty,
    
        response.send(dataToSend);

      })
    }
    else{
      response.send(null);
    }
})
})
/*
exports.dummy = functions.https.onRequest((request,response)=>{ 
  console.log("hello world");
});
*/
/*
exports.queue_triggers = functions.firestore.document('Message/{messageid}')
 .onCreate(async (snapshot, context) => {
   if(!snapshot.data().messagesent)
   {
 await message(snapshot.data());
  console.log("message Sent");
 var ref= snapshot.data().Message;
   snapshot.ref.update({
  messagesent: true
   });
  }
});
*/
/*
exports.radndom1 = functions.https.onRequest((request,response)=>{ 

  console.log("over here radndom1");
  const projectId="watson-9878";
  const dataset = "watson";
  const tablename = "sample";
  const table = `${projectId}.${dataset}.${tablename}`;
  const bigquery = new BigQuery();
  const  query = "SELECT name,pp_totalpaid,pp_totalpurchasevalue.integer as pp_totalpurchasevalue,pp_installmentamount.integer as pp_installmentamount,pp_lastpayment,pp_status FROM `watson-9878.watson.sample` where pp_status in ('Active PaymentPlan','Missing PP')  and  pp_lastpayment not between '2019-02-01' and '2019-02-28' ";
  console.log("this is bigquery function");

 return bigquery.query
  ({
    query:query,
    useLegacySql:false
  })
  
  .then(result=>{
    const rows = result[0];
     cors(request,response,()=>{
       response.json(rows);
    const data=request.body;
    console.log(data);
       response.send(data);
      
     })
  });

})



export const getdata = functions.https.onRequest((request,response)=>{

  return cors(request, response,()=>{
  
    
    const startdate = request.body;
   
  console.log("Over Here date function");
  console.log("this is sdate & edate : ",startdate);
 

 return response.status(200).send('startdate:{sdate} and endate:{edate}');
  })
 //return this.http.get('url').subscribe(res=>console.log(res));
})

*/
exports.particiapant_ppstatusfix = functions.https.onRequest(async (req, res) => {
  await admin.firestore().collection('Participants').get()
  .then(async function (querySnapshot) {
      querySnapshot.forEach(function (participantDoc)
      {
        if(!participantDoc.pp_status)
        {
          participantDoc.ref.update({
          pp_status: 'Active PaymentPlan'
        });
        console.log("Payment Plan Activated");
      }
        });
        
    });
});




exports.journeysequence_triggers = functions.https.onRequest(async (req, res) => {
  /*await admin.firestore().collection('Journey').get()
  .then(async function (querySnapshot) {
      querySnapshot.forEach(function (journeyDoc)
      {
        if(!journeyDoc.sequence)
        {
          journeyDoc.ref.update({
          sequence: 1
        });
        console.log("Payment Plan Activated");
      }
    })
    */
      await admin.firestore().collection('Journey').get()
      .then(async function (querySnapshot) {
        querySnapshot.forEach(function (journeyDoc)
        {
          
          console.log(journeyDoc.data().sequence);
          var sequencecorrected;
          sequencecorrected = +journeyDoc.data().sequence;
          console.log(sequencecorrected);

          if(journeyDoc.data().sequence)
          {
            console.log("updating sequence");
            journeyDoc.ref.update({
              sequence: sequencecorrected
            })    
          }
        });
        console.log("All record completed");
        return null;
    });
    console.log("All record completed");
    return null;
});



exports.payment_triggers_v3 = functions.firestore.document('ParticipantPayments/{paymentId}')
  .onCreate(async (snapshot, context) => {
    console.log("New Payment :)");
  var participantid = snapshot.data().participantid;
  await aggregate(participantid, true);
  //await sendinvoice(paymentId);
  await admin.firestore().collection('Participants').doc(participantid)
  .get()
  .then(async querySnapshot => {
    var email=querySnapshot.data().email;
    console.log("this is invoice email "+email);
    snapshot.ref.update({
      email: email,
    })
  })
});

//var count=0;
var invoicenum;
exports.payment_triggers_invoice=functions.firestore.document('ParticipantPayments/{paymentId}')

.onCreate(async (snapshot, context) => {   
  await admin.firestore().collection("defaults").doc("counters").get()
  .then(counters=>{
     var invoiceid = counters.data().invoiceid;
     console.log("the invoiceid is" + invoiceid);
   
   
 
     console.log("the invoiceid is update in payment");
// count=count+1
 invoicenum = invoiceid + 1;

    var ref = snapshot.data().ref;
     snapshot.ref.update({
      invoiceid:invoicenum
      
 });
 console.log("the invoiceid is" + invoicenum);

   })
   await admin.firestore().collection("defaults").doc("counters").update({
     invoiceid:invoicenum,
   })
 console.log(invoicenum);
})
 
//invoice function to trigger the sendinvoice function
exports.invoice_triggers = functions.firestore.document('Invoice/{paymentId}')
  .onWrite(async (change, context) => {

  console.log("this is test invoice");

   console.log("afterdata", change.after.data());

    console.log("beforedata",change.before.data());
    
    await invoicemail(change.after.data());

  }) 


//send email to all the customer 
exports.customeremail_triggers_v2 = functions.firestore.document('CustomerEmailsv2/{emailerId}')
  .onCreate(async (snapshot, context) => {
    if(!snapshot.data().emailersent)
    {
  await sendcustomeremail1(snapshot.data());
   console.log("checked true");
  var ref= snapshot.data().ref;
    snapshot.ref.update({
    emailersend: true
    });
   }
 });

//send test email for etemplate
 exports.testemail_triggers = functions.firestore.document('TestEmail/{emailerId}')
 .onCreate(async (snapshot, context) => {
   if(!snapshot.data().sent)
   {
 await testemail(snapshot.data());
  console.log("Test Email Sent");
 var ref= snapshot.data().TestEmail;
   snapshot.ref.update({
  sent: true
   });
  }
});

exports.sendtoken_triggers = functions.firestore.document('Token/{tokenid}')
 .onCreate(async (snapshot, context) => {
   if(!snapshot.data().sent)
   {
    if(snapshot.data().exception){
      await sendexcetoken(snapshot.data());
      console.log("Token generator exception Email Sent");
     var ref= snapshot.data().Token;
       snapshot.ref.update({
      sent: true
       });
     }
     if(!snapshot.data().exception){
      await sendtoken(snapshot.data());
      console.log("Token generator Email Sent");
     var ref= snapshot.data().Token;
       snapshot.ref.update({
      sent: true
       });
     }
  }
 })
 
 exports.sendformtoken_triggers = functions.firestore.document('form/{formid}')
 .onCreate(async (snapshot, context) => {
   if(!snapshot.data().sent)
   {
 await sendformtoken(snapshot.data());
  console.log("Token generator Email Sent");
 var ref= snapshot.data().FormToken;
   snapshot.ref.update({
  sent: true
   });
  }
 })



var first_consultation;
  var recent_consultation;
  var consultation_taken;
  var review_taken;
//this is to add the firstconsultation and recentconsultation date in participant.
exports.addjourney_triggers = functions.firestore.document('/Journey/{journeyId}')
.onCreate(async(snapahot,context)=>{
  console.log("this is journey function");
  var journeyid=snapahot.data().id;
  console.log(journeyid);
  var participantid=snapahot.data().participantid;
  console.log(participantid);
  first_consultation = null;
await admin.firestore().collection('Journey').where('participantid', '==', participantid).where('type', '==', 'Consultation','||','type', '==', 'Review').orderBy('date','asc')
    .get()
    .then(querySnapshot => {
    querySnapshot.forEach(querySnapshot=>{
      var query=querySnapshot.data();
      console.log("data:",query);
      //var journey=JourneyDoc.data();
     if(!first_consultation){
       console.log("this is first consultation");
      first_consultation=query.date;
     }
     recent_consultation=query.date;
    })
    console.log("first_consultation :",first_consultation);
    console.log("recent_consultation :",recent_consultation);
    })
    await admin.firestore().collection('Participants').doc(participantid).update({
      first_consultation:first_consultation,
      recent_consultation:recent_consultation,
      })
    await admin.firestore().collection('Journey').where('participantid', '==', participantid).where('type', '==', 'Consultation').orderBy('date','asc')
    .get()
    .then(querySnapshot => {
       consultation_taken=querySnapshot.size;
      console.log("consultation_taken :" ,consultation_taken);
    })
  

   await admin.firestore().collection('Journey').where('participantid', '==', participantid).where('type', '==', 'Review').orderBy('date','asc')
    .get()
    .then(querySnapshot => {
      review_taken=querySnapshot.size;
      console.log("review_taken :",review_taken);
    })
    
    await admin.firestore().collection('Participants').doc(participantid).update({
    consultation_taken:consultation_taken,
    review_taken:review_taken
    })
  console.log("data is updated in document");

}) 


//To check and add the sequence number in the timeline in journet document

exports.queuestage_triggers = functions.firestore.document('/Journey/{journeyId}')
.onCreate(async(snapahot,context)=>{
  console.log("before queue sequence",snapahot.data().sequence);
  var sequencenum=Number(snapahot.data().sequence);
  
  var participantid=snapahot.data().participantid;
  var journeyid=snapahot.data().id;
  console.log(journeyid);
  console.log(participantid);
  var sequence;
  if(!sequencenum){
      console.log("inside if functions");
        admin.firestore().collection('Journey').where('participantid', '==', participantid).orderBy('sequence','desc').limit(1)
      .get()
      .then(querySnapshot => {
              querySnapshot.forEach(querySnapshot=>{
             sequence = Number(querySnapshot.data().sequence);
             console.log("sequencenumber" ,sequence);
            var count=sequence;
                console.log(count);
            var cnt=count+10;
            var cont=cnt.toString();
             admin.firestore().collection('Journey').doc(journeyid).update({
             sequence:cont,
                    })
         console.log(cnt);
                  })
               })
  
      }
})







exports.paymentdelete_triggers = functions.firestore.document('ParticipantPayments/{paymentId}')
  .onDelete((snapshot, context) =>  {
    return aggregate(snapshot.data().participantid, false);
      });

exports.purchasedelete_triggers = functions.firestore.document('ParticipantPurchases/{purchaseId}')
  .onDelete((snapshot,context) => {
    return aggregate(snapshot.data().participantid, false);
      });

exports.participantdelete_triggers = functions.firestore.document('/Participants/{participantId}')
  .onDelete(async (snapshot,context) => {
    const participantid = context.params.participantId;
    const paymentplandocurl = '/ParticipantPaymentPlans/'+participantid;

    await admin.firestore().collection('ParticipantPurchases').where('participantid', '==', participantid)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete().then(() => {
          console.log("Purchases successfully deleted!");
        }).catch(function(error) {
          console.error("Error removing purchase: ", error);
        });
      });
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });

    await admin.firestore().collection('ParticipantPayments').where('participantid', '==', participantid)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete().then(() => {
          console.log("Payments successfully deleted!");
        }).catch(function(error) {
          console.error("Error removing payment: ", error);
        });
      });
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
    return 0;
  });

  // async function recentpurchase(participantid)
  // {
  //   await admin.firestore().collection('ParticipantPurchases').where('participantid', '==', participantid).orderBy('purchasedate', "dsc").limit(1)
  //   .get()
  //   .then(function(querySnapshot) {
  //       querySnapshot.forEach(function (purchaseDoc)
  //       {
  //         var recentpurchase = purchaseDoc.product;
  //       });
  //     });
  //
  //     await admin.firestore().collection('Participants').doc(participantid)
  //     .get()
  //     .then(querySnapshot => {
  //       if(!querySnapshot.data())
  //       {
  //         console.log("Participant id error");
  //         console.log(participantid);
  //         return null;
  //       }
  //       else
  //       {
  //         return admin.firestore().collection('Participants').doc(participantid).update({
  //           recentpurchase: recentpurchase
  //         });
  //     }
  //   });
  // }

  /* exports.purchase_triggers = functions.firestore.document('ParticipantPurchases/{purchaseId}')
    .onCreate((snapshot, context) => {
      console.log("New Purchase :)");
      return recentpurchase(snapshot.data().participantid);
  }); 
*/
