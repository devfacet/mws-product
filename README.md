# MWS Product

[![NPM][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

MWS Product is a module for retrieving product information via Amazon MWS API.

## Installation

```bash
npm install mws-product
```

## Usage

### Service Status

```javascript
var mwsProd = require('mws-product');
var app     = mwsProd({marketplace: 'US'});

app.serviceStatus(function(err, data) {
  if(!err) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(err);
  }
});

// Output
/*
{
  "GetServiceStatusResponse": {
    "A$": {
      "xmlns": "http://mws.amazonservices.com/schema/Products/2011-10-01"
    },
    "GetServiceStatusResult": {
      "Status": "GREEN",
      "Timestamp": "2014-04-21T02:56:09.178Z"
    },
    "ResponseMetadata": {
      "RequestId": "7f5..."
    }
  }
}
*/
```

### Matching Product For Id

```javascript
var mwsProd = require('mws-product');
var app     = mwsProd({auth: {sellerId: 'SELLERID', accessKeyId: 'ACCESSKEYID', secretKey: 'SECRETKEY'}, marketplace: 'US'});

app.matchingProductForId({idType: 'ASIN', idList: ['B00863WC40','B008648946']}, function(err, data) {
  if(!err) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(err);
  }
});

// Output
/*
{
  "GetMatchingProductForIdResponse": {
    "A$": {
      "xmlns": "http://mws.amazonservices.com/schema/Products/2011-10-01"
    },
    "GetMatchingProductForIdResult": [
      {
        "A$": {
          "Id": "B00863WC40",
          "IdType": "ASIN",
          "status": "Success"
        },
        "Products": {
          "A$": {
            "xmlns": "http://mws.amazonservices.com/schema/Products/2011-10-01",
            "xmlns:ns2": "http://mws.amazonservices.com/schema/Products/2011-10-01/default.xsd"
          },
          "Product": {
            "Identifiers": {
              "MarketplaceASIN": {
                "MarketplaceId": "ATVPDKIKX0DER",
                "ASIN": "B00863WC40"
              }
            },
            "AttributeSets": {
              "ns2:ItemAttributes": {
                "A$": {
                  "xml:lang": "en-US"
                },
                "ns2:Binding": "Toy",
                "ns2:Brand": "The Bridge Direct",
                "ns2:Feature": [
                  "Includes Bilbo, Thorin, Dwalin, Kili and Fili characters",
                  "Featuring Authentic detail from the Movie - The Hobbit: The Unexpected Journey",
                  "Each Figure contains up to 10 points of articulation and replicates the facial features, clothing, weapons and accessories of the character",
                  "Approximately 3.75\" tall"
                ],
                "ns2:ItemDimensions": {
                  "ns2:Height": {
                    "C$": "3.75",
                    "A$": {
                      "Units": "inches"
                    }
                  },
                  "ns2:Length": {
                    "C$": "0.50",
                    "A$": {
                      "Units": "inches"
                    }
                  },
                  "ns2:Width": {
                    "C$": "2.00",
                    "A$": {
                      "Units": "inches"
                    }
                  },
                  "ns2:Weight": {
                    "C$": "0.31",
                    "A$": {
                      "Units": "pounds"
                    }
                  }
                },
                "ns2:IsAdultProduct": "false",
                "ns2:IsAutographed": "false",
                "ns2:IsMemorabilia": "false",
                "ns2:Label": "The Bridge Direct",
                "ns2:Languages": {
                  "ns2:Language": {
                    "ns2:Name": "english",
                    "ns2:Type": "Unknown"
                  }
                },
                "ns2:ListPrice": {
                  "ns2:Amount": "34.99",
                  "ns2:CurrencyCode": "USD"
                },
                "ns2:Manufacturer": "The Bridge Direct",
                "ns2:ManufacturerMaximumAge": {
                  "C$": "180",
                  "A$": {
                    "Units": "months"
                  }
                },
                "ns2:ManufacturerMinimumAge": {
                  "C$": "48",
                  "A$": {
                    "Units": "months"
                  }
                },
                "ns2:Model": "16061",
                "ns2:PackageDimensions": {
                  "ns2:Height": {
                    "C$": "2.70",
                    "A$": {
                      "Units": "inches"
                    }
                  },
                  "ns2:Length": {
                    "C$": "15.10",
                    "A$": {
                      "Units": "inches"
                    }
                  },
                  "ns2:Width": {
                    "C$": "7.10",
                    "A$": {
                      "Units": "inches"
                    }
                  },
                  "ns2:Weight": {
                    "C$": "0.75",
                    "A$": {
                      "Units": "pounds"
                    }
                  }
                },
                "ns2:PackageQuantity": "1",
                "ns2:PartNumber": "BD16061",
                "ns2:ProductGroup": "Toy",
                "ns2:ProductTypeName": "TOYS_AND_GAMES",
                "ns2:Publisher": "The Bridge Direct",
                "ns2:ReleaseDate": "2012-10-01",
                "ns2:SmallImage": {
                  "ns2:URL": "http://ecx.images-amazon.com/images/I/51BFb%2BnQOdL._SL75_.jpg",
                  "ns2:Height": {
                    "C$": "75",
                    "A$": {
                      "Units": "pixels"
                    }
                  },
                  "ns2:Width": {
                    "C$": "69",
                    "A$": {
                      "Units": "pixels"
                    }
                  }
                },
                "ns2:Studio": "The Bridge Direct",
                "ns2:Title": "The Bridge Direct Hobbit Hero Pack - Bilbo, Thorin, Dwalin, Kili and Fili 3.75\" Figure Box Set",
                "ns2:Warranty": "No Warranty"
              }
            },
            "Relationships": "",
            "SalesRankings": {
              "SalesRank": {
                "ProductCategoryId": "toy_display_on_website",
                "Rank": "20775"
              }
            }
          }
        }
      },
      {
        "A$": {
          "Id": "B008648946",
          "IdType": "ASIN",
          "status": "Success"
        },
        "Products": {
          "A$": {
            "xmlns": "http://mws.amazonservices.com/schema/Products/2011-10-01",
            "xmlns:ns2": "http://mws.amazonservices.com/schema/Products/2011-10-01/default.xsd"
          },
          "Product": {
            "Identifiers": {
              "MarketplaceASIN": {
                "MarketplaceId": "ATVPDKIKX0DER",
                "ASIN": "B008648946"
              }
            },
            "AttributeSets": {
              "ns2:ItemAttributes": {
                "A$": {
                  "xml:lang": "en-US"
                },
                "ns2:Binding": "Toy",
                "ns2:Brand": "The Bridge Direct",
                "ns2:Edition": "1st",
                "ns2:Feature": [
                  "Each figure contains up to 10 points of articulation and replicates the facial features, clothing, weapons and accessories of the character",
                  "Featuring authentic detail from the movie - The Hobbit: An Unexpected Journey",
                  "Measures 3.75\" tall",
                  "Includes Legolas and Tauriel characters"
                ],
                "ns2:ItemDimensions": {
                  "ns2:Height": {
                    "C$": "3.50",
                    "A$": {
                      "Units": "inches"
                    }
                  },
                  "ns2:Length": {
                    "C$": "0.50",
                    "A$": {
                      "Units": "inches"
                    }
                  },
                  "ns2:Width": {
                    "C$": "2.00",
                    "A$": {
                      "Units": "inches"
                    }
                  },
                  "ns2:Weight": {
                    "C$": "0.22",
                    "A$": {
                      "Units": "pounds"
                    }
                  }
                },
                "ns2:IsAdultProduct": "false",
                "ns2:Label": "The Bridge Direct",
                "ns2:Languages": {
                  "ns2:Language": {
                    "ns2:Name": "english",
                    "ns2:Type": "Unknown"
                  }
                },
                "ns2:ListPrice": {
                  "ns2:Amount": "16.99",
                  "ns2:CurrencyCode": "USD"
                },
                "ns2:Manufacturer": "The Bridge Direct",
                "ns2:ManufacturerMaximumAge": {
                  "C$": "180",
                  "A$": {
                    "Units": "months"
                  }
                },
                "ns2:ManufacturerMinimumAge": {
                  "C$": "48",
                  "A$": {
                    "Units": "months"
                  }
                },
                "ns2:Model": "16014",
                "ns2:PackageDimensions": {
                  "ns2:Height": {
                    "C$": "1.81",
                    "A$": {
                      "Units": "inches"
                    }
                  },
                  "ns2:Length": {
                    "C$": "9.61",
                    "A$": {
                      "Units": "inches"
                    }
                  },
                  "ns2:Width": {
                    "C$": "8.19",
                    "A$": {
                      "Units": "inches"
                    }
                  },
                  "ns2:Weight": {
                    "C$": "0.22",
                    "A$": {
                      "Units": "pounds"
                    }
                  }
                },
                "ns2:PackageQuantity": "1",
                "ns2:PartNumber": "BD16014",
                "ns2:ProductGroup": "Toy",
                "ns2:ProductTypeName": "TOYS_AND_GAMES",
                "ns2:Publisher": "The Bridge Direct",
                "ns2:ReleaseDate": "2012-10-01",
                "ns2:SmallImage": {
                  "ns2:URL": "http://ecx.images-amazon.com/images/I/51B%2B4-5hW2L._SL75_.jpg",
                  "ns2:Height": {
                    "C$": "68",
                    "A$": {
                      "Units": "pixels"
                    }
                  },
                  "ns2:Width": {
                    "C$": "75",
                    "A$": {
                      "Units": "pixels"
                    }
                  }
                },
                "ns2:Studio": "The Bridge Direct",
                "ns2:Title": "The Bridge Direct Hobbit 3.75\" Adventure: Legolas and Tauriel - Wave 1, Pack of 2",
                "ns2:Warranty": "No Warranty"
              }
            },
            "Relationships": "",
            "SalesRankings": {
              "SalesRank": {
                "ProductCategoryId": "toy_display_on_website",
                "Rank": "24762"
              }
            }
          }
        }
      }
    ],
    "ResponseMetadata": {
      "RequestId": "b4d..."
    }
  }
}
*/
```

### Full test

Create a JSON file (ex. `auth.json`) like below;

```JSON
{
  "sellerId": "SELLERID",
  "accessKeyId": "ACCESSKEYID",
  "secretKey": "SECRETKEY"
}
```
```bash
node node_modules/mocha/bin/mocha --reporter spec test/test-all.js --auth-json ../auth.json
```

## Implementations

- [x] GetServiceStatus
- [x] ListMatchingProducts
- [x] ~~GetMatchingProduct~~
- [x] GetMatchingProductForId
- [x] GetCompetitivePricingForSKU
- [x] GetCompetitivePricingForASIN
- [x] GetLowestOfferListingsForSKU
- [x] GetLowestOfferListingsForASIN
- [x] GetMyPriceForSKU
- [x] GetMyPriceForASIN
- [x] GetProductCategoriesForSKU
- [x] GetProductCategoriesForASIN

## License

Licensed under The MIT License (MIT)  
For the full copyright and license information, please view the LICENSE.txt file.

[npm-url]: http://npmjs.org/package/mws-product
[npm-image]: https://badge.fury.io/js/mws-product.svg

[travis-url]: https://travis-ci.org/devfacet/mws-product
[travis-image]: https://travis-ci.org/devfacet/mws-product.svg?branch=master
