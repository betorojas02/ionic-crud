import { Song } from './../../models/song.interface';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/data/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {


  songs: Song = {
    albumName: '',
    artistName: '',
    songDescription: '',
    songName: '',
  };
  public songForm: FormGroup;
  songId=null;
  // public song:  Observable<Song>;
  constructor(private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    public formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,) { 
     
    }

  ngOnInit() {
this.loadTodo();
    


   
  }

  async loadTodo(){
    const loading = await this.loadingController.create({
      message: 'Cargando....'
    });
    await loading.present();

    this.songId = this.route.snapshot.paramMap.get('id');
      this.firestoreService.getSongDetail(this.songId).valueChanges().subscribe(todo => {
       
        loading.dismiss();;
       console.log(todo);
       this.songs = todo;
     });

     console.log(this.songs);
  }




  async updateSong(){


  
    const loading = await this.loadingController.create();



    this.firestoreService.updateSong(this.songs)
    .then(
      () => {
        loading.dismiss().then(() => {
          console.log("guardo");
          this.router.navigateByUrl('/home');
      

          let alert = this.toastCtrl.create({
            message: 'Se edito un nuevo dato',
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
