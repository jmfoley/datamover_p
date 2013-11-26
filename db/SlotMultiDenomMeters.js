var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';


function callback(error,results){};

function CheckDenomRecord(connection,data,callback) {
    var records;
    var sql = 'select count(*) from db_denommeters where machineNumber = @mach and denomid = @denom and propid = @propid';


    var request = new Request(sql,function(err,rowCount) {
        if (err) {
            sql = null;
            request = null;
            errMsg = 'CheckMultiDenomRecord error: '  + err;
            return callback(errMsg,null);
        } else {
             sql = null;
             request = null;
            return callback(null,records);
        }

    });          


        request.addParameter('mach', TYPES.Int,data.mach);
        request.addParameter('denom', TYPES.Int,data.denomid);
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

function WriteDenomRecord(data,callback){
    var insert = false;
    var sql = '';
    var connection;
    var updated = new Date();
    console.log('In Denom Meters');
    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            return callback(errMsg,null);

        } else {
            connection = results;
            CheckDenomRecord(connection,data,function(err,rowCount) {
                if (err) {
                    connection.close();
                    connection = null;
                    return callback(err,null);
                } else {
                    if (rowCount > 0 ) {
                        sql = 'update db_denomMeters set coinin = @cin,coinout = @cout,jackpot = @jpot,gamesplayed = @games,' +
                              'updated = @date where machinenumber = @mach and denomid = @denom and ' +
                              'propid = @propid'
                    } else {
                        insert = true;
                        sql = 'insert into db_denomMeters(operatorid,machinenumber,onlineid,denomid,coinin,coinout,' +
                              'jackpot,gamesplayed,updated,propid) ' +
                              'values(@oper,@mach,@id,@denom,@cin,@cout,@jpot,@games,@date,@propid)';  
                    }

                    var request = new Request(sql,function(err,results) {
                        if (err) {
                            errMsg = 'WriteMultiGameRecord error: '  + err;
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
                           callback(null,'ok');

                        }
                    });                    

                    if (insert) {
                       request.addParameter('oper', TYPES.Int,data.operatorid);
                       request.addParameter('id', TYPES.Int,data.onlineid);

                    }
                    request.addParameter('mach', TYPES.Int,data.mach);
                    request.addParameter('cin', TYPES.Int,data.coinin);
                    request.addParameter('cout', TYPES.Int,data.coinout);
                    request.addParameter('games', TYPES.Int,data.gamesplayed);
                    request.addParameter('jpot', TYPES.Int,data.jackpot);
                    request.addParameter('date', TYPES.DateTime, updated);
                    request.addParameter('denom', TYPES.Float,data.denomid);
                    request.addParameter('propid', TYPES.Int,data.propid);

                    connection.execSql(request);



                }
            });
        }
    });


} exports.WriteDenomRecord = WriteDenomRecord;
