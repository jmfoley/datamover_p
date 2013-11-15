var SendGrid = require('sendgrid-nodejs').SendGrid;
var Email = require('sendgrid-nodejs').Email;



var sender = new SendGrid('azure_78e4f021276d2d5749a5a24469737218@azure.com',
                          'umluqqq4'); 


function callback(error,results){};

function SendReport( data,callback) {

var crashData = 'Operator: ' + data.operatorid + ' prop: ' + data.propid + ' unit: ' + data.unit + '\r\n\r\n trace: ' +
            data.trace;


var email = new Email({
   to: ['jfoley@m3ts.com','skotova@m3ts.com'],
   from: 'kioskErrorReport@m3ts.com',
   subject: 'Kiosk Error Information',
   text : crashData
});




sender.send(email,function(success,err){
      if(success){
        callback(null,success);
     }
     else {
        callback(err,null);
     }

});

}exports.SendReport = SendReport;




function SendMemLeakReport( data,callback) {

var crashData = 'Operator: ' + data.operatorid + ' prop: ' + data.propid + ' unit: ' + data.unit + '\r\n\r\n information: ' +
            data;


var email = new Email({
   to: ['jfoley@m3ts.com'],
   from: 'interfaceMemLeakReport@m3ts.com',
   subject: 'Interface Memory Leak Information',
   text : crashData
});




sender.send(email,function(success,err){
      if(success){
        callback(null,success);
     }
     else {
        callback(err,null);
     }

});

}exports.SendMemLeakReport = SendMemLeakReport;


function SendMemInfo( data,callback) {



var email = new Email({
   to: ['jfoley@m3ts.com'],
   from: 'interfaceMemLeakReport@m3ts.com',
   subject: 'Memory Heap Info',
   text : data
});


sender.send(email,function(success,err){
      if(success){
        callback(null,success);
     }
     else {
        callback(err,null);
     }

});

}exports.SendMemInfo = SendMemInfo;


