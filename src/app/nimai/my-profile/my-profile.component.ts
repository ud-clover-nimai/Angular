import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { KycuploadService } from 'src/app/services/kyc-upload/kycupload.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { signup } from 'src/app/beans/signup';
import * as $ from '../../../assets/js/jquery.min';
import  { ValidateRegex } from '../../beans/Validations';
import { BusinessDetailsService } from 'src/app/services/business-details/business-details.service';
import { Business } from 'src/app/beans/business';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  public title: string = "My Profile";
  personalDetails: any = "";
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  isReferrer: boolean = false;
  isBank: boolean = false;
  public bd: any = "";
  public kd: any = "";
  public isCustomer = false;
  document: any;
  noData:boolean
  imgDownload: boolean;
  fileData: any;

  constructor(public titleService: TitleService, 
    public personalDetailsService: PersonalDetailsService,
    public fb: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public bds: BusinessDetailsService,
    public kycUpload:KycuploadService,
    ) { 

   // this.titleService.changeTitle(this.title);
   setTimeout(() => {
    this.titleService.loading.next(false);
    }, 2000);

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    this.callPersonalDetailService();
    this.callBusinessDetailService(sessionStorage.getItem('userID'))
    this.callKycDetailService(sessionStorage.getItem('userID'))
    console.log("loading//////");


  }

  ngOnInit() {
    
    
  }

  personalDetailsForm = this.fb.group({

    firstName: ['', [Validators.required, Validators.maxLength(30)]],
    lastName: ['', [Validators.required, Validators.maxLength(30)]],
    emailId: ['', [Validators.required, Validators.email]],
    mobileNo: ['', Validators.required],
    landLineNo: [''],
    country: ['', Validators.required]
  });

  get perDetails() {
    return this.personalDetailsForm.controls;
  }

  callPersonalDetailService(){
    this.titleService.loading.next(true);
    this.personalDetailsService.getPersonalDetails(sessionStorage.getItem('userID'))
    .subscribe(
      (response) => {
        let responseData = JSON.parse(JSON.stringify(response));
        console.log(responseData.data)
        this.personalDetails = responseData.data;
        console.log("this.personalDetails.kycStatus---",this.personalDetails.kycStatus)
        var username = this.personalDetails.firstName + " " + this.personalDetails.lastName;
        this.titleService.changeUserName(username);
        this.personalDetailsForm.patchValue({
          firstName: this.personalDetails.firstName,
          lastName: this.personalDetails.lastName,
          emailId: this.personalDetails.emailAddress,
          mobileNo: this.personalDetails.mobileNum,
          landLineNo: this.personalDetails.landLinenumber,
          country: this.personalDetails.countryName
        });

        let subscriptionType = this.personalDetails.subscriberType;
          let bankType = this.personalDetails.bankType
          if (subscriptionType === 'REFERRER') {
            this.isReferrer = true;
            this.isBank = false;
          } else if (subscriptionType === 'BANK' && bankType === 'UNDERWRITER') {

            this.isBank = true;
            this.isReferrer = false;
          } else {
            this.isBank = false;
            this.isReferrer = false;
          }
  })}

  callBusinessDetailService(userID: string) {
    this.bds.viewBusinessDetails(userID).subscribe(
      (response) => {
        let responseData = JSON.parse(JSON.stringify(response));
        this.bd = responseData.data;
        if (this.bd.userId.startsWith('BA') || this.bd.userId.startsWith('RE')) {
          this.isCustomer = false;
        } else if (this.bd.userId.startsWith('CU') || this.bd.userId.startsWith('BC')) {
          this.isCustomer = true;
        }
      }   
    )
  }
  callKycDetailService(userID: string){
    console.log("userID--",userID)
    this.kycUpload.viewKycDetails(userID).subscribe(
      (response) => {        
        let responseData = JSON.parse(JSON.stringify(response));
        this.kd = responseData;

        if(!this.kd)
          this.noData = true;
        
        this.titleService.loading.next(false);
      }   
    )
  }

  download(){
    
    var str = this.fileData; 
    var splittedStr = str.split(" |", 2); 
    var data=splittedStr[1];
    var  base64string = data;
    
    var filename=splittedStr[0];
    var ext = filename.split("."); 
    var extension='.'+ext[1];

    if(extension=='.xlsx'){
    var  base64string= base64string.replace('data:application/octet-stream;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type:'application/octet-stream'});
      FileSaver.saveAs(blob, filename);
      this.imgDownload=false;
    } 
    else if(extension=='.pdf'){
      base64string= base64string.replace('data:application/pdf;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type: 'application/pdf' });
      FileSaver.saveAs(blob, filename);
      this.imgDownload=false;

    }  
     else if(extension=='.docx'){
        base64string= base64string.replace('data:application/octet-stream;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        FileSaver.saveAs(blob,filename);
        this.imgDownload=false;

    }
     else if(extension=='.csv'){
            base64string= base64string.replace('data:application/octet-stream;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'text/csv' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=false;

          }
          else if(extension=='.jpeg' || extension=='.jpg' || extension=='.png' || extension=='.svg'){
            base64string= base64string.replace('data:image/jpeg;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'image/jpeg' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=true;

          }               
              
              }
              convertbase64toArrayBuffer(base64) {
                var binary_string = window.atob(base64);
                var len = binary_string.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) {
                  bytes[i] = binary_string.charCodeAt(i);
                }
                return bytes.buffer;
              }

  openDocument(file){
    $('#modal_kycView').show();
   // this.document = file;
   console.log('kk')
    var str = file; 
    var splittedStr = str.split(" |", 2); 
    var filename=str.split(" |", 1); 
    var filename=splittedStr[0];
    var ext = filename.split("."); 
     if(ext[1]=='jpeg' || ext[1]=='jpg' || ext[1]=='png' || ext[1]=='svg'){
      this.imgDownload=true;
     }else{
      this.imgDownload=false;
     }
    var data=splittedStr[1];
    this.document = data;
    this.fileData=file;
  }
  close(){
    $('.modal3').hide();
  }

  public pdb(): signup {

    let data = {
      subscriberType: "",
      firstName: this.personalDetailsForm.get('firstName').value,
      lastName: this.personalDetailsForm.get('lastName').value,
      emailAddress: this.personalDetailsForm.get('emailId').value,
      mobileNum: this.personalDetailsForm.get('mobileNo').value,
      countryName: this.personalDetailsForm.get('country').value,
      landLinenumber: this.personalDetailsForm.get('landLineNo').value,
      companyName: "",
      designation: "",
      businessType: "",
      userId: sessionStorage.getItem('userID'),
      bankType: "",
      minLCValue: "",
      interestedCountry: [],
      blacklistedGoods:[],
      emailAddress1: "",
      emailAddress2: "",
      emailAddress3: ""
    }
    return data;
  }

  onSubmitPerDetails(): void {
    this.submitted = true;
    if(this.personalDetailsForm.invalid) {
      return;
    }
    this.submitted = false;
    $("#myModal5").hide();
    let userID: string = sessionStorage.getItem('userID');
    this.personalDetailsService.updatePersonalDetails(this.pdb(), userID)
      .subscribe(
        (response) => {
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Congratulations! Your Personal Details has been successfully submitted!',
              message: '',
              parent: this.parentURL + '/my-profile'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/my-profile/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        },
        (error) => {
          const navigationExtras: NavigationExtras = {
            state: {
              title: ' Your Personal Details has been failed!',
              message: 'Invalid Data',
              parent: this.parentURL + 'my-profile'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/my-profile/error`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        }
      )

  }

  validateRegexFields(event, type){
    if(type == "number"){
      ValidateRegex.validateNumber(event);
    }
    else if(type == "alpha"){
      ValidateRegex.alphaOnly(event);
    }
    else if(type == "alphaNum"){
      ValidateRegex.alphaNumeric(event);
    }
  }

  redirectOn(redirectVal){
    console.log('1111');
    
    const navigationExtras: NavigationExtras = {
      state: {
        redirectedFrom: "MyProfile"
      }
    };
    this.router.navigate([`/${this.subURL}/${this.parentURL}`+"/"+redirectVal], navigationExtras);
    }

}
