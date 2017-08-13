import * as _ from 'lodash';
import * as moment from 'moment';
import * as fs from 'fs';
import * as readlineSync from 'readline-sync';

// reference : http://chamnapchhorn.blogspot.kr/2008/07/trick-to-use-static-variables-in.html
let getTid = (function() {
    let id = 0;
    let date = moment(new Date()).format('YYYYMMDDHHmmss');
    return function() { 
        let date2 = moment(new Date()).format('YYYYMMDDHHmmss');
        if (date2 === date) {
            id++;
        } else {
            date = date2;
        }
        return "TID_" + date + "-" + _.padStart(id.toString(), 5, '0');
     }
})();

let writeToFile = function(fname:string, recs :any[]) {
    let date = moment(new Date()).format('YYYYMMDDHHmmss');
    fs.writeFile(fname+"-"+date, JSON.stringify(recs), (err) => {
        if (err) throw err;
        console.log('result file created : ' + fname);
    });
}

let getConfigFileName = function() {
    let fname = readlineSync.question('Enter config file name : ');
    return fname.indexOf('/') > 0 ? fname : "./" + fname;
}

let writeToFile2 = function(name:string, recs :any[]) {
    let fname = name + "-" + moment(new Date()).format('YYYYMMDDHHmmss') + ".json";
    let out = fs.createWriteStream(fname);

    out.once('open', (fd) => {
        out.write(JSON.stringify(recs));
        // _.map(recs, (record) => {
        //     out.write(JSON.stringify(record));
        //     out.write("\n");
        // });
        out.end();
        console.log('result file created : ' + fname);
    });
}

// {
//     let i=getTid();
//     console.log('i = ' + i);
//     i=getTid();
//     console.log('i = ' + i);
//     i=getTid();
//     console.log('i = ' + i);
//     i=getTid();
//     console.log('i = ' + i);
//     i=getTid();
//     console.log('i = ' + i);
// }


const fname = getConfigFileName();
const config = require(fname);
console.log('fname = ' + fname);

let datas: any[] = _.map(config.jsonFiles, (fname) => {
    return require(config.jsonDir + fname);
});

let tid;

let records = _.times(parseInt(config.genCount), () => {
    tid = getTid();
    let extracted = _.map(datas, (data) => {
        return _.sample(data);
    });
    let tmp2={};
    _.map(extracted, (item) => {
        _.assign(tmp2, item);
    })

    return _.assign({"tid": tid }, tmp2);
});

console.log('records.length = ' + records.length);
_.map(records, (record) => {
    console.log(JSON.stringify(record));
})

writeToFile2(config.outFile, records);
// const callers = require('./caller.json');
// const traces = require('./trace.json');

// // console.log('callers = ' + JSON.stringify(callers));
// // let id = _.uniqueId('TID_');
// // console.log('id = ' + id);
// let aCaller = _.sample(callers);
// let aTrace = _.sample(traces);
// let tid = 'TID_' + moment(new Date()).format('YYYYMMDDHHmmss');

// console.log('selected caller ' + JSON.stringify(aCaller));
// console.log('selected trace ' + JSON.stringify(aTrace));

// let aRecord = { "tid" : tid };
// _.merge(aRecord, aCaller);
// _.merge(aRecord, aTrace);

// console.log('aRecord : ' + JSON.stringify(aRecord));





// console.log('tid = ' + tid);