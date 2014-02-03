// Init reqs
/* jslint node: true */
'use strict';

var mMWSProd  = require('../'),
    mUtilex   = require('utilex')
;

// Init vars
var gTestList = {
      SERVICESTATUS: true,
      MATCHINGPRODUCTFORID: false
    },

    gAuth     = {sellerId: 'SELLERID', accessKeyId: 'ACCESSKEYID', secretKey: 'SECRETKEY'},
    gMP       = 'US',
    gMWSProd
;

if(mUtilex.tidyArgs().testDEV !== undefined) {
  gTestList.SERVICESTATUS               = true;
  gTestList.MATCHINGPRODUCTFORID        = true;
  if(mUtilex.tidyArgs().authJSON) gAuth = require(mUtilex.tidyArgs().authJSON);
}

gMWSProd = mMWSProd({auth: gAuth, marketplace: gMP});

// Tests
console.log('test-all.js');

// Test for service status
if(gTestList.SERVICESTATUS === true) {
  gMWSProd.serviceStatus(function(err, data) {
    console.log('SERVICESTATUS:');

    if(!err) {
      console.log(JSON.stringify(data, null, 2));
    }
    else {
      console.log("ERROR!:" + JSON.stringify(err, null, 2));
    }
  });
}

// Test for matching product for id
if(gTestList.MATCHINGPRODUCTFORID === true) {
  gMWSProd.matchingProductForId({idType: 'ASIN', idList: ['B00863WC40', 'B008648946']}, function(err, data) {
    console.log('MATCHINGPRODUCTFORID:');

    if(!err) {
      console.log(JSON.stringify(data, null, 2));
    }
    else {
      console.log("ERROR!:" + JSON.stringify(err, null, 2));
    }
  });
}