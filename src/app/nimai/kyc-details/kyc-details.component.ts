import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { call } from '../../../assets/js/bootstrap-filestyle.min'
import { TitleService } from 'src/app/services/titleservice/title.service';
import { KycuploadService } from 'src/app/services/kyc-upload/kycupload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { loadFilestyle ,loads} from '../../../assets/js/commons'
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kyc-details',
  templateUrl: './kyc-details.component.html',
  styleUrls: ['./kyc-details.component.css']
})
export class KycDetailsComponent implements OnInit {
  public kycDetailsForm: FormGroup;
  selectedFiles: File[] = [];

  public title: string = "KYC Details";
  public subURL: string = "";
  public parentURL: string = "";
  parentRedirection: string = "account-review";

  constructor(public activatedRoute: ActivatedRoute, public fb: FormBuilder, public titleService: TitleService, public router: Router, public kycService: KycuploadService) {
    call();
    loadFilestyle();

    setTimeout(() => {
      this.titleService.loading.next(false);
      }, 2000);

    let navigation = this.router.getCurrentNavigation();

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    console.log(navigation);
    if(navigation.extras.state){
      if(navigation.extras.state.redirectedFrom == "MyProfile"){
        this.parentRedirection = "my-profile";
      }
    }


  }

  ngOnInit() {
    this.kycDetailsForm = this.fb.group({
      file: [''],
      busiDocument: [''],
      busiCountry: [''],
      perCountry:[''],
      perDocument:[''],

    });
    loads();
    this.titleService.changeTitle(this.title);
  }


  submit(): void {

    const formData: FormData = new FormData();

    if (this.selectedFiles.length) {
      for (let i = 0; i < this.selectedFiles.length; i++)
        formData.append('files', this.selectedFiles[i], this.selectedFiles[i].name),this;
    }

    formData.append('userId', sessionStorage.getItem('userID'));
    formData.append('fileType', 'pdf');

    this.kycService.upload(formData)
      .subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            console.log(Math.round(100 * event.loaded / event.total));
          } else if (event instanceof HttpResponse) {
            console.log(event.body.message);
          }
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Thank you for submitting the KYC documents.',
              message: 'Currently we are reviewing your account. You will be notified on registered email address once we complete the review.',
              parent: this.subURL + '/' + this.parentURL + '/' + this.parentRedirection
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        },
        err => {
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Oops! Something went wrong while uploading KYC documents',
              message: '',
              parent: this.subURL + '/' + this.parentURL + '/kyc-details'

            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/kyc-details/error`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        });



  }

  selectFile(event) {

    console.log("event-------",event)
    if (event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.selectedFiles.push(<File>event.target.files[i]);
      }
    }
    call();
    console.log("selectedFiles",this.selectedFiles)
  }

  creatFile(): FormGroup {
    return this.fb.group({
      file: ''
    })
  }

  addItem() {
    let item = this.kycDetailsForm.get('files') as FormArray;
    item.push(this.creatFile());
  }

}
