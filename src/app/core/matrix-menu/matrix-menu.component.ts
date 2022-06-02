import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SynapseService } from 'src/app/shared/services/synapse.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-matrix-menu',
  templateUrl: './matrix-menu.component.html',
  styleUrls: ['./matrix-menu.component.scss']
})
export class MatrixMenuComponent implements OnInit {


  configForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private synapse: SynapseService) { }

  menuExpanded: boolean = false;

  ngOnInit(): void {
    this.configForm = this.formBuilder.group({
      homeserver: ["", Validators.required],
      roomId: ["", Validators.required],
      mediaGallery: [false],
      carousel: [false],
      fromStart: [false]
    });
  }

  expandMenu() {
    this.menuExpanded = true;
    this.configForm.setValue({
      homeserver: this.synapse.homeserver$,
      roomId: this.synapse.roomId$,
      mediaGallery: this.synapse.mediaGallery$,
      carousel: this.synapse.carousel$,
      fromStart: this.synapse.fromStart$
    })
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
    this.synapse.setHomeserver(this.configForm.value.homeserver);
    this.synapse.setRoomId(this.configForm.value.roomId);
    this.synapse.setMediaGallery(this.configForm.value.mediaGallery);
    this.synapse.setCarousel(this.configForm.value.carousel);
    this.synapse.setFromStart(this.configForm.value.fromStart);
    this.closeMenu();
    this.synapse.initiateRoom().subscribe();
  }

}
