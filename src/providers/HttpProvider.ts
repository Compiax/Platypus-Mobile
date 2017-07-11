import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

// API server URL
const URL = 'http://localhost:3000/mobile';

@Injectable()
export class HttpProvider {

  constructor(public http: Http) {
    console.log("Http Provider Instantiated");
  }

  /**
  * Request te API to create a new session
  * @param  {String}  nickname  The nickname of the session owner
  * @param  {String}  color     The color chosen by the owner
  * @return {String}            The JSON string containing a session_id and user_id
  */
  createSession(nickname, color) {

    // Set HTTP request parameters
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let data = "nickname="+nickname+"&color="+color;

    // Send data to the API and store the response
    let responseJSON = this.http.post(URL+'/createSession', data,  options);

    return responseJSON;
  }

  /**
  * Send a request to the API to join a session with the specified ID
  * @param  {Integer}  session_id The session id of the session to join
  * @return {String}              A JSON string containing a new user_id for the joining client
  */
  joinSession(session_id) {

    // Set HTTP request parameters
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
	  let data = { id: session_id };

    // Send data to the API and store the response
    let responseJSON = this.http.post(URL+'/joinSession', data,  options);

    return responseJSON;
  }

  /**
   * Sends an image to the API for OCR processing
   * @param  {String} imageData [description]
   * @return {String}           JSON string containing the reciept items and their values
   */
  sendSessionImage(imageData) {
    // @todo Send image data to API
  }

}
