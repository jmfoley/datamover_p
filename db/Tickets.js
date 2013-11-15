var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';

function callback(error,results){};


function SaveHandpayVoucher(data,callback){
	var sql = '';
	var connection;
    console.log('In savehandpay');
    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
    	if (err) {
    		callback(err,null);
    	} else {
    		connection = results;
    		sql = 'insert into tk_tickets(operatorId,print_mach_num,validation_num,amount,state,print_datetime,' +
    			  'floorexpirationdatetime,cageexpirationdatetime,updated,valnum_last4,print_val_type,' +
    			  'redeem_mach_num,seq,propid,transactionid,seq_id)values(@oper,@printmach,@val,@amount,@state,' +
    			  '@printdatetime,@floorexpiration,@cageexpiration,@date,@last4,@printvaltype,@redeemmach,' +
    			  '@seq,@prop,@trans,@seqid)';

            var request = new Request(sql,function(err,results) {
                if (err) {
                    errMsg = 'SaveHandpayVoucher error: '  + err;
                    connection.close();
                    connection = null;
                    sql = null;
                    delete request;
                    callback(errMsg,null);
                } else {
                     connection.close();
                     connection = null;
                     sql = null;
                     delete request;
                     callback(null,results);
                }

            });

            request.addParameter('oper', TYPES.Int,data.operatorid);
            request.addParameter('printmach', TYPES.Int,data.printedmachnum);
            request.addParameter('val', TYPES.VarChar,data.validationnum);
            request.addParameter('amount', TYPES.Int,data.amount);
            request.addParameter('state', TYPES.Int,data.state);
            request.addParameter('printdatetime', TYPES.DateTime, new Date(data.printeddatetime));
            request.addParameter('floorexpiration', TYPES.DateTime, new Date(data.floorexpiration));
            request.addParameter('cageexpiration', TYPES.DateTime, new Date(data.cageexpiration));


            request.addParameter('date', TYPES.DateTime,new Date());
            request.addParameter('last4', TYPES.VarChar,data.last4);
            request.addParameter('printvaltype', TYPES.Int,data.printvaltype);
            request.addParameter('redeemmach', TYPES.Int,data.redeemmachnum);
            request.addParameter('seq', TYPES.Int,data.seq);
            request.addParameter('prop', TYPES.Int,data.propid);
            request.addParameter('trans', TYPES.Int,data.transid);
            request.addParameter('seqid', TYPES.Int,data.seqid);
            
            connection.execSql(request);
            

    	}
    });




}exports.SaveHandpayVoucher = SaveHandpayVoucher;



function UpdatePendingTrans(data,callback){
    var sql = '';
    var connection;

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
        if (err) {
            callback(err,null);
        } else {
            connection = results;
            sql = 'update tk_tickets set state = 2,redeem_datetime = @date,cashier = @cashier,updated = @date ' +
                  'where state = 0 and print_mach_num = @printmach';

            var request = new Request(sql,function(err,results) {
            if (err) {
                errMsg = 'UpdatePendingTrans error: '  + err;
                connection.close();
                connection = null;
                sql = null;
                delete request;
                callback(errMsg,null);
            } else {
                 connection.close();
                 connection = null;
                 sql = null;
                 delete request;
                 callback(null,results);
            }

        });

        request.addParameter('cashier', TYPES.VarChar,data.cashier);
        request.addParameter('printmach', TYPES.Int,data.mach);
        request.addParameter('date', TYPES.DateTime, new Date());

        connection.execSql(request);


        }

    });


}exports.UpdatePendingTrans = UpdatePendingTrans;
