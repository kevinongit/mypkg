import * as _ from 'lodash';
import * as moment from 'moment';

const callers = require('./caller.json');
const traces = require('./trace.json');

// console.log('callers = ' + JSON.stringify(callers));
// let id = _.uniqueId('TID_');
// console.log('id = ' + id);
let aCaller = _.sample(callers);
let aTrace = _.sample(traces);
let tid = 'TID_' + moment(new Date()).format('YYYYMMDDHHmmss');

console.log('selected caller ' + JSON.stringify(aCaller));
console.log('selected trace ' + JSON.stringify(aTrace));

let aRecord = { "tid" : tid };
_.merge(aRecord, aCaller);
_.merge(aRecord, aTrace);

console.log('aRecord : ' + JSON.stringify(aRecord));





console.log('tid = ' + tid);