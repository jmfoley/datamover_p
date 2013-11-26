var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool');
var util = require('util');
var errMsg = '';


function callback(error,results){};


function UpdateLastCom( data,callback) {
    var sql = '';
    var connection;
    var lastCom = new Date(data.lastcom);
    
    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            return callback(errMsg,null);

        } else {
            connection = results;
            sql = 'update slots set last_com_datetime = @lastcom,netsock_ip = @port where ' +
                  'mach_num = @mach and propid = @propid';

            var request = new Request(sql,function(err,results) {
                if (err) {
                    errMsg = 'UpdateLastCom error: '  + err;
                    connection.close();
                    connection = null;
                    sql = null;
                    request = null;
                    delete lastCom;
                    return callback(errMsg,null);


                } else {
                   connection.close();
                   connection = null;
                   sql = null;
                   request = null;
                   delete lastCom;
                   results = null;
                   return callback(null,'ok');

                }
            }); 


            request.addParameter('lastcom', TYPES.DateTime, lastCom);
//            request.addParameter('date', TYPES.DateTime,updated);
            request.addParameter('port', TYPES.VarChar,data.port);
            request.addParameter('mach', TYPES.Int,data.mach);
            request.addParameter('propid', TYPES.Int,data.propid);


            connection.execSql(request);
        }

    });

}exports.UpdateLastCom = UpdateLastCom;




function CheckSlotsTable(connection,data,callback) {
    var records;
    var sql = 'select count(*) from slots where mach_num = @mach and propid = @propid';


    var request = new Request(sql,function(err,rowCount) {
    	if (err) {
            sql = null;
            request = null;
            errMsg = 'CheckSlotsTable error: '  + err;
    		return callback(errMsg,null);
    	} else {
             sql = null;
             request = null;
    		return callback(null,records);
    	}

    });          


        request.addParameter('mach', TYPES.Int,data.mach);
        request.addParameter('propid', TYPES.Int,data.propid);

       request.on('row', function(columns) {
          columns.forEach(function(column) {
            if (column.value === null) {
             console.log('NULL');
          } else {
             records = column.value;

           }
      });
  });

        
        connection.execSql(request);

};





function UpdateSlotsMeters(data,callback) {
     
    var sql = '';
    var connection;
    var update;
    var lastCom = new Date(data.lastcom);
    var updated = new Date();

    //console.log('In updateSlotsMeters: Operatorid = ' + data.operatorid);
    //console.log('data = ' + util.inspect(data)); 

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
    if (err) {
        errMsg = 'GetDbConnection error: ' + err;
        return callback(errMsg,null);

    } else {
        connection = results;
        CheckSlotsTable(connection,data,function(err,rowCount) {
        	if (err) {
                connection.close();
                connection = null;
                rowCount = null;
                return callback(err,null);

        	} else {
                 if (rowCount > 0 ) {
                 	 update = true;
                     sql = 'update slots set post_by = @postby,ol_coin_in = @cin, ol_coin_out = @cout,ol_coin_drop = @drop,' +
                           'ol_games = @games,ol_bill_1 = @bill1, ol_bill_2 = @bill2,ol_bill_5 = @bill5,ol_bill_10 = @bill10,' +
                           'ol_bill_20 = @bill20,ol_bill_50 = @bill50,ol_bill_100 = @bill100,ci_coin1 = @coin1,ci_coin2 = @coin2,' +
                           'ci_coin3 = @coin3,ci_coin4 = @coin4,ci_coin5 = @coin5,ci_coin6 = @coin6,ci_coin7 = @coin7,' +
                           'ci_coin8 = @coin8,ci_coin9 = @coin9,ci_coin10 = @coin10,ol_jackpot = @jack,ol_cancel_credit = @cc,' +
                           'last_com_datetime = @lastcom,updated = @date where mach_num = @mach and propid = @propid';
                 } else {
                     //call add machine function here, Maybe..
                 }

                 if (update){

                    var request = new Request(sql,function(err,results) {
                        if (err) {
                            errMsg = 'UpdateSlotsMeters error: '  + err;
                            connection.close();
                            connection = null;
                            sql = null;
                            request = null;
                            delete lastCom;
                            delete updated;
                            return callback(errMsg,null);

                        } else {
                           connection.close();
                           connection = null;
                           sql = null;
                           request = null;
                           delete lastCom;
                           delete updated;
                           results = null;
                           return callback(null,'ok');

                        }
                    }); 
                    request.addParameter('postby', TYPES.VarChar,data.postby);
                    request.addParameter('cin', TYPES.Int,data.olcoinin);
                    request.addParameter('cout', TYPES.Int,data.olcoinout);
                    request.addParameter('drop', TYPES.Int,data.olcoindrop);
                    request.addParameter('games', TYPES.Int,data.olgames);
                    request.addParameter('bill1', TYPES.Int,data.bill1);
                    request.addParameter('bill2', TYPES.Int,data.bill2);
                    request.addParameter('bill5', TYPES.Int,data.bill5);
                    request.addParameter('bill10', TYPES.Int,data.bill10);
                    request.addParameter('bill20', TYPES.Int,data.bill20);
                    request.addParameter('bill50', TYPES.Int,data.bill50);
                    request.addParameter('bill100', TYPES.Int,data.bill100);
                    request.addParameter('coin1', TYPES.Int,data.coin1);
                    request.addParameter('coin2', TYPES.Int,data.coin2);
                    request.addParameter('coin3', TYPES.Int,data.coin3);
                    request.addParameter('coin4', TYPES.Int,data.coin4);
                    request.addParameter('coin5', TYPES.Int,data.coin5);
                    request.addParameter('coin6', TYPES.Int,data.coin6);
                    request.addParameter('coin7', TYPES.Int,data.coin7);
                    request.addParameter('coin8', TYPES.Int,data.coin8);
                    request.addParameter('coin9', TYPES.Int,data.coin9);
                    request.addParameter('coin10', TYPES.Int,data.coin10);
                    request.addParameter('jack', TYPES.Int,data.jackpot);
                    request.addParameter('cc', TYPES.Int,data.cancelcredit);
                    request.addParameter('lastcom', TYPES.DateTime,lastCom);
                    request.addParameter('date', TYPES.DateTime, updated);
                    request.addParameter('mach', TYPES.Int,data.mach);
                    request.addParameter('propid', TYPES.Int,data.propid);

                    connection.execSql(request);


 


                 } else {
                    connection.close();
                    connection = null;
                    return callback(null,'ok');
                 }
               }
         	
        });
    }
    
 });

}exports.UpdateSlotsMeters = UpdateSlotsMeters;

