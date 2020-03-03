import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { FirestoreService } from '../../services/data/firestore.service';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/file/ngx";

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  public createSongForm: FormGroup;
  public image :any;
  constructor(
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public firestoreService: FirestoreService,
  public formBuilder: FormBuilder,
  private router: Router,
  private toastCtrl:ToastController,
  private camera: Camera, 
  private file: File
  ) 
  {  
    this.createSongForm = formBuilder.group({
    albumName: ['', Validators.required],
    artistName: ['', Validators.required],
    songDescription: ['', Validators.required],
    songName: ['', Validators.required],
  });
}

  ngOnInit() {
    
    
  
  }

  async createSong() {
    const loading = await this.loadingCtrl.create();
    const albumName = this.createSongForm.value.albumName;
    const artistName = this.createSongForm.value.artistName;
    const songDescription = this.createSongForm.value.songDescription;
    const songName = this.createSongForm.value.songName;

    const songImage = this.image;


    console.log( this.createSongForm.value);

    this.firestoreService.createSong(albumName, artistName, songDescription, songName, songImage)
    .then(
      () => {
        loading.dismiss().then(() => {
          console.log("guardo");
          this.router.navigateByUrl('/home');
      

          let alert = this.toastCtrl.create({
            message: 'Se agrego un nuevo dato',
            duration: 3000,
           
          }).then(alert=> alert.present());

          
        });
       
      },
      error => {
        console.error(error);
      }
    );
  
    return await loading.present();
  
     
  }



  async pickImage() {
    try {
      const options: CameraOptions = {
        quality: 80,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.ALLMEDIA,
        sourceType : this.camera.PictureSourceType.PHOTOLIBRARY
      };

      let cameraInfo = await this.camera.getPicture(options);
      let blobInfo = await this.makeFileIntoBlob(cameraInfo);

    
      let uploadInfo: any = await this.uploadToFirebase(blobInfo);

     

      alert("File Upload Success " + uploadInfo.fileName);
    } catch (e) {
      console.log(e.message);
      alert("File Upload Error " + e.message);
    }
  }

  // FILE STUFF
  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;

          // get the path..
          let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
          console.log("path", path);
          console.log("fileName", name);

          fileName = name;

          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });
          console.log(imgBlob.type, imgBlob.size);
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  /**
   *
   * @param _imageBlobInfo
   */
  uploadToFirebase(_imageBlobInfo) {
    console.log("uploadToFirebase");
    // return new Promise((resolve, reject) => {
    //   let fileRef = firebase.storage().ref("images/" + _imageBlobInfo.fileName);

    //   let uploadTask = fileRef.put(_imageBlobInfo.imgBlob);

    //   uploadTask.on(
    //     "state_changed",
    //     (_snapshot: any) => {
    //       console.log(
    //         "snapshot progess " +
    //           (_snapshot.bytesTransferred / _snapshot.totalBytes) * 100
    //       );
    //     },
    //     _error => {
    //       console.log(_error);
    //       reject(_error);
    //     },
    //     () => {
    //       // completion...
    //       resolve(uploadTask.snapshot);
    //     }
    //   );
    // });

  this.image = _imageBlobInfo.fileName;
  }



}
