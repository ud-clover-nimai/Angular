import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { call } from '../../../assets/js/bootstrap-filestyle.min'
import { TitleService } from 'src/app/services/titleservice/title.service';
import { KycuploadService } from 'src/app/services/kyc-upload/kycupload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { loadFilestyle ,loads} from '../../../assets/js/commons'
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import * as $ from '../../../assets/js/jquery.min';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-kyc-details',
  templateUrl: './kyc-details.component.html',
  styleUrls: ['./kyc-details.component.css']
})
export class KycDetailsComponent implements OnInit {
  public kycDetailsForm: FormGroup;
  public submitted:boolean = false;
  selectedFiles: File[] = [];

  public title: string = "KYC Details";
  public subURL: string = "";
  public parentURL: string = "";
  parentRedirection: string = "account-review";
  isBank: boolean = false;
  isCustomer: boolean = false;
  resp: any;
  itemData:any = [];
  imageSrcBusi: any;
  imageSrcPer: any;
  private filename: string = '';
  kycStatusData: any;
  disabledBusiness: boolean=false;
  disabledpersonal: boolean=false;
  rejectReason: string;
  rejectedTitle: any;
  detail: any;

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
      busiCountry: ['', Validators.required],
      busiDocument: ['', Validators.required],   
      perCountry: ['', Validators.required],  
      perDocument : ['', Validators.required]
    })
  }
  ngOnInit() {
    loads();
    this.titleService.changeTitle(this.title);
     let kycStatus = sessionStorage.getItem("kycStatus");
    if(kycStatus=="Approved"){
      this.router.navigate([`/${this.subURL}/${this.parentURL}/dashboard-details`])
    } 
    if(kycStatus=="Pending"){   
      this.router.navigate([`/${this.subURL}/${this.parentURL}/account-review`]) 
    }
   this.checkStatus();
  }
checkStatus(){ 
   var userId = sessionStorage.getItem("userID")
  this.kycService.viewKycDetails(userId)
  .subscribe(
    response => {
      this.kycStatusData= JSON.parse(JSON.stringify(response));
      for (let i = 0; i < this.kycStatusData.length; i++) {
        if(this.kycStatusData[i].title=="Business"){
          if(this.kycStatusData[i].kycStatus== "Rejected"){
            this.disabledBusiness=true;
            this.rejectReason=this.kycStatusData[i].reason;
            this.rejectedTitle=this.kycStatusData[i].title;
            $('#rejectedPopup').show();
          }
          this.kycDetailsForm.patchValue({      
            busiCountry: this.kycStatusData[i].country,
            busiDocument:this.kycStatusData[i].documentName,  
            encodedFileContent:this.kycStatusData[i].encodedFileContent,
          })
          this.imageSrcBusi=this.kycStatusData[i].encodedFileContent;
         } 
         if (this.kycStatusData[i].title=="Personal"){
          if(this.kycStatusData[i].kycStatus== "Rejected"){
            console.log("title--->",this.kycStatusData[i].title)
            this.disabledpersonal=true;
            this.rejectReason=this.kycStatusData[i].reason;
            this.rejectedTitle=this.kycStatusData[i].title;

            $('#rejectedPopup').show();
          }
          this.kycDetailsForm.patchValue({                 
      perCountry: this.kycStatusData[i].country,  
      perDocument :this.kycStatusData[i].documentName,
     encodedFileContent:this.kycStatusData[i].encodedFileContent,
          })
          this.imageSrcPer=this.kycStatusData[i].encodedFileContent;

         }
      }  
    },
    error => {
      this.detail = JSON.parse(JSON.stringify(error)).message;
      console.log(this.detail)
      this.disabledBusiness=true;
      this.disabledpersonal=true;

    })


}
closePopup(){
  $('#rejectedPopup').hide();
}
  getBusiList(){
    return this.fb.group({
    documentName: [''],
    title: ['Business'],
    country: [''],
    encodedFileContent: ['', Validators.required],
    documentType: ['jpg']
  });
}

  getPersList(){
    return this.fb.group({
    documentName: [''],
    title: ['Personal'],
    country: [''],
    encodedFileContent: ['',Validators.required],
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

get kycDetails() {
  return this.kycDetailsForm.controls;
}
  submit(): void {
    this.submitted = true;    
    //  if(this.kycDetailsForm.invalid) {
    //         return;
    // }
   
    const businessDocumentList = <FormArray>this.kycDetailsForm.get('businessDocumentList');
    businessDocumentList.controls = [];

    businessDocumentList.push(this.fb.group({
      documentName: $('#busiDocument').val(),
      title: ['Business'],
      country: this.kycDetailsForm.get('busiCountry').value,
      encodedFileContent: [this.imageSrcBusi],
      documentType: ['jpg']      
    }));
  
  
    const personalDocumentList = <FormArray>this.kycDetailsForm.get('personalDocumentList');
    personalDocumentList.controls = [];
    personalDocumentList.push(this.fb.group({
      documentName: $('#perDocument').val(),
      title: ['Personal'],
      country: this.kycDetailsForm.get('perCountry').value,
      encodedFileContent: [this.imageSrcPer],
      documentType: ['jpg']      
    }));

    var data = {
      "userId" : sessionStorage.getItem("userID"),
      "businessDocumentList": this.kycDetailsForm.get('businessDocumentList').value,
      "personalDocumentList": this.kycDetailsForm.get('personalDocumentList').value,
    }

    let busi = this.kycDetailsForm.get('businessDocumentList') as FormArray;
    if(busi.controls.length == 0){
      this.failedError();
      return;
    } else if(busi.controls[0].value.documentName.toLowerCase() == "select" || busi.controls[0].value.country.toLowerCase() == "select" || busi.controls[0].value.encodedFileContent == null){
      businessDocumentList.controls = [];
      this.failedError();
      return;
    }

    let pers = this.kycDetailsForm.get('personalDocumentList') as FormArray;
    if(pers.controls.length == 0){
      this.failedError();
      return;
    } else if(pers.controls[0].value.documentName.toLowerCase() == "select" || pers.controls[0].value.country.toLowerCase() == "select" || pers.controls[0].value.encodedFileContent == null){
      personalDocumentList.controls = [];
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
    // $("#moreImageUploadLinkType").show();
    this.itemData = data;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.filename=file.name;
    var reader = new FileReader();
    // if (!file.type.match(pattern)) {
    //   alert('invalid format');
    //   return;
    // }
    // else{
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);     
   // }
    
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrcBusi =this.filename +" |" + reader.result;
    this.kycDetailsForm.get('encodedFileContent').setValue(this.imageSrcBusi);
   
  }

  selectFile_KYC(e) {
      // $("#moreImageUploadLink").show();
    
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.filename=file.name;
    var reader = new FileReader();
    // if (!file.type.match(pattern)) {
    //   alert('invalid format');
    //   return;
    // }
    // else{
      reader.onload = this._handleReaderLoaded_KYC.bind(this);
      reader.readAsDataURL(file);
   // }
    
  }
  _handleReaderLoaded_KYC(e) {
    let reader = e.target;
  
    this.imageSrcPer =this.filename +" |" + reader.result;
    this.kycDetailsForm.get('encodedFileContent').setValue(this.imageSrcPer);
   
  }

  
}