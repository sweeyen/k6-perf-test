import http from 'k6/http';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.2/index.js';

export function yyyyMMddHHmmss() {
  let currentDate = new Date();
  let yyyy = currentDate.getFullYear();
  let mm = currentDate.getMonth() < 9 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1); // Return value from getMonth() function is zero-based.
  let dd = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();
  let hh = currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours();
  let min = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
  let ss = currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds();
  return ''.concat(yyyy).concat(mm).concat(dd).concat(hh).concat(min).concat(ss);
}