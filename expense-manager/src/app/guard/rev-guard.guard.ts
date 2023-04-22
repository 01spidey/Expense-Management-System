import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RevGuardGuard implements CanActivate {

  constructor(private router:Router){
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(sessionStorage.getItem('user')=='null' || sessionStorage.getItem('user')===null){
        console.log('null bruh')
        // this.router.navigate([''])
        return true
      }else{ 
        console.log(sessionStorage.getItem('user'))
        this.router.navigate(['dashboard'])
        return false
      }
  }
  
}
