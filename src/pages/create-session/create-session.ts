import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { HttpProvider } from '../../providers/HttpProvider';
import { Camera, CameraOptions } from '@ionic-native/camera';

// @todo Add try again button in interface to relaunch the camera
@IonicPage()
@Component({
  selector: 'page-create-session',
  templateUrl: 'create-session.html',
})

export class CreateSessionPage {

  loading: any; // Loading spinner
  imageData: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private camera: Camera,
    private httpProvider:HttpProvider) {

      console.log("Initialize loading spinner");
      this.loading = this.loadingCtrl.create({
        content: "<ion-spinner></ion-spinner>"
      });

  }

  captureImage() {
    console.log("Accessing device's camera and saving the captured data");
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
	    correctOrientation:true
    };

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageData = base64Image;
    }, (err) => {
      console.log("Camera error occured: "+err);
      return false;
    });

    return true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateSessionPage');
  }

  ionViewDidEnter() {

    console.log("CreateSessionPage View Did Enter");

    if(this.captureImage()){

      this.loading.present();
      console.log("Call http provider's createSession");
      var session_id = this.httpProvider.createSession(this.imageData).data.session_id;
      this.loading.dismiss();

      if(session_id){
        console.log("Redirecting to JoinSessionPage");
        this.navCtrl.push('JoinSessionPage', {session_id: session_id});
      } else {
        console.log("Invalid Session id. Http provider must've encountered a problem.");
      }
    }
  }

}
