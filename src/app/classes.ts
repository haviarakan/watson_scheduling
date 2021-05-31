import { StringNullableChain } from "lodash";

export class User{
   firstname: string;
   lastname: string;
   email: string;
   phone: number;
   billingaddress: string;
   remarks:string;
   getpwd:string;
   billingemail:string;

}

export class Purchase{

  fee: number;
  product: string;
  purchasedate: Date;
  initialpayment: number;

}

export class Cheque{
  count: number;
  value: number;
}

export class Paymentplan{

paymentday: number;
installmentamount: number;
initialpayment: number;
balance: number;
installmentsdue: number;
installmentspaid: number;

}

export class Payment{
receipt: number;
date: Date;
}

export class Customer{
  fname: String;
  lname: String;
  email: String;
  phone: number;
  seqno:number;
}
