// Init reqs
/* jslint node: true */
/* global describe: false */
/* global it: false */
'use strict';

var mwsProd = require('../'),
    utilex  = require('utilex'),
    expect  = require('chai').expect
;

// Tests

// Test for the module
describe('mwsProd', function() {

  var auth       = {sellerId: 'SELLERID', accessKeyId: 'ACCESSKEYID', secretKey: 'SECRETKEY'},
      mplace     = 'US',
      appMWSProd // mwsProd instance
  ;

  if(utilex.tidyArgs().testDEV !== undefined && utilex.tidyArgs().authJSON)
    auth = require(utilex.tidyArgs().authJSON);

  appMWSProd = mwsProd({auth: auth, marketplace: mplace});

  it('should get service status ', function(done) {
    appMWSProd.serviceStatus(function(err, data) {
      if(err) {
        done(err.message);
        return;
      }

      expect(data).to.have.property('GetServiceStatusResponse');
      var gssr = data.GetServiceStatusResponse;
      expect(gssr).to.be.a('object');
      expect(gssr).to.have.property('GetServiceStatusResult');
      expect(gssr.GetServiceStatusResult).to.be.a('object');
      expect(gssr.GetServiceStatusResult).to.have.property('Status');
      expect(gssr.GetServiceStatusResult.Status).to.be.a('string');
      done();
    });
  });

  if(auth.sellerId && auth.sellerId !== 'SELLERID') {

    var prodID = 'B00863WC40';

    it('should query a list of matching products for ' + prodID, function(done) {
      appMWSProd.matchingProducts({query: 'B00863WC40', queryContextId: 'All'}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('ListMatchingProductsResponse');
        var gmpfiresp = data.ListMatchingProductsResponse;
        expect(gmpfiresp).to.be.a('object');
        expect(gmpfiresp).to.have.property('ListMatchingProductsResult');
        var gmpfires = gmpfiresp.ListMatchingProductsResult;
        expect(gmpfires).to.be.a('array');
        expect(gmpfires[0]).to.have.property('Products');
        expect(gmpfires[0]['Products']).to.be.a('object');
        done();
      });
    });

    it('should get matching products for ' + prodID, function(done) {
      appMWSProd.matchingProductForId({idType: 'ASIN', idList: [prodID]}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetMatchingProductForIdResponse');
        var gmpfiresp = data.GetMatchingProductForIdResponse;
        expect(gmpfiresp).to.be.a('object');
        expect(gmpfiresp).to.have.property('GetMatchingProductForIdResult');
        var gmpfires = gmpfiresp.GetMatchingProductForIdResult;
        expect(gmpfires).to.be.a('array');
        expect(gmpfires[0]).to.have.property('A$');
        expect(gmpfires[0]['A$']).to.be.a('object');
        expect(gmpfires[0]['A$']).to.have.property('Id', prodID);
        done();
      });
    });

    it('should get matching product for ' + prodID, function(done) {
      appMWSProd.matchingProduct({ASINList: [prodID]}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetMatchingProductResponse');
        var gmpfiresp = data.GetMatchingProductResponse;
        expect(gmpfiresp).to.be.a('object');
        expect(gmpfiresp).to.have.property('GetMatchingProductResult');
        var gmpfires = gmpfiresp.GetMatchingProductResult;
        expect(gmpfires).to.be.a('array');
        expect(gmpfires[0]).to.have.property('A$');
        expect(gmpfires[0]['A$']).to.be.a('object');
        expect(gmpfires[0]['A$']).to.have.property('ASIN', prodID);
        done();
      });
    });    

    it('should get competitive pricing for ' + prodID, function(done) {
      appMWSProd.competitivePricingForAsin({ASINList: [prodID]}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetCompetitivePricingForASINResponse');
        var gmpfiresp = data.GetCompetitivePricingForASINResponse;
        expect(gmpfiresp).to.be.a('object');
        expect(gmpfiresp).to.have.property('GetCompetitivePricingForASINResult');
        var gmpfires = gmpfiresp.GetCompetitivePricingForASINResult;
        expect(gmpfires).to.be.a('array');
        expect(gmpfires[0]).to.have.property('A$');
        expect(gmpfires[0]['A$']).to.be.a('object');
        expect(gmpfires[0]['A$']).to.have.property('ASIN', prodID);
        done();
      });
    });

    it('should get lowest offer listings for ' + prodID, function(done) {
      appMWSProd.lowestOfferListingsForAsin({ASINList: [prodID]}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetLowestOfferListingsForASINResponse');
        var gmpfiresp = data.GetLowestOfferListingsForASINResponse;
        expect(gmpfiresp).to.be.a('object');
        expect(gmpfiresp).to.have.property('GetLowestOfferListingsForASINResult');
        var gmpfires = gmpfiresp.GetLowestOfferListingsForASINResult;
        expect(gmpfires).to.be.a('array');
        expect(gmpfires[0]).to.have.property('A$');
        expect(gmpfires[0]['A$']).to.be.a('object');
        expect(gmpfires[0]['A$']).to.have.property('ASIN', prodID);
        done();
      });
    });

    it("should return seller's pricing info for " + prodID, function(done) {
      appMWSProd.myPriceForAsin({ASINList: [prodID]}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetMyPriceForASINResponse');
        var gmpfiresp = data.GetMyPriceForASINResponse;
        expect(gmpfiresp).to.be.a('object');
        expect(gmpfiresp).to.have.property('GetMyPriceForASINResult');
        var gmpfires = gmpfiresp.GetMyPriceForASINResult;
        expect(gmpfires).to.be.a('array');
        expect(gmpfires[0]).to.have.property('A$');
        expect(gmpfires[0]['A$']).to.be.a('object');
        expect(gmpfires[0]['A$']).to.have.property('ASIN', prodID);
        done();
      });
    });

    it("should return parent categories for " + prodID, function(done) {
      appMWSProd.productCategoriesForAsin({ASIN: prodID}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('GetProductCategoriesForASINResponse');
        var gmpfiresp = data.GetProductCategoriesForASINResponse;
        expect(gmpfiresp).to.be.a('object');
        expect(gmpfiresp).to.have.property('GetProductCategoriesForASINResult');
        var gmpfires = gmpfiresp.GetProductCategoriesForASINResult;
        expect(gmpfires).to.be.a('array');
        expect(gmpfires[0]).to.have.property('Self');
        expect(gmpfires[0]['Self']).to.be.a('object');
        done();
      });
    });  
  }
});