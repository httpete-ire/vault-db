# Vault

Vault is an in-memory storage that also gets saved to a file using a writeable stream. When new data is saved to the db it is saved in a collection and written to a db file.

This is an experiment to learn streams and promises so **DO NOT USE** in production...

#Documentation

* [Vault](#vault)
* [Load](#load)
* [Get](#get)
* [Set](#set)
* [Delete](#delete)
* [Search](#search)

##<a name="vault"></a>Vault

The constructor takes a path to a .db file to load into memory

````
var db = new Vault('./db/vault.db');

````


##<a name="load"></a>load()

Load the .db file into the _records collection. Returns a promise with the database records.

**example**

````
db.load().then(function(records) {
  console.log(records);
});

````

##<a name="get"></a>get(key)


Return a result from the collection using a 'key', if a result is not found null is returned.

````
db.get(String key);
````

**example**

````
var person = db.get('person');

console.log(person); // { name: 'John', gender: 'male' }


````

##<a name="set"></a>set(key, value)

Set a record in the db by a 'key' and 'value'. If value is set to
null it will delete the object reference from the in-memory db.
The data is also persisted in a .db file.

**example**

````
var car = { make: 'BMW', price: 50000 };

db.set('car', car).then(function(newRecord) {
  console.log(newRecord); // { make: 'BMW', price: 50000 }
});
````

##<a name="delete"></a>delete(key)

A convenience method for deleting a record from the collection and set
its value to null in the .db file. A promise is returned with the record that was deleted

**example**

````
db.delete('car').then(function(deletedRecord) {
  console.log(deletedRecord);
});

````

##<a name="search"></a>search(queryType, queryValue)

Search the collection of records for a match according to the queryType and queryValue. Return the first match or return null if no object matches the query.

**example**

````
db.search('make', 'BMW').then(function(result) {
  console.log(result); //  { make: 'BMW', price: 50000 }
});

````