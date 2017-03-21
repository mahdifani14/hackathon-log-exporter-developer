'use strict';

const fs = require('fs');
const readline = require('readline');
const flat = require('flat');
const instream = fs.createReadStream('../data/sample.log');
const rl = readline.createInterface(instream, null);
const _uniq = require('lodash.uniq');

var keys = [];

rl.on('line', function(line) {

    var jsonObject, flattenJsonObject;
    var values = [];

    try {
        /**
         * To access the pure JSON object, I prune the repeated date info at the beginning of each line and
         * then create the flatten JSON object by using a 3rd-party NodeJs module.
         * Afterwards, I collect the keys of each object and remove the duplicates.
         */
        jsonObject = line.replace(/.* {/i, '{');
        flattenJsonObject = flat(JSON.parse(jsonObject));
        keys = _uniq(keys.concat(Object.keys(flattenJsonObject)));

        /**
         * Get the values and save them into the CSV file
         * I consider empty space value for those keys that are not presented to be consistent with CSV style and put them
         * in a right column at the end.
         */
        keys.forEach((key) => {
            if (flattenJsonObject[key])
                values.push(flattenJsonObject[key]);
            else
                values.push(' ');
        })

        values = values.join(',');

        fs.appendFile('./sampleLog.csv', `${values}\n`, (err) => {
            if (err) throw err;
        });

    } catch (error) {
        console.error(error);
    }
});

rl.on('close', function() {

    /**
     *  Putting the keys string at the beginning of the file to have them as the table headers
     */
    try {
        fs.readFile('./sampleLog.csv', function(err, data) {
            if (err)
                throw err
            fs.writeFile('./sampleLog.csv', `${keys}\n`, (err) => {
                if (err)
                    throw err
                fs.appendFile('./sampleLog.csv', data, (err) => {
                    if (err)
                        throw err
                });
            });
        });

    } catch (error) {
        console.error(error);
    }

    console.log('Finished reading file');
});
