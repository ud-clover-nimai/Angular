import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css']
})
export class OthersComponent implements OnInit {
  
  @Input() public LcDetail:FormGroup;
  fileToUpload: File = null;
  private imageSrc: string = '';
  

  constructor(public rds:DataServiceService) {

    
   }

  ngOnInit() {
    

  }

  handleFileInput1(e) {
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
    this.LcDetail.get('lcProForma').setValue(this.imageSrc);

  }
}

