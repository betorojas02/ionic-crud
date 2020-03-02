import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { FirestoreService } from '../services/data/firestore.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public songList;
  constructor(
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit() {
  this.songList = this.firestoreService.getSongList().valueChanges();

  console.log("listado ",this.songList);
}

}
