import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { FirestoreService } from '../../services/data/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  public createSongForm: FormGroup;

  constructor(
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public firestoreService: FirestoreService,
  public formBuilder: FormBuilder,
  private router: Router,
  private toastCtrl:ToastController
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
    const t = await this.toastCtrl.create();
    const albumName = this.createSongForm.value.albumName;
    const artistName = this.createSongForm.value.artistName;
    const songDescription = this.createSongForm.value.songDescription;
    const songName = this.createSongForm.value.songName;


    console.log( this.createSongForm.value);

    this.firestoreService.createSong(albumName, artistName, songDescription, songName)
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

}
