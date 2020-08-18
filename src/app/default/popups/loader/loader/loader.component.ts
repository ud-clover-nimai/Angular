import { Component, OnInit } from '@angular/core';
import { LoaderServiceService } from 'src/app/services/loader/loader-service.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  loading: boolean;

  constructor(private loaderService: LoaderServiceService) {

    this.loaderService.isLoading.subscribe((v) => { 
      this.loading = v;
    });

  }
  ngOnInit() {
  }

}
