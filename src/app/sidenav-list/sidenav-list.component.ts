import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  items: MenuItem[] = [];

  constructor(private _authService: AuthService) {
    this._authService.isLoggedIn.subscribe(value => {
      if (value) {
        this.items = this._authService.menu;
        this.items.forEach(i => {
          if ((i.routerLink !== null && i.routerLink !== '') || i.label === 'Logout') {
            i.command = () => { this.onSidenavClose(); };
          } else if (i.items !== undefined) {
            if (i.items.length !== 0) {
              i.items.forEach(j => {
                if (j.routerLink !== null && j.routerLink !== '') {
                  j.command = () => { this.onSidenavClose(); };
                }
              });
            }
          }
        })

      }
    });
  }

  ngOnInit() { }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }
}
