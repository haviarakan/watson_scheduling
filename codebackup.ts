const participantid = this.db.createId();
this.participantsCollection.doc(participantid).set({
  id: participantid,
  firstname: this.user.firstname,
  lastname: this.user.lastname,
  name:this.user.firstname + " " + this.user.lastname,
  email: this.user.email,
  phone: this.user.phone,
  firstpurchase: this.purchase.purchasedate
}).then(res =>
  {
  console.log("Added Participant")
   this.db.doc('/Participants/'+participantid).snapshotChanges().subscribe(data =>
          {
            //Add Purchase
            this.purchasesCollection.add({
            participant: data.payload.ref,
            fee: this.purchase.fee,
            gst: this.purchase.fee * .18,
            gross: this.purchase.fee * 1.18,
            initialpayment: this.paymentplan.initialpayment,
            product: this.purchase.product,
            purchasedate: this.purchase.purchasedate
            });
            console.log("Added Purchase");


            //Add Payment

             this.paymentsCollection.add({
              date: this.purchase.purchasedate,
              receipt: this.paymentplan.initialpayment,
              fee: this.paymentplan.initialpayment / 1.18,
              gst: this.paymentplan.initialpayment / .18,
              participant: data.payload.ref
              });
              console.log("Added Payment");
            //Add Payment Plan

             this.paymentplansCollection.add({
              frequency: "monthly",
              purchasevalue: this.purchase.fee,
              paymentplanvalue: this.purchase.fee - this.paymentplan.initialpayment,
              installmentamount: this.paymentplan.installmentamount,
              installmentspaid: 0,
              installmentsdue: Math.ceil((this.purchase.fee - this.paymentplan.initialpayment)/this.paymentplan.installmentamount),
              lastpayment: this.purchase.purchasedate,
              paymentday: this.paymentplan.paymentday,
              recentpurchase: this.purchase.purchasedate,
              balance: this.purchase.fee - this.paymentplan.initialpayment,
              term: Math.ceil((this.purchase.fee - this.paymentplan.initialpayment)/this.paymentplan.installmentamount),
              participant: data.payload.ref
              });
              console.log("Added Payment Plan");

        });
      });
