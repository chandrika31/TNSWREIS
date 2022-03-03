import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isSignedIn: boolean = false;
  getUserInfo: any;
  menuItems: any;
  private loggedIn = new BehaviorSubject<boolean>(false); 
  /// To control if the user is logged in or not
  /// The BehaviorSubject keeps the latest value cached (in our case when the service is created the initial value is going to be false). 
  /// So when an Observer subscribes to the isLoggedIn(), the cached valued is going to be emitted right away.

  constructor(private _router: Router) { 
    localStorage.removeItem('UserInfo');
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable(); // getter to expose only the get method publicly and as also expose the Subject as an Observable
  }

  login(user: User){
    if (user.username !== '' && user.token !== '' ) { 
      localStorage.setItem('UserInfo', JSON.stringify(user));
      this.loggedIn.next(true);
      this._router.navigate(['/dashboard']);
    }
  }

  checkStatus() {
    if (localStorage.getItem('UserInfo')) {
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false);
    }
  }

  setMenu(data) {
    this.menuItems = data;
  }

  get menu() {
    return this.menuItems;
  }

  get UserInfo() {
    return JSON.parse(localStorage.getItem('UserInfo'));
  }

  public logout() {
    localStorage.removeItem('UserInfo');
    this._router.navigate(['/']);
    window.location.reload();
    this.loggedIn.next(false);
  }
  
}
