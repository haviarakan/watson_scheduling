export class PhoneNumber {
number:string;
/*
    country: string;
    area: string;
    prefix: string;
    line: string;
*/

get e164(){
  const num = this.number
    //const num = this.country + this.area + this.prefix + this.line
    return `+${num}`
 }
}