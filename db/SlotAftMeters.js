var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';


function callback(error,results){};

function CheckAftRecord(connection,data,callback) {

    var records;
    var sql = 'select count(*) from eftmeters where mach_num = @mach and propid = @propid';


    var request = new Request(sql,function(err,rowCount) {
        if (err) {
            sql = null;
            request = null;
            errMsg = 'CheckAftRecord error: '  + err;
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
              console.log(column.value);
              records = column.value;

           }
      });
  });

        
        connection.execSql(request);

};


function WriteAftMeters(data,callback){
    var insert = false;
    var sql = '';
    var connection;
    var updated = new Date();

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            return callback(errMsg,null);

        } else {
            connection = results;
            CheckAftRecord(connection,data,function(err,rowCount) {
                if (err) {
                    connection.close();
                    connection = null;
                    return callback(err,null);
                } else {
                    if (rowCount > 0 ) {
                        sql = 'update eftmeters set promocredits = @promoin,cashablecredits = @cashin,updated = @date,promocreditscnt = @promoincnt,' +
                              'cashablecreditscnt = @cashincnt,promocreditsout = @promoout,cashablecreditsout = @cashout, ' +
                              'promocreditsoutcnt = @promooutcnt,cashablecreditsoutcnt = @cashoutcnt,slot_id = @id where mach_num = @mach and ' +
                              'propid = @propid'
                    } else {
                        insert = true;
                        sql = 'insert into eftmeters(operatorid,slot_id,mach_num,promocredits,cashablecredits,noncashablecredits,transcredits, ' +
                              'updated,promocreditscnt,cashablecreditscnt,promocreditsout,cashablecreditsout,promocreditsoutcnt,' +
                              'cashablecreditsoutcnt,propid,eft_id)values(@oper,@id,@mach,@promoin,@cashin,0,0,@date,@promoincnt,@cashincnt,@promoout, ' +
                              '@cashout,@promooutcnt,@cashoutcnt,@propid,@eftid)';
                    }

                    var request = new Request(sql,function(err,results) {
                        if (err) {
                            errMsg = 'WriteAftMeters error: '  + err;
                            connection.close();
                            connection = null;
                            sql = null;
                            request = null;
                            delete updated;
                            return callback(errMsg,null);

                        } else {
                           connection.close();
                           connection = null;
                           sql = null;
                           request = null;
                           delete updated;
                           results = null;
                           return callback(null,'ok');

                        }
                    });                    

                    if (insert) {
                       request.addParameter('oper', TYPES.Int,data.operatorid);
                       request.addParameter('eftid', TYPES.Int,data.eftid);

                    }
                    request.addParameter('id', TYPES.Int,data.onlineid);                    
                    request.addParameter('mach', TYPES.Int,data.mach);
                    request.addParameter('promoin', TYPES.Int,data.promoin);
                    request.addParameter('cashin', TYPES.Int,data.cashin);
                    request.addParameter('date', TYPES.DateTime, updated);
                    request.addParameter('promoincnt', TYPES.Int,data.promoincnt);
                    request.addParameter('cashincnt', TYPES.Int,data.cashincnt);
                    request.addParameter('promoout', TYPES.Int, data.promoout);
                    request.addParameter('cashout', TYPES.Int,data.cashout);
                    request.addParameter('promooutcnt', TYPES.Int,data.promooutcnt);                    
                    request.addParameter('cashoutcnt', TYPES.Int,data.cashoutcnt);
                    request.addParameter('propid', TYPES.Int,data.propid);

                    connection.execSql(request);



                }
            });
        }
    });


} exports.WriteAftMeters = WriteAftMeters;
