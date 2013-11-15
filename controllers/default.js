
var utils = require('util');
var kioskTableFilter = require('../db/KioskTableFilter');
var slotTableFilter = require('../db/SlotTableFilter');
var mailer = require('../db/Mailer');

var post_kioskdata;
var post_slotdata;
var post_crashdata;
var comm_check;
var get_stats;
var get_main_view;


var startDate = new Date();
var totalTransReceived = 0;
var totalSuccessfulTrans = 0;
var totalErrorTrans = 0;




exports.install = function (framework) {
  //framework.route('/m3t', post_data,['post','json']);
  framework.route('/kioskdata', post_kioskdata, ['post', 'json']);
  framework.route('/slotdata', post_slotdata, ['post', 'json']);
  framework.route('/crash', post_crashdata, ['post', 'json']);
  framework.route('/commcheck', comm_check);
  framework.route('/stats', get_stats);
  framework.route('/', get_main_view);

};



function get_main_view() {
  var self = this;
  // var memory = process.memoryUsage();
  // console.log(process.version);
  // console.log(process.platform);
  // console.log(process.arch);
  // console.log('total {0} MB, used {1} MB'.format((memory.heapTotal / 1024 / 1024).format('#######.##'), (memory.heapUsed / 1024 / 1024).format('#######.##')));

  self.layout('layout');
  self.view('index');
  //self.plain(self.framework.usage(true));

}




function get_stats() {
  var self = this;
  var memory = process.memoryUsage();
  var stats =
    {
      "startDate": startDate.getMonth() + 1 + '-' + startDate.getDate() + '-' + startDate.getFullYear() + ' ' + startDate.getHours() +
                   ':' + startDate.getMinutes() + ':' + startDate.getSeconds(),
      "totalTrans": totalTransReceived,
      "totalErrTrans": totalErrorTrans,
      "totalSuccessfulTrans": totalSuccessfulTrans,
      "nodeVer": process.version,
      "platform": process.platform,
      "arch": process.arch,
      "mem": 'Total {0} MB, Used {1} MB'.format((memory.heapTotal / 1024 / 1024).format('#######.##'), (memory.heapUsed / 1024 / 1024).format('#######.##')),
      "uptime": '{0} minutes'.format(Math.floor(process.uptime() / 60)),
      "dir": '{0}'.format(process.cwd)
    };

  //console.log(JSON.stringify(stats));
  //self.res.writeHead(200, {'Content-Type': 'application/json'});
  //self.res.write(JSON.stringify(stats));
  self.json(stats);
  stats = null;
}



function comm_check() {
  var self = this;
  self.res.writeHead(200);
  self.close();
}


function post_crashdata() {
  var self = this;

  mailer.SendReport(self.post, function (err, results) {
    if (err) {
      console.log(err);
    }

  });
}



function post_kioskdata() {
  var self = this;
  totalTransReceived++;
  kioskTableFilter.ProcessTrans(self.post, function (err, results) {
    console.log(self.post.operatorid);
    if (err) {
      totalErrorTrans++;
      self.res.writeHead(200);
      self.close();

    } else {
      totalSuccessfulTrans++;
      self.res.writeHead(200);
      self.close();

    }

  });
}


function post_slotdata() {
  var self = this;
  totalTransReceived++;
  slotTableFilter.ProcessTrans(self.post, function (err, results) {
    console.log(self.post.operatorid);
    if (err) {
      totalErrorTrans++;
      self.res.writeHead(200);
      self.close();

    } else {
      totalSuccessfulTrans++;
      self.res.writeHead(200);
      self.close();
    }

  });
}
