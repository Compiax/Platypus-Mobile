import { Injectable } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class Alert {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {}

    public sendAlert(alertMessage) {
      let toast = this.toastCtrl.create({
        message: alertMessage,
        duration: 5000,
        showCloseButton: true,
        closeButtonText: "Ok",
        position: 'top'
      });
      toast.present();
    }

}
