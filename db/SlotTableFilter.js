


var slotAlarms = require('./SlotAlarms');
var slotTicketMeters = require('./SlotTicketMeters');
var Utils = require('./Utils');
var multiGame = require('./SlotMultiGameMeters');
var multiDenom = require('./SlotMultiDenomMeters');
var aft = require('./SlotAftMeters');
var slots = require('./SlotsTable');
var netSock = require('./NetSock');



function callback(error,results){};

function ProcessTrans(data,callback){
  if(data.table === 'sl_alarms') {
      if(data.operation === 'slotalarm') {
    	slotAlarms.WriteSlotAlarm(data,function(err,results) {
  	    if (err) {
  		    console.log('WriteSlotAlarm error: ' + err);
          Utils.LogError(data,err,function(err,results) {

          });

          data = null;
  		    callback(err,null);
  	    } else {
  		    //console.log('Event written');
          data = null;
  		    callback(null,results);
  	    }

      });
    }
    // } else if( data.operation === 'routedrop') {
    //   console.log('******* route drop received************');
    //   slotAlarms.WriteRouteDropAlarm(data,function(err,results) {
    //     if (err) {
    //       console.log('WriteRouteDropAlarm error: ' + err);
    //       Utils.LogError(data,err,function(err,results) {

    //       });

    //       data = null;
    //       callback(err,null);
    //     } else {
    //       //console.log('Event written');
    //       data = null;
    //       callback(null,results);
    //     }

    //   });



    // }
  
  } else if (data.table === 'ticketmeters') {
      console.log('ticketmeters received');
     slotTicketMeters.UpdateTicketMeters(data,function(err,results) {
	    if (err) {
		    console.log('UpdateTicketMeters error: ' + err);
        Utils.LogError(data,err,function(err,results) {

        });

        data = null;
		    callback(err,null);
	    } else {
		    //console.log('Event written');
        data = null;
		    callback(null,results);
	    }



     });
  } else if (data.table === 'sc_multigameconfig') {

    multiGame.WriteMultiGameConfig(data,function(err,results) {
      if (err) {
        console.log('WriteMultiGameConfig error: ' + err);
        Utils.LogError(data,err,function(err,results) {

        });

        data = null;
        callback(err,null);
      } else {
        //console.log('Event written');
        data = null;
        callback(null,results);
      }


    });

  } else if (data.table ==='db_multigamemeters') {

    multiGame.WriteMultiGameRecord(data,function(err,results) {
      if (err) {
        console.log('WriteMultiGameRecord error: ' + err);
        Utils.LogError(data,err,function(err,results) {

        });

        data = null;
        callback(err,null);
      } else {
        //console.log('Event written');
        data = null;
        callback(null,results);
      }


    });

  } else if (data.table === 'db_denommeters') {

    multiDenom.WriteDenomRecord(data,function(err,results) {
      if (err) {
        console.log('WriteDenomRecord error: ' + err);
        Utils.LogError(data,err,function(err,results) {

        });

        data = null;
        callback(err,null);
      } else {
        //console.log('Event written');
        data = null;
        callback(null,results);
      }


    });



  } else if (data.table === 'eftmeters') {

    aft.WriteAftMeters(data,function(err,results) {
      if (err) {
        console.log('WriteAftMeters error: ' + err);
        Utils.LogError(data,err,function(err,results) {

        });

        data = null;
        callback(err,null);
      } else {
        //console.log('Event written');
        data = null;
        callback(null,results);
      }


    });

  } else if (data.table === 'slots') {
    if (data.operation === 'meterupdate') {
      slots.UpdateSlotsMeters(data,function(err,results) {
        if (err) {
          console.log('UpdateSlotsMeters error: ' + err);
          Utils.LogError(data,err,function(err,results) {

          });

          data = null;
          callback(err,null);
        } else {
          //console.log('Event written');
          data = null;
          callback(null,results);
        }

      });

    } else if (data.operation === 'lastcom') {
      slots.UpdateLastCom(data,function(err,results) {
        if (err) {
          console.log('UpdateLastCom error: ' + err);
          Utils.LogError(data,err,function(err,results) {

          });

          data = null;
          callback(err,null);
        } else {
          //console.log('Event written');
          data = null;
          callback(null,results);
        }


      });

    } else if( data.operation === 'addmachine') {
      netSock.AddMachine(data,function(err,results) {

        if (err) {
          console.log('AddMachine error: ' + err);
          Utils.LogError(data,err,function(err,results) {

          });

          data = null;
          callback(err,null);
        } else {
          //console.log('Event written');
          data = null;
          callback(null,results);
        }


      });

    } else if(data.operation === 'removemachine') {
        netSock.RemoveMachine(data,function(err,results) {
         if (err) {
          console.log('RemoveMachine error: ' + err);
          Utils.LogError(data,err,function(err,results) {

          });

          data = null;
          callback(err,null);
        } else {
          //console.log('Event written');
          data = null;
          callback(null,results);
        }
         
        });
    // } else if( data.operation === 'editmachine') {

    //     netSock.EditMachine(data,function(err,results) {
    //      if (err) {
    //       console.log('EditMachine error: ' + err);
    //       Utils.LogError(data,err,function(err,results) {

    //       });

    //       data = null;
    //       callback(err,null);
    //     } else {
    //       //console.log('Event written');
    //       data = null;
    //       callback(null,results);
    //     }
         
    //     });

    // }


    } else if (data.operation === 'add_update_machine') {
       netSock.AddUpdateMachine(data,function(err,results) {
         if (err) {
          console.log('AddUpdateMachine error: ' + err);
          Utils.LogError(data,err,function(err,results) {

          });

          data = null;
          callback(err,null);
        } else {
          //console.log('Event written');
          data = null;
          callback(null,results);
        }
        
       });

    }
 }
}exports.ProcessTrans = ProcessTrans;