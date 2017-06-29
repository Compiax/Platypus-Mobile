import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpProvider {

  constructor(public http: Http) {
    console.log("Http Provider Instantiated");
  }

  createSession(imageData) {
    let responseJSON; // responseJSON.data.session_id

    this.http.post('http://splitbill.com/createSession', imageData)
      .subscribe(res => {
        responseJSON = res.json();
      }, (err) => {
        console.log(err);
        return false;
      });

    return responseJSON;
  }

  joinSession(session_id) {
	  let data = { id: session_id };
    let responseJSON; // responseJSON.data.user_id

    this.http.post('http://splitbill.com/joinSession', JSON.stringify(data))
      .subscribe(res => {
      	responseJSON = res.json();
      }, (err) => {
      	console.log(err);
        return false;
      });

    return responseJSON;
  }

}
