'use strict';

const fs = require('fs');
const readline = require('readline');

const instream = fs.createReadStream('../data/sample.log');
const rl = readline.createInterface(instream, null);

rl.on('line', function(line) {
	console.log(`Read line ${line}`);
});

rl.on('close', function() {
	console.log('Finished reading file');
});
