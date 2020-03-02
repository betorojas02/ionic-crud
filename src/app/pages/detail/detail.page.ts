import { Song } from './../../models/song.interface';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/data/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  songId = '';
  public song: Observable<Song>;
  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private alertController:AlertController,
    private router: Router,
    private toastCtrl:ToastController,
  ) {}

  ngOnInit() {
    this.songId = this.route.snapshot.paramMap.get('id');
    this.song = this.firestoreService.getSongDetail(this.songId).valueChanges();

    console.log("datos que traigo de firebase",this.song);
  }
  async deleteSong() {
    const alert = await this.alertController.create({
      message: 'Esta seguro que desea eliminar la canción',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          handler: () => {
            this.firestoreService.deleteSong(this.songId).then(() => {
              this.router.navigateByUrl('');
              let alert = this.toastCtrl.create({
                message: 'Se elimino un dato',
                duration: 3000,
               
              }).then(alert=> alert.present());
            });
          },
        },
      ],
    });
   
    await alert.present();
  }

}   
