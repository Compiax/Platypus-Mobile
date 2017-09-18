import { Injectable } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Alert } from './Alert';

const TIMEOUT_LIMIT: any = 60000;

@Injectable()
export class Timeout {

  loading: any; // Loading spinner
  timeoutId: any; // Loading spinner

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertService: Alert) {}

  startTimeout(err) {

    console.log("Initialize loading spinner");
    this.loading = this.loadingCtrl.create({
      content: "<ion-spinner></ion-spinner>"
    });
    this.loading.present();

    this.timeoutId = setTimeout(() => {
      this.loading.dismiss();
      console.log("TIMEOUT: "+err+" took too long");
      this.alertService.sendAlert(err+" took too long");
      this.navCtrl.pop();
    }, TIMEOUT_LIMIT);
  };

  endTimeout() {
    clearTimeout(this.timeoutId);
    this.loading.dismiss();
    console.log("Ending timeout");
  };
}
