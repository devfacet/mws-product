/*
 * MWS Product
 * For the full copyright and license information, please view the LICENSE.txt file.
 */

/* jslint node: true */
'use strict';

var request = require('request'),
    qs      = require('qs'),
    xml2JS  = require('xml2js'),
    crypto  = require('crypto');

// Init the module
exports = module.exports = function(options) {

  var authOpt   = (options && options.auth)         ? options.auth        : null,
      mpOpt     = (options && options.marketplace)  ? options.marketplace : null,

      xmlParser = new xml2JS.Parser({charkey: 'C$', attrkey: 'A$', explicitArray: false}),

      mpCur,            // current marketplace
      mpDef     = 'US', // default marketplace
      mpList    = {     // marketplace list
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

      authInfo,                   // auth info
      mwsReqHost,                 // MWS request host
      mwsReqPath,                 // MWS request path
      mwsReqUrl,                  // MWS request url
      mwsReqSignGen,              // MWS request signature generator - function
      mwsReqQryGen,               // MWS request query generator - function
      mwsReqParamFormatter,       // MWS request parameter formatter - function
      mwsReqProcessor,            // MWS Request processor - function
      mwsResParser,               // MWS response parser - function
      serviceStatus,              // service status (API: GetServiceStatus) - function
      matchingProducts,           // list matching products (API: ListMatchingProducts) - function
      matchingProduct,            // matching product and attributes (API: GetMatchingProduct) - function
      matchingProductForId,       // get product info (API: GetMatchingProductForId) - function
      competitivePricingForSKU,   // get competitive pricing (API: GetCompetitivePricingForSKU) - function
      competitivePricingForASIN,  // get competitive pricing (API: GetCompetitivePricingForASIN) - function
      lowestOfferListingsForSKU,  // lowest offer listings (API: GetLowestOfferListingsForSKU) - function
      lowestOfferListingsForASIN, // lowest offer listings (API: GetLowestOfferListingsForASIN) - function
      myPriceForSKU,              // seller's price (API: GetMyPriceForSKU) - function
      myPriceForASIN,             // seller's price (API: GetMyPriceForASIN) - function
      productCategoriesForSKU,    // product categories (API: GetProductCategoriesForSKU) - function
      productCategoriesForASIN;   // product categories (API: GetProductCategoriesForASIN) - function

  // Check params
  mpCur    = ('' + mpOpt) || mpDef;
  authInfo = {sellerId: null, accessKeyId: null, secretKey: null};

  if(authOpt) {
    authInfo.sellerId    = authOpt.sellerId    || null;
    authInfo.accessKeyId = authOpt.accessKeyId || null;
    authInfo.secretKey   = authOpt.secretKey   || null;
  }

  if(!mpList[mpCur]) {
    throw 'Invalid marketplace parameter! (' + mpCur + ')';
  }

  mwsReqHost = mpList[mpCur].host;
  mwsReqPath = '/Products/2011-10-01';
  mwsReqUrl  = 'https://' + mwsReqHost + mwsReqPath;

  // Generates MWS request signature
  mwsReqSignGen = function mwsReqSignGen(val) {
    return (val && typeof val === 'string' && authInfo.secretKey) ? crypto.createHmac('sha256', authInfo.secretKey).update(val).digest('base64') : null;
  };

  // Generates MWS request query
  mwsReqQryGen = function mwsReqQryGen(options) {

    var method     = (options && options.method) ? ('' + options.method) : 'POST',
        host       = (options && options.host)   ? ('' + options.host)   : mwsReqHost,
        path       = (options && options.path)   ? ('' + options.path)   : mwsReqPath,
        query      = (options && options.query)  ? options.query         : null,
        returnData = {
          "AWSAccessKeyId": authInfo.accessKeyId,
          "SellerId": authInfo.sellerId,
          "SignatureMethod": "HmacSHA256",
          "SignatureVersion": "2",
          "Timestamp": new Date().toISOString(),
          "Version": "2011-10-01"
        },
        key;

    if(query && typeof query === "object")
      for(key in query)
        if(query.hasOwnProperty(key)) returnData[key] = ('' + query[key]);

    if(authInfo.secretKey && method && host && path) {

      // Sort query parameters
      var keys = [],
          qry  = {};

      for(key in returnData)
        if(returnData.hasOwnProperty(key)) keys.push(key);

      keys = keys.sort();
      for(key in keys)
        if(keys.hasOwnProperty(key)) qry[keys[key]] = returnData[keys[key]];

      var sign = [method, host, path, qs.stringify(qry)].join("\n");
      //sign = sign.replace(/!/g,"%21").replace(/'/g,"%27").replace(/\*/g,"%2A").replace(/\(/g,"%28").replace(/\)/g,"%29");

      returnData.Signature = mwsReqSignGen(sign);
    }

    //console.log(returnData); // for debug

    return returnData;
  };

  // Format request parameter whether array or single value
  mwsReqParamFormatter = function mwsReqParamFormatter(reqForm, name, values) {

    if(values instanceof Array) {
      for (var i = 0; i < values.length; i++) reqForm.query[name + '.' + (i+1)] = ('' + values[i]);
    } else if(typeof values === 'string') {
      reqForm.query[name + '.1'] = ('' + values);
    }
  };

  // Process an MWS request and cleanup the response if needed
  mwsReqProcessor = function mwsReqProcessor(reqForm, name, responseKey, resultKey, errorCode, callback) {

    var returnData,
        returnErr,
        mwsRes,
        reqErr,
        reqOpt = {
          url: mwsReqUrl,
          method: 'POST',
          timeout: 30000,
          form: null
        };

    reqOpt.form = mwsReqQryGen(reqForm);

    request(reqOpt, function (err, res, body) {

      mwsRes = mwsResParser({body: body, header: res.headers});
      reqErr = (mwsRes && mwsRes.error && mwsRes.error.message) ? mwsRes.error.message : ((err) ? ('' + err) : ((res.statusCode !== 200) ? 'HTTP status code: ' + ('' + res.statusCode) : null));

      if(!reqErr) {
        if(mwsRes && mwsRes.data) {
          returnData = mwsRes.data;

          // make it array due `explicitArray: false` option
          if(mwsRes && mwsRes.data && responseKey && resultKey &&
            mwsRes.data[responseKey] && mwsRes.data[responseKey][resultKey] &&
            !(mwsRes.data[responseKey][resultKey] instanceof Array)) {

            mwsRes.data[responseKey][resultKey] = [mwsRes.data[responseKey][resultKey]];
          }
        }
      } else {
        returnErr = {
          "type": "fatal",
          "code": errorCode,
          "source": name,
          "message": reqErr
        };
      }

      if(callback && typeof callback === 'function') {
        return callback(returnErr, returnData);
      } else {
        return {"error": returnErr, "data": returnData};
      }
    });
  };

  // Parses Amazon response
  mwsResParser = function mwsResParser(options) {

    var body   = (options && options.body)   ? ('' + options.body) : null,
        header = (options && options.header) ? options.header      : null,
        returnData,
        returnErr,
        respErr;

    //console.log(JSON.stringify(header, null, 2)); // for debug
    if(!header) {

    }

    // Parse response
    xmlParser.parseString(body, function(err, result) {
      if(!err) {
        if(!result.ErrorResponse) {
          returnData = result;
        } else {
          if(result && result.ErrorResponse && result.ErrorResponse.Error && result.ErrorResponse.Error) {
            respErr = result.ErrorResponse.Error.Message;
            respErr = respErr + '(' + result.ErrorResponse.Error.Type + '/' + result.ErrorResponse.Error.Code +')';
          } else {
            respErr = ('' + body).replace(/(\r\n|\n|\r)/gm, '');
          }

          returnErr = {
            "type": "fatal",
            "code": "mwsprod-001",
            "source": "mwsResParser",
            "message": "Response error! (" + respErr + ")"
          };
        }
      } else {
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

  // Returns service status
  serviceStatus = function serviceStatus(callback) {
    mwsReqProcessor({query: {"Action": "GetServiceStatus"}}, 'serviceStatus', undefined, undefined, "mwsprod-003", callback);
  };

  // Gets product info for the given Id list
  // idType: ASIN, GCID, SellerSKU, UPC, EAN, ISBN, and JAN
  matchingProductForId = function matchingProductForId(options, callback) {

    var idType = (options && options.idType) ? ('' + options.idType) : null,
        idList = (options && options.idList) ? options.idList        : null;

    // Request
    var reqForm = {query: {"Action": "GetMatchingProductForId", "MarketplaceId": mpList[mpCur].id, "IdType": idType}};

    mwsReqParamFormatter(reqForm, 'IdList.Id', idList);
    mwsReqProcessor(reqForm, 'matchingProductForId', "GetMatchingProductForIdResponse", "GetMatchingProductForIdResult", "mwsprod-004", callback);
  };

  // Lists matching products for a given query string in a given context
  // TODO: provide a queryContextId lookup mechanism
  matchingProducts = function matchingProducts(options, callback) {

    var query          = (options && options.query)          ? ('' + options.query)   : null,
        queryContextId = (options && options.queryContextId) ? options.queryContextId : null;

    // Request
    var reqForm = {query: {"Action": "ListMatchingProducts", "MarketplaceId": mpList[mpCur].id, "Query": query, "QueryContextId": queryContextId}};

    mwsReqProcessor(reqForm, 'matchingProducts', "ListMatchingProductsResponse", "ListMatchingProductsResult", "mwsprod-005", callback);
  };

  // Gets products and attributes for a given ASIN list
  matchingProduct = function matchingProduct(options, callback) {

    var asinList = (options && options.asinList) ? options.asinList : null;

    // Request
    var reqForm = {query: {"Action": "GetMatchingProduct", "MarketplaceId": mpList[mpCur].id}};

    mwsReqParamFormatter(reqForm, 'ASINList.ASIN', asinList);
    mwsReqProcessor(reqForm, 'matchingProduct', "GetMatchingProductResponse", "GetMatchingProductResult", "mwsprod-006", callback);
  };

  // Gets competitive pricing for the given SKU list
  competitivePricingForSKU = function competitivePricingForSKU(options, callback) {

    var skuList = (options && options.skuList) ? options.skuList : null;

    // Request
    var reqForm = {query: {"Action": "GetCompetitivePricingForSKU", "MarketplaceId": mpList[mpCur].id}};

    mwsReqParamFormatter(reqForm, 'SellerSKUList.SellerSKU', skuList);
    mwsReqProcessor(reqForm, 'competitivePricingForSKU', "GetCompetitivePricingForSKUResponse", "GetCompetitivePricingForSKUResult", "mwsprod-007", callback);
  };

  // Gets competitive pricing for the given ASIN list
  competitivePricingForASIN = function competitivePricingForASIN(options, callback) {

    var asinList = (options && options.asinList) ? options.asinList : null;

    // Request
    var reqForm = {query: {"Action": "GetCompetitivePricingForASIN", "MarketplaceId": mpList[mpCur].id}};

    mwsReqParamFormatter(reqForm, 'ASINList.ASIN', asinList);
    mwsReqProcessor(reqForm, 'competitivePricingForASIN', "GetCompetitivePricingForASINResponse", "GetCompetitivePricingForASINResult", "mwsprod-008", callback);
  };

  // Gets lowest offer listings for the given SKU list
  // itemCondition: Any, New, Used, Collectible, Refurbished, Club - (optional - defaults to Any)
  lowestOfferListingsForSKU = function lowestOfferListingsForSKU(options, callback) {

    var skuList       = (options && options.skuList)            ? options.skuList       : null,
        itemCondition = (options && options.itemCondition)      ? options.itemCondition : 'Any',
        excludeMe     = (options && options.excludeMe === true) ? 'True'                : 'False';

    // Request
    var reqForm = {query: {"Action": "GetLowestOfferListingsForSKU", "MarketplaceId": mpList[mpCur].id, "ItemCondition": itemCondition, "ExcludeMe": excludeMe}};

    mwsReqParamFormatter(reqForm, 'SellerSKUList.SellerSKU', skuList);
    mwsReqProcessor(reqForm, 'lowestOfferListingsForSKU', "GetLowestOfferListingsForSKUResponse", "GetLowestOfferListingsForSKUResult", "mwsprod-009", callback);
  };

  // Gets lowest offer listings for the given ASIN list
  // itemCondition: Any, New, Used, Collectible, Refurbished, Club - (optional - defaults to Any)
  lowestOfferListingsForASIN = function lowestOfferListingsForASIN(options, callback) {

    var asinList      = (options && options.asinList)           ? options.asinList      : null,
        itemCondition = (options && options.itemCondition)      ? options.itemCondition : 'Any',
        excludeMe     = (options && options.excludeMe === true) ? 'True'                : 'False';

    // Request
    var reqForm = {query: {"Action": "GetLowestOfferListingsForASIN", "MarketplaceId": mpList[mpCur].id, "ItemCondition": itemCondition, "ExcludeMe": excludeMe}};

    mwsReqParamFormatter(reqForm, 'ASINList.ASIN', asinList);
    mwsReqProcessor(reqForm, 'lowestOfferListingsForASIN', "GetLowestOfferListingsForASINResponse", "GetLowestOfferListingsForASINResult", "mwsprod-010", callback);
  };

  // Gets seller's price for the given SKU list
  // itemCondition: Any, New, Used, Collectible, Refurbished, Club - (optional - defaults to Any)
  myPriceForSKU = function myPriceForSKU(options, callback) {

    var skuList       = (options && options.skuList)       ? options.skuList       : null,
        itemCondition = (options && options.itemCondition) ? options.itemCondition : 'Any';

    // Request
    var reqForm = {query: {"Action": "GetMyPriceForSKU", "MarketplaceId": mpList[mpCur].id, "ItemCondition": itemCondition}};

    mwsReqParamFormatter(reqForm, 'SellerSKUList.SellerSKU', skuList);
    mwsReqProcessor(reqForm, 'myPriceForSKU', "GetMyPriceForSKUResponse", "GetMyPriceForSKUResult", "mwsprod-011", callback);
  };

  // Gets seller's price for the given ASIN list
  // itemCondition: Any, New, Used, Collectible, Refurbished, Club - (optional - defaults to Any)
  myPriceForASIN = function myPriceForASIN(options, callback) {

    var asinList      = (options && options.asinList)      ? options.asinList      : null,
        itemCondition = (options && options.itemCondition) ? options.itemCondition : 'Any';

    // Request
    var reqForm = {query: {"Action": "GetMyPriceForASIN", "MarketplaceId": mpList[mpCur].id, "ItemCondition": itemCondition}};

    mwsReqParamFormatter(reqForm, 'ASINList.ASIN', asinList);
    mwsReqProcessor(reqForm, 'myPriceForASIN', "GetMyPriceForASINResponse", "GetMyPriceForASINResult", "mwsprod-012", callback);
  };

  // Returns parent categories for the given SKU
  productCategoriesForSKU = function productCategoriesForSKU(options, callback) {

    var sku = (options && options.sku) ? options.sku : null;

    // Request
    var reqForm = {query: {"Action": "GetProductCategoriesForSKU", "MarketplaceId": mpList[mpCur].id, "SKU": sku}};

    mwsReqProcessor(reqForm, 'productCategoriesForSKU', "GetProductCategoriesForSKUResponse", "GetProductCategoriesForSKUResult", "mwsprod-013", callback);
  };

  // Returns parent categories for the given ASIN
  productCategoriesForASIN = function productCategoriesForASIN(options, callback) {

    var asin = (options && options.asin) ? options.asin : null;

    // Request
    var reqForm = {query: {"Action": "GetProductCategoriesForASIN", "MarketplaceId": mpList[mpCur].id, "ASIN": asin}};

    mwsReqProcessor(reqForm, 'productCategoriesForASIN', "GetProductCategoriesForASINResponse", "GetProductCategoriesForASINResult", "mwsprod-014", callback);
  };

  // Return
  return {
    serviceStatus: serviceStatus,
    matchingProductForId: matchingProductForId,
    matchingProduct: matchingProduct,
    matchingProducts: matchingProducts,
    competitivePricingForSKU: competitivePricingForSKU,
    competitivePricingForASIN: competitivePricingForASIN,
    lowestOfferListingsForSKU: lowestOfferListingsForSKU,
    lowestOfferListingsForASIN: lowestOfferListingsForASIN,
    myPriceForSKU: myPriceForSKU,
    myPriceForASIN: myPriceForASIN,
    productCategoriesForSKU: productCategoriesForSKU,
    productCategoriesForASIN: productCategoriesForASIN
  };
};