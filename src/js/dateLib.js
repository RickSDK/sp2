
// Date functions for AT&T written by Rick Medved
//-----------------------------------------------
function getDateObjFromJSDate(dateStr = '') {
    // formats:
    // 2019-05-08T15:00:49-07:00
    // Wed Jun 03 2020 07:31:19 GMT-0700 (Pacific Daylight Time)
    // or blank for now
    var now = new Date();
    if (dateStr)
        now = new Date(dateStr);

    if(now.toLocaleDateString() == 'Invalid Date')
        now = new Date(dateStr.replace(/ /, 'T'));
        
    return {
        sentDate: dateStr,
        jsDate: now.toString(),
        legacy: convertDateToString(now),
        oracle: oracleDateStampFromDate(now),
        local: now.toLocaleDateString() + ' ' + now.toLocaleTimeString(),
        localDate: now.toLocaleDateString(),
        localTime: now.toLocaleTimeString(),
        getTime: now.getTime(),
        mo: now.getMonth() + 1,
        month: monthName(now),
        prevMonth: monthNameByNumber(now.getMonth()),
        year: now.getFullYear(),
        prevYear: (now.getMonth() > 0) ? now.getFullYear() : now.getFullYear() - 1,
        getTimeHexFormat: now.getTime().toString(16),
        getTime32: now.getTime().toString(32),
        html5Date: dateComponentFromDateStamp(now),
        html5Time: dateComponentFromDateStamp(now, true)
    }
}
function getDateObjFromHtml5Date(dateStr = '2019-06-15', timeStr = '00:00') {
    return getDateObjFromJSDate(dateFromHtml5Time(dateStr, timeStr));
}
function monthName(date) {
    var month = date.getMonth();
    return monthNameByNumber(month + 1);
}
function htmlDateStringWhileTyping(str) {
    var phoneNumDigits = str.replace(/\D/g, ''); //removes all non-numbers

    var formattedNumber = phoneNumDigits;

    var year = phoneNumDigits.substring(0, 4);
    var month = phoneNumDigits.substring(4, 6);
    var day = phoneNumDigits.substring(6, 8);
    if (phoneNumDigits.length >= 4)
        formattedNumber = year + '-' + month;
    if (phoneNumDigits.length >= 6)
        formattedNumber = year + '-' + month + '-' + day;

    return formattedNumber;

}
function netTrackerMonth() {
    var now = new Date();
    return now.getFullYear().toString() + pad(now.getMonth() + 1);
}
function monthNameByNumber(num) {
    mlist = ["December", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return mlist[num];
};
function nowYear() {
    var now = new Date();
    return now.getFullYear();
}
function pad(n = 0, width = 2, z = '0') {
    var str = n.toString();
    return str.length >= width ? str : new Array(width - str.length + 1).join(z) + str;
}
function clockSinceStartTime(startTime) {
    var seconds = secondsSinceDateStamp(startTime);
    var hours = Math.floor(seconds / 3600);
    seconds -= (hours * 3600);
    var minutes = Math.floor(seconds / 60);
    seconds -= (minutes * 60);
    return hours + ':' + pad(minutes) + ':' + pad(seconds);
}
function secondsSinceDateStamp(dateStamp) {
    var date1 = new Date(dateStamp);
    var now = new Date();
    var diff = diffBetweenTwoDates(now, date1);
    return Math.ceil(diff / 1000);
}
function ptpTimeFromStamp(dt) {
    var date = new Date(dt);
    return convertDateToString(date);
}
function convertDateToString(d) {
    if (!d)
        return;
    var day = pad(d.getDate());
    var monthIndex = pad(d.getMonth() + 1);
    var year = d.getFullYear();
    var h2 = d.getHours();
    var h = hours12(d);
    var m = pad(d.getMinutes());
    var amPm = 'AM';
    if (h2 >= 12) {
        amPm = 'PM';
    }

    return monthIndex + '/' + day + '/' + year + ' ' + h + ':' + m + ':00 ' + amPm;
}
function hours12(date) { return (date.getHours() + 24) % 12 || 12; }
function isHtml5TimeInFuture(dayStr, timeStr) {
    var date1 = dateFromHtml5Time(dayStr, timeStr);
    var now = new Date();
    var diff = diffBetweenTwoDates(date1, now);
    return diff > 0;
}
function daysTillDate(dateStr) {
    var date1 = new Date(dateStr);
    var now = new Date();
    var diff = diffBetweenTwoDates(date1, now);
    var days = Math.ceil(diff / 1000 / 86400);
    return days;
}
function minutesBetween2DateStamps(dateStr1, dateStr2) {
    var date1 = new Date(dateStr1);
    var date2 = new Date(dateStr2);
    var diff = diffBetweenTwoDates(date2, date1);
    return Math.ceil(diff / 1000 / 60);
}
function diffBetweenTwoDates(date1, date2) {
    return date1.getTime() - date2.getTime();
}
function dateFromHtml5Time(dayStr, timeStr) {
    return new Date(dayStr + ' ' + timeStr);
}

function localTimeFromStamp(dateStamp) {
    return dateComponentFromDateStamp(dateStamp, true, true);
}
function weekdayOfDate(dateStamp) {
    var dateSt = new Date();
    if (dateStamp)
        dateSt = new Date(dateStamp);

    var day = dateSt.getDay();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
}
function timeOfDayOfDate(dateStamp) {
    var dateSt = new Date();
    if (dateStamp)
        dateSt = new Date(dateStamp);
    var hour = pad(dateSt.getHours());

    if (hour >= 4 && hour < 12)
        return 'Morning';
    if (hour >= 12 && hour < 5)
        return 'Afternoon';
    if (hour >= 5 && hour < 9)
        return 'Evening';

    return 'Night';
}
function convertStringToDate2(str) {
    if (!str)
        return new Date();
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
function dateStampFromHtml5Time(dayStr, timeStr) {
    if (timeStr == '')
        timeStr = '20:00';
    var now = new Date();
    var hours = Math.floor(now.getTimezoneOffset() / 60);
    var sign = (hours >= 0) ? '-' : '+';
    return dayStr + 'T' + timeStr + ':00' + sign + pad(hours) + ':00';
}
function oracleDateStampFromDate(date) {
    var dayStr = dateComponentFromDateStamp(date);
    var timeStr = dateComponentFromDateStamp(date, true);
    return dateStampFromHtml5Time(dayStr, timeStr);
}
function pacificTimeOfDate(d = null) {
    if (!d)
        d = new Date();
    var year = d.getUTCFullYear();
    var month = d.getUTCMonth();
    var day = d.getUTCDate();
    var hours = d.getUTCHours();
    var minutes = d.getUTCMinutes();
    var seconds = d.getUTCSeconds();
    var utcDate = new Date(year, month, day, hours, minutes, seconds);
    utcDate.setMinutes(utcDate.getMinutes() - 420);
    return utcDate
}

function dateComponentFromDateStamp(dateStamp, timeFlg = false, localFormatFlg = false) {
    //"2019-05-08T15:00:49-07:00"
    var dateSt = new Date();
    if (dateStamp)
        dateSt = new Date(dateStamp);

    if (typeof dateSt.getMonth === 'function') {
        if (localFormatFlg) {
            if (timeFlg)
                return dateSt.toLocaleDateString() + ' ' + dateSt.toLocaleTimeString();
            else
                return dateSt.toLocaleDateString();
        }

        var year = dateSt.getFullYear();
        var month = pad(dateSt.getMonth() + 1);
        var day = pad(dateSt.getDate());

        var hour = pad(dateSt.getHours());
        var min = pad(dateSt.getMinutes());
        var seconds = pad(dateSt.getSeconds());

        if (timeFlg)
            return hour + ':' + min; //'00:00'
        else
            return year + '-' + month + '-' + day; //'2019-06-15'

    } else {
        console.log('invalid date!!!', dateStamp);
    }
    return dateStamp;
}
function dateStringFromDate(date) {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
