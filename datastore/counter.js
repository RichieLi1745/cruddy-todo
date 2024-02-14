const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
      //console.log('number: ', Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });

};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  //save counter to hard drive
  //first read counter to make sure there is an existing, and err if not using error first callback
  readCounter((err, count)=> {
    if (err) {
      //console.log('Reading error: counter file: ', err);
      return callback(err);
    }
    //increment counter
    count++;
    //write counter to counterFile returning counterString from the callback while using error first callback
    writeCounter(count, (err, counterString)=> {
      if (err) {
        //console.log('Writing error: counter file: ', err);
        return callback(err);
      }
      //console.log('counter: ', counterString);
      //return error set to null with successful data as second argument
      callback(null, counterString);
    });

  });
  //write it to the file in hard drive

  /*counter = counter + 1;
  return zeroPaddedNumber(counter);*/
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
