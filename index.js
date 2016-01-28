(function() {
	var TimeIsMoney = (function () {

		var _defaults = {
			yearlyWage: 100000,
			monthlyWage: 600,
			tax: 0,
			workingDays: 5,
			workingHours: 8,
			isActive: true,
			replace: true
		};

		var settings = _defaults; // for now

		var _merge = function(obj1, obj2){
			for (var key in obj2){ 
				obj1[key] = obj2[key]; 
			}
			return obj1;
		};

		var options = function(obj){
			settings = _merge(settings, obj || {});
		};

	 	var offsets = {
			yr: {
			  d: 3600*settings.workingHours*settings.workingDays*52, 
			  total: Infinity,
			  longName: "year"
			},
			mo: {
			  d: Math.round(3600*settings.workingHours*settings.workingDays*4.333333),
			  total: 12,
			  longName: "month"
			},
			wk: {
			  d: 3600*settings.workingHours*settings.workingDays,
			  total: 4.333333333, // Weeks in a month
			  longName: "week"
			},
			d: {
			  d: 3600*settings.workingHours,
			  total: settings.workingDays,
			  longName: "day"
			},
			hr: {
			  d: 3600,
			  total: settings.workingHours,
			  longName: "hour"
			},
			min: {
			  d: 60,
			  total: 60,
			  longName: "min"
			},
			sec: {
			  d: 1,
			  total: 60,
			  longName: "sec"
			}
	  	};

	  var oneSecondWage = function() {
		return (settings.monthlyWage * 12) / (settings.workingDays * 52) / settings.workingHours / 60 / 60;
	  };

	  // d is seconds in that value, set for 5 days a week, 8 hours a day
	  var moneyToTime = function(money) {
		var delta = parseFloat(money) / oneSecondWage(),
		  arr = [],
		  str = "",
		  count = 0;

		// Calculate exact year, months, weeks, days etc... push them into an array.
		for (var key in offsets) {
		  var value = Math.floor(delta / offsets[key].d);
		  var obj = {
			key: key,
			longName: offsets[key].longName,
			value: value
		  };

		  arr.push(obj);
		  delta -= value * offsets[key].d;
		}

		// Round up values according to max, rounding down is not nessecary due to the way we read them back later.

		for (var i = arr.length - 1; i >= 0; i--) {
		  var a = arr[i];
		  var dec = Math.round(a.value/offsets[a.key].total);
		  if (dec) {
			arr[i - 1].value += 1;
			a.value = 0;
		  }
		}

		// Loop through and pick just one or two of the highest values
		var value = 0, unit;
		for (var key in arr) {
		  var k = arr[key];
		  if ((count && !k.value) || (count > 1)) {
			break;
		  }
		  if (k.value) {
			if(count){
			  var decimal = k.value/offsets[k.key].total;
			  value = Math.round((value+decimal)*2)/2;
			}else{
			  value += k.value;
			  unit = k.key;
			  longUnit = k.longName;
			}

			if (settings.replace) {
			  str += (count > 0 ? ", " : "") + k.value + " " + k.longName + (k.value > 1 ? 's' : '');
			}
			else {
			  str = value+unit
			}

			count++;
		  }
		}
		return (str) || '0s';
	  };

		var replaceMoneyWithTime = function(text) {
			var re = /\£\d{0,3}(,?\d+)?(.?\d+)(K|k|M|m)?/g; // http://regexr.com/3cduh
			var re_strip = /[^0-9.kKmM]/g;
			var result;

			return text.replace(re, function(value){
				  var cleaned = value.replace(re_strip, '');
				 if (/(k|K)$/.test(cleaned)) {
					cleaned = cleaned.replace(/(k|K)$/, '');
					cleaned = parseInt(cleaned) * Math.pow(10,3);
				  } else if (/(m|M)$/.test(cleaned)) {
					cleaned = cleaned.replace(/(m|M)$/, '');
					cleaned = parseInt(cleaned) * Math.pow(10,6);
				  }
				  return moneyToTime(cleaned);
			});
		};

		var convert = function(value){
			if(typeof value === 'object'){
				return value.map(function(value, index){
					return replaceMoneyWithTime(value);
				});
			}else{
				return replaceMoneyWithTime(value);
			}
		};

		return {
			options:options,
			convert:convert
		};

	})();
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
		module.exports = TimeIsMoney;
	}else{
		window.TimeIsMoney = TimeIsMoney;
	}

})();
