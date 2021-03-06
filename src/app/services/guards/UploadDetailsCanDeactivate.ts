import { CanDeactivate } from '@angular/router';
import { UploadLCComponent } from 'src/app/nimai/transaction/upload-lc/upload-lc.component';


export class UploadLcDetailsCanDeactivate implements CanDeactivate<UploadLCComponent>{
    canDeactivate(component:UploadLCComponent):boolean{
        // component.save();
        return true;
    }

}