var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var dbConnect = require('./DbConnectionPool');
var util = require('util');
var errMsg = '';


function callback(error,results){};


function StartTenCoinTest( data,callback) {

  var sql = '';
  var connection;
  var reportDate = new Date(data.reportdate);
  var updated = new Date();

  dbConnect.GetDbConnection(data.operatorid,function(err,results) {
  	if (err){
	    errMsg = 'GetDbConnection error: ' + err;
	    return callback(errMsg,null);

  	} else {
        connection = results;
        sql = 'insert into db_tenCoin( operatorid,reportdate, started, machineNumber, machineDenom, bf_coin_in, bf_coin_out, bf_coin_drop, ' +
                    'bf_games, bf_bill_1, bf_bill_2, bf_bill_5, bf_bill_10, bf_bill_20, bf_bill_50, bf_bill_100, bf_jackpot, bf_cancel_credit, ' +
                    'bf_red_cash_ct, bf_red_cash_amt, bf_red_promo_ct, bf_red_promo_amt, bf_prt_cash_ct, bf_prt_cash_amt, bf_prt_promo_ct, bf_prt_promo_amt,' +
                    'bf_aft_cash_in, bf_aft_cash_out, bf_aft_promo_in, bf_aft_promo_out, startedBy, startedFrom, updatedBy, updatedFrom, propId, updated, ' +
                    'reportnum, bf_machPaidExternBonus, bf_attPaidExternBonus, bf_machPaidProgBonus, bf_attPaidProgBonus) select @oper,@reportDate, @date, ' +
                    '@machineNumber, a.mach_denom, a.ol_coin_in, a.ol_coin_out, a.ol_coin_drop, a.ol_games, a.ol_bill_1, a.ol_bill_2, a.ol_bill_5, ' +
                    'a.ol_bill_10, a.ol_bill_20, a.ol_bill_50, a.ol_bill_100, a.ol_jackpot, a.ol_cancel_credit, b.RedeemCashable_ct, CAST(b.RedeemCashable_amt * 100 as int) as RedeemCashable_amt, ' +
                    'b.RedeemPromo_ct, CAST(b.RedeemPromo_amt * 100 as int) as RedeemPromo_amt, b.PrintedCashable_ct, CAST(b.PrintedCashable_amt * 100 as int) as PrintedCashable_amt, b.PrintedPromo_ct, CAST(b.PrintedPromo_amt * 100 as int) as PrintedPromo_amt, ' +
                    'c.CashableCredits, c.cashableCreditsOut, c.PromoCredits, c.promoCreditsOut, @userId, @workstation, @userId, @workstation, @propId, @date, ' +
                    '@reportNum, b.machPaidExternBonus, b.attPaidExternBonus, b.machPaidProgBonus, b.attPaidProgBonus from slots a left outer join ticketMeters b on a.mach_num = b.mach_num ' +
                    'and a.propid = b.propid left outer join EFTMeters c on a.mach_num = c.mach_num and a.propid = c.propid where a.mach_num = @machineNumber and a.propid = @propid';


        var request = new Request(sql,function(err,results) {
            if (err) {
                errMsg = 'StartTenCoinTest error: '  + err;
                connection.close();
                connection = null;
                sql = null;
                request = null;
                delete reportDate;
                delete updated;
                return callback(errMsg,null);

            } else {
               connection.close();
               connection = null;
               sql = null;
               request = null;
               delete reportDate;
               delete updated;
               results = null;
               callback(null,'ok');

            }
        }); 

        request.addParameter('oper', TYPES.Int,data.operatorid); 
        request.addParameter('machinenumber', TYPES.Int,data.mach);
        request.addParameter('reportdate', TYPES.DateTime, reportDate);
        request.addParameter('userId', TYPES.VarChar,data.userid);
        request.addParameter('workstation', TYPES.VarChar,data.workstation);
        request.addParameter('reportnum', TYPES.Int,data.reportnum);
        request.addParameter('date', TYPES.DateTime, updated);
        request.addParameter('propid', TYPES.Int,data.propid);


        connection.execSql(request);
      

    }




  });


}exports.StartTenCoinTest = StartTenCoinTest;




function EndTenCoinTest( data,callback) {

  var sql = '';
  var connection;
  var reportDate =  new Date(data.reportdate);
  var endDate = new Date(data.enddate);
  var updated = new Date();


  //console.log(util.inspect(data));
  dbConnect.GetDbConnection(data.operatorid,function(err,results) {
    if (err){
      errMsg = 'GetDbConnection error: ' + err;
      return callback(errMsg,null);

    } else {
       connection = results;
        sql = 'UPDATE db_tenCoin SET ' +
              'reportdate = @rdate, ended = @edate, af_coin_in = @af_coin_in, af_coin_out = @af_coin_out, ' +
              'af_coin_drop = @af_coin_drop, af_games = @af_games, af_bill_1 = @af_bill_1, af_bill_2 = @af_bill_2, af_bill_5 = @af_bill_5, af_bill_10 = @af_bill_10, ' +
              'af_bill_20 = @af_bill_20, af_bill_50 = @af_bill_50, af_bill_100 = @af_bill_100, af_jackpot = @af_jackpot, af_cancel_credit = @af_cancel_credit, ' +
              'af_red_cash_ct = @af_red_cash_ct, af_red_cash_amt = @af_red_cash_amt, af_red_promo_ct = @af_red_promo_ct, af_red_promo_amt = @af_red_promo_amt, ' +
              'af_prt_cash_ct = @af_prt_cash_ct, af_prt_cash_amt = @af_prt_cash_amt, af_prt_promo_ct = @af_prt_promo_ct, af_prt_promo_amt = @af_prt_promo_amt, ' +
              'af_aft_cash_in = @af_aft_cash_in, af_aft_cash_out = @af_aft_cash_out, af_aft_promo_in = @af_aft_promo_in, af_aft_promo_out = @af_aft_promo_out, ' +
              'updated = @date, TOvsCC = @TOvsCC, TDvsCT = @TDvsCT, FW = @FW, updatedBy = @updatedby, updatedfrom = @updatedfrom WHERE reportNum = @ReportID and ' +
              'machineNumber = @machineNumber and propid = @propid';

        var request = new Request(sql,function(err,results) {
            if (err) {
                errMsg = 'EndTenCoinTest error: '  + err;
                connection.close();
                connection = null;
                sql = null;
                request = null;
                delete reportDate;
                delete endDate;
                delete updated;
                return callback(errMsg,null);

            } else {
               connection.close();
               connection = null;
               sql = null;
               request = null;
               delete reportDate;
               delete endDate;
               delete updated;
               results = null;
               callback(null,'ok');

            }
        }); 

        request.addParameter('rdate', TYPES.DateTime,reportDate);
        request.addParameter('edate', TYPES.DateTime,endDate);
        request.addParameter('af_coin_in', TYPES.Int,data.afcoinin);
        request.addParameter('af_coin_out', TYPES.Int, data.afcoinout);
        request.addParameter('af_coin_drop', TYPES.Int, data.afcoindrop);
        request.addParameter('af_games', TYPES.Int, data.afgames);
        request.addParameter('af_bill_1', TYPES.Int, data.afbill1);
        request.addParameter('af_bill_2', TYPES.Int, data.afbill2);
        request.addParameter('af_bill_5', TYPES.Int, data.afbill5);
        request.addParameter('af_bill_10', TYPES.Int, data.afbill10);
        request.addParameter('af_bill_20', TYPES.Int, data.afbill20);
        request.addParameter('af_bill_50', TYPES.Int, data.afbill50);
        request.addParameter('af_bill_100', TYPES.Int, data.afbill100);
        request.addParameter('af_jackpot', TYPES.Int, data.afjackpot);
        request.addParameter('af_cancel_credit', TYPES.Int, data.afcancelcredit);
        request.addParameter('af_red_cash_ct', TYPES.Int, data.afredcashct);
        request.addParameter('af_red_cash_amt', TYPES.Int, data.afredcashamt);
        request.addParameter('af_red_promo_ct', TYPES.Int, data.afredpromoct);
        request.addParameter('af_red_promo_amt', TYPES.Int, data.afredpromoamt);
        request.addParameter('af_prt_cash_ct', TYPES.Int, data.afprtcashct);
        request.addParameter('af_prt_cash_amt', TYPES.Int, data.afprtcashamt);
        request.addParameter('af_prt_promo_ct', TYPES.Int, data.afprtpromoct);
        request.addParameter('af_prt_promo_amt', TYPES.Int, data.afprtpromoamt);
        request.addParameter('af_aft_cash_in', TYPES.Int, data.afaftcashin);
        request.addParameter('af_aft_cash_out', TYPES.Int, data.afaftcashout);
        request.addParameter('af_aft_promo_in', TYPES.Int, data.afaftpromoin);
        request.addParameter('af_aft_promo_out', TYPES.Int, data.afaftpromoout);
        request.addParameter('updatedby', TYPES.VarChar, data.updatedby);
        request.addParameter('updatedfrom', TYPES.VarChar, data.updatedfrom);
        request.addParameter('date', TYPES.DateTime, updated);
        request.addParameter('TovsCC', TYPES.Bit, data.tovscc);
        request.addParameter('TDvsCT', TYPES.Bit, data.tdvct);
        request.addParameter('FW', TYPES.Bit, data.fw);
        request.addParameter('ReportID', TYPES.Int, data.reportid);
        request.addParameter('machinenumber', TYPES.Int, data.mach);
        request.addParameter('propid', TYPES.Int, data.propid);

        connection.execSql(request);







    }

  });

}exports.EndTenCoinTest = EndTenCoinTest;
