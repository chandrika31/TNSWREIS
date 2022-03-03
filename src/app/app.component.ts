import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { MasterService } from './services/master-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TN-ADWHMS';
  hideHeader: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private _authService: AuthService) {
    this._authService.isLoggedIn.subscribe(value => {
      this.isLoggedIn = value;
    });
  }

  ngOnInit() { }
}
