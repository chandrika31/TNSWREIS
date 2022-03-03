import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.css']
})
export class MenuHeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  items: MenuItem[] = [];
  showMenu: boolean = false;
  hideHeader: boolean = false;
  username: string;
  place: string;
  logged_user: User;
  roleId: number;
  officeType: string;
  placeType: string;
  @ViewChild('op', { static: false }) _op: OverlayPanel;
  constructor(private _authService: AuthService, private _router: Router) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login') {
          this.hideHeader = true;
        } else {
          this.hideHeader = false;
        }
      }
    });
    this._authService.isLoggedIn.subscribe(value => {
      this.showMenu = value;
      if (this.showMenu) {
        this.items = this._authService.menu;
        this.logged_user = this._authService.UserInfo;
        if (this.items.length !== 0) {
          this.items.forEach(i => {
             if(i.label === 'Logout') {
              i.command = () => { this.onLogout(); };
            }
          })
        }
        this.username = this.logged_user.username;
        this.roleId = (this.logged_user.roleId * 1);
      if(this.roleId === 1) {
        this.officeType = 'Head Office';
        this.place = '';
        this.placeType = '';
      } else if(this.roleId === 2) {
        this.officeType = 'District Office';
        this.place = this.logged_user.districtName;
        this.placeType = 'District';
      } else if(this.roleId === 3) {
        this.officeType = 'Taluk Office';
        this.place = this.logged_user.talukName;
        this.placeType = 'Taluk';
      } else {
        this.officeType = 'Hostel';
        var str: any = (this.logged_user.hostelName).toString();
        str = str.split(',');
        this.place = str[0];
        this.placeType = 'Hostel';
      }
    }
    });
  }

  ngOnInit(): void { }

  onLogout() {
  //  this._op.toggle(event);
    this.onToggleSidenav();
    this._authService.logout();
  }

  onSignIn() {
    this._router.navigate(['/login']);
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

}
