// Init reqs
/* jslint node: true */
'use strict';

var mwsprod = require('../'),
    utilex  = require('utilex')
;

// Init vars
var testList  = {SERVICESTATUS: true, MATCHINGPRODUCTFORID: false},
    auth      = {sellerId: 'SELLERID', accessKeyId: 'ACCESSKEYID', secretKey: 'SECRETKEY'},
    mplace    = 'US',
    mwsProd
;

if(utilex.tidyArgs().testDEV !== undefined) {
  testList.SERVICESTATUS              = true;
  testList.MATCHINGPRODUCTFORID       = true;
  if(utilex.tidyArgs().authJSON) auth = require(utilex.tidyArgs().authJSON);
}

mwsProd = mwsprod({auth: auth, marketplace: mplace});

// Tests
utilex.tidyLog('test-all.js');

// Test for service status
if(testList.SERVICESTATUS === true) {
  mwsProd.serviceStatus(function(err, data) {
    utilex.tidyLog('SERVICESTATUS:');

    if(!err) {
      console.log(JSON.stringify(data, null, 2));
    }
    else {
      console.log(JSON.stringify(err, null, 2));
    }
  });
}

// Test for matching product for id
if(testList.MATCHINGPRODUCTFORID === true) {
  mwsProd.matchingProductForId({idType: 'ASIN', idList: ['B00863WC40', 'B008648946']}, function(err, data) {
    utilex.tidyLog('MATCHINGPRODUCTFORID:');

    if(!err) {
      console.log(JSON.stringify(data, null, 2));
    }
    else {
      console.log(JSON.stringify(err, null, 2));
    }
  });
}