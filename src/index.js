const _ = require('lodash');
const request = require('request-promise');

export class Enrichment {
  constructor({
    src = {},
    normalizedInput = {},
    normalizedOutput = [],
    params = {},
  } = {}) {
    this.src = src;
    this.normalizedInput = normalizedInput;
    this.normalizedOutput = normalizedOutput;
    this.params = params;
  }

  connect() {}

  disconnect() {}

  querySource() {
    throw new Error('Not implemented.');
  }

  normalize() {
    throw new Error('Not implemented.');
  }

  enrich() {
    this.connect();

    const input = {};
    _.forOwn(this.normalizedInput, (path, key) => {
      input[key] = _.get(this.src, path);
    });

    return this.querySource(input)
      .then((result) => {
        this.disconnect();

        let output = {};
        _.forEach(this.normalizedOutput, (key) => {
          output = _.set(output, key, this.normalize(result));
        });

        return output;
      });
  }
}

export class ArcGISServiceEnrichment extends Enrichment {
  constructor({
    src = {},
    normalizedInput = {},
    normalizedOutput = [],
    params = {},
  } = {}) {
    super({ src, normalizedInput, normalizedOutput, params });

    // merge in defaults
    this.params = _.merge({
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
        f: 'json',
      },
      json: true,
    }, params);
  }

  // eslint-disable-next-line
  querySource(input) {
    this.params.qs.geometry = `${input.longitude},${input.latitude}`;

    return request(this.params)
      .then(res => res.features);
  }
}
