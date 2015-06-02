var fs = require('fs');
var q = require('q');

'use strict';

/**
 * [Vault description]
 * @param {[type]} path [description]
 */
function Vault(path) {
  this.path = path;
  this.loaded = false;
  this._records = {};

  //
  this._writeStream = fs.createWriteStream(this.path, {
    encoding: 'utf8',
    flags: 'a'
  });
}

/**
 * [load description]
 * @return {[type]} [description]
 */
Vault.prototype.load = function() {
  var defer = q.defer();

  if (!this.loaded) {

    var _this = this;
    var stream = fs.createReadStream(_this.path, { encoding: 'utf8' });
    var data = '';
    var records;
    var record;

    //
    //
    stream.on('readable', function() {

      data += stream.read();

      // split the records by new line
      records = data.split('\n');

      // remove the last entry from the db file as it is a blank line
      data = records.pop();

      for (var i = 0; i < records.length; i++) {

        try {

          record = JSON.parse(records[i]);

          // if the value is null delete it from memory, otherwise
          // store the value by its key in the '_records' object
          if (!record.value) {
            delete _this._records[record.key];
          } else {
            _this._records[record.key] = record.value;
          }

        } catch (e) {
          // catach the JSON parse error and reject the promise with the error
          defer.reject(e);
        }

      }

    });

    // when the data is read and parsed, set the loaded to true
    // to ensure the db file is only read once and resolve the
    // promise with the db records
    stream.on('end', function() {
      _this.loaded = true;
      defer.resolve(_this._records);
    });

    // if there is an error with the stream reject the promise
    stream.on('error', function(err) {
      defer.reject(err);
    });

  } else {
    // database is already loaded so return records
    defer.resolve(this._records);
  }

  return defer.promise;
};

/**
 * [get description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
Vault.prototype.get = function(key) {
  return this._records[key] || null;
};

/**
 * [set description]
 * @param {[type]} key   [description]
 * @param {[type]} value [description]
 */
Vault.prototype.set = function(key, value) {
  var defer = q.defer();

  // create an object with the key and value properties
  var obj = { key: key, value: value};

  // if the value is null delete it from memory, otherwise
  // store the value by its key in the '_records' object
  if (!value) {
    delete this._records[key];
  } else {
    this._records[key] = value;
  }

  // when the data is written to the db file
  // resolve the promise with the object inserted
  this._writeStream.write(JSON.stringify(obj) + '\n', function() {
    defer.resolve(obj);
  });

  // return the promise
  return defer.promise;
};

/**
 * [delete description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
Vault.prototype.delete = function(key) {
  return this.set(key, null);
};

module.exports = Vault;
