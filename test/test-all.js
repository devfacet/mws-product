/* jslint node: true */
/* global describe: false, it: false */
'use strict';

var mwsProd = require('../'),
    utilex  = require('utilex'),
    expect  = require('chai').expect;

// Tests

describe('mws-product', function() {

  var auth     = {sellerId: 'SELLERID', accessKeyId: 'ACCESSKEYID', secretKey: 'SECRETKEY'},
      mplace   = 'US', // marketplace
      app,     // mwsProd instance
      authjson = utilex.args()['auth-json'];

  if(typeof authjson === 'string')
    auth = require(authjson);

  app = mwsProd({auth: auth, marketplace: mplace});

  it('should get service status ', function(done) {
    app.serviceStatus(function(err, data) {
      if(err) {
        done(err.message);
        return;
      }

      expect(data).to.have.property('GetServiceStatusResponse');
      var respData = data.GetServiceStatusResponse;
      expect(respData).to.be.a('object');
      expect(respData).to.have.property('GetServiceStatusResult');
      expect(respData.GetServiceStatusResult).to.be.a('object');
      expect(respData.GetServiceStatusResult).to.have.property('Status');
      expect(respData.GetServiceStatusResult.Status).to.be.a('string');
      done();
    });
  });

  if(auth.sellerId && auth.sellerId !== 'SELLERID') {

    var prodID = 'B00863WC40';

    it('should get (ListMatchingProducts) a list of matching products for ' + prodID, function(done) {
      app.matchingProducts({query: prodID, queryContextId: 'All'}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('ListMatchingProductsResponse');
        var respData = data.ListMatchingProductsResponse;
        expect(respData).to.be.a('object');
        expect(respData).to.have.property('ListMatchingProductsResult');
        var reslData = respData.ListMatchingProductsResult;
        expect(reslData).to.be.a('array');
        expect(reslData[0]).to.have.property('Products');
        expect(reslData[0]['Products']).to.be.a('object');
        done();
      });
    });

    it('should get (GetMatchingProduct) matching product for ' + prodID, function(done) {
      app.matchingProduct({asinList: [prodID]}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetMatchingProductResponse');
        var respData = data.GetMatchingProductResponse;
        expect(respData).to.be.a('object');
        expect(respData).to.have.property('GetMatchingProductResult');
        var reslData = respData.GetMatchingProductResult;
        expect(reslData).to.be.a('array');
        expect(reslData[0]).to.have.property('A$');
        expect(reslData[0]['A$']).to.be.a('object');
        expect(reslData[0]['A$']).to.have.property('ASIN', prodID);
        done();
      });
    });

    it('should get (GetMatchingProductForId) matching products for ' + prodID, function(done) {
      app.matchingProductForId({idType: 'ASIN', idList: [prodID]}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetMatchingProductForIdResponse');
        var respData = data.GetMatchingProductForIdResponse;
        expect(respData).to.be.a('object');
        expect(respData).to.have.property('GetMatchingProductForIdResult');
        var reslData = respData.GetMatchingProductForIdResult;
        expect(reslData).to.be.a('array');
        expect(reslData[0]).to.have.property('A$');
        expect(reslData[0]['A$']).to.be.a('object');
        expect(reslData[0]['A$']).to.have.property('Id', prodID);
        done();
      });
    });

    it('should get (GetCompetitivePricingForASIN) competitive pricing for ' + prodID, function(done) {
      app.competitivePricingForASIN({asinList: [prodID]}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetCompetitivePricingForASINResponse');
        var respData = data.GetCompetitivePricingForASINResponse;
        expect(respData).to.be.a('object');
        expect(respData).to.have.property('GetCompetitivePricingForASINResult');
        var reslData = respData.GetCompetitivePricingForASINResult;
        expect(reslData).to.be.a('array');
        expect(reslData[0]).to.have.property('A$');
        expect(reslData[0]['A$']).to.be.a('object');
        expect(reslData[0]['A$']).to.have.property('ASIN', prodID);
        done();
      });
    });

    it('should get (GetLowestOfferListingsForASIN) lowest offer listings for ' + prodID, function(done) {
      app.lowestOfferListingsForASIN({asinList: [prodID]}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetLowestOfferListingsForASINResponse');
        var respData = data.GetLowestOfferListingsForASINResponse;
        expect(respData).to.be.a('object');
        expect(respData).to.have.property('GetLowestOfferListingsForASINResult');
        var reslData = respData.GetLowestOfferListingsForASINResult;
        expect(reslData).to.be.a('array');
        expect(reslData[0]).to.have.property('A$');
        expect(reslData[0]['A$']).to.be.a('object');
        expect(reslData[0]['A$']).to.have.property('ASIN', prodID);
        done();
      });
    });

    it("should get (GetMyPriceForASIN) seller's price for " + prodID, function(done) {
      app.myPriceForASIN({asinList: [prodID]}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetMyPriceForASINResponse');
        var respData = data.GetMyPriceForASINResponse;
        expect(respData).to.be.a('object');
        expect(respData).to.have.property('GetMyPriceForASINResult');
        var reslData = respData.GetMyPriceForASINResult;
        expect(reslData).to.be.a('array');
        expect(reslData[0]).to.have.property('A$');
        expect(reslData[0]['A$']).to.be.a('object');
        expect(reslData[0]['A$']).to.have.property('ASIN', prodID);
        done();
      });
    });

    it("should get (GetProductCategoriesForASIN) parent categories for " + prodID, function(done) {
      app.productCategoriesForASIN({asin: prodID}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetProductCategoriesForASINResponse');
        var respData = data.GetProductCategoriesForASINResponse;
        expect(respData).to.be.a('object');
        expect(respData).to.have.property('GetProductCategoriesForASINResult');
        var reslData = respData.GetProductCategoriesForASINResult;
        expect(reslData).to.be.a('array');
        expect(reslData[0]).to.have.property('Self');
        expect(reslData[0]['Self']).to.be.a('object');
        done();
      });
    });
  }

});