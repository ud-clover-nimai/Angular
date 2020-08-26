import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';




@Injectable()
export class BankCanActiveService implements CanActivate{
    constructor(public router:Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean {
        let userID = sessionStorage.getItem('userID');
        if(userID){
        if(userID.startsWith('BA'))
        return true;
        else{
            this.router.navigate(['/']);
            return false;
        }
    }else{
        this.router.navigate(['/']);
        return false;
    }
    }
    
}