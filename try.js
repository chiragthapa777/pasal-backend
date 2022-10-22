const moment = require("moment")

var m = moment().utcOffset(0);
m.set({hour:23,minute:59,second:59,millisecond:59})
m.toISOString()
m.format()
console.log(m)