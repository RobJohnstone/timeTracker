var ATT = ATT || {};

(function(ATT) {
	"use strict";

	ATT.applicationController = function(state) {
		var currentState = state || 'day';
		ATT.globalevents.on('applicationStateChange', function(event) {
			if (event.state !== currentState) {
				$('.'+currentState+'Container').hide();
				$('.'+event.state+'Container').show();
				currentState = event.state;
			}
		});
	};

})(ATT);

(function(ATT) {
	"use strict";

	var DayPage = function(date) {
		date = date || new Date();
		this._jContainer = $('.dayContainer');
		this._jDate = this._jContainer.find('.date');
		this._jDescription = this._jContainer.find('.dayDescription');
		this._setDate(date, function() {
			this._initialiseDom();
			this._initialiseEvents();
		}.bind(this));
	};

	DayPage.prototype._initialiseDom = function() {
		this._jDate.text(ATT.date.prettyDate(this._date));
		this._jDescription.val(this._dayObj.description);
		this._jDescription.focus();
	};

	DayPage.prototype._setDate = function(date, callback) {
		this._date = date;
		ATT.days.get(date, function(day) {
			this._dayObj = day;
			if (callback) callback();
		}.bind(this));
	};

	DayPage.prototype._initialiseEvents = function() {
		this._jDescription.on('change', this._handleDescriptionChange.bind(this));
		ATT.globalevents.on('dateChanged', this._handleDateChanged.bind(this));
	};

	DayPage.prototype._removeEvents = function() {
		this._jDescription.off();
		ATT.globalevents.off('dateChanged', this._handleDateChanged);
	};

	DayPage.prototype._handleDateChanged = function(event) {
		this.changeDate(event.date);
	};

	DayPage.prototype.changeDate = function(date) {
		this._setDate(date, function() {
			this._initialiseDom(date);
		}.bind(this));
	};

	DayPage.prototype._handleDescriptionChange = function(event) {
		var target = $(event.currentTarget),
			date = ATT.date.apiDate(this._date),
			description = target.val();
		ATT.days.set(date, {
			date: date,
			description: description
		});
	};

	ATT.DayPage = DayPage;

})(ATT);

(function(ATT) {
	"use strict";

	var WeekPage = function(date) {
		date = date || new Date();
		this._jContainer = $('.weekContainer');
		this._jDate = this._jContainer.find('.dateContainer .date');
		this._setDate(date, function() {
			this._initialiseDom();
			this._initialiseEvents();
		}.bind(this));
	};

	WeekPage.prototype._initialiseDom = function() {
		var jTable = this._jContainer.find('.weekTable'),
			description;
		jTable.html('<tbody><tr><th>Date</th><th>Tasks</th></tr></tbody>');
		this._jDate.text(ATT.date.prettyDate(this._date));
		this._weekArr.forEach(function(day) {
			description = day.description || '';
			jTable.append('<tr><td>'+ATT.date.getLongDay(day.date)+'</td><td>'+description+'</td></tr>');
		});
	};

	WeekPage.prototype._setDate = function(date, callback) {
		var weekStart = ATT.date.offsetWeek(date, date.getDay() -1);
		this._date = weekStart;
		ATT.days.getDays(weekStart, 7, function(week) {
			this._weekArr = week;
			if (callback) callback();
		}.bind(this));
	};

	WeekPage.prototype._initialiseEvents = function() {
		ATT.globalevents.on('dateChanged', this._handleDateChanged.bind(this));
	};

	WeekPage.prototype._removeEvents = function() {
		/*ATT.globalevents.off('dateChanged', this._handleDateChanged);*/
	};

	WeekPage.prototype._handleDateChanged = function(event) {
		this.changeDate(event.date);
	};

	WeekPage.prototype.changeDate = function(date) {
		this._setDate(date, function() {
			this._initialiseDom();
		}.bind(this));
	};

	ATT.WeekPage = WeekPage;

})(ATT);

(function(ATT) {
	"use strict";

	var MonthPage = function(date) {
		date = date || new Date();
		this._jContainer = $('.monthContainer');
		this._jDate = this._jContainer.find('.dateContainer .date');
		this._setDate(date, function() {
			this._initialiseDom();
			this._initialiseEvents();
		}.bind(this));
	};

	MonthPage.prototype._initialiseDom = function() {
		var jTable = this._jContainer.find('.monthTable');
		jTable.html('<tbody><tr><th>Date</th><th>Tasks</th></tr></tbody>');
		this._jDate.text(ATT.date.getLongMonth(this._date)+' '+this._date.getFullYear());
		this._monthArr.forEach(function(day) {
			if (day.description) {
				jTable.append('<tr><td>'+day.date+'</td><td>'+day.description+'</td></tr>');
			}
		});
	};

	MonthPage.prototype._setDate = function(date, callback) {
		var monthStart = ATT.date.offsetMonth(date, 0);
		this._date = monthStart;
		ATT.days.getMonth(monthStart, function(month) {
			this._monthArr = month;
			if (callback) callback();
		}.bind(this));
	};

	MonthPage.prototype._initialiseEvents = function() {
		ATT.globalevents.on('dateChanged', this._handleDateChanged.bind(this));
	};

	MonthPage.prototype._removeEvents = function() {
		/*ATT.globalevents.off('dateChanged', this._handleDateChanged);*/
	};

	MonthPage.prototype._handleDateChanged = function(event) {
		this.changeDate(event.date);
	};

	MonthPage.prototype.changeDate = function(date) {
		this._setDate(date, function() {
			this._initialiseDom();
		}.bind(this));
	};

	ATT.MonthPage = MonthPage;

})(ATT);

(function(ATT) {
	"use strict";

	var Timeline  = function(date, period) {
		this._period = period || 'day';
		this._jContainer = $('.timeline');
		this._currentDate = date || new Date();
		this._initialiseDom(this._currentDate);
		this._initialiseEvents();
	};

	Timeline.prototype._initialiseDom = function(date) {
		var jPeriods = this._jContainer.find('.timelinePeriod'),
			numPeriods = jPeriods.length,
			period = this._period;
		jPeriods.each(function(index, elm) {
			var offset = index - Math.floor(numPeriods/2),
				thisDate = ATT.date.offsetDate(date, offset, period);
			$(elm).text(this.renderPeriod(thisDate))
					.attr('id', 'timeline_day_'+thisDate.toString());
		}.bind(this));
	};

	Timeline.prototype.renderPeriod = function(date) {
		var currentDate = new Date(this._currentDate.getTime());
		switch (this._period) {
			case 'day':
				return ATT.date.apiDate(date);
			case 'week':
				return ATT.date.apiDate(date);
			case 'month':
				return ATT.date.getLongMonth(date);
		}
	};

	Timeline.prototype._setDate = function(date, period) {
		this._currentDate = date;
		this._period = period || this._period || 'day';
		ATT.globalevents.fire('dateChanged', {date: date});
	};

	Timeline.prototype._handlePeriodChanged = function(event) {
		this._period = event.period;
		this._initialiseDom(this._currentDate);
	};

	Timeline.prototype._initialiseEvents = function() {
		this._jContainer.on('click', '.timelinePeriod', this._handleTimelineClick.bind(this));
		ATT.globalevents.on('timePeriodChanged', this._handlePeriodChanged.bind(this));
	};

	Timeline.prototype._handleTimelineClick = function(event) {
		var target = $(event.currentTarget),
			dateString = target.attr('id').split('_')[2],
			date = new Date(dateString);
		this._setDate(date);
		this._initialiseDom(date);
	};

	ATT.Timeline = Timeline;

})(ATT);

(function(ATT) {
	"use strict";

	var TimePeriodBar = function(period) {
		this._period = period || 'day';
		this._initialiseDom();
		this.highlightPeriod();
		this._initialiseEvents();
	};

	TimePeriodBar.prototype._initialiseDom = function() {
		this.jContainer = $('.timePeriodBar');
	};

	TimePeriodBar.prototype._initialiseEvents = function() {
		this.jContainer.on('click', '.timePeriod', this._handleTimePeriodClicked.bind(this));
	};

	TimePeriodBar.prototype._handleTimePeriodClicked = function(event) {
		var jPeriod = $(event.currentTarget),
			period = jPeriod.attr('id').split('_')[1];
		this._handleTimePeriodChanged({period: period});
		ATT.globalevents.fire('timePeriodChanged', {
			period: period
		});
		ATT.globalevents.fire('applicationStateChange', {
			state: period
		});
	};

	TimePeriodBar.prototype._handleTimePeriodChanged = function(event) {
		this._period = event.period;
		this.highlightPeriod();
	};

	TimePeriodBar.prototype.highlightPeriod = function() {
		this.jContainer.find('.timePeriod').removeClass('highlighted');
		this.jContainer.find('.'+this._period).addClass('highlighted');
	};

	ATT.TimePeriodBar = TimePeriodBar;
})(ATT);

(function(ATT) {
	"use strict";

	ATT.date = {
		days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		prettyDate: function(date) {
			return this.days[date.getDay()]+', '+this.addOrdinal(date.getDate())+' '+this.months[date.getMonth()]+' '+date.getFullYear();
		},
		getLongDay: function(date) {
			date = (date.getDay) ? date : new Date(date);
			return this.longDays[date.getDay()];
		},
		getLongMonth: function(date) {
			return this.longMonths[date.getMonth()];
		},
		addOrdinal: function(date) {
			var ordinal = 'th';
			if (date == 1 || date == 21 || date == 31) {
				ordinal = 'st';
			}
			else if (date == 2 || date == 22) {
				ordinal = 'nd';
			}
			else if (date == 3 || date == 23) {
				ordinal = 'rd';
			}
			return date + ordinal;
		},
		apiDate: function(date) {
			return  date.getFullYear() + '-' + this.twoDigit(date.getMonth() + 1) + '-' + this.twoDigit(date.getDate());
		},
		twoDigit: function(number) {
			return number < 10 ? '0'+number : number;
		},
		offsetDate: function(date, offset, period) {
			switch (period) {
				case 'day':
					return this.offsetDay(date, offset);
				case 'week':
					return this.offsetWeek(date, offset);
				case 'month':
					return this.offsetMonth(date, offset);
			}
		},
		offsetDay: function(date, offset) {
			var newDate = new Date(date.getTime());
			newDate.setDate(newDate.getDate() + offset);
			return newDate;
		},
		offsetWeek: function(date, offset) {
			var newDate = new Date(date.getTime());
			newDate.setDate(newDate.getDate() - newDate.getDay() + 1 + (offset * 7));
			return newDate;
		},
		offsetMonth: function(date, offset) {
			var newDate = new Date(date.getTime());
			newDate.setDate(1); // we want first day of the month
			newDate.setMonth(newDate.getMonth() + offset);
			return newDate;
		}
	};

})(ATT);

(function(ATT) {
	"use strict";

	var handlers = [];

	ATT.globalevents = {
		on: function(eventName, handler) {
			handlers[eventName] = handlers[eventName] || [];
			handlers[eventName].push(handler);
		},
		off: function(eventName, handler) {
			console.log('Remember to implement ATT.globalevents.off()!');
		},
		fire: function(eventName, params) {
			if (handlers[eventName]) {
				handlers[eventName].forEach(function(handler) {
					handler(params);
				});
			}
		}
	};

})(ATT);

(function(ATT) {
	"use strict";

	var _data,
		_pending = {};

	ATT.data = {
		initialise: function(data) {
			_data = data;
		},
		getAll: function() {
			return _data;
		},
		get: function(namespace, property, callback) {
			var ns = _data[namespace];
			if (ns) {
				if (ns[property]) {
					if (callback) callback(ns[property]);
					return ns[property];
				}
				else {
					_pending[namespace] = _pending[namespace] || [];
					_pending[namespace][property] = callback;
					return false;
				}
			}
		},
		update: function() {
			
		},
		set: function(namespace, property, value, noAjax) {
			var numArgs = arguments.length;
			if (numArgs < 3) {
				throw new Exception('ATT.data.set() requires 3 arguments');
			}
			_data[namespace] = _data[namespace] || {};
			_data[namespace][property] = $.extend({}, value);

			if (!noAjax) {
				value.save = namespace;
				$.ajax({
					url: window.location.href,
					type: 'post',
					data: value
				});
			}
		},
		setMany: function(elements, noAjax) {
			elements.forEach(function(elm) {
				this.set(elm.namespace, elm.property, elm.value, noAjax);
			}, this);
		}
	};

	ATT.globalevents.on('dataNamespaceUpdated', function(elements) {
		var oldPending = $.extend({}, _pending);
		_pending = {};

		ATT.data.setMany(elements, true);

		elements.forEach(function(element) {
			var namespace = element.namespace,
				property = element.property;
			if (oldPending[namespace] && oldPending[namespace][property]) {
				ATT.data.get(namespace, property, oldPending[namespace][property]);
			}
		});
	});

})(ATT);

(function(ATT) {
	"use strict";

	var _dateBuffer = 31;

	ATT.days = {
		get: function(date, callback) {
			var dateString = (typeof date === 'string') ? date : ATT.date.apiDate(date);
			return ATT.data.get('day', dateString, callback);
		},
		set: function(date, obj, noAjax) {
			ATT.data.set('day', date, obj, noAjax);
		},
		getDays: function(startDate, numDays, callback) {
			var date, dateString, days = [], completed = 0;
			for (var i=0; i<numDays; i++) {
				date = ATT.date.offsetDay(startDate, i);
				dateString = ATT.date.apiDate(date);
				ATT.data.get('day', dateString, success);
			}

			function success(day) {
				days.push(day);
				completed++;
				if (completed === numDays) {
					if (typeof callback === 'function') callback(days);
				}
			}
		},
		getMonth: function(date, callback) {
			var monthStart = ATT.date.offsetMonth(date, 0),
				monthEnd = ATT.date.offsetMonth(date, 1),
				daysInMonth;
			monthEnd.setDate(0);
			daysInMonth = monthEnd.getDate();
			this.getDays(monthStart, daysInMonth, callback);
		}
	};

	ATT.globalevents.on('dateChanged', function(event) {
		var currentDate = event.date,
			days = [],
			dayInterval = 24 * 60 * 60 * 1000,
			start = currentDate.valueOf() - (_dateBuffer * dayInterval),
			end = currentDate.valueOf() + (_dateBuffer * dayInterval),
			date, dateString;

		for (var timeStamp = start; timeStamp <= end; timeStamp+=dayInterval) {
			date = new Date(timeStamp);
			dateString = ATT.date.apiDate(date);
			if (!ATT.days.get(dateString)) {
				days.push(dateString);
			}
		}

		if (days.length) {
			$.ajax({
				url: window.location.href,
				data: {'specificDays': JSON.stringify(days)},
				success: function(result) {
					var days = JSON.parse(result),
						date,
						dates = [];
					for (date in days) {
						if (days.hasOwnProperty(date)) {
							ATT.days.set(date, days[date], true);
							dates.push({
								namespace: 'day',
								property: date,
								value: days[date]
							});
						}
					}
					ATT.globalevents.fire('dataNamespaceUpdated', dates);
				}
			});
		}
	});


})(ATT);

$(function() {
	new ATT.DayPage();
	new ATT.WeekPage();
	new ATT.MonthPage();
	new ATT.Timeline();
	new ATT.TimePeriodBar();
	ATT.applicationController();
});
