import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../../providers/HttpProvider';
import { Timeout } from '../../providers/Timeout';

@IonicPage()
@Component({
  selector: 'page-join-session',
  templateUrl: 'join-session.html',
  providers:[HttpProvider, Timeout]
})
export class JoinSessionPage {

  session_id: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private storage: Storage,
    private httpProvider: HttpProvider,
    private timeout: Timeout) { }

  joinSession(session_id): void {
    var thisPage = this;

    console.log("Call http provider's joinSession");
    thisPage.timeout.startTimeout("requesting join session from httpProvider");
    thisPage.httpProvider.joinSession(session_id).then( (json) => {

      thisPage.timeout.endTimeout();

      var session_vars = JSON.parse(json.data);

      console.log("joinSession Response JSON: "+session_vars);
      var user_id = session_vars.user_id;
      console.log("joinSession Response JSON user_id: "+user_id);
      // console.log("joinSession Response JSON: "+session_vars);
      // var user_id = session_vars.data.attributes.user_id;
      // console.log("joinSession Response JSON user_id: "+user_id);

      thisPage.storeJoinSessionResponse(session_id, user_id);

    }, (err) => { console.log("Join Session Error: "+err) });
  }

  storeJoinSessionResponse(session_id, user_id) {

    var thisPage = this;

    thisPage.timeout.startTimeout("saving session_id to local storage");
    thisPage.storage.set('session_id', session_id).then( (data) => {

      thisPage.timeout.endTimeout();

      thisPage.timeout.startTimeout("saving user_id to local storage");
      thisPage.storage.set('user_id', user_id).then( (data) => {

        thisPage.timeout.endTimeout();

        // console.log("Redirecting to JoinSessionPage");
        // thisPage.navCtrl.push('SessionPage', {session_id: session_id});

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
