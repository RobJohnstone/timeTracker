var ATT = ATT || {};

(function(ATT) {
	"use strict";

	var DayPage = function(selector, date) {
		date = date || new Date();
		this._jContainer = $(selector);
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

	var Timeline  = function(date) {
		this._jContainer = $('.timeline');
		this._currentDate = date || new Date();
		if (date) this._intialiseDom(date);
		this._initialiseEvents();
	};

	Timeline.prototype._initialiseDom = function(date) {
		var jDays = this._jContainer.find('.day'),
			numDays = jDays.length,
			dayInterval = 24 * 60 * 60 * 1000;
		jDays.each(function(index) {
			var offset = index - Math.floor(numDays/2),
				thisDate = new Date(date.valueOf() + (offset * dayInterval));
			$(this).text(ATT.date.apiDate(thisDate))
					.attr('id', 'timeline_day_'+thisDate.toString());
		});
	};

	Timeline.prototype._setDate = function(date) {
		this._currentDate = date;
		ATT.globalevents.fire('dateChanged', {date: date});
	};

	Timeline.prototype._initialiseEvents = function() {
		this._jContainer.on('click', '.day', this._handleDayClick.bind(this));
	};

	Timeline.prototype._handleDayClick = function(event) {
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

	ATT.date = {
		days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		prettyDate: function(date) {
			return this.days[date.getDay()]+' '+this.addOrdinal(date.getDate())+' '+this.months[date.getMonth()]+' '+date.getFullYear();
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

	var _dateBuffer = 2;

	ATT.days = {
		get: function(date, callback) {
			var dateString = (typeof date === 'string') ? date : ATT.date.apiDate(date);
			return ATT.data.get('day', dateString, callback);
		},
		set: function(date, obj) {
			ATT.data.set('day', date, obj);
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

		$.ajax({
			url: window.location.href,
			data: {'specificDays': JSON.stringify(days)},
			success: function(result) {
				var days = JSON.parse(result),
					date,
					dates = [];
				for (date in days) {
					if (days.hasOwnProperty(date)) {
						ATT.days.set(date, days[date]);
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
	});


})(ATT);

$(function() {
	new ATT.DayPage('.dayContainer');
	new ATT.Timeline();
});
