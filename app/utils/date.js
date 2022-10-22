const moment = require("moment");

const todayDateRange = () => {
	var to = moment().utcOffset(0);
	to.set({ hour: 23, minute: 59, second: 59, millisecond: 59 });
	to.toISOString();
	to.format();
	var from = moment().utcOffset(0);
	from.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
	from.toISOString();
	from.format();
	return [from,to]
};

module.exports={
    todayDateRange
}

