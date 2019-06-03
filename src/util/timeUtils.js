/**
 * 格式化日期方法
 * 已注入所有Vue实例，
 * template模板里调用 $dateFormat(date)
 * 组件方法里调用 this.$dateFormat(date)
 * 例：this.$dateFormat('Dec 27, 2017 3:18:14 PM') 得到 '2017-12-27 15:18:14'
 */
export function dateFormat(value) {
  if (!value) return ''
  var date = new Date(value);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var mydate = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  if (month < 10) month = '0' + month;
  if (mydate < 10) mydate = '0' + mydate;
  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;
  var time = `${year}-${month}-${mydate} ${hours}:${minutes}:${seconds}`
  return time;
}

/**
 * 格式化日期方法
 * 已注入所有Vue实例，
 * template模板里调用 $dateFormatNoTime(date)
 * 组件方法里调用 this.$dateFormatNoTime(date)
 * 例：this.$dateFormatNoTime('Dec 27, 2017 3:18:14 PM') 得到 '2017-12-27'
 */
export function dateFormatNoTime(value) {
  if (!value) return ''
  var date = new Date(value);
  var Y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var H = date.getHours();
  var i = date.getMinutes();
  var s = date.getSeconds();
  if (m < 10) { m = '0' + m; }
  if (d < 10) { d = '0' + d; }
  if (H < 10) { H = '0' + H; }
  if (i < 10) { i = '0' + i; }
  if (s < 10) { s = '0' + s; }
  var time = Y + '-' + m + '-' + d;
  return time;
}

/**
 * 时间戳转换
 * 已注入所有Vue实例，
 * template模板里调用 $timestampToTime
 * 组件方法里调用 this.$timestampToTime
 * 例：this.$timestampToTime(1523440865000) 得到 '2018-04-11 18:01:05'
 */
export function timestampToTime(value) {
  if (!value) return ''
  var date = new Date(value);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  if (h < 10) { h = '0' + h; }
  if (m < 10) { m = '0' + m; }
  if (s < 10) { s = '0' + s; }
  var time = Y + M + D + h + m + s;
  return time;
}

/**
 * 格林威时间转换str
 */
export function GMTToStr(time){
    let date = new Date(time)
    let Str=date.getFullYear() + '-' +
            (date.getMonth() + 1) + '-' +
            date.getDate() + ' ' +
            date.getHours() + ':' +
            date.getMinutes() + ':' +
            date.getSeconds()
    return Str;
}

/**
 * str转换格林威时间
 */
export function StrToGMT(time){
    let GMT = new Date(time)
    return GMT;
}