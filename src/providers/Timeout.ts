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

  /**
   * Stops and starts the timeout for promise chaining
   * @param  {string} err The error message to siplay upon timeout
   */
  timeoutHandler (err) {
    
    this.endTimeout();
    this.startTimeout(err);
  }

  /**
   * Initializes the timeout functionality
   * @param  {string} err The error message to siplay upon timeout
   */
  startTimeout(err) {

    console.log("Starting timeout");

    // Create the loading spinner
    this.loading = this.loadingCtrl.create({
      content: "<ion-spinner></ion-spinner>"
    });
    this.loading.present();

    // Start a timer
    this.timeoutId = setTimeout(() => {
      this.loading.dismiss();

      console.log("TIMEOUT: "+err+" took too long");
      this.alertService.sendAlert(err+" took too long");
      this.navCtrl.pop();

    }, TIMEOUT_LIMIT);

  };

  /**
   * Stops the timeout function
   */
  endTimeout() {
    this.loading.dismiss();

    console.log("Ending timeout");
    clearTimeout(this.timeoutId);
  };
}
