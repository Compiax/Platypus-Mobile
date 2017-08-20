import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../../providers/HttpProvider';
import { Timeout } from '../../providers/Timeout';
import { Alert } from '../../providers/Alert';

@IonicPage()
@Component({
  selector: 'page-join-session',
  templateUrl: 'join-session.html',
  providers:[HttpProvider, Timeout, Alert]
})
export class JoinSessionPage {

  session_id: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage,
    private httpProvider: HttpProvider,
    private timeout: Timeout) { }

  /**
   * Attempts to join an session and saves the response locally
   * @param {String} session_id The id of the session to join
   */
  joinSession(): void {
    var thisPage = this;
    console.log("SESSION_ID: "+this.session_id)
    thisPage.timeout.startTimeout("get stored nickname");
    thisPage.storage.get('nickname').then(nickname => {

      thisPage.timeout.endTimeout();

      console.log("Sending nickname: "+nickname);

      thisPage.timeout.startTimeout("get stored color");
      thisPage.storage.get('color').then(color => {

        thisPage.timeout.endTimeout();

        console.log("Sending color: "+color);

        thisPage.httpProvider.joinSession(this.session_id, nickname, color).then( (json) => {

          thisPage.timeout.endTimeout();

          var session_vars = JSON.parse(json.data);

          console.log("joinSession Response JSON: "+session_vars);
          var user_id = session_vars.user_id;
          console.log("joinSession Response JSON user_id: "+user_id);

          thisPage.storeJoinSessionResponse(this.session_id, user_id);

        }, (err) => {
          console.log("Join Session Error: "+err)
        });
      });
    });

  }

  /**
   * Stores the parameters in local storage from the response of joining a session
   * @param  {String} session_id The ID of the session the client joined
   * @param  {String} user_id    The user ID of the client
   */
  storeJoinSessionResponse(session_id, user_id) {

    var thisPage = this;

    thisPage.timeout.startTimeout("saving session_id to local storage");
    thisPage.storage.set('session_id', session_id).then( (data) => {

      thisPage.timeout.endTimeout();

      thisPage.timeout.startTimeout("saving user_id to local storage");
      thisPage.storage.set('user_id', user_id).then( (data) => {

        thisPage.timeout.endTimeout();

        console.log("Redirecting to SessionPage");
        this.navCtrl.setRoot("SessionPage");

      }, (err) => {
        console.log("Storing user_id "+user_id+" in local storage failed...");
      });

    }, (err) => {
      console.log("Storing session_id "+session_id+" in local storage failed...");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinSessionPage');
  }

}
