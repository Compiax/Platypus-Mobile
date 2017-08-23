import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import * as io from 'socket.io-client';

// API server URL
const IP = 'http://192.168.43.144';
const URL = IP+':3000/mobile';
const HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'};

@Injectable()
export class HttpProvider {

  fileTransfer: FileTransferObject;
  socket: SocketIOClient.Socket;

  constructor(private http: HTTP, private transfer: FileTransfer, private file: File) {
    console.log("Http Provider Instantiated");
    this.fileTransfer = this.transfer.create();
    this.socket = io(IP+':3002');
    this.handleListeners();
  }

  handleListeners() {
    this.socket.on('sendItem', this.getItem);
  }

  claimItem(session_id, user_id, item_id) {
    this.socket.emit('claimItem', { session_id: session_id, user_id: user_id, item_id: item_id });
  }

  createItem(session_id) {
    this.socket.emit('createItem', { session_id: session_id });
  }

  deleteItem(session_id, item_id) {
    this.socket.emit('deleteItem', { session_id: session_id, item_id: item_id });
  }

  editItem(session_id, price, name, quantity, item_id) {
    this.socket.emit('editItem', { session_id: session_id, price: price, name: name, quantity: quantity, item_id: item_id });
  }

  getItem(data) {
      console.log("Got item: "+data);
      // @todo Check if the item in data exists (ID). If it does replace it's information. Else add it to the items.
  }

  /**
  * Request te API to create a new session
  * @param  {String}  nickname  The nickname of the session owner
  * @param  {String}  color     The color chosen by the owner
  * @return {String}            The JSON string containing a session_id and user_id
  */
  createSession(nickname, color) {

    console.log("Sending Data...");
    let data = {"nickname": nickname, "color": color};
    let url = URL+"/createSession";
    let responseJSON = this.http.post(url, data, HEADERS);
    console.log("Returing response...");
    return responseJSON;
  }

  /**
  * Send a request to the API to join a session with the specified ID
  * @param  {Integer}  session_id The session id of the session to join
  * @return {String}              A JSON string containing a new user_id for the joining client
  */
  joinSession(session_id, nickname, color) {

    // Set HTTP request parameters
    let data = {"session_id": session_id, "nickname": nickname, "color": color};
    let url = URL+"/joinSession";

    console.log("Sending join session data to API server")
    let responseJSON = this.http.post(url, data, HEADERS);
    console.log("Returing response...");
    return responseJSON;
  }

  /**
   * Sends an image to the API for OCR processing
   * @param  {String} imageData base64 image captured by user
   * @return {String}           JSON string containing the reciept items and their values
   */
  sendSessionImage(imageData, session_id) {

    console.log("SendSessionImage entered");

    let extension = ".jpg";
    let filename = session_id+extension;
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: filename,
      mimeType: 'image/jpg',
      chunkedMode: false,
      params: { "session_id":session_id }
    };
    let url = URL+"/sendImage";
    console.log("Sending image data to "+URL+" server");
    return this.fileTransfer.upload(imageData, url, options);

  }

}
