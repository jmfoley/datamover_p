var KioskEvents = require('./Events');
var KioskMeters = require('./Meters');
var atm = require('./atm');
var KioskTrans = require('./Transactions');
var KioskUnit = require('./Config');
var Utils  = require('./Utils');
var DropMeters = require('./DropMeters');
var Tickets = require('./Tickets');
var tenCoin = require('./TenCoin');
var slotAlarms = require('./SlotAlarms');
var netSock = require('./NetSock');
var profile = require('./MultiGameProfiles');
var util = require('util');



function callback(error,results){};


function ProcessTrans(data,callback){
    


    //console.log(util.inspect(data)); 

    if(data.table === 'sl_alarms') {
      if( data.operation === 'routedrop') {
        console.log('******* route drop received************');
        slotAlarms.WriteRouteDropAlarm(data,function(err,results) {
          if (err) {
            console.log('WriteRouteDropAlarm error: ' + err);
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

    } else if (data.table === 'slots') {
    
      if( data.operation === 'editmachine') {

            netSock.EditMachine(data,function(err,results) {
             if (err) {
              console.log('EditMachine error: ' + err);
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

        } else if (data.operation === 'activate_pending_machine') {

            netSock.ActivatePendingMachine(data,function(err,results) {
             if (err) {
              console.log('EditMachine error: ' + err);
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


        } else if (data.operation === 'addmachine' ){
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

        }


    } else if(data.table === 'db_unitevents') {
 	    KioskEvents.WriteKioskEvent(data,function(err,results){
 		    if (err) {
 			    console.log('WriteEvents error: ' + err);
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
     } else if ( data.table === 'db_onlinemeters') {

         if(data.operation === 'update') {
        console.log('***** Online meter update********');
 	    KioskMeters.UpdateOnlineMeters(data,function(err,results){
 		    if (err) {
 			    console.log('Update Online Meters error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
 			    callback(err,null);
 		    } else {
 			    //console.log('Online meters written');
                data = null;
 			    callback(null,results);
 		    }

 	     });
      } else if (data.operation === 'purge') {

          KioskMeters.ZeroCoinHopper(data,function(err,results) {
            if (err) {
                console.log('ZeroCoinHopper error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);
            } else {
                //console.log('ZeroCoinHopper written');
                data = null;
                callback(null,results);
            }


          });
         } else if (data.operation === 'drop') {
            console.log('***** Online meter drop update********');
              DropMeters.UpdateOnlineDropMeters(data,function(err,results) {
                if (err) {
                    console.log(err);
                    callback(err,null);
                } else {
                    //console.log('donline drop meters updated');
                    callback(null,results);
                }

              });
         }

    
     } else if (data.table === 'db_atmTrans') {

 
         if(data.operation ==='insert'){


                 atm.WriteAtmTrans(data,function(err,results) {
                 
                 if (err) {
                 	console.log('WriteAtmTrans error: ' + err);
                    Utils.LogError(data,err,function(err,results) {

                    });

                    data = null;
                 	callback(err,null);
                 } else {
                 	 //console.log('atm trans written');
                     data = null;
                 	 callback(null,results);
                 }
             });
             
             
         } else if (data.operation === 'update') {

                 atm.UpdateAtmTrans(data,function(err,results) {
                 
                 if (err) {
                    console.log('UpdateAtmTrans error: ' + err);
                    Utils.LogError(data,err,function(err,results) {

                    });

                    data = null;
                    callback(err,null);
                 } else {
                     //console.log('UpdateAtmTrans written');
                     data = null;
                     callback(null,results);
                 }
             });


         }

     } else if (data.table === 'db_unitTransMeters') {
     	KioskMeters.WriteOnlineMeterSnapshot(data,function(err,results) {

             if (err) {
             	console.log('WriteOnlineMeterSnapshot error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
             	callback(err,null);
             } else {
             	 //console.log('WriteOnlineMeterSnapshot written');
                 data = null;
             	 callback(null,results);
             }



     	});
     } else if (data.table === 'db_LtdOccurMeters') {

        KioskMeters.UpdateDoorSwitchMeters(data,function(err,results) {

             if (err) {
                console.log('UpdateDoorSwitchMeters error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);
             } else {
                 //console.log('UpdateDoorSwitchMeters written');
                 data = null;
                 callback(null,results);
             }
 

        });
     } else if (data.table === 'db_unitTrans') {
       

          if(data.operation === 'initial_write') {
             console.log('initial_write');
             KioskTrans.WriteKioskTrans(data,function(err,results) {

             if (err) {
                console.log('WriteKioskTrans error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);
             } else {
                 //console.log('WriteKioskTrans written');
                 data = null;
                 callback(null,results);
             }

         });
      } else if (data.operation === 'complete') {
  
          KioskTrans.CompleteCurrentTrans(data,function(err,results) {

             if (err) {
                console.log('CompleteCurrentTrans error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);
             } else {
                 //console.log('CompleteCurrentTrans written');
                 data = null;
                 callback(null,results);
             }

         });

      
      } else if (data.operation === 'pending_to_complete') {

          KioskTrans.SetPendingTransToComplete(data,function(err,results) {

             if (err) {
                console.log('SetPendingTransToComplete error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);
             } else {
                 //console.log('SetPendingTransToComplete written');
                 data = null;
                 callback(null,results);
             }

         });



      }
   } else if (data.table === 'db_unitTransDetail') {

        KioskTrans.WriteUnitTransDetail(data,function(err,results) {
   
            if (err) {
                console.log('WriteUnitTransDetail error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);

            } else {
                 //console.log('WriteUnitTransDetail written');
                 data = null;
                 callback(null,results);

            }

        });

   } else if (data.table === 'sc_units') {


       if(data.operation === 'update') {


           KioskUnit.UpdateKioskUnit(data,function(err,results) {

                if (err) {
                    console.log('UpdateKioskUnit error: ' + err);
                    Utils.LogError(data,err,function(err,results) {

                    });

                    data = null;
                    callback(err,null);

                } else {
                   //  console.log('UpdateKioskUnit written');
                     data = null;
                     callback(null,results);

                }

           });
       } else if(data.operation == 'update_app_version') {

           KioskUnit.UpdateAppVersion(data,function(err,results) {
  
              if (err) {
                    console.log('UpdateAppVersion error: ' + err);
                    Utils.LogError(data,err,function(err,results) {

                    });

                    data = null;
                    callback(err,null);

                } else {
                     //console.log('UpdateAppVersion written');
                     data = null;
                     callback(null,results);

                }



           });
       } else if (data.operation === 'update_creditcard') {

           KioskUnit.UpdateCreditCardOption(data,function(err,results) {
  
              if (err) {
                    console.log('UpdateCreditCardOption error: ' + err);
                    Utils.LogError(data,err,function(err,results) {

                    });

                    data = null;
                    callback(err,null);

                } else {
                     //console.log('UpdateCreditCardOption written');
                     data = null;
                     callback(null,results);

                }



           });
       } else if (data.operation === 'session') {

           KioskUnit.UpdateUnitSession(data,function(err,results) {
              if (err) {
                    console.log('UpdateSession error: ' + err);
                    Utils.LogError(data,err,function(err,results) {

                    });

                    data = null;
                    callback(err,null);

                } else {
                     //console.log('UpdateSession written');
                     data = null;
                     callback(null,results);

                }
           
           });

       }else if ( data.operation === 'update_atmid') {
          KioskUnit.UpdateAtmId(data,function(err,results) {
            if(err) {
                console.log('UpdateSession error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);

            } else {
             data = null;
             callback(null,results);

            }

          });
      } else if (data.operation === 'update_status') {
          KioskUnit.UpdateUnitStatus(data,function(err,results) {
            if(err) {
                console.log('UpdateUnitStatus error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);

            } else {
             data = null;
             callback(null,results);

            }

          });

      }

     } else if (data.table === 'sc_unitConfig') {

        if(data.operation === 'delete') {

            KioskUnit.DeleteUnitDenomConfig(data,function(err,results) {

            if (err) {
                console.log('DeleteUnitDenomConfig error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);

            } else {
                 //console.log('DeleteUnitDenomConfig written');
                 data = null;
                 callback(null,results);

            }



        });
        } else if(data.operation === 'update') {

            KioskUnit.UpdateDenomConfig(data,function(err,results) {


            if (err) {
                console.log('UpdateDenomConfig error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);

            } else {
                 //console.log('UpdateDenomConfig written');
                 data = null;
                 callback(null,results);

            }



            });
        }


   } else if( data.table ==='sc_deviceConfig') {

        if(data.operation === 'insert') {

            KioskUnit.InsertUnitDevice(data,function(err,results) {

            if (err) {
                console.log('InsertUnitDevice error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);

            } else {
                 //console.log('InsertUnitDevice written');
                 data = null;
                 callback(null,results);

            }


            });

        } else if( data.operation ==='update') {

            KioskUnit.UpdateUnitDevice(data,function(err,results) {

            if (err) {
                console.log('UpdateUnitDevice error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);

            } else {
                 //console.log('UpdateUnitDevice written');
                 data = null;
                 callback(null,results);

            }


            });


        } else if (data.operation === 'delete') {

            KioskUnit.DeleteUnitDevice(data,function(err,results) {

            if (err) {
                console.log('DeleteUnitDevice error: ' + err);
                Utils.LogError(data,err,function(err,results) {

                });

                data = null;
                callback(err,null);

            } else {
                 //console.log('DeleteUnitDevice written');
                 data = null;
                 callback(null,results);

            }


            });




        }
   } else if (data.table === 'db_LTDMeters') {

        KioskMeters.UpdateLTDMeters(data,function(err,results) {
        
            if (err) {
                data = null;
                console.log('UpdateLTDMeters error: ' + err);
                callback(err,null);
            } else {
                data = null;
                console.log('UdpateLTDMeters written');
                callback(null,results);
            }
        });
   } else if (data.table === 'sc_billbreaks') {

        if (data.operation === 'add') {

            KioskUnit.AddBillbreakConfig(data,function(err,results) {

                if (err) {

                    console.log('Add Billbreak error: ' + err);
                    Utils.LogError(data,err,function(err,results) {


                  });
                 data = null;
                 callback(err,null);

                } else {

                  // console.log('AddBillbreakConfig written');
                   data = null;
                   callback(null,results);
              }

            });
        } else if (data.operation === 'update') {

            KioskUnit.UpdateBillbreakConfig(data,function(err,results) {

                if (err) {

                    console.log('UpdateBillbreakConfig: ' + err);
                    Utils.LogError(data,err,function(err,results) {


                  });
                 data = null;
                 callback(err,null);

                } else {

                   //console.log('UpdateBillbreakConfig written');
                   data = null;
                   callback(null,results);
              }

            });

        } else if( data.operation === 'delete') {

            KioskUnit.DeleteBillbreakConfig(data,function(err,results) {

                if (err) {

                    console.log('DeleteBillbreakConfig: ' + err);
                    Utils.LogError(data,err,function(err,results) {


                  });
                 data = null;
                 callback(err,null);

                } else {

                   //console.log('DeleteBillbreakConfig written');
                   data = null;
                   callback(null,results);
              }

            });



        }



   } else if (data.table === 'db_unittransdrop') {

        DropMeters.WriteDropDetail(data,function(err,results){

            if (err) {
                console.log('WriteDropDetails: ' + err);
                Utils.LogError(data,err,function(err,results) {


               });
                data = null;
                callback(err,null);
  
            } else {
               //console.log('WriteDropDetails written');
               data = null;
               callback(null,results);


            }



        });
 

   } else if (data.table === 'db_unitdropmeters') {

        DropMeters.WriteDropMeters(data,function(err,results){

            if (err) {
                console.log('WriteDropMeters: ' + err);
                Utils.LogError(data,err,function(err,results) {


               });
                data = null;
                callback(err,null);
  
            } else {
               //console.log('WriteDropMeters written');
               data = null;
               callback(null,results);
                

            }



        });
 

   } else if (data.table === 'tk_tickets') {

      if (data.operation === 'insert' ){

      Tickets.SaveHandpayVoucher(data,function(err,results){

            if (err) {
                console.log('SaveHandpayVoucher: ' + err);
                Utils.LogError(data,err,function(err,results) {


               });
                data = null;
                callback(err,null);
  
            } else {
               //console.log('WriteDropMeters written');
               data = null;
               callback(null,results);
                

            }



      });
    } else if (data.operation === 'update_pending') {
      Tickets.UpdatePendingTrans(data,function(err,results){

            if (err) {
                console.log('UpdatePendingTrans: ' + err);
                Utils.LogError(data,err,function(err,results) {


               });
                data = null;
                callback(err,null);
  
            } else {
               //console.log('WriteDropMeters written');
               data = null;
               callback(null,results);
                

            }



      });


    }

   } else if( data.table === 'db_tencoin') {
       if(data.operation === 'start') {
         tenCoin.StartTenCoinTest(data,function(err,results) {
            if (err) {
                console.log('StartTenCoinTest: ' + err);
                Utils.LogError(data,err,function(err,results) {


               });
                data = null;
                callback(err,null);
  
            } else {
               //console.log('WriteDropMeters written');
               data = null;
               callback(null,results);
                

            }



         });

       } else if (data.operation === 'end'){
         tenCoin.EndTenCoinTest(data,function(err,results) {
            if (err) {
                console.log('EndTenCoinTest: ' + err);
                Utils.LogError(data,err,function(err,results) {


               });
                data = null;
                callback(err,null);
  
            } else {
               //console.log('WriteDropMeters written');
               data = null;
               callback(null,results);
                

            }


         });

       }


   } else if (data.table === 'sc_multigameconfig') {
       console.log('In multigame config');
       KioskUnit.UpdateMultiGameDesc(data,function(err,results) {

            if (err) {
                console.log('UpdateMultiGameDesc: ' + err);
                Utils.LogError(data,err,function(err,results) {


               });
                data = null;
                callback(err,null);
  
            } else {
               //console.log('WriteDropMeters written');
               data = null;
               callback(null,results);
                

            }



       });

   } else if (data.table === 'db_atmRequestMessages') {
      atm.WriteAtmRequestMessage(data,function(err,results) {
        if(err) {
            console.log('WriteAtmRequestMessage error: ' + err);
            Utils.LogError(data,err,function(err,results) {


           });
            data = null;
            callback(err,null);

        } else {
                 data = null;
                 callback(null,results);

        }

      });

   } else if (data.table === 'db_atmResponseMessages') {

      atm.WriteAtmResponseMessage(data,function(err,results) {
        if(err) {
            console.log('WriteAtmResponseMessage error: ' + err);
            Utils.LogError(data,err,function(err,results) {


           });
            data = null;
            callback(err,null);

        } else {
                 data = null;
                 callback(null,results);

        }

      });


   } else if (data.table === 'db_atmMessages'){
      if(data.operation === 'insert'){
        atm.WriteAtmMessage(data,function(err,results) {
        if(err) {
            console.log('WriteAtmMessage error: ' + err);
            Utils.LogError(data,err,function(err,results) {


           });
            data = null;
            callback(err,null);

        } else {
                 data = null;
                 callback(null,results);

        }

      });

      } else if (data.operation === 'update'){
          atm.UpdateAtmMessage(data,function(err,results) {
            if(err) {
                console.log('UpdateAtmMessage error: ' + err);
                Utils.LogError(data,err,function(err,results) {


               });
             data = null;
             callback(err,null);

              } else {
                 data = null;
                 callback(null,results);

              }
          });
      }
  } else if( data.table === 'db_multiGameMachineProfile') {
    console.log('in db_multiGameMachineProfile');
       profile.UpdateMachineProfile(data,function(err,results) {

            if(err) {
                console.log('UpdateMachineProfile error: ' + err);
                Utils.LogError(data,err,function(err,results) {


               });
             data = null;
             callback(err,null);

              } else {
                 data = null;
                 callback(null,results);

              }


    });
  } else if(data.table === 'sc_multiGameProfile') {
       console.log('in sc_multiGameProfile');
       profile.SaveMultiGameProfile(data,function(err,results) {

            if(err) {
                console.log('SaveMultiGameProfile error: ' + err);
                Utils.LogError(data,err,function(err,results) {


               });
             data = null;
             callback(err,null);

              } else {
                 data = null;
                 callback(null,results);

              }


    });



  } else if (data.table === 'sc_multiGameProfileDetail') {

       if(data.operation === 'insert') {
           profile.SaveMultiGameProfileDetail(data,function(err,results) {

              if(err) {
                  console.log('SaveMultiGameProfileDetail error: ' + err);
                  Utils.LogError(data,err,function(err,results) {


                 });
                 data = null;
                 callback(err,null);

              } else {
                 data = null;
                 callback(null,results);

              }


        });
     } else if(data.operation === 'update') {

           profile.UpdateMultiGameProfileDetail(data,function(err,results) {

              if(err) {
                  console.log('UpdateMultiGameProfileDetail error: ' + err);
                  Utils.LogError(data,err,function(err,results) {


                 });
                 data = null;
                 callback(err,null);

              } else {
                 data = null;
                 callback(null,results);
              

              }


        });

     }

  } else if( data.table === 'db_atmReversalRetries') {
    if(data.operation === 'insert'){
        atm.InsertAtmReversalReties(data,function(err,results) {
              if(err) {
                  console.log('InsertAtmReversalReties error: ' + err);
                  Utils.LogError(data,err,function(err,results) {


                 });
                 data = null;
                 callback(err,null);

              }
              else {
                 data = null;
                 callback(null,results);

              }




        });
    } else if( data.operation === 'update'){
        atm.UpdateAtmReversalReties(data,function(err,results) {
              if(err) {
                  console.log('UpdateAtmReversalReties error: ' + err);
                  Utils.LogError(data,err,function(err,results) {


                 });
                 data = null;
                 callback(err,null);

              } else {
                 data = null;
                 callback(null,results);

              }



    });

   }

   } else if ( data.table === 'db_fillTrans') {
      if(data.operation === 'update' ) {
        DropMeters.UpdateFillTrans(data,function(err,results){

            if (err) {
                console.log('UpdateFillTrans: ' + err);
                Utils.LogError(data,err,function(err,results) {


               });
                data = null;
                callback(err,null);
  
            } else {
               data = null;
               callback(null,results);

           }

        });


      }

    } else {  //unknown table, need to respond anyway so the client doesn't keep sending
        data = null;
        console.log('***In catch all*******');
        callback(null,'OK');
    }
}
 exports.ProcessTrans = ProcessTrans;