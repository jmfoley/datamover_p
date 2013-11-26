var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';

function callback(error,results){};



//Begin unit trans detail

function CheckUnitTransDetail(connection,data,callback) {

    var records;
    var sql = 'select count(*) from db_unitTransDetail where transNumber = @transnumber and unitId = @unitid and itemId = @itemid and itemDenom = @denom ' +
              'and propid = @propid';

    var request = new Request(sql,function(err,rowCount) {
        if(err) {
            errMsg = 'CheckUnitTransDetail error: ' + err;
            sql = null;
            request = null;
            return callback(errMsg,null);

        } else {
             sql = null;
             request = null;
             return callback(null,records);
        }

    });          

        request.addParameter('transnumber', TYPES.Int,data.transnumber);
        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('itemid', TYPES.NVarChar,data.item);
        request.addParameter('denom', TYPES.Int,data.denom);
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


function WriteUnitTransDetail( data,callback) {

    var connection;
    var insert;
    var sql = '';
    var updated = new Date();

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
             errMsg = 'GetDbConnection error: ' + err;
             return callback(errMsg,null);
 
        } else {
            
            connection = results;
            CheckUnitTransDetail(connection,data,function(err,results) {

                    if (err) {

                        connection.close();
                        connection = null;
                        return callback(err,null);

                    } else {

                        if (results > 0 ) {

                            insert = false;
                            sql = 'update db_unitTransDetail set itemAmount = itemAmount + @amount,updated = @date where transNumber = @transnumber and itemId = @itemid and ' +
                                  'itemDenom = @denom and unitId = @unitid and propId = @propid'; 

                        } else {

                            insert = true;
                            sql = 'insert into db_unitTransDetail(transNumber,propId,unitId,itemId,itemAmount,itemDenom,updated,operatorId) values(@transnumber,' +
                                  '@propid,@unitid,@itemid,@amount,@denom,@date,@oper)';

                        }

                              var request = new Request(sql,function(err,rowCount) {
                                  if(err) {
                                    errMsg = 'WriteUnitTransDetail error: ' + err;
                                      connection.close();
                                      connection = null;
                                      sql = null;
                                      request = null;
                                      delete updated;
                                      return callback(errMsg,null) ;
                                  } else {
                                       connection.close();
                                       connection = null;
                                       sql = null;
                                       request = null;
                                       delete updated;
                                       rowCount = null;
                                       return callback(null,'ok');
                                  }
                              }); 


                        
                            request.addParameter('amount', TYPES.Int,data.transamount);
                            request.addParameter('unitid', TYPES.Int,data.unit);
                            request.addParameter('itemid', TYPES.NVarChar,data.item);
                            request.addParameter('denom', TYPES.Int,data.denom);
                            request.addParameter('propid', TYPES.Int,data.propid);
                            request.addParameter('transnumber', TYPES.Int,data.transnumber);
                            request.addParameter('date', TYPES.DateTime,updated);

                            if (insert) {
                                request.addParameter('oper', TYPES.Int,data.operatorid);                                
                            }

                            connection.execSql(request);
                    }
            });
        }


    });


} exports.WriteUnitTransDetail = WriteUnitTransDetail
;



//End unit trans detail



//Begin unit transactions

function SetPendingTransToComplete( data, callback) {

    var conenction;
    var sql = '';
    var updated = new Date();

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            return callback(err,null);
        } else {
            
            connection = results;
            sql = 'update db_unitTrans set transStatus = @transstatus, updated = @date where unitId = @unitid and ' +
                  'unitPropId = @propid and transNumber = @transnumber';


            var request = new Request(sql,function(err,rowCount) {
        
        
            if (err) {
                errMsg = 'SetPendingTransToComplete error: '  + err;
                connection.close();
                connection = null;
                sql = null;
                request = null;
                delete updated;
                return callback(errMsg,null);
            
            } else{
                connection.close();
                connection = null;
                sql = null;
                request = null;
                delete updated;
                rowCount = null;
                return callback(null,'ok');
            
            }


          });


           request.addParameter('transstatus', TYPES.Int,data.transstatus);
           request.addParameter('date', TYPES.DateTime,updated);
           request.addParameter('unitid', TYPES.Int,data.unit);
           request.addParameter('propid', TYPES.Int,data.propid);
           request.addParameter('transnumber', TYPES.Int,data.transnumber);
             
           connection.execSql(request);

        }
    });    


} exports.SetPendingTransToComplete = SetPendingTransToComplete
;

function CompleteCurrentTrans( data,callback) {

    var sql = '';
    var connection;
    var updated = new Date();

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
    
        if (err) {
          errMsg = 'GetDbConnection error: ' + err;
          return callback(errMsg,null);
        } else {
            connection = results;

            if (data.transamount === '0') {

                sql = 'update db_unitTrans set transStatus = @transstatus, updated = @date where unitId = @unitid and ' +
                      'unitPropid = @unitpropid and transNumber = @transnumber';

            } else {

                sql = 'update db_unitTrans set transStatus = @transstatus,updated = @date, transAmount = @amount where ' +
                      'unitId = @unitid and unitPropId = @unitpropid and transNumber = @transnumber';
 
            }

            var request = new Request(sql,function(err,rowCount) {
        
        
            if(err){
                errMsg = 'CompleteCurrentTrans error: '  + err;
                connection.close();
                connection = null;
                sql = null;
                request = null;
                delete updated;
                return callback(errMsg,null);
            
            } else{
                connection.close();
                conenction = null;
                sql = null;
                request = null;
                delete updated;
                rowCount = null;
                return callback(null,'ok');
            
            }


          });
  
           request.addParameter('transstatus', TYPES.Int,data.transstatus);
           request.addParameter('date', TYPES.DateTime,updated);
           request.addParameter('unitid', TYPES.Int,data.unit);
           request.addParameter('unitpropid', TYPES.Int,data.propid);
           request.addParameter('transnumber', TYPES.Int,data.transnumber);

           if (data.transamount != '0') {

               request.addParameter('amount', TYPES.Int,data.transamount);               
           }

           connection.execSql(request);

        }

    });


} exports.CompleteCurrentTrans = CompleteCurrentTrans
;


function WriteKioskTrans(data,callback) {

    var transTime = new Date(data.transtarttime);
    var updated = new Date();


    dbConnect.GetDbConnection(data.operatorid,function(err,results) {

         if (err) {
          errMsg = 'GetDbConnection error: ' + err;          
         	return callback(errMsg,null);
         } else {
            console.log("data = : " + data.transtarttime);
            var connection = results;
            var sql = 'insert into db_unitTrans(operatorid, unitId,unitPropId,transType,transNumber,transAmount,transStatus,transStartTime,' +
    	              'gameday,validationNum,sessionId,cardId,cardCasinoId,bvNum,updated)values(@oper,@unitid,@unitpropid,@transtype,' +
    	              '@transnumber,@transamount,@transstatus,@transstarttime,@gameday,@valnum,@sessionid,@cardid,@cardcasinoid,' +
    	              '@bv,@date)'

	        var request = new Request(sql,function(err,rowCount) {
        
        
            if (err) {
              errMsg = 'WriteKioskTrans error: ' + err;
        	    connection.close();
              connection = null;
              sql = null;
              request = null;
              delete transTime;
              delete updated;
        	    return callback(errMsg,null);
        	
            } else{
        	    connection.close();
              connection = null;
              sql = null;
              request = null;
              delete transTime;
              delete updated;
              rowCount = null;
        	    return callback(null,'ok');
        	
            }


	});
        request.addParameter('oper', TYPES.Int,data.operatorid);
        request.addParameter('unitid', TYPES.Int,data.unit);
        request.addParameter('unitpropid', TYPES.Int,data.propid);
        request.addParameter('transtype', TYPES.Int,data.transtype);
        request.addParameter('transnumber', TYPES.Int,data.transnumber);
        request.addParameter('transamount', TYPES.Int,data.transamount);
        request.addParameter('transstatus', TYPES.Int,data.transstatus);
        request.addParameter('transstarttime', TYPES.DateTime,transTime);
        request.addParameter('gameday', TYPES.VarChar,data.gameday);
        request.addParameter('valnum', TYPES.NVarChar,data.valnum);
        request.addParameter('sessionid', TYPES.Int,data.sessionid);
        request.addParameter('cardid', TYPES.Int,data.cardid);
        request.addParameter('cardcasinoid', TYPES.Int,data.cardcasinoid);
        request.addParameter('amount', TYPES.Int,data.amount);
        request.addParameter('bv', TYPES.Int,data.bv);
        request.addParameter('date', TYPES.DateTime, updated);

        connection.execSql(request);
          




         }


    });


} exports.WriteKioskTrans = WriteKioskTrans
;

//End unit transactions

