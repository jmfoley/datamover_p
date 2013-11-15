var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool')



function callback(error,results){};



function LogUnEx(clientData,errorText,callback) {
    
    var sql = '';
    var connection;

    dbConnect.GetDbConnection(10,function(err,results) {

        if ( err ) {

            callback(err,null);

        } else {

           connection =  results;
           sql = 'insert into db_route_errorlog (operatorID,location,data,updated)values(@oper,@loc,@errText,@date)';
            var request = new Request(sql,function(err,rowCount) {
        
        
            if (err) {
                connection.close();
                sql = null;
                console.log(errMsg);
                callback(errMsg,null);
        
            } else {
                connection.close();
                sql = null;
                callback(null,connection);
            
            }


        });

        request.addParameter('oper', TYPES.Int,10);
        request.addParameter('loc', TYPES.VarChar,'DataSync');
        request.addParameter('errText', TYPES.VarChar,errorText);
        request.addParameter('date', TYPES.DateTime,new Date());

        connection.execSql(request);

        }

    });

}exports.LogUnEx = LogUnEx;



function LogError(clientData,errorText,callback) {
    
    var sql = '';
    var connection;

    dbConnect.GetDbConnection(clientData.operatorid,function(err,results) {

		if ( err ) {

			callback(err,null);

		} else {

           connection =  results;
           sql = 'insert into db_route_errorlog (operatorID,location,data,updated)values(@oper,@loc,@errText,@date)';
	        var request = new Request(sql,function(err,rowCount) {
        
        
            if (err) {
        	    connection.close();
                sql = null;
                console.log(errMsg);
        	    callback(errMsg,null);
       	
            } else {
        	    connection.close();
                sql = null;
        	    callback(null,connection);
        	
            }


    	});

        request.addParameter('oper', TYPES.Int,clientData.operatorid);
        request.addParameter('loc', TYPES.VarChar,'DataSync');
        request.addParameter('errText', TYPES.VarChar,errorText);
        request.addParameter('date', TYPES.DateTime,new Date());

        connection.execSql(request);

		}

    });

}exports.LogError = LogError;