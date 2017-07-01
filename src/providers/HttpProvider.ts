import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

const URL = 'http://localhost:3000/test';

@Injectable()
export class HttpProvider {

  constructor(public http: Http) {
    console.log("Http Provider Instantiated");
  }

  createSession(nickname, color) {
    let responseJSON; // responseJSON.data.session_id

    console.log('Calling '+URL+'/createSession from HttpProvider');
    this.http.post(URL+'/createSession', {nickname: nickname, color: color})
      .subscribe(res => {
        responseJSON = res.json();
      }, (err) => {
        console.log(err);
        return false;
      });

    console.log('Returning JSON response from HttpProvider');
    return responseJSON;
  }

  joinSession(session_id) {
	  let data = { id: session_id };
    let responseJSON; // responseJSON.data.user_id

    this.http.post(URL+'/joinSession', JSON.stringify(data))
      .subscribe(res => {
      	responseJSON = res.json();
      }, (err) => {
      	console.log(err);
        return false;
      });

    return responseJSON;
  }

  sendSessionImage(imageData) {
    // @todo Send image data to API
  }

}
