var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')
var errMsg = '';


function callback(error,results){};




function CheckMultiGameConfig(connection,data,callback) {
    var records;
    var sql = 'select count(*) from sc_multigameconfig where machineNumber = @mach and propid = @propid and multiTypeId = @game';

    console.log('in check multigame config');
    var request = new Request(sql,function(err,rowCount) {
    	if (err) {
            sql = null;
            delete request;
            errMsg = 'CheckMultiGameConfig error: '  + err;
    		callback(errMsg,null);
    	} else {
             sql = null;
             delete request;
    		callback(null,records);
    	}

    });          


        request.addParameter('mach', TYPES.Int,data.mach);
        request.addParameter('propid', TYPES.Int,data.propid);
        request.addParameter('game', TYPES.Int,data.game);

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



function WriteMultiGameConfig(data,callback){
    
    var sql = '';
    var connection;
    var insert;
    var updated = new Date();
    var desc = '';

    console.log('In WriteMultiGameConfig');

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
    	if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);

    	} else {
            connection = results;
            CheckMultiGameConfig(connection,data,function(err,rowCount) {
                if( err ) {
                   callback(err,null) ;
                } else {
                  console.log('***rowcount = : ' + rowCount);
                   if (rowCount < 1) {
                       sql = 'insert into sc_multigameconfig (operatorId,machineNumber,multiTypeId,multiTypeDesc,payTableId,' +
                             'parPct,maxBet,denom,gameEnabled,status,updatedBy,updatedFrom,updated,multiTypeRecId,propid)values(@oper,@mach,@type,' +
                             '@desc,@pay,@par,@max,@denom,@enabled,@status,@updatedBy,@updatedFrom,@date,@recid,@prop)';

                        var request = new Request(sql,function(err,results) {
                            if (err) {
                                errMsg = 'WriteMultiGameConfig error: '  + err;
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

                        try {
                          if(data.desc == null) {
                            desc = ' ';
                          } else {
                            desc = data.desc;
                          }

                        } catch(exception) {
                          desc = ' ';

                        }

                        request.addParameter('oper', TYPES.Int,data.operatorid);
                        request.addParameter('prop', TYPES.Int,data.propid);
                        request.addParameter('mach', TYPES.Int,data.mach);
                        request.addParameter('type', TYPES.Int,data.game);
                        request.addParameter('desc', TYPES.VarChar,desc);
                        request.addParameter('pay',  TYPES.VarChar,data.paytable);
                        request.addParameter('par',  TYPES.Float,data.par);
                        request.addParameter('max',  TYPES.Int,data.max);
                        request.addParameter('denom',TYPES.Int,data.denom);
                        request.addParameter('enabled', TYPES.Bit,data.enabled);
                        request.addParameter('status', TYPES.Int,data.status);
                        request.addParameter('updatedby', TYPES.VarChar,data.updatedby);
                        request.addParameter('updatedfrom', TYPES.VarChar,data.updatedfrom);
                        request.addParameter('date', TYPES.DateTime,updated);
                        request.addParameter('recid', TYPES.UniqueIdentifierN,data.recid);

                        connection.execSql(request);

                   } 
                }

            });
    	}

    });


} exports.WriteMultiGameConfig = WriteMultiGameConfig;





function CheckMultiGameRecord(connection,data,callback) {

    var sql = 'select count(*) from db_multigamemeters where machineNumber = @mach and gamenumber = @game and propid = @propid';
    var records;

    var request = new Request(sql,function(err,rowCount) {
        if (err) {
            sql = null;
            delete request;
            errMsg = 'CheckMultiGameRecord error: '  + err;
            callback(errMsg,null);
        } else {
             sql = null;
             delete request;
             console.log('CheckMultigameRecord rowcount = ' + rowCount + ' mach = ' + data.mach + ' gamenumber = ' + data.gamenumber + ' propid = ' + data.propid);
            callback(null,records);
        }

    });          


        request.addParameter('mach', TYPES.Int,data.mach);
        request.addParameter('game', TYPES.Int,data.gamenumber);
        request.addParameter('propid', TYPES.Int,data.propid);
        request.addParameter('rec', TYPES.Int,data.recid);
        


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



function WriteMultiGameRecord(data,callback){
    var insert = false;
    var sql = '';
    var connection;
    var updated = new Date(data.updated);
    
    console.log('In multigame meters');

    dbConnect.GetDbConnection(data.operatorid,function(err,results) {
        if (err) {
            errMsg = 'GetDbConnection error: ' + err;
            callback(errMsg,null);

        } else {
            connection = results;
            CheckMultiGameRecord(connection,data,function(err,rowCount) {
                if (err) {
                    connection.close();
                    callback(err,null);
                } else {
                    console.log('rowcount = ' + rowCount + ' mach = ' + data.mach + ' gamenumber = ' + data.gamenumber + ' recid = ' + data.recid);
                    if (rowCount > 0 ) {
                        sql = 'update db_multigamemeters set coinin = @cin,coinout = @cout,gamesplayed = @games,jackpot = @jpot,' +
                              'updated = @date,sasversion = @sas,denom = @denom,maxbet = @max,paytableid = @pay,gamepar = @par,' +
                              'gameenabled = @enabled,onlineid = @id where machinenumber = @mach and gamenumber = ' +
                              '@gamenumber and propid = @propid'
                    } else {
                        insert = true;
                        sql = 'insert into db_multigamemeters(operatorid,onlineid,gamenumber,machinenumber,coinin,coinout,' +
                              'gamesplayed,jackpot,updated,sasversion,denom,maxbet,paytableid,gamepar,gameenabled,propid,recid) ' +
                              'values(@oper,@id,@gamenumber,@mach,@cin,@cout,@games,@jpot,@date,@sas,@denom,@max,@pay,' +
                              '@par,@enabled,@propid,@recid)';  
                    }

                    var request = new Request(sql,function(err,results) {
                        if (err) {
                            errMsg = 'WriteMultiGameRecord error: '  + err;
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
                           callback(null,results);

                        }
                    });                    

                    if (insert) {
                       request.addParameter('oper', TYPES.Int,data.operatorid);
                       request.addParameter('recid', TYPES.Int,data.recid);
                    }
                    request.addParameter('id', TYPES.Int,data.onlineid);
                    request.addParameter('cin', TYPES.Int,data.coinin);
                    request.addParameter('cout', TYPES.Int,data.coinout);
                    request.addParameter('games', TYPES.Int,data.gamesplayed);
                    request.addParameter('jpot', TYPES.Int,data.jackpot);
                    request.addParameter('date', TYPES.DateTime, updated);
                    request.addParameter('sas', TYPES.VarChar,data.sasver);
                    request.addParameter('denom', TYPES.Float,data.denom);
                    request.addParameter('max', TYPES.Int,data.maxbet);
                    request.addParameter('pay', TYPES.VarChar,data.paytable);
                    request.addParameter('par', TYPES.Float,data.par);
                    request.addParameter('enabled', TYPES.Bit,data.enabled);
                    request.addParameter('propid', TYPES.Int,data.propid);
                    request.addParameter('gamenumber', TYPES.Int,data.gamenumber);
                    request.addParameter('mach', TYPES.Int,data.mach);

                    connection.execSql(request);



                }
            });
        }

    });

} exports.WriteMultiGameRecord = WriteMultiGameRecord;


