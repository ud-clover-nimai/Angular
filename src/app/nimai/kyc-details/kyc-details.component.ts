import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { call } from '../../../assets/js/bootstrap-filestyle.min'
import { TitleService } from 'src/app/services/titleservice/title.service';
import { KycuploadService } from 'src/app/services/kyc-upload/kycupload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { loadFilestyle ,loads} from '../../../assets/js/commons'
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import * as $ from '../../../assets/js/jquery.min';


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
  isBank: boolean = false;
  isCustomer: boolean = false;
  resp: any;
  imageSrc: any;
  itemData:any = [];

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

    let userID = sessionStorage.getItem("userID");
    if((userID.startsWith('BA')) || (userID.startsWith('BC'))){
      this.isBank = true;
    }
    else if(userID.startsWith('CU')){
      this.isCustomer = true;
    }

    this.resp = JSON.parse(sessionStorage.getItem('countryData'));

     this.kycDetailsForm = this.fb.group({
      businessDocumentList: this.fb.array([]),
      personalDocumentList: this.fb.array([]),
      businessDocumentList_html: this.fb.array([this.getBusiList()]),
      personalDocumentList_html: this.fb.array([this.getPersList()]),

    });

    if(sessionStorage.getItem("KYCStatus").toLowerCase() == "pending"){
      this.router.navigate([this.subURL + '/' + this.parentURL + '/account-review']);
    }

  }

  ngOnInit() {
   
    loads();
    this.titleService.changeTitle(this.title);
  }

  getBusiList(){
    return this.fb.group({
    documentName: [''],
    title: ['Business'],
    country: [''],
    encodedFileContent: [''],
    documentType: ['jpg']
  });
}

  getPersList(){
    return this.fb.group({
    documentName: [''],
    title: ['Personal'],
    country: [''],
    encodedFileContent: [''],
    documentType: ['jpg']
  });
}

add(i: number, type) {
  if(type){
    let items = this.kycDetailsForm.get('businessDocumentList_html') as FormArray;
    if (items.length < 3)
    {
      items.push(this.getBusiList());
    }
  }
  else{
    let items = this.kycDetailsForm.get('personalDocumentList_html') as FormArray;
    if (items.length < 3)
    {
      items.push(this.getPersList());
    }
  }
}

remove(i: number, type) {
  if(type){
    let items = this.kycDetailsForm.get('businessDocumentList_html') as FormArray;
    items.removeAt(i);
  }
  else{
    let items = this.kycDetailsForm.get('personalDocumentList_html') as FormArray;
    items.removeAt(i);
  }
}


  submit(): void {

    var data = {
      "userId" : sessionStorage.getItem("userID"),
      "businessDocumentList": this.kycDetailsForm.get('businessDocumentList').value,
      "personalDocumentList": this.kycDetailsForm.get('personalDocumentList').value,
    }

    let busi = this.kycDetailsForm.get('businessDocumentList') as FormArray;
    if(busi.controls.length == 0){
      this.failedError();
      return;
    } else if(busi.controls[0].value.documentName.toLowerCase() == "select" || busi.controls[0].value.country.toLowerCase() == "select"){
      this.failedError();
      return;
    }

    let pers = this.kycDetailsForm.get('personalDocumentList') as FormArray;
    if(pers.controls.length == 0){
      this.failedError();
      return;
    } else if(pers.controls[0].value.documentName.toLowerCase() == "select" || pers.controls[0].value.country.toLowerCase() == "select"){
      this.failedError();
      return;
    }

    

    this.kycService.upload(data)
      .subscribe(
        resp => {
          
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
          this.failedError();
        });



  }

  failedError(){
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
  }

  selectFile(e, data) {
    $("#moreImageUploadLinkType").show();
    this.itemData = data;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    else{
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);     
    }
    
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;

    const control = <FormArray>this.kycDetailsForm.get('businessDocumentList');

     control.push(this.fb.group({
      documentName: $('#busiDocument').val(),
      title: ['Personal'],
      country: $('#busiCountry').val(),
      encodedFileContent: [this.imageSrc],
      documentType: ['jpg']      
    }));

  }

  selectFile_KYC(e) {
      // $("#moreImageUploadLink").show();
    
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    else{
      reader.onload = this._handleReaderLoaded_KYC.bind(this);
      reader.readAsDataURL(file);
    }
    
  }
  _handleReaderLoaded_KYC(e) {
    let reader = e.target;
    this.imageSrc = reader.result;

    const control = <FormArray>this.kycDetailsForm.get('personalDocumentList');

     control.push(this.fb.group({
      documentName: $('#perDocument').val(),
      title: ['Personal'],
      country: $('#perCountry').val(),
      encodedFileContent: [this.imageSrc],
      documentType: ['jpg']      
    }));
  }

  
}
