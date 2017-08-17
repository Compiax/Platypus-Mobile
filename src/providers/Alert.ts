import { Injectable } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

@Injectable()
export class Alert {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController) {}

}
