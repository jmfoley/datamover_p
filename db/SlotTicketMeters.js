var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';


function callback(error,results){};

function CheckTicketMeters(connection,data,callback) {
    var records;
    var sql = 'select count(*) from ticketmeters where mach_num = @mach and propid = @propid';

    var request = new Request(sql,function(err,rowCount) {
    	if (err) {
            sql = null;
            delete request;
            errMsg = 'CheckTicketMeters error: '  + err;
    		callback(errMsg,null);
    	} else {
             sql = null;
             delete request;
             console.log('ticket meter count = ' + records); 
    		    callback(null,records);
    	}

    });          


        request.addParameter('mach', TYPES.Int,data.mach);
        request.addParameter('propid', TYPES.Int,data.propid);

       request.on('row', function(columns) {
          columns.forEach(function(column) {
            if (column.value === null) {
             console.log('NULL');
          } else {
            console.log(column.value);
            records = column.value;

           }
      });
  });


        
        connection.execSql(request);

};


function UpdateTicketMeters(data,callback){

    var sql = '';
    var connection;
    var insert;
    var updated = new Date();

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
    	if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);

    	} else {
    		connection = results;
    		CheckTicketMeters(connection,data,function(err,rowCount) {
    			if (err) {
            connection.close();
    				callback(err,null);
    			} else {

    				if (rowCount > 0) {
    					sql = 'update ticketmeters set redeemcashable_ct = @rcashct,redeemcashable_amt = @rcashamt,redeempromo_ct = ' +
    					      '@rpromoct,redeempromo_amt = @rpromoamt,printedcashable_ct = @pcashct,printedcashable_amt = @pcashamt,' +
    					      'printedpromo_ct = @ppromoct,printedpromo_amt = @ppromoamt,updated = @date,machpaidexternbonus = ' +
    					      '@machextbonus,attpaidexternbonus = @attpaidextbonus,machpaidprogbonus = @machprogbonus,slot_id = @slotid ' +
    					      'where mach_num = @mach and propid = @propid';
    				} else {
    					insert = true;
    					sql = 'insert into ticketmeters(operatorId,slot_id,mach_num,redeemcashable_ct,redeemcashable_amt,redeempromo_ct,' +
    						  'redeempromo_amt,printedcashable_ct,printedcashable_amt,printedpromo_ct,printedpromo_amt,updated,machpaidexternbonus,' +
    						  'attpaidexternbonus,machpaidprogbonus,propid,ticket_id)values(@oper,@slotid,@mach,@rcashct,@rcashamt,' +
    						  '@rpromoct,@rpromoamt,@pcashct,@pcashamt,@ppromoct,@ppromoamt,@date,@machextbonus,@attpaidextbonus,@machprogbonus,' +
    						  '@propid,@ticketid)';
    				}

                   var request = new Request(sql,function(err,rowCount) {
                      if (err) {
                        errMsg = 'UpdateTicketMeters error: '  + err;
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
                         callback(null,rowCount);

                      }

                   });

                     if (insert) {
                       request.addParameter('oper', TYPES.Int,data.operatorid);
                       request.addParameter('ticketid', TYPES.Int,data.ticketid);                     
                     }


                  request.addParameter('slotid', TYPES.Int,data.id);                     
                  request.addParameter('mach', TYPES.Int,data.mach);
                  request.addParameter('rcashct', TYPES.Int,data.redcashct);
                  request.addParameter('rcashamt', TYPES.Float,data.redcashamt);
                  request.addParameter('rpromoct', TYPES.Int,data.redpromoct);
                  request.addParameter('rpromoamt', TYPES.Float,data.redpromoamt);
                  request.addParameter('pcashct', TYPES.Int,data.printedcashct);
                  request.addParameter('pcashamt', TYPES.Float,data.printedcashamt);
                  request.addParameter('ppromoct', TYPES.Int,data.printedpromoct);
                  request.addParameter('ppromoamt', TYPES.Float,data.printedpromoamt);
                  request.addParameter('date', TYPES.DateTime,updated);
                  request.addParameter('machextbonus', TYPES.Int,data.machextbonus); 
                  request.addParameter('attpaidextbonus', TYPES.Int,data.attextbonus);
                  request.addParameter('machprogbonus', TYPES.Int,data.machprogbonus);
                  request.addParameter('attprogbonus', TYPES.Int,data.attprogbonus);
                  request.addParameter('propid', TYPES.Int,data.propid);                     
                  
                   
                  connection.execSql(request);

    			}
    		});

    	}
    });

} exports.UpdateTicketMeters = UpdateTicketMeters;