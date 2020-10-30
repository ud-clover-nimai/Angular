import { Component, OnInit, ViewChild } from '@angular/core';
import { Tflag } from 'src/app/beans/Tflag';
import { TitleService } from 'src/app/services/titleservice/title.service';
import * as $ from '../../../../../assets/js/jquery.min';
import { TransactionBean } from 'src/app/beans/TransactionBean';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import { ActiveTransactionComponent } from 'src/app/nimai/active-transaction/active-transaction.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TData } from 'src/app/beans/TransBean';
import { LoginService } from 'src/app/services/login/login.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  @ViewChild(ActiveTransactionComponent, { static: true }) activeTransaction: ActiveTransactionComponent;

  public isActive: boolean = false;
  public data:TData;
  public title: string = "";
  public tab = 'tab2';
  document: any;
  public parentURL: string = "";
  public subURL: string = "";
  public viewDisable: boolean = true;
  public noFileDisable: boolean= true;
  countryName: any;
  public applicantType: boolean = true;
  public beneficiaryType: boolean = true;
  applicant: boolean = false;
  beneficiary: boolean = false; 
  public userTypes:string='';
  benName: string;
  benCountry: string;
  appliName : string;
  appliCountry : string;
  private imageSrc: string = '';
  isUploadForma: boolean=false;
  isUpload=false;
  private filename: string = '';
  imgDownload: boolean=false;
  fileData: any;

  reqType : string;
  constructor(public loginService: LoginService,public titleService: TitleService, public ts: NewTransactionService, public activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    this.data = {
      originalTenorDays:"",
      refinancingPeriod:"",
      lcMaturityDate:"",
      lcNumber:"",
      lastBeneBank:"",
      lastBeneSwiftCode:"",
      lastBankCountry:"",
      loadingCountry:"",
      loadingPort:"",
      dischargeCountry:"",
      dischargePort:"",
      chargesType:"",
      validity:"",
      lcProForma:"",
      applicantName:"",
      applicantCountry:"",
      userType:"",
      applicantContactPerson:"",
      applicantContactPersonEmail:"",
      beneName:"",
      beneCountry:"",
      beneContactPerson:"",
      beneContactPersonEmail:"",
      beneBankName:"",
      beneSwiftCode:"",
      beneBankCountry:"",
      lCIssuanceBank:"",
      lCIssuanceBranch:"",
      swiftCode:"",
      lCIssuanceCountry:"",
      requirementType:"",
      lCValue:"",
      lCCurrency:"",
      lCIssuingDate:"",
      negotiationDate:"",
      lastShipmentDate:"",
      goodsType:"",
      discountingPeriod:"",
      confirmationPeriod:"",
      paymentTerms:"",   
      tenorFile:"" 
    }
    
  }

  ngOnInit() {
    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));
  }

  deleteFileContent(){    
    $('#upload_file1').val('');
    this.data.tenorFile="";
    this.isUpload = false;    
  }
  handleFileInput(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    this.filename=file.name;

    // if (!file.type.match(pattern)) {
    //   alert('invalid format');
    //   $('#upload_file1').val('');
    //   return;
    // }
    this.isUpload=true;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
    
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = this.filename +" |" + reader.result;
    this.data.tenorFile=this.imageSrc;
    // this.LcDetail.get('lcMaturityDate').setValue("");

  }
  changeReqType(event){    
    this.reqType=event.target.value
  }
  onNegotChange(val){
    if (val === 'applicant') {
      this.applicantType=true;
      this.beneficiaryType=false;
      this.userTypes='Applicant';
      this.data.applicantName=this.data.beneName;
      this.data.applicantCountry=this.data.beneCountry;
      this.data.beneName=this.benName;
    this.data.beneCountry=this.benCountry;
    } else if (val === 'beneficiary') {
      this.applicantType=false;
      this.beneficiaryType=true;
      this.userTypes='Beneficiary';
      this.data.beneName=this.data.applicantName;
      this.data.applicantName=this.appliName;
      this.data.beneCountry=this.data.applicantCountry;
     this.data.applicantCountry=this.appliCountry;
    }    
  }

  deleteFileContentForma(){    
    $('#upload_file2').val('');
    this.data.lcProForma="";
    this.isUploadForma = false;    
  }
  handleFileProForma(e){
    this.noFileDisable=true;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    this.filename=file.name;
    // if (!file.type.match(pattern)) {
    //   alert('invalid format');
    //   $('#upload_file2').val('');
    //   return;
    // }
    this.isUploadForma=true;
    reader.onload = this._handleReaderLoadedForma.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoadedForma(e) {
    let reader = e.target;
    this.imageSrc = this.filename +" |" + reader.result;
    this.data.lcProForma=this.imageSrc;

  }

  public action(flag: boolean, type: Tflag, data: any) {
    this.tab='tab2';
    if (flag) {
      this.isActive = flag;
      if (type === Tflag.VIEW) {
        this.title = 'View';
        this.data = data;
        this.reqType=this.data.requirementType;
        if (this.data.userType === 'Applicant') {
          this.userTypes='Applicant';
          this.beneficiary = false;
          this.applicant = true;
          this.applicantType=true;
          this.beneficiaryType=false;
          this.benName=this.data.beneName;
          this.benCountry=this.data.beneCountry;
          data.applicantCountry= data.applicantCountry.toUpperCase();

        } else if (this.data.userType === 'Beneficiary') {
          this.userTypes='Beneficiary';
          this.applicant = false;
          this.beneficiary = true;
          this.applicantType=false;
          this.beneficiaryType=true;
          this.benName='';
          this.benCountry='';
          this.appliName=this.data.applicantName;
          this.appliCountry=this.data.applicantCountry;
          data.beneCountry=data.beneCountry.toUpperCase();

        }
      } else if (type === Tflag.EDIT) {
        this.title = 'Edit';
        this.data = data;
        // $('input').attr('readonly', false);
      }
    } else {
      this.isActive = flag;
      this.data = data;
      this.title = '';
      // $('input').attr('readonly', true);

    }


    if(data.lcProForma==null || data.lcProForma=="" || data.lcProForma==undefined){
      this.noFileDisable=false;
      this.viewDisable=true;

     }else{
      this.viewDisable=false;
      this.noFileDisable=true;
     }

  }

  public closed() {
    this.isActive = false;
    // this.titleService.quote.next(false);
  }

  closed_div(){
    this.isActive = false;
    document.getElementById("menu-barnew").style.width = "0%"; 
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0"; 
   }
  public transaction(act: string) {

    switch (act) {
      case 'edit': {
        this.tab = 'tab1'
        setTimeout(() => {
          // $('input').attr('readonly', false);
        }, 100);
        this.title = 'Edit';
      }
        break;

      case 'submit': {
        this.data.userType=this.userTypes;
        this.ts.updateCustomerTransaction(this.data).subscribe(
          (response) => {
            this.tab = 'tab3';
            
          },
          error => {
            alert('error')
          }
        )


      }
        break;
      case 'ok': {

        this.closed();
        this.tab = 'tab1';
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/active-transaction`]);
      });
      }
        break;
      case 'preview': {
        this.tab = 'tab2';
        if(this.data.lcProForma){
          this.viewDisable=false;
          this.noFileDisable=true;
        }else{
          this.noFileDisable=false;
         this.viewDisable=true;

        }
        setTimeout(() => {
          // $('input').attr('readonly', true);
        }, 200);
      }
        break;
    }

  }

  close(){
    $('.modal3').hide();
  }

  openDocument(file){
    $('#myModalC').show();
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
          convertbase64toArrayBuffer(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
              bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
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

}
