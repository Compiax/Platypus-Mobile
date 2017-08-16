import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';

// Used for storing user data locally
import { Storage } from '@ionic/storage';
import { SESSION_PAGES } from '../../app/pages';

@IonicPage()
@Component({
  selector: 'page-session',
  templateUrl: 'session.html',
})
export class SessionPage {

  pages = SESSION_PAGES;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SessionPage');
  }

  ionViewWillEnter() {
    // @todo Check session_id is stored and correct
    // @todo Check user_id is stored and correct
    // @todo If valid client, start socketIO

    // @todo Get JSON (Store it locally as array of JSON items)
    // @todo Receive updates from socketIO and update JSON array items
    // OR
    // @todo Get JSON and parse it straight into ionic panels
    // @todo Receive updates from scoketIO, parse it as ionic panels and update them
  }

}
