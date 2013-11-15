

var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;

function DbConnectCallback(error, results) {}

//   var config = {
//         userName: 'M3tech!@ncn55muurk',
//         password: 'r@fdM3Al!',
//         server: 'ncn55muurk.database.windows.net',
//          tdsVersion: '7_2',
//             options: {
//                 encrypt: true,
//                 database: 'm3_Fed_Root',
//         //     debug: {
//         //        packet:  true,
//         //        data:    true,
//         //        payload: true,
//         //        log:     true 
//         // }
//     }
// };



var config = {
  userName: 'M3tech!@sifne67iyi',
  password: 'r@fdM3Al!',
  server: 'sifne67iyi.database.windows.net',
  tdsVersion: '7_2',
  options: {
    encrypt: true,
    database: 'm3_Fed_Root',
        //     debug: {
        //        packet:  true,
        //        data:    true,
        //        payload: true,
        //        log:     true 
        // }
    }
 
};



var poolConfig = {
   min: 0,
   max: 50,
   idleTimeoutMillis: 10000
};


 pool = new ConnectionPool(poolConfig, config);



 function GetDbConnection(operatorid,DbConnectCallback) {
 


     pool.requestConnection(function (err, connection) {
         
         if(err) {
         	DbConnectCallback(err,null);
         } else {
         	//console.log('connected from pool');
          

             var request = new Request('use federation [OperatorFederation] ([OperatorID]=' + operatorid + ') with reset,filtering=on', function(err, rowCount) {
             if(err) {
                console.log('Federation error: ' + err);
                DbConnectCallback(err,null);
             } else {
            //      console.log('changed fed');
                  delete request;
                  DbConnectCallback(null,connection);


             }
      });

              connection.on('connect', function(err) {
              connection.execSqlBatch(request);
          });

          connection.on('end', function(err){
             // console.log('Connection closed') ;
          });

              

         }





     });



 } exports.GetDbConnection = GetDbConnection;
 ;