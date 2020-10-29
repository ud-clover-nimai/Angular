import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import { LoginService } from 'src/app/services/login/login.service';
import * as $ from 'src/assets/js/jquery.min';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';


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
  portOfDischarge:any;
  minDate = new Date;
  private filename: string = '';
  constructor(public rds:DataServiceService,public loginService: LoginService,public upls: UploadLcService) {
  }
  ngOnInit() {
    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));

  }
 
  handleFileInput1(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    console.log(file.name)
  this.filename=file.name;

    var pattern = /image-*/;
    var reader = new FileReader();
    // if (!file.type.match(pattern)) {
    //   alert('invalid format');
    //   $('#upload_file2').val('');
    //   return;
    // }
    // else{
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
   //   console.log(file)
    //}
    
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc =this.filename +" |" + reader.result;
    this.LcDetail.get('lcProForma').setValue(this.imageSrc);
    
  }


  portDischargeOnchange(event:any){
    
    const data={
              "countryName":this.LcDetail.get('dischargeCountry').value
            }    
      this.upls.getPortByCountry(data).subscribe(
        (response) => {
          this.portOfDischarge = JSON.parse(JSON.stringify(response)).data;
        });
  }
  portLoadingOnchange(event:any){
    const data={
              "countryName":this.LcDetail.get('loadingCountry').value
            }    
      this.upls.getPortByCountry(data).subscribe(
        (response) => {
          this.portOfLoading = JSON.parse(JSON.stringify(response)).data;
        });
  }
}

