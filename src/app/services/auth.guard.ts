import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLoggedIn         //  to retrieve the isLoggedIn Observable getter from the AuthService
      .pipe(
        take(1),                              // Since we are only checking the value from the Observalbe a single time (if the user is logged in or not), we will use the take operator 
        map((isLoggedIn: boolean) => {         // to verify the value emitted by the BehaviorSubject
          if (!isLoggedIn){
            this.router.navigate(['/']);  // if not logged in we will navigate to the login screen
            return false;
          }
          return true;
        })
      )
  }
  
}
