import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
headerText: string;
subHeader: string;
showNavBar: boolean;
items: any[];
showMenuIcon: boolean;
  constructor(private _router: Router, private _authService: AuthService) { }

  ngOnInit(): void {
    this._authService.isLoggedIn.subscribe(value => {
      this.showMenuIcon = value;
    });
    this.headerText = 'Government Of Tamilnadu';
    this.subHeader = 'Social Welfare Department';
  }

  onSignIn() { 
    this._router.navigate(['/login']);
  }

  onSignOut() {
    this._authService.logout();
  }
}
