import { expect } from 'chai';

import {
  Enrichment,
  ArcGISServiceEnrichment,
  LambdaEnrichment,
} from '../src/';

describe('Enrichment', () => {
  it('should export constructor', () => {
    const e = new Enrichment();
    expect(e).to.be.an('object');
  });

  it('should override defaults', () => {
    const e = new Enrichment({
      src: { a: 'a' },
    });
    expect(e.src).to.deep.equal({
      a: 'a',
    });
  });

  it('should throw error when querySource notImplemented()', (done) => {
    const e = new Enrichment();
    try {
      e.querySource();
    } catch (err) {
      expect(err.message).to.equal('Not implemented.');
      done();
    }
  });

  it('should throw error when normalize notImplemented()', (done) => {
    const e = new Enrichment();
    try {
      e.normalize();
    } catch (err) {
      expect(err.message).to.equal('Not implemented.');
      done();
    }
  });
});

class ExampleEnrichment extends Enrichment {
  constructor({
    src = {},
    normalizedInput = {},
    normalizedOutput = [],
    params = {},
  } = {}) {
    super({ src, normalizedInput, normalizedOutput, params });
  }

  // takes input.field1 and multiples by 2
  querySource(input) {
    const d = new Promise((resolve) => {
      setTimeout(() => {
        resolve(input.field1 * 2);
      }, 10);
    });

    return d;
  }

  // lets convert to a string for example
  normalize(result) {
    return result.toString();
  }
}

describe('ExampleEnrichment', () => {
  it('should enrich', (done) => {
    const src = {
      a: 1,
    };

    const normalizedInput = {
      field1: 'a',
    };

    const normalizedOutput = ['output', 'output2'];

    const e = new ExampleEnrichment({ src, normalizedInput, normalizedOutput });

    e.enrich().then((result) => {
      expect(result.output).to.equal('2');
      expect(result.output2).to.equal('2');
      done();
    });
  });
});

describe('ArcGISServiceEnrichment', () => {
  it('should export constructor', () => {
    const e = new ArcGISServiceEnrichment();
    expect(e).to.be.an('object');
  });
});

describe('LambdaEnrichment', () => {
  it('should export constructor', () => {
    const e = new LambdaEnrichment();
    expect(e).to.be.an('object');
  });
});
