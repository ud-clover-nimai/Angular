import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import { LoginService } from 'src/app/services/login/login.service';
import * as $ from 'src/assets/js/jquery.min';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { uploadFileRefinance } from 'src/assets/js/commons'


@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css']
})
export class OthersComponent implements OnInit {
  @Input() public LcDetail:FormGroup;
  fileToUpload: File = null;
  private imageSrc: string = '';
  countryName: any;
  portOfLoading:any;
  chargesTypeCk1:boolean=false;
  chargesTypeCk2:boolean=false;
  portOfDischarge:any;
  minDate = new Date;
  private filename: string = '';
  isUpload: boolean;
  constructor(public rds:DataServiceService,public loginService: LoginService,public upls: UploadLcService) {
  }
  ngOnInit() {
    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));

  }

  onItemChangeApp(e){
  var appChargeType=this.LcDetail.get('applicantName').value+ " ("+e+")";
  this.LcDetail.get('chargesType').setValue(appChargeType)
  this.chargesTypeCk1=true;
  this.chargesTypeCk2=false;

}
onItemChangeBene(e){
  var benChargeType=this.LcDetail.get('beneName').value+" ("+e+")";
  this.LcDetail.get('chargesType').setValue(benChargeType)
  this.chargesTypeCk2=true;
  this.chargesTypeCk1=false;
  }

  onItemChange(e){
    var str = e; 
    var splittedStr = str.split(" (", 2); 
    var name1=splittedStr[1];
    var splitted = name1.split(")", 2); 
    e=splitted[0]
if(e=='Applicant'){
  this.chargesTypeCk1=true;
  this.chargesTypeCk2=false;
  this.onItemChangeApp(e) 
   this.LcDetail.get('chargesType').setValue(str)
}  
  if(e=='Beneficiary'){
    this.chargesTypeCk2=true;
    this.chargesTypeCk1=false;
    this.onItemChangeBene(e)
    this.LcDetail.get('chargesType').setValue(str)

  }

 }
 
  handleFileInput1(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
  this.filename=file.name;
  this.isUpload=true;
    var pattern = /image-*/;
    var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
  
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc =this.filename +" |" + reader.result;
    this.LcDetail.get('lcProForma').setValue(this.imageSrc);
    
  }


  portDischargeOnchange(event:any){
    var data;
    if(this.LcDetail.get('dischargeCountry').value==""){
       data={
        "countryName":event
        
      } 
    }else{
       data={
        "countryName":this.LcDetail.get('dischargeCountry').value
      } 
    }
      
      this.upls.getPortByCountry(data).subscribe(
        (response) => {
          this.portOfDischarge = JSON.parse(JSON.stringify(response)).data;
        });
  }
  portLoadingOnchange(event:any){
var data;
if(this.LcDetail.get('loadingCountry').value==""){
   data={
    "countryName":event
  } 
}else{
   data={
    "countryName":this.LcDetail.get('loadingCountry').value
  } 
}

     
      this.upls.getPortByCountry(data).subscribe(
        (response) => {
          this.portOfLoading = JSON.parse(JSON.stringify(response)).data;
        });
  }


  deleteFileContent(){     

    $('#upload_file11').val('');
    this.LcDetail.get('lcProForma').reset;
    this.isUpload = false;   
    uploadFileRefinance();
  }
}

