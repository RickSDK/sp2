function isMobile() {
	if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)))
		return true;
	return (screen.width <= 512);
}
function changeClass(id, className) {
	var e = document.getElementById(id);
	if (e) {
		e.className = className;
	}
}
function convertStringToDate(str) {
	if (!str)
		return new Date();

	var newDate = new Date(str);
	if (newDate)
		return newDate;
	var items = str.split(" ");
	var dayStr = stringVal(items[0]);
	var hourMin = stringVal(items[1]);
	var amPm = stringVal(items[2]);

	var dayItems = dayStr.split("/");
	var month = parseInt(dayItems[0]);
	var day = parseInt(dayItems[1]);
	var year = parseInt(dayItems[2]);
	if (year < 100)
		year += 2000;

	var h = 12;
	var m = 0;
	if (hourMin && hourMin.length >= 4) {
		var timeItems = hourMin.split(":");
		h = parseInt(timeItems[0]);
		if (h == 12)
			h = 0;
		m = parseInt(timeItems[1]);
	}

	if (amPm == 'PM' && h < 12)
		h += 12;
	var d = new Date(year, month - 1, day, h, m, 0);
	return d;
}
function stringVal(str) {
	if (!str)
		return '';
	return str.toString();
}
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1);  // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2)
		;
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180)
}
function globalAddress(city, state, country) {
	if (country == 'USA')
		return city + ', ' + state;
	else
		return city + ', ' + country;
}
function addMinutesToDate(minutes) {
	var e = document.getElementById('dateEntryField');
	str = e.innerHTML;
	d = convertStringToDate(str);
	var newD = dateAdd(d, minutes);
	selectedValue = convertDateToString(newD);
	e.innerHTML = selectedValue;
}

function valueOfInput(id) {
	var e = document.getElementById(id);
	if (e)
		return e.value;
	else
		alert('error, no field: ' + id);
}
function databaseSafeValueOfInput(id) {
	var e = document.getElementById(id);
	if (e)
		return databaseSafe(e.value);
//	else
//		alert('error, no field: ' + id);
}
function getCheckedValueOfField(id) {
	var e = document.getElementById(id);
	if (e)
		return e.checked;
	else
		return false;
}
function setCheckedValueOfField(id, flag) {
	var e = document.getElementById(id);
	if (e)
		e.checked = flag;
}

function dateAdd(date, minutes) {
	var ret = new Date(date);
	ret.setTime(ret.getTime() + minutes * 60000);
	return ret;
}
function convertDateToString(d) {
	if (!d)
		return;
	var day = pad(d.getDate());
	var monthIndex = pad(d.getMonth() + 1);
	var year = d.getFullYear();
	var h = d.getHours();
	var m = pad(d.getMinutes());
	var amPm = 'AM';
	if (h > 12) {
		h -= 12;
		amPm = 'PM';
	}
	return monthIndex + '/' + day + '/' + year + ' ' + h + ':' + m + ' ' + amPm;
}
function nowYear() {
	var now = new Date();
	var year = now.getFullYear();
	return year;
}
function convertDateToDateStamp(d) {
	var day = pad(d.getDate());
	var monthIndex = pad(d.getMonth() + 1);
	var year = d.getFullYear();
	var h = pad(d.getHours());
	var m = pad(d.getMinutes());
	return year + monthIndex + day + h + m;
}
function numberVal(num) {
	var numVal = parseInt(num);
	if (numVal)
		return numVal;
	else
		return 0;
}
function pad(n, width, z) {
	width = width || 2;
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function numberWithSuffix(i) {
	var j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return i + "st";
	}
	if (j == 2 && k != 12) {
		return i + "nd";
	}
	if (j == 3 && k != 13) {
		return i + "rd";
	}
	return i + "th";
}
function moneyToNumber(money) {
	var val = money.replace("$", "");
	val = val.replace(",", "");
	return numberVal(val);
}
function streakFromNumber2(num) {
	num = parseInt(num);
	if (num == 0)
		return '-';
	if (num > 0)
		return 'Win ' + num;
	return 'Lose ' + num * -1;
}
function streakFromNumber(num) {
	if (!num || num == 0)
		return '-';
	if (num == 0)
		return 0;
	if (num > 0)
		return 'W' + num;
	else
		return 'L' + (num * -1);
}
function last10FromLine(line) {
	if (!line)
		return '0-0';
	var wins = 0;
	var losses = 0;
	var games = line.split('+');
	games.forEach(function (game) {
		if (game == 'W')
			wins++;
		if (game == 'L')
			losses++;
	});
	return wins + '-' + losses;
}
function getHoursSinceLogin(dt) {
	var seconds = getDateFromString(dt);
	if (seconds < 0)
		seconds = 11;
	var last_login_time = parseInt(seconds / 3600);

	if (last_login_time <= 0)
		last_login_time = 0;

	return last_login_time + ' hrs';
}
function getDateFromString(str) {
	var now = new Date();
	var last_loginDt = new Date(str);
	if (!str)
		return 0;
	var t = last_loginDt.getTime();
	var seconds = 0;
	if (isNaN(t)) {
		var c = str.split(' ');
		var formattedDate = c[0] + 'T' + c[1] + 'Z';
		last_loginDt = new Date(formattedDate);
		seconds = (now.getTime() - last_loginDt.getTime()) / 1000;
		seconds -= 8 * 60 * 60;
	} else {
		seconds = (now.getTime() - last_loginDt.getTime()) / 1000;
	}

	return seconds;
}
function convertNumberToMoney(amount, decimalFlg) {
	if (!amount)
		amount = 0;
	var intVal = parseInt(Math.round(amount));
	if (amount != intVal) {
		decimalFlg = true;
		amount = parseFloat(amount);
	}

	if (decimalFlg) { amount = amount.toFixed(2); }
	else { amount = intVal; }
	return numberToCurrency(amount);
}
function numberToCurrency(amount) {
	var negSign = '';
	if (amount < 0) {
		negSign = '-';
		amount *= -1;
	}
	var cents = '';
	if (parseInt(amount) != parseFloat(amount)) {
		var comps = amount.toString().split(".");
		cents = '.' + comps[1];
		amount = parseInt(amount);
	}

	var thousandsSeparator = ","
	var currencyNum = "";
	var amountString = amount.toString();
	var digits = amountString.split("");

	var countDigits = digits.length;
	var revDigits = digits.reverse();

	for (var i = 0; i < countDigits; i++) {
		if ((i % 3 == 0) && (i != 0)) {
			currencyNum += thousandsSeparator + revDigits[i];
		} else {
			currencyNum += digits[i];
		}
	};

	var revCurrency = currencyNum.split("").reverse().join("");
	var finalCurrency = negSign + "$" + revCurrency + cents;

	return finalCurrency;
}
function floatVal(num) {
	return (num) ? parseFloat(num) : 0;
}
function databaseSafe(line) {
	line = line.replace(/\|/g, '');
	line = line.replace(/<br>/g, '');
	line = line.replace(/<a>/g, '');
	line = line.replace(/<xx>/g, '');
	return line.replace(/`/g, '');
}

