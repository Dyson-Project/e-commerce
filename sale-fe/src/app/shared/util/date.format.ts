
export class DateFormat {
  static formatISO(date: Date): string {
    let str = date.toISOString();
    str = str.slice(0, str.indexOf('T'));
    return str;
  }
}