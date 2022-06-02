import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { SynapseService } from 'src/app/shared/services/synapse.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-matrix-menu',
  templateUrl: './matrix-menu.component.html',
  styleUrls: ['./matrix-menu.component.scss']
})
export class MatrixMenuComponent implements OnInit {


  configForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private synapse: SynapseService, private route: Router) { }

  menuExpanded: boolean = false;

  ngOnInit(): void {
    this.configForm = this.formBuilder.group({
      homeserver: [this.synapse.homeserver$, Validators.required],
      roomId: [this.synapse.roomId$, Validators.required],
      mediaGallery: [this.synapse.mediaGallery$],
      carousel: [this.synapse.carousel$],
      fromStart: [this.synapse.fromStart$]
    });

  }

  expandMenu() {
    this.menuExpanded = true;
    // this.configForm.setValue({
    //   homeserver: this.synapse.homeserver$,
    //   roomId: this.synapse.roomId$,
    //   mediaGallery: this.synapse.mediaGallery$,
    //   carousel: this.synapse.carousel$,
    //   fromStart: this.synapse.fromStart$
    // })
  }

  closeMenu() {
    this.menuExpanded = false;
  }

  checkCarousel(e: any) {
    if (e.target.checked){
      this.configForm.patchValue({ mediaGallery: false })
    }
  }

  checkGallery(e: any) {
    if (e.target.checked){
      this.configForm.patchValue({ carousel: false })
    }
  }

  submitConfig() {
    // this.synapse.setHomeserver(this.configForm.value.homeserver);
    // this.synapse.setRoomId(this.configForm.value.roomId);
    // this.synapse.setMediaGallery(this.configForm.value.mediaGallery);
    // this.synapse.setCarousel(this.configForm.value.carousel);
    // this.synapse.setFromStart(this.configForm.value.fromStart);
    this.closeMenu();
    // this.synapse.initiateRoom().subscribe();
    this.navigateWithParams(
      this.configForm.value.homeserver, 
      this.configForm.value.roomId,
      this.configForm.value.mediaGallery,
      this.configForm.value.fromStart
      )
  }

  navigateWithParams(homeserver: string, roomId: string, mediaGallery: boolean, fromStart: boolean ) {
    this.route.navigate(
      [""],
      { queryParams: {homeserver: homeserver, roomId: roomId, mediaGallery: mediaGallery, fromStart: fromStart} }
      )
  }

}
