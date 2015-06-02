/// <reference path="../typings/mocha/mocha.d.ts"/>
var expect = require('chai').expect;
var path = require('path');

var Vault = require('./../index.js');

describe('Vault database module', function() {

  var db;

  beforeEach(function() {
    db = new Vault(path.resolve('./test/fixtures/vault.db'));
  });

  it('Should be an instance of Vault', function() {
    expect(db).to.be.an.instanceof(Vault);
  });

  it('Should return data when the load function is called', function(done) {

    db.load().then(
        function(result) {
          expect(result.test).to.equal('example');
          done();
        },

        function(err) {
          done(err);
        }

    ).done(null, done);

  });

  it('the promise should handle the parse error', function(done) {

    db = new Vault(path.resolve('./test/fixtures/fail.db'));

    db.load().catch(function(err) {
      expect(err).to.be.defined;
      done();
    }).done(null, done);
  });

  it('should return a value using the key', function(done) {

    db.load().then(
        function(result) {

          expect(db.get('test')).to.equal('example');
          expect(db.get('test1')).to.equal('example1');
          expect(db.get('adscasdcsacdasdcasdcdsc')).to.equal(null);

          done();
        },

        function(err) {
          done(err);
        }

    ).done(null, done);

  });

  it('should set the value in memory and store to the db file', function(done) {
    db.load()
    .then(function(data) {
      return db.set('cat', {name: 'Bilbo'});
    }).then(function(newData) {
      expect(newData.key).to.equal('cat');
      expect(newData.value.name).to.equal('Bilbo');
      expect(db.get('cat').name).to.equal('Bilbo');
      done();
    }).done(null, done);
  });

  it('should delete the object', function(done) {

    db.load()
    .then(function(data) {
      return db.set('person', {name: 'pete'});
    })
    .then(function(newData) {
      return db.delete('person');
    })
    .then(function() {
      var result = db.get('pete');

      expect(result).to.equal(null);
      done();
    })
    .done(null, done);
  });

});
