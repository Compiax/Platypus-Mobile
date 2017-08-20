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
    protected storage: Storage,
    private httpProvider: HttpProvider,
    private timeout: Timeout) { }

  /**
   * Attempts to join a session through promise chaining and saves the response locally
   */
  joinSession(): void {

    this.timeout.startTimeout("Getting Nickname");  // Initial timeout
    this.getNickname(this)
    .then( (data) => { this.timeout.timeoutHandler("Getting Color"); return this.getColor(data, this); })
    .then( (data) => { this.timeout.timeoutHandler("Sending Join Request to Server"); return this.sendJoinRequest(data, this); })
    .then( (data) => { this.timeout.timeoutHandler("Storing User ID"); return this.storeUserId(data, this); })
    .then( (data) => { this.timeout.timeoutHandler("Storing Session ID"); return this.storeSessionId(this); })
    .then( (data) => {

      this.timeout.endTimeout();  // Stop timeout chain

      console.log("Redirecting to SessionPage");
      this.navCtrl.setRoot("SessionPage");
    });
  }

  /**
   * Attempts to retrieve the locally stored nickname
   * @param  {} scope Reference to the class scope
   */
  getNickname(scope){

    console.log("Attempting to retrieve the user's nickname");
    return new Promise(function (resolve, reject) {
      scope.storage.get('nickname').then(nickname => {

        console.log("Successfully retrieved the nickname: "+nickname);
        resolve(nickname);

      }, (err) => { reject(err) });
    });
  }

  /**
   * Attempts to retrieve the locally stored color
   * @param  {string} input Input from the previous chained call (nickname)
   * @param  {} scope Reference to the class scope
   */
  getColor(input, scope){

    console.log("Attempting to retrieve the user's color");
    return new Promise(function (resolve, reject) {
      scope.storage.get('color').then(color => {

        console.log("Successfully retrieved the color: "+color);
        resolve({ nickname: input, color:color });

      }, (err) => { reject(err) });
    });
  }

  /**
   * Attempts to send a request to the server to join the session
   * @param  {string} input Input from the previous chained call ({nickname, color})
   * @param  {} scope Reference to the class scope
   */
  sendJoinRequest(input, scope) {

    console.log("Attempting to send a request to the server to join a session");
    return new Promise(function (resolve, reject) {
      scope.httpProvider.joinSession(scope.session_id, input.nickname, input.color).then( (json) => {

        var session_vars = JSON.parse(json.data);
        var user_id = session_vars.user_id;

        console.log("Successfully joined the session and retrieved the User ID: "+user_id);
        resolve(session_vars.user_id);

      }, (err) => { reject(err) });
    });
  }

  /**
   * Attempts to store the user id locally
   * @param  {string} input Input from the previous chained call (user id)
   * @param  {} scope Reference to the class scope
   */
  storeUserId(input, scope){

    console.log("Attempting to store the User ID");
    return new Promise(function (resolve, reject) {
      scope.storage.set('user_id', input).then( (data) => {

        console.log("Successfully stored User ID: "+input);
        resolve(input);

      }, (err) => { reject(err) });
    });
  }

  /**
   * Attempts to store the session id locally
   * @param  {} scope Reference to the class scope
   */
  storeSessionId(scope){

    console.log("Attempting to store the Session ID");
    return new Promise(function (resolve, reject) {
      scope.storage.set('session_id', scope.session_id).then( (data) => {

        console.log("Successfully stored User ID: "+scope.session_id);
        resolve(scope.session_id);

      }, (err) => { reject(err) });
    });
  }

}
