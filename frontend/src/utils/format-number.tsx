/* eslint-disable @typescript-eslint/no-explicit-any */
import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number: any) {
  return numeral(number).format();
}

export function fCurrency(number: any) {
  const format = number ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number: any) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number: any) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number: any) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format: string, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}

export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes === 0) return '0 Bytes';

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const digitGroups = Math.floor(Math.log(sizeInBytes) / Math.log(1024));

  return `${(sizeInBytes / 1024 ** digitGroups).toFixed(2)}${units[digitGroups]}`;
}
