import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

const URL = 'http://localhost:3000/mobile';

@Injectable()
export class HttpProvider {

  constructor(public http: Http) {
    console.log("Http Provider Instantiated");
  }

  createSession(nickname, color) {

    console.log('Calling '+URL+'/createSession from HttpProvider and sending '+nickname+' and '+color);

    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let data = "nickname="+nickname+"&color="+color;
    let responseJSON = this.http.post(URL+'/createSession', data,  options);

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
