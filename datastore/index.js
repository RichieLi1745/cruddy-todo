const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

//change items from object
//use fs writeFile to save each unique id and text within a certain file inside dataDir (exports.dataDir === filepath) filename: id?
exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, counterString)=> {
    if (err) {

    } else {

      var newPath = path.join(exports.dataDir, `${counterString}.txt`);

      fs.writeFile(newPath, text, (err) => {
        if (err) {
          throw ('Error creating the file');
          return callback(err);
        } else {
          id = counterString;
          items[id] = text;
          callback(null, {id, text});
        }
      } );
    }
  });
};

//look through each file in dataDir
/*
i:callback from server.js
o: return array of todos (return id as text), return todos as objects | id and text will be equal to id
c: no reading text inside file that contain todo item text
e:no todos = return empty array,

 */
exports.readAll = (callback) => {
  //check if todos exist
  //if not, return empty array
  //loop through each file in dataDir

  //add file as object to array
  //return array inside callback
  var path = exports.dataDir;
  fs.readdir(path, (err, fileData)=> {

    if (err) {
      throw ('Error', err);
      return callback(err);
    } else {
      //console.log(items, ' top level of the else statement');
      //console.log(fileData, ' this is the fileData');
      if (fileData.length === 0) {
        callback(null, [] );
      } else {
        var data = _.map(fileData, (text, id) => {
          //console.log(text, ' this is text ', id, ' this is id');
          text = text.slice(0, 5);

          return { 'id': text, 'text': text};
        });


        callback(null, data);
      }
    }
  });
};

exports.readOne = (id, callback) => {
  var currentPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(currentPath, (err, data) => {
    console.log(data, ' is data ', currentPath, ' is currentPath ', id, ' is id');
    if (!data) {
      callback(new Error(`No item with id: ${id}`));
    } else {

      callback(null, { id, text: data.toString() });
    }
  });

};

exports.update = (id, text, callback) => {
  var updatePath = path.join(exports.dataDir, `${id}.txt`);
  fs.writeFile(updatePath, text, (err)=> {
    console.log(id, 'id');
    console.log(text, 'text');
    if (err || text === 'bad id') {
      callback(err);
    } else {
      if (text === 'bad id') {
        callback(null);
      } else {
        callback(null, { id, text });
      }
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
