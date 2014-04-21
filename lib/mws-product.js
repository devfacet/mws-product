/*
 * MWS Product
 * Copyright (c) 2014 Fatih Cetinkaya (http://github.com/cmfatih/mws-product)
 * For the full copyright and license information, please view the LICENSE.txt file.
 */

// Init reqs
/* jslint node: true */
'use strict';

var request = require('request'),
    qs      = require('qs'),
    xml2JS  = require('xml2js'),
    crypto  = require('crypto')
;

// Init the module
exports = module.exports = function(iParam) {

  // Init vars
  var iAuth     = (iParam && iParam.auth)         ? iParam.auth         : null, // authentication
      iMP       = (iParam && iParam.marketplace)  ? iParam.marketplace  : null, // marketplace

      xmlParser = new xml2JS.Parser({charkey: 'C$', attrkey: 'A$', explicitArray: false}),    // xml parser

      mpCur,                // current marketplace
      mpDef     = 'US',     // default marketplace
      mpList    = {         // marketplace list
        "US": {"id": "ATVPDKIKX0DER",   "name": "US", "url": "www.amazon.com",    "host": "mws.amazonservices.com",     "country": {"code": "US", "name": "United States"}},
        "CA": {"id": "A2EUQ1WTGCTBG2",  "name": "CA", "url": "www.amazon.ca",     "host": "mws.amazonservices.ca",      "country": {"code": "CA", "name": "Canada"}},
        "UK": {"id": "A1F83G8C2ARO7P",  "name": "UK", "url": "www.amazon.co.uk",  "host": "mws-eu.amazonservices.com",  "country": {"code": "UK", "name": "United Kingdom"}},
        "DE": {"id": "A1PA6795UKMFR9",  "name": "DE", "url": "www.amazon.de",     "host": "mws-eu.amazonservices.com",  "country": {"code": "DE", "name": "Germany"}},
        "ES": {"id": "A1RKKUPIHCS9HS",  "name": "ES", "url": "www.amazon.es",     "host": "mws-eu.amazonservices.com",  "country": {"code": "ES", "name": "Spain"}},
        "FR": {"id": "A13V1IB3VIYZZH",  "name": "FR", "url": "www.amazon.fr",     "host": "mws-eu.amazonservices.com",  "country": {"code": "FR", "name": "France"}},
        "IN": {"id": "A21TJRUUN4KGV",   "name": "IN", "url": "www.amazon.in",     "host": "mws.amazonservices.in",      "country": {"code": "IN", "name": "India"}},
        "IT": {"id": "APJ6JRA9NG5V4",   "name": "IT", "url": "www.amazon.it",     "host": "mws-eu.amazonservices.com",  "country": {"code": "IT", "name": "Italy"}},
        "JP": {"id": "A1VC38T7YXB528",  "name": "JP", "url": "www.amazon.co.jp",  "host": "mws.amazonservices.jp",      "country": {"code": "JP", "name": "Japan"}},
        "CN": {"id": "AAHKV2X7AFYLW",   "name": "CN", "url": "www.amazon.cn",     "host": "mws.amazonservices.com.cn",  "country": {"code": "CN", "name": "China"}}
      },

      authInfo,             // auth info
      mwsReqHost,           // MWS request host
      mwsReqPath,           // MWS request path
      mwsReqUrl,            // MWS request url
      mwsReqSignGen,        // MWS request signature generator - function
      mwsReqQryGen,         // MWS request query generator - function
      mwsResParser,         // MWS response parser - function
      serviceStatus,        // service status (API: GetServiceStatus) - function
      matchingProductForId  // get product info (API: GetMatchingProductForId) - function
  ;

  // Check params
  mpCur     = ('' + iMP) || mpDef;
  authInfo  = {sellerId: null, accessKeyId: null, secretKey: null};

  if(iAuth) {
    authInfo.sellerId     = iAuth.sellerId    || null;
    authInfo.accessKeyId  = iAuth.accessKeyId || null;
    authInfo.secretKey    = iAuth.secretKey   || null;
  }

  if(!mpList[mpCur]) {
    throw 'Invalid marketplace parameter! (' + mpCur + ')';
  }

  mwsReqHost = mpList[mpCur].host;
  mwsReqPath = '/Products/2011-10-01';
  mwsReqUrl  = 'https://' + mwsReqHost + mwsReqPath;

  // generates MWS request signature
  mwsReqSignGen = function mwsReqSignGen(iStr) {
    return (iStr && typeof iStr == 'string' && authInfo.secretKey) ? crypto.createHmac('sha256', authInfo.secretKey).update(iStr).digest('base64') : null;
  };

  // generates MWS request query
  mwsReqQryGen = function mwsReqQryGen(iParam) {

    // Init vars
    var iMethod     = (iParam && iParam.method) ? ('' + iParam.method) : 'POST',
        iHost       = (iParam && iParam.host)   ? ('' + iParam.host)   : mwsReqHost,
        iPath       = (iParam && iParam.path)   ? ('' + iParam.path)   : mwsReqPath,
        iQuery      = (iParam && iParam.query)  ? iParam.query  : null,

        returnData  = {
          "AWSAccessKeyId": authInfo.accessKeyId,
          "SellerId": authInfo.sellerId,
          "SignatureMethod": "HmacSHA256",
          "SignatureVersion": "2",
          "Timestamp": new Date().toISOString(),
          "Version": "2011-10-01"
        }
    ;

    if(iQuery && typeof iQuery == "object") for(var key in iQuery) returnData[key] = ('' + iQuery[key]);

    if(authInfo.secretKey && iMethod && iHost && iPath) {

      // Sort query parameters
      var tKeys = [],
          tQry  = {}
      ;

      for(var key in returnData) tKeys.push(key);
      tKeys = tKeys.sort();
      for(var key in tKeys) tQry[tKeys[key]] = returnData[tKeys[key]];

      var tStr = [iMethod, iHost, iPath, qs.stringify(tQry)].join("\n");
      //tStr = tStr.replace(/!/g,"%21").replace(/'/g,"%27").replace(/\*/g,"%2A").replace(/\(/g,"%28").replace(/\)/g,"%29");

      returnData.Signature = mwsReqSignGen(tStr);
    }

    //console.log(returnData); // for debug

    return returnData;
  };

  // parse Amazon response
  mwsResParser = function mwsResParser(iParam) {

    // Init vars
    var iBody       = (iParam && iParam.body)   ? ('' + iParam.body)  : null,
        iHeader     = (iParam && iParam.header) ? iParam.header       : null,

        returnData, // return data
        returnErr,  // return error
        respErr     // response error
    ;

    //console.log(JSON.stringify(iHeader, null, 2)); // for debug

    // Parse response
    xmlParser.parseString(iBody, function(err, result) {
      if(!err) {
        if(!result.ErrorResponse) {
          returnData = result;
        }
        else {
          if(result && result.ErrorResponse && result.ErrorResponse.Error && result.ErrorResponse.Error) {
            respErr = result.ErrorResponse.Error.Message;
            respErr = respErr + '(' + result.ErrorResponse.Error.Type + '/' + result.ErrorResponse.Error.Code +')';
          }
          else {
            respErr = ('' + iBody).replace(/(\r\n|\n|\r)/gm, '');
          }

          returnErr = {
            "type": "fatal",
            "code": "mwsprod-001",
            "source": "mwsResParser",
            "message": "Response error! (" + respErr + ")"
          };
        }
      }
      else {
        returnErr = {
          "type": "fatal",
          "code": "mwsprod-002",
          "source": "mwsResParser",
          "message": "XML parsing error! (" + err + ")"
        };
      }
    });

    return {"error": returnErr, "data": returnData};
  };

  // return service status
  serviceStatus = function serviceStatus(iCallback) {

    // Init vars
    var returnData, // return data
        returnErr,  // return error
        mwsRes,     // MWS response

        reqErr,     // request error
        reqOpt = {  // request options
          url: mwsReqUrl,
          method: 'POST',
          timeout: 30000,
          form: null
        }
    ;

    // Request
    reqOpt.form = mwsReqQryGen({query: {"Action": "GetServiceStatus"}});
    request(reqOpt, function (err, res, body) {

      mwsRes = mwsResParser({body: body, header: res.headers});
      reqErr = (mwsRes && mwsRes.error && mwsRes.error.message) ? mwsRes.error.message : ((err) ? ('' + err) : ((res.statusCode !== 200) ? 'HTTP status code: ' + ('' + res.statusCode) : null));

      if(!reqErr) {
        if(mwsRes && mwsRes.data) returnData = mwsRes.data;
      }
      else {
        returnErr = {
          "type": "fatal",
          "code": "mwsprod-003",
          "source": "serviceStatus",
          "message": reqErr
        };
      }

      if(iCallback && typeof iCallback === 'function') {
        return iCallback(returnErr, returnData);
      }
      else {
        return {"error": returnErr, "data": returnData};
      }
    });
  };

  // gets product info by Id
  // idType: ASIN, GCID, SellerSKU, UPC, EAN, ISBN, and JAN
  matchingProductForId = function matchingProductForId(iParam, iCallback) {

    // Init vars
    var iIdType     = (iParam && iParam.idType) ? ('' + iParam.idType)  : null,
        iIdList     = (iParam && iParam.idList) ? iParam.idList         : null,

        returnData, // return data
        returnErr,  // return error
        mwsRes,     // MWS response

        reqErr,     // request error
        reqOpt = {  // request options
          url: mwsReqUrl,
          method: 'POST',
          timeout: 30000,
          form: null
        }
    ;

    // Request
    var tForm = {query: {"Action": "GetMatchingProductForId", "MarketplaceId": mpList[mpCur].id, "IdType": iIdType}};

    if(iIdList instanceof Array) {
      for (var i = 0; i < iIdList.length; i++) tForm.query['IdList.Id.' + (i+1)] = ('' + iIdList[i]);
    }
    else if(typeof iIdList == 'string') {
      tForm.query['IdList.Id.1'] = ('' + iIdList);
    }

    reqOpt.form = mwsReqQryGen(tForm);

    request(reqOpt, function (err, res, body) {

      mwsRes = mwsResParser({body: body, header: res.headers});
      reqErr = (mwsRes && mwsRes.error && mwsRes.error.message) ? mwsRes.error.message : ((err) ? ('' + err) : ((res.statusCode !== 200) ? 'HTTP status code: ' + ('' + res.statusCode) : null));

      if(!reqErr) {
        if(mwsRes && mwsRes.data) {
          returnData = mwsRes.data;

          // make it array due `explicitArray: false` option
          if(mwsRes && mwsRes.data && mwsRes.data.GetMatchingProductForIdResponse && mwsRes.data.GetMatchingProductForIdResponse.GetMatchingProductForIdResult && !(mwsRes.data.GetMatchingProductForIdResponse.GetMatchingProductForIdResult instanceof Array)) {
            mwsRes.data.GetMatchingProductForIdResponse.GetMatchingProductForIdResult = [mwsRes.data.GetMatchingProductForIdResponse.GetMatchingProductForIdResult];
          }
        }
      }
      else {
        returnErr = {
          "type": "fatal",
          "code": "mwsprod-004",
          "source": "matchingProductForId",
          "message": reqErr
        };
      }

      if(iCallback && typeof iCallback === 'function') {
        return iCallback(returnErr, returnData);
      }
      else {
        return {"error": returnErr, "data": returnData};
      }
    });
  };

  // Return
  return {
    serviceStatus: serviceStatus,
    matchingProductForId: matchingProductForId
  };
};