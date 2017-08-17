import { Injectable } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

@Injectable()
export class Alert {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController) {}

    public sendAlert(alertMessage) {
      this.navCtrl.setRoot("SessionPage").then( function (){
      let toast = this.toastCtrl.create({
        message: alertMessage,
        duration: 5000,
        showCloseButton: true,
        closeButtonText: "Ok",
        position: 'top'
      });
    });
    }

}
