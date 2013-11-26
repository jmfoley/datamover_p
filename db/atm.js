
//module.exports = atm;

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool');
var errMsg = '';

function callback(error, results) {}


// function atm() {
//   console.log('***********in constructor***********');
//   if (!(this instanceof atm))
//     return new atm();
// }


//  atm.prototype.WriteAtmTrans = function (data, callback) {
  function WriteAtmTrans (data, callback) {
  
  var sql = '';
  var connection;
  var updated = new Date();
    

  
  dbConnect.GetDbConnection(data.operatorid, function (err, results) {
    if (err) {
      errMsg = 'GetDbConnection error: ' + err;
      return callback(errMsg, null);
    } else {
      connection = results;
      sql = 'insert into db_atmTrans(recid,operatorID,unitId,unitPropId,terminalId,transCode,acctType,sequenceNum,responseCode,authNum,transDate,' +
            'transTime,businessDate,amount1,amount2,cardLast4,updated)values(newid(),@oper,@unitid,@propid,@termid,@transcode,@accttype,@seqnum,@rescode,' +
            '@authnum,@transdate,@transtime,@busdate,@amt1,@amt2,@last4,@updated)';
  
      //return callback(null,'ok');

      var request = new Request(sql, function (err, rowCount) {
        if (err) {
          errMsg = 'WriteAtmTrans Error: ' + err;
          connection.close();
          connection = null;
          sql = null;
          updated = null;
          request = null;
          results = null;
          err = null;
          return callback(errMsg, null);
        } else {
          connection.close();
          connection = null;
          sql = null;
          request = null;
          updated = null;
          results = null;
          rowCount = null;
          return callback(null, rowCount);
        }
      });

      request.addParameter('oper', TYPES.Int, data.operatorid);
      request.addParameter('unitid', TYPES.Int, data.unit);
      request.addParameter('propid', TYPES.Int, data.propid);
      request.addParameter('termid', TYPES.NVarChar, data.terminalid);
      request.addParameter('transcode', TYPES.NVarChar, data.transcode);
      request.addParameter('accttype', TYPES.NVarChar, data.accttype);
      request.addParameter('seqnum', TYPES.Int, data.seq);
      request.addParameter('rescode', TYPES.Int, data.response);
      request.addParameter('authnum', TYPES.Int, data.auth);
      request.addParameter('transdate', TYPES.Int, data.transdate);
      request.addParameter('transtime', TYPES.Int, data.transtime);
      request.addParameter('busdate', TYPES.Int, data.busdate);
      request.addParameter('amt1', TYPES.Int, data.amt1);
      request.addParameter('amt2', TYPES.Int, data.amt2);
      request.addParameter('last4', TYPES.NVarChar, data.last4);
      request.addParameter('updated', TYPES.DateTime, updated);
      connection.execSql(request);
    }

  });

}
exports.WriteAtmTrans = WriteAtmTrans;







function WriteAtmMessage(data, callback) {

  
  //return callback(null, 'ok');
  var sql = '';
  var connection;
  var created = new Date(data.createdDate);

  

  dbConnect.GetDbConnection(data.operatorId, function (err, results) {
    if (err) {
      errMsg = 'WriteAtmMessage error: ' + err;
      return callback(errMsg, null);
    } else {
      connection = results;
      // sql = 'insert into db_atmMessages(messageContent,truncated,request,atmHost,parity,operatorId,unitId,unitPropId,error,'  +
      //       'messageSequenceID,createdDate) values(@msgCon,@trunc,@req,@host,@par,@oper,@unit,@prop,@err,@seq,@date)';

      sql = 'insert into db_atmMessages(messageContent,truncated,request,atmHost,parity,operatorId,unitId,unitPropId,'  +
            'createdDate,db_atmMessageID,messageSequenceID,error) values(convert(varbinary,@msgCon),@trunc,@req,@host,@par,@oper,' +
            '@unit,@prop,@date,@msgId,@seq,@err)';


      var request = new Request(sql, function (err, results) {
        if (err) {
          errMsg = 'WriteAtmMessage error: ' + err;
          connection.close();
          connection = null;
          sql = null;
          //delete request;
          return callback(errMsg, null);
        } else {
          connection.close();
          connection = null;
          sql = null;
          request = null;
          results = null;
          return callback(null, 'ok');
        }

      });


      request.addParameter('msgCon', TYPES.VarChar, data.messageContent);
      request.addParameter('trunc', TYPES.Int, data.truncated);
      request.addParameter('req', TYPES.Int, data.request);
      request.addParameter('host', TYPES.VarChar, data.atmHost);
      request.addParameter('par', TYPES.Int, data.parity);
      request.addParameter('err', TYPES.VarChar, data.errorValue);
      request.addParameter('oper', TYPES.Int, data.operatorId);
      request.addParameter('unit', TYPES.Int, data.unitId);
      request.addParameter('prop', TYPES.Int, data.unitPropId);
      request.addParameter('seq', TYPES.UniqueIdentifierN, data.messageSeqId);
      request.addParameter('date', TYPES.DateTime, created);
      request.addParameter('msgId', TYPES.Int, data.db_atmMessageId);
      connection.execSql(request);

    }

  });

}
exports.WriteAtmMessage = WriteAtmMessage;




function UpdateAtmReversalReties(data, callback) {
  var sql = '';
  var connection;
  var created = new Date(data.updated);

  dbConnect.GetDbConnection(data.operatorId, function (err, results) {
    if (err) {
      errMsg = 'UpdateAtmReversalReties error ' + err;
      return callback(errMsg, null);
    } else {

      connection = results;
      sql = 'update db_atmReversalRetries set track2 = @track2,completed = @comp,updated = @updated where recid = @recid and ' +
            'unitId = @id and unitPropId = @prop';

      var request = new Request(sql, function (err, results) {
        if (err) {
          errMsg = 'UpdateAtmReversalReties error: ' + err;
          connection.close();
          connection = null;
          sql = null;
          request = null;
          results = null;
          return callback(errMsg, null);
        } else {
          connection.close();
          connection = null;
          sql = null;
          request = null;
          results = null;
          return callback(null, 'ok');
        }

      });
      request.addParameter('id', TYPES.Int, data.unitId);
      request.addParameter('prop', TYPES.Int, data.propid);
      request.addParameter('recid', TYPES.UniqueIdentifierN, data.recid);
      request.addParameter('comp', TYPES.Bit, data.completed);
      request.addParameter('track2', TYPES.VarChar, data.track2);
      request.addParameter('updated', TYPES.DateTime, created);
      connection.execSql(request);

    }
  });
}
exports.UpdateAtmReversalReties = UpdateAtmReversalReties;





function InsertAtmReversalReties(data, callback) {
  var sql = '';
  var connection;
  var created = new Date(data.updated);

  dbConnect.GetDbConnection(data.operatorId, function (err, results) {
    if (err) {
      errMsg = 'InsertAtmReversalReties error ' + err;
      return callback(errMsg, null);
    } else {

      connection = results;
      sql = 'insert into db_atmReversalRetries(operatorId,unitId,unitPropId,recID,atmTransRecID,atmHost,terminalID,sequenceNumber,' +
            'track2,amount1,amount2,actualDispensedAmount,reason,messageSequenceID,created,updated)values(@oper,@id,@prop,' +
            '@recid,@transrecid,@host,@terminalid,@seqnum,@track2,@amt1,@amt2,@act,@reason,@msgseqid,@created,@updated)';

      var request = new Request(sql, function (err, results) {
        if (err) {
          errMsg = 'InsertAtmReversalReties error: ' + err;
          connection.close();
          connection = null;
          sql = null;
          request = null;
          return callback(errMsg, null);
        } else {
          connection.close();
          connection = null;
          sql = null;
          request = null;
          results = null;
          return callback(null, 'ok');
        }

      });

      request.addParameter('oper', TYPES.Int, data.operatorId);
      request.addParameter('id', TYPES.Int, data.unitId);
      request.addParameter('prop', TYPES.Int, data.propid);
      request.addParameter('recid', TYPES.UniqueIdentifierN, data.recid);
      request.addParameter('transrecid', TYPES.UniqueIdentifierN, data.atmtransrecid);
      request.addParameter('host', TYPES.VarChar, data.atmhost);
      request.addParameter('terminalid', TYPES.VarChar, data.terminalid);
      request.addParameter('seqnum', TYPES.Int, data.seq);
      request.addParameter('track2', TYPES.VarChar, data.track2);
      request.addParameter('amt1', TYPES.Int, data.amount1);
      request.addParameter('amt2', TYPES.Int, data.amount2);
      request.addParameter('act', TYPES.VarChar, data.actualdisamt);
      request.addParameter('reason', TYPES.Int, data.reason);
      request.addParameter('msgseqid', TYPES.UniqueIdentifierN, data.messageid);
      request.addParameter('created', TYPES.DateTime, created);
      request.addParameter('updated', TYPES.DateTime, created);
      connection.execSql(request);


    }
  });


}
exports.InsertAtmReversalReties = InsertAtmReversalReties;


function UpdateAtmMessage(data, callback) {

  var sql = '';
  var connection;

  dbConnect.GetDbConnection(data.operatorId, function (err, results) {
    if (err) {
      errMsg = 'UpdateAtmMessage error: ' + err;
      return callback(errMsg, null);
    } else {
      connection = results;
      sql = 'update db_atmMessages set formatRecognized = @format,messageContent = convert(varbinary,@msgCon) where db_atmMessageID = @id ' +
            'and unitId = @unit and unitPropId = @prop';

      var request = new Request(sql, function (err, results) {
        if (err) {
          errMsg = 'UpdateAtmMessage error: ' + err;
          connection.close();
          connection = null;
          sql = null;
          request = null;
          return callback(errMsg, null);
        } else {
          connection.close();
          connection = null;
          sql = null;
          request = null;
          results = null;
          return callback(null, 'ok');
        }
      });

      request.addParameter('format', TYPES.Int, data.formatRecognized);
      request.addParameter('msgCon', TYPES.VarChar, data.messageContent);
      request.addParameter('id', TYPES.Int, data.db_atmMessageID);
      request.addParameter('unit', TYPES.Int, data.unitId);
      request.addParameter('prop', TYPES.Int, data.unitPropId);
      connection.execSql(request);

    }

  });
}
exports.UpdateAtmMessage = UpdateAtmMessage;









function WriteAtmResponseMessage(data, callback) {

  var sql = '';
  var connection;
  var created = new Date(data.createdDate);

  dbConnect.GetDbConnection(data.operatorId, function (err, results) {
    if (err) {
      errMsg = 'WriteAtmResponseMessage error: ' + err;
      return callback(errMsg, null);
    } else {
      connection = results;
      sql = 'insert into db_atmResponseMessages(operatorId,unitId,unitPropId,db_atmResponseMessageID,db_atmRequestMessageID,' +
            'cf_atmRequestAndResponseMessageFormatID,formatConsistent,fieldTruncated,ACK,ENQ,MessageLength,InformationHeader,' +
            'MultiBlockIndicator,TerminalID,TransactionCode,SequenceNumber,ResponseCode,AuthorizationNum,TransactionDate,' +
            'TransactionTime,BusinessDate,Amount1,Amount2,Miscellaneous1,Miscellaneous2,FieldIDCodeEncryptedPINKey,' +
            'EncryptedPINKey,FieldIDCodeSurchargeAmount,SurchargeAmount,MiscellaneousX,LRC,extra,db_atmMessageID,createdDate)values(' +
            '@oper,@unit,@prop,@responseID,@requestID,@formatId,@formatCon,@fieldTrun,@ack,@enq,@len,@infoHeader,' +
            '@multi,@termId,@transcode,@seq,@responseCode,@authnum,@transdate,@transtime,@busdate,@amt1,@amt2,@misc1,' +
            '@misc2,@fieldid1,@pin,@fieldid2,@sur,@miscX,@lrc,@extra,@messId,@created)';

      var request = new Request(sql, function (err, rowCount) {
        if (err) {
          errMsg = 'WriteAtmResponseMessage error: ' + err;
          connection.close();
          connection = null;
          sql = null;
          request = null;
          return callback(errMsg, null);
        } else {
          connection.close();
          connection = null;
          sql = null;
          request = null;
          rowCount = null;
          return callback(null, 'ok');
        }

      });

      request.addParameter('oper', TYPES.Int, data.operatorId);
      request.addParameter('unit', TYPES.Int, data.unitId);
      request.addParameter('prop', TYPES.Int, data.unitPropId);
      request.addParameter('responseID', TYPES.Int, data.db_atmResponseMessageID);
      request.addParameter('requestID', TYPES.Int, data.db_atmRequestMessageID);
      request.addParameter('formatId', TYPES.Int, data.cf_atmRequestAndResponseMessageFormatID);
      request.addParameter('formatCon', TYPES.Int, data.formatConsistent);
      request.addParameter('fieldTrun', TYPES.Int, data.fieldTruncated);
      request.addParameter('ack', TYPES.VarChar, data.ACK);
      request.addParameter('enq', TYPES.VarChar, data.ENQ);
      request.addParameter('len', TYPES.VarChar, data.MessageLength);
      request.addParameter('infoHeader', TYPES.VarChar, data.InformationHeader);
      request.addParameter('multi', TYPES.VarChar, data.MultiBlockIndicator);
      request.addParameter('termId', TYPES.VarChar, data.TerminalID);
      request.addParameter('transCode', TYPES.VarChar, data.TransactionCode);
      request.addParameter('seq', TYPES.VarChar, data.SequenceNumber);
      request.addParameter('responseCode', TYPES.VarChar, data.ResponseCode);
      request.addParameter('authnum', TYPES.VarChar, data.AuthorizationNum);
      request.addParameter('transdate', TYPES.VarChar, data.TransactionDate);
      request.addParameter('transtime', TYPES.VarChar, data.TransactionTime);
      request.addParameter('busDate', TYPES.VarChar, data.BusinessDate);
      request.addParameter('amt1', TYPES.VarChar, data.Amount1);
      request.addParameter('amt2', TYPES.VarChar, data.Amount2);
      request.addParameter('misc1', TYPES.VarChar, data.Miscellaneous1);
      request.addParameter('misc2', TYPES.VarChar, data.Miscellaneous2);
      request.addParameter('fieldid1', TYPES.VarChar, data.FieldIDCodeEncryptedPINKey);
      request.addParameter('pin', TYPES.VarChar, data.EncryptedPINKey);
      request.addParameter('fieldid2', TYPES.VarChar, data.FieldIDCodeSurchargeAmount);
      request.addParameter('sur', TYPES.VarChar, data.SurchargeAmount);
      request.addParameter('miscx', TYPES.VarChar, data.MiscellaneousX);
      request.addParameter('lrc', TYPES.VarChar, data.LRC);
      request.addParameter('extra', TYPES.VarChar, data.extra);
      request.addParameter('messId', TYPES.Int, data.db_atmMessageID);
      request.addParameter('created', TYPES.DateTime, created);
      connection.execSql(request);

    }
  });

}
exports.WriteAtmResponseMessage = WriteAtmResponseMessage;


function WriteAtmRequestMessage(data, callback) {

  var sql = '';
  var connection;
  var created = new Date(data.createdDate);

  dbConnect.GetDbConnection(data.operatorId, function (err, results) {
    if (err) {
      errMsg = 'WriteAtmRequestMessage error: ' + err;
      return callback(errMsg, null);
    } else {
      connection = results;
      sql = 'insert into db_atmRequestMessages (operatorId,unitId,unitPropId,db_atmRequestMessageID,cf_atmRequestAndResponseMessageFormatID,' +
            'formatConsistent,fieldTruncated,MessageLength,CommunicationsIdentifier,TerminalIdentifier,SoftwareVersionNo,EncryptionModeFlag,' +
            'InformationHeader,TerminalID,TransactionCode,SequenceNumber,Track2,Amount1,Amount2,Amount3,PINBlock,Miscellaneous1,' +
            'Miscellaneous2,ProgramVersionNumber,TableVersionNumber,FirmwareVersionNumber,AlarmChestDoorOpen,AlarmTopDoorOpen,AlarmSupervisorActive,' +
            'ReceiptPrinterPaperStatus,ReceiptPrinterRibbonStatus,JournalPrinterPaperStatus,JournalPrinterRibbonStatus,NoteStatusDispenser,' +
            'ReceiptPrinter,JournalPrinter,Dispenser,CommunicationsSystem,CardReader,CardsRetained,ElectronicsSystem,CurrentErrorCodeForTerminal,' +
            'CommunicationsFailures,CassetteADenomination,CassetteANotesLoaded,CassetteANotesDispensed,CassetteARejectEvents,CassetteBDenomination,' +
            'CassetteBNotesLoaded,CassetteBNotesDispensed,CassetteBRejectEvents,CassetteCDenomination,CassetteCNotesLoaded,CassetteCNotesDispensed,' +
            'CassetteCRejectEvents,CassetteDDenomination,CassetteDNotesLoaded,CassetteDNotesDispensed,CassetteDRejectEvents,TotalNotesPurged,' +
            'MiscellaneousX,LRC,extra,db_atmMessageID,createdDate)values(@oper,@unit,@prop,@requestID,@formatId,@formatCon,@fieldTrun,' +
            '@len,@commIdent,@termIdent,@softVer,@encFlag,@infoHeader,@termId,@transCode,@seq,@track2,@amt1,@amt2,@amt3,@pinBlk,@misc1,' +
            '@misc2,@progVer,@tableVer,@firmVer,@chestOpen,@topOpen,@supActive,@recptPrnPaperStat,@recptPrnRibStat,@jornPaperStat,' +
            '@jornRibStat,@dispStat,@recp,@journ,@disp,@commSystem,@card,@retained,@eleSystem,@curError,@commFail,@casADenom,@casALoad,' +
            '@casADisp,@casARej,@casBDenom,@casBLoad,@casBDisp,@casBRej,@casCDenom,@casCLoad,@casCDisp,@casCRej,@casDDenom,@casDLoad,' +
            '@casDDisp,@casDRej,@totPur,@miscX,@lrc,@extra,@messId,@created)';

      var request = new Request(sql, function (err, rowCount) {
        if (err) {
          errMsg = 'WriteAtmRequestMessage error: ' + err;
          connection.close();
          connection = null;
          sql = null;
          request = null;
          return callback(errMsg, null);
        } else {
          connection.close();
          connection = null;
          sql = null;
          request = null;
          rowCount = null;
          return callback(null, 'ok');
        }
      });

      request.addParameter('oper', TYPES.Int, data.operatorId);
      request.addParameter('unit', TYPES.Int, data.unitId);
      request.addParameter('prop', TYPES.Int, data.unitPropId);
      request.addParameter('requestID', TYPES.Int, data.db_atmRequestMessageID);
      request.addParameter('formatId', TYPES.Int, data.cf_atmRequestAndResponseMessageFormatID);
      request.addParameter('formatCon', TYPES.Int, data.formatConsistent);
      request.addParameter('fieldTrun', TYPES.Int, data.fieldTruncated);
      request.addParameter('len', TYPES.VarChar, data.MessageLength);
      request.addParameter('commIdent', TYPES.VarChar, data.CommunicationsIdentifier);
      request.addParameter('termIdent', TYPES.VarChar, data.TerminalIdentifier);
      request.addParameter('softVer', TYPES.VarChar, data.SoftwareVersionNo);
      request.addParameter('encFlag', TYPES.VarChar, data.EncryptionModeFlag);
      request.addParameter('infoHeader', TYPES.VarChar, data.InformationHeader);
      request.addParameter('termId', TYPES.VarChar, data.TerminalID);
      request.addParameter('transCode', TYPES.VarChar, data.TransactionCode);
      request.addParameter('seq', TYPES.VarChar, data.SequenceNumber);
      request.addParameter('track2', TYPES.VarChar, data.Track2);
      request.addParameter('amt1', TYPES.VarChar, data.Amount1);
      request.addParameter('amt2', TYPES.VarChar, data.Amount2);
      request.addParameter('amt3', TYPES.VarChar, data.Amount3);
      request.addParameter('pinBlk', TYPES.VarChar, data.PINBlock);
      request.addParameter('misc1', TYPES.VarChar, data.Miscellaneous1);
      request.addParameter('misc2', TYPES.VarChar, data.Miscellaneous2);
      request.addParameter('progVer', TYPES.VarChar, data.ProgramVersionNumber);
      request.addParameter('tableVer', TYPES.VarChar, data.TableVersionNumber);
      request.addParameter('firmVer', TYPES.VarChar, data.FirmwareVersionNumber);
      request.addParameter('chestOpen', TYPES.VarChar, data.AlarmChestDoorOpen);
      request.addParameter('topOpen', TYPES.VarChar, data.AlarmTopDoorOpen);
      request.addParameter('supActive', TYPES.VarChar, data.AlarmSupervisiorActive);
      request.addParameter('recptPrnPaperStat', TYPES.VarChar, data.ReceiptPrinterPaperStatus);
      request.addParameter('recptPrnRibStat', TYPES.VarChar, data.ReceiptPrinterRibbonStatus);
      request.addParameter('jornPaperStat', TYPES.VarChar, data.JournalPrinterPaperStatus);
      request.addParameter('jornRibStat', TYPES.VarChar, data.JournalPrinterRibbonStatus);
      request.addParameter('dispStat', TYPES.VarChar, data.NoteStatusDispenser);
      request.addParameter('recp', TYPES.VarChar, data.ReceiptPrinter);
      request.addParameter('journ', TYPES.VarChar, data.JournalPrinter);
      request.addParameter('disp', TYPES.VarChar, data.Dispenser);
      request.addParameter('commSystem', TYPES.VarChar, data.CommunicationsSystem);
      request.addParameter('card', TYPES.VarChar, data.CardReader);
      request.addParameter('retained', TYPES.VarChar, data.CardsRetained);
      request.addParameter('eleSystem', TYPES.VarChar, data.ElectronicsSystem);
      request.addParameter('curError', TYPES.VarChar, data.CurrentErrorCodeForTerminal);
      request.addParameter('commFail', TYPES.VarChar, data.CommunicationsFailures);
      request.addParameter('casADenom', TYPES.VarChar, data.CassetteADenomination);
      request.addParameter('casALoad', TYPES.VarChar, data.CassetteANotesLoaded);
      request.addParameter('casADisp', TYPES.VarChar, data.CassetteANotesDispensed);
      request.addParameter('casARej', TYPES.VarChar, data.CassetteARejectEvents);
      request.addParameter('casBDenom', TYPES.VarChar, data.CassetteBDenomination);
      request.addParameter('casBLoad', TYPES.VarChar, data.CassetteBNotesLoaded);
      request.addParameter('casBDisp', TYPES.VarChar, data.CassetteBNotesDispensed);
      request.addParameter('casBRej', TYPES.VarChar, data.CassetteBRejectEvents);
      request.addParameter('casCDenom', TYPES.VarChar, data.CassetteCDenomination);
      request.addParameter('casCLoad', TYPES.VarChar, data.CassetteCNotesLoaded);
      request.addParameter('casCDisp', TYPES.VarChar, data.CassetteCNotesDispensed);
      request.addParameter('casCRej', TYPES.VarChar, data.CassetteCRejectEvents);
      request.addParameter('casDDenom', TYPES.VarChar, data.CassetteDDenomination);
      request.addParameter('casDLoad', TYPES.VarChar, data.CassetteDNotesLoaded);
      request.addParameter('casDDisp', TYPES.VarChar, data.CassetteDNotesDispensed);
      request.addParameter('casDRej', TYPES.VarChar, data.CassetteDRejectEvents);
      request.addParameter('totPur', TYPES.VarChar, data.TotalNotesPurged);
      request.addParameter('miscX', TYPES.VarChar, data.MiscellaneousX);
      request.addParameter('lrc', TYPES.VarChar, data.LRC);
      request.addParameter('extra', TYPES.VarChar, data.extra);
      request.addParameter('messId', TYPES.Int, data.db_atmMessageID);
      request.addParameter('created', TYPES.DateTime, created);
      connection.execSql(request);

    }

  });

}
exports.WriteAtmRequestMessage = WriteAtmRequestMessage;


function UpdateAtmTrans(data, callback) {

  var sql = '';
  var connection;
  var updated = new Date();
  
  dbConnect.GetDbConnection(data.operatorid, function (err, results) {
    if (err) {
      errMsg = 'GetDbConnection error: ' + err;
      return callback(errMsg, null);
    } else {
      connection = results;
      sql = 'update db_atmTrans set transNumber = @trans,updated = @date where sequenceNum = @seq and unitId = @unitid and unitPropId = @prop';

      var request = new Request(sql, function (err, rowCount) {
        if (err) {
          errMsg = 'UpdateAtmTrans error: ' + err;
          connection.close();
          connection = null;
          sql = null;
          request = null;
          delete updated;
          return callback(errMsg, null);
        } else {
          connection.close();
          connection = null;
          sql = null;
          request = null;
          rowCount = null;
          delete updated; 
          return callback(null, 'ok');
        }
      });

            //request.addParameter('oper', TYPES.Int,data.operatorid);
      request.addParameter('unitid', TYPES.Int, data.unit);
      request.addParameter('prop', TYPES.Int, data.propid);
      request.addParameter('trans', TYPES.Int, data.trans);
      request.addParameter('seq', TYPES.Int, data.seq);
      request.addParameter('date', TYPES.DateTime, updated);
      connection.execSql(request);

    }
  });

}
exports.UpdateAtmTrans = UpdateAtmTrans;




