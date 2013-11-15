var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool');

var errMsg = '';


function callback(error,results){};


function WriteKioskEvents(data,callback) {

    var sql = '';
    var connection;
    var updated = new Date();
    

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

         if (err) {
            errMsg = 'GetDbConnection error: ' + err;
         	callback(errMsg,null);
         } else {

            connection = results;
            sql = 'insert into db_unitEvents(operatorid, recid,unitid,unitPropid,eventId,eventTime,cardId,cardCasinoId,amount,transactionNumber,deviceId,eventtypeid) ' +
    	              'values(@operatorid,@recid,@unitid,@unitpropid,@eventid,@date,@cardid,@cardcasinoid,@amount,@trans,@deviceid,@eventtypeid)';

	        var request = new Request(sql,function(err,rowCount) {
        
        
            if (err) {
                errMsg = 'WriteKioskEvents error: ' + err;
        	    connection.close();
                connection = null;
                sql = null;
                delete request;
                delete updated;
        	    callback(errMsg,null);
        	
            } else {
        	    connection.close();
                connection = null;
                sql = null;
                delete request;
                delete updated;
        	    callback(null,connection);
        	
            }


	});
        request.addParameter('operatorid', TYPES.Int,data.operatorid);
        request.addParameter('recid', TYPES.Int,data.recid);
        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('unitpropid', TYPES.Int,data.propid);
        request.addParameter('eventid', TYPES.Int,data.eventid);
        request.addParameter('date', TYPES.DateTime,updated);
        request.addParameter('cardid', TYPES.Int,data.cardid);
        request.addParameter('cardcasinoid', TYPES.Int,data.cardcasinoid);
        request.addParameter('amount', TYPES.Int,data.amount);
        request.addParameter('trans', TYPES.Int,data.transnumber);
        request.addParameter('deviceid', TYPES.Int,data.deviceid);
        request.addParameter('eventtypeid', TYPES.Int,data.eventtypeid);

        connection.execSql(request);
          




         }


    });

} exports.WriteKioskEvent = WriteKioskEvents;
;