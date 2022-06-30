import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { SynapseService } from 'src/app/shared/services/synapse.service';

@Component({
  selector: 'app-matrix-menu',
  templateUrl: './matrix-menu.component.html',
  styleUrls: ['./matrix-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatrixMenuComponent implements OnInit {


  configForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private synapse: SynapseService, private route: Router) { }

  menuExpanded: boolean = false;

  ngOnInit(): void {
    this.configForm = this.formBuilder.group({
      homeserver: [this.synapse.pageConfig$.homeserver, Validators.required],
      roomId: [this.synapse.pageConfig$.roomId, Validators.required],
      roomAlias: [''],
      mediaGallery: [this.synapse.pageConfig$.mediaGallery],
      carousel: [this.synapse.pageConfig$.carousel],
      fromStart: [this.synapse.pageConfig$.fromStart]
    });

    this.onChanges();
  }

  onChanges() {
    this.configForm.get('roomAlias')?.valueChanges.pipe(debounceTime(1000)).subscribe(alias => {
      var pattern = new RegExp(`#[^:]*:.+`);
      if (pattern.test(alias)) {
        this.synapse.getRoomIdFromAlias(alias).subscribe(
          {
            next: (response) => {
              if (response["room_id"]) {
                this.configForm.patchValue({
                  roomId: response.room_id
                })
              }
            },
            error: (error) => {
              if (error.error["errcode"] && error.error["errcode"] === 'M_NOT_FOUND') {
                this.configForm.controls['roomAlias'].setErrors({ err: error.error["error"] });
              } else {
                console.error("This alias doesn't exists")
              }
            }
          }
        )
      }
    })
  }

  expandMenu() {
    this.menuExpanded = true;
    this.configForm.setValue({
      homeserver: this.synapse.pageConfig$.homeserver,
      roomId: this.synapse.pageConfig$.roomId,
      roomAlias: '',
      mediaGallery: this.synapse.pageConfig$.mediaGallery,
      carousel: this.synapse.pageConfig$.carousel,
      fromStart: this.synapse.pageConfig$.fromStart
    })
  }

  closeMenu() {
    this.menuExpanded = false;
  }

  checkCarousel(e: any) {
    if (e.target.checked) {
      this.configForm.patchValue({ mediaGallery: false })
    }
  }

  checkGallery(e: any) {
    if (e.target.checked) {
      this.configForm.patchValue({ carousel: false })
    }
  }

  submitConfig() {
    this.closeMenu();
    this.navigateWithParams(
      this.configForm.value.homeserver,
      this.configForm.value.roomId,
      this.configForm.value.mediaGallery,
      this.configForm.value.fromStart
    )
  }

  navigateWithParams(homeserver: string, roomId: string, mediaGallery: boolean, fromStart: boolean) {
    this.route.navigate(
      [""],
      { queryParams: { homeserver: homeserver, roomId: roomId, mediaGallery: mediaGallery, fromStart: fromStart } }
    )
  }

}
