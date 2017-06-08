import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-join-session',
  templateUrl: 'join-session.html',
})
export class JoinSessionPage {

  constructor(private navCtrl: NavController, private navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinSessionPage');
  }

}
