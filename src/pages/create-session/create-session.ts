import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-create-session',
  templateUrl: 'create-session.html',
})
export class CreateSessionPage {

  constructor(private navCtrl: NavController, private navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateSessionPage');
  }

}
