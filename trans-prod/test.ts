import * as _ from 'lodash';
import * as moment from 'moment';
import * as fs from 'fs';
import * as readlineSync from 'readline-sync';

// reference : http://chamnapchhorn.blogspot.kr/2008/07/trick-to-use-static-variables-in.html
let getTid = (function () {
    let id = 0;
    let date = moment(new Date()).format('YYYYMMDDHHmmss');
    return function () {
        let date2 = moment(new Date()).format('YYYYMMDDHHmmss');
        if (date2 === date) {
            id++;
        } else {
            date = date2;
        }
        return "TID_" + date + "-" + _.padStart(id.toString(), 5, '0');
    }
})();

let writeToFile = function (fname: string, recs: any[]) {
    let date = moment(new Date()).format('YYYYMMDDHHmmss');
    fs.writeFile(fname + "-" + date, JSON.stringify(recs), (err) => {
        if (err) throw err;
        console.log('result file created : ' + fname);
    });
}

let getConfigFileName = function () {
    let fname = readlineSync.question('Enter config file name : ');
    return fname.indexOf('/') > 0 ? fname : "./" + fname;
}

let writeToFile2 = function (name: string, recs: {}) {
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


let getRows = function (config: any) {
    
    let allMajorRows : any[][] = [];
    let allMinorRows : any[][] = [];
    let datas: any[] = _.map(config.jsonFiles, (fname) => {
        return require(config.jsonDir + fname);
    });
    let majorColumns = config.columns;
    let minorColumns: string[] = [];

    _.times(parseInt(config.genCount), () => {
        let majorRows : string[] = [], minorRows : string[] = [];
        let tmp1 = {};
        let extracted = _.map(datas, (data) => {
            return _.assign(tmp1, _.sample(data));
        });
        console.log('extracted = ' + JSON.stringify(extracted[0]));

        let row : string[];
        let extractedHash = extracted[0];
        console.log('extractedHash  = ' + extractedHash);
        // _.keys(extracted[0]).forEach((key) => {
        //     if (_.includes(config.columns, key)) {
        //         console.log('in key : ' + key + extractedHash.get);
        //     } else {
        //         console.log('out key : ' + key);
        //     }
        // });
        let keys = _.keys(extractedHash);
        let values : string[] = _.values(extractedHash);
        let coltmp = [];

        for (let i=0; i < keys.length; i++) {
            if (_.includes(config.columns, keys[i])) {
                majorRows.push(values[i]);
                
            } else {
                coltmp.push(keys[i]);
                minorRows.push(values[i]);
            }
        }

        if (minorColumns.length == 0) {
            minorColumns = coltmp;
        }

        allMajorRows.push(majorRows);
        allMinorRows.push(minorRows);
        console.log('keys = ' + JSON.stringify(keys));
        console.log('majorRows = ' + JSON.stringify(majorRows));
        console.log('minorRows = ' + JSON.stringify(minorRows));

        // return _.assign({"tid": tid }, tmp2);
    });

    // console.log('majorColumns = ' + JSON.stringify(majorColumns));
    // console.log('allMajorRows = ' + JSON.stringify(allMajorRows));
    // console.log('minorColumns = ' + JSON.stringify(minorColumns));
    // console.log('allMinorRows = ' + JSON.stringify(allMinorRows));

    return {
        "majorColumns": majorColumns,
        "allMajorRows": allMajorRows,
        "minorColumns": minorColumns,
        "allMinorRows": allMinorRows
    };
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



let ti = getRows(config);

console.log('majorColumns = ' + JSON.stringify(ti.majorColumns));
console.log('allMajorRows = ' + JSON.stringify(ti.allMajorRows));
console.log('minorColumns = ' + JSON.stringify(ti.minorColumns));
console.log('allMinorRows = ' + JSON.stringify(ti.allMinorRows));

writeToFile2(config.outFile, ti);

// let tid;

// let records = _.times(parseInt(config.genCount), () => {
//     tid = getTid();
//     let extracted = _.map(datas, (data) => {
//         return _.sample(data);
//     });
//     let tmp2={};
//     _.map(extracted, (item) => {
//         _.assign(tmp2, item);
//     })

//     return _.assign({"tid": tid }, tmp2);
// });

// console.log('records.length = ' + records.length);
// _.map(records, (record) => {
//     console.log(JSON.stringify(record));
// })

// writeToFile2(config.outFile, records);
