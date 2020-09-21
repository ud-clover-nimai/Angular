import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import { LoginService } from 'src/app/services/login/login.service';
import * as $ from 'src/assets/js/jquery.min';


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
  minDate = new Date;
  constructor(public rds:DataServiceService,public loginService: LoginService) {
  }
  ngOnInit() {
    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));

  }
 
  handleFileInput1(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      $('#upload_file2').val('');
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
    this.LcDetail.get('lcProForma').setValue(this.imageSrc);

  }
}

