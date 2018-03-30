'use strict';

const _ = require('lodash');

class Enrichment {
  constructor() {}

  connect() {}

  disconnect() {}

  querySource() {
    throw new Error('Not implemented.');
  }

  enrich(src) {
    this.connect();
    return this.querySource(inputParams).then(result => {
      this.disconnect();
      return result;
    });
  }
}

class ArcGISServiceEnrichment extends Enrichment {
  constructor(params) {
    super();

    // merge in defaults
    this.params = _.merge({a
      qs: {
        text: '',
        geometryType: 'esriGeometryPoint',
        inSr: 4326,
        spatialRel: 'esriSpatialRelIntersects',
        relationParam: '',
        objectIds: '',
        where: '',
        time: '',
        returnCountOnly: false,
        returnIdsOnly: false,
        returnGeometry: false,
        maxAllowableOffset: '',
        outSR: 4326,
        outFields: '*',
        f: 'json'
      },
      json: true
    }, params);
  }

  // eslint-disable-next-line
  querySource() {
    this.params.qs.geometry = `${inputParams.address.longitude},${inputParams.address.latitude}`;

    return request(this.params).then(res => res.features);
  }
}

class ParcelEnrichmentRichmond extends ArcGISServiceEnrichment {
  constructor() {
    super();
  }

  querySource(src) {
    let deferred = Promise.defer();

    setTimeout(() => {
      deferred.resolve({
        meta: {
          extra_data: 'My extra data'
        }
      });
    }, 1000);

    return deferred.promise;
  }
}

exports = module.exports = function () {
  return new RichmondParcelEnrichment();
};
