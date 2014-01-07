var utils = (function() {
    "use strict";

    return {
        convertApiToJsDate: function(apiDate) {
            var parts = apiDate.split('-');
            if (parts.length === 2) {
                parts.push('01');
            }
            if (parts.length !== 3) {
                throw 'Invalid API date: ' + apiDate;
            }
            return new Date(parts[0], (parts[1] - 1), parts[2]);
        },
        convertJsToApiDate: function(jsDate, type) {
            type = type || 'day';
            switch (type) {
                case 'day':
                    return jsDate.getFullYear() + '-' + utils.twoDigits(jsDate.getMonth() + 1) + '-' + utils.twoDigits(jsDate.getDate());
                case 'month':
                    return jsDate.getFullYear() + '-' + utils.twoDigits(jsDate.getMonth() + 1);
                default:
                    throw 'Invalid type for API date';
            }
            
        },
        offsetMonth: function(date, offset) {
            var dateCopy = new Date(date.getTime());
            dateCopy.setMonth(dateCopy.getMonth() + offset);
            return dateCopy;
        },
        offsetDay: function(date, offset) {
            var dateCopy = new Date(date.getTime());
            dateCopy.setDate(dateCopy.getDate() + offset);
            return dateCopy;
        },
        twoDigits: function(number) {
            return (number < 10) ? '0'+number : number;
        }
    };
})();