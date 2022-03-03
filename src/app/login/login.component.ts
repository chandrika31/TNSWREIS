import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  showPswd: boolean;

  constructor(private _authService: AuthService, private _messageService: MessageService,
    private _restApiService: RestAPIService, private _masterService: MasterService) { }

  ngOnInit(): void { }
  

  onShowPswd() {
    var inputValue = (<HTMLInputElement>document.getElementById('pswd'));
    if (inputValue.type === 'password') {
      inputValue.type = 'text';
      this.showPswd = !this.showPswd;
    } else {
      this.showPswd = !this.showPswd;
      inputValue.type = 'password';
    }
  }

  onLogin() {
    const params = {
      UserId: this.username,
      Password: this.password,
    }
    this._restApiService.post(PathConstants.Login, params).subscribe(response => {
      if (response !== undefined && response !== null) {
        if (response.item1) {
          if (response.item3.length !== 0) {
            response.item3.forEach(i => {
              const obj: User = {
                username: (i.userName !== undefined && i.userName !== null) ? i.userName : ''
                , userID: (i.id !== undefined && i.id !== null) ? i.id : null
                , emailId: (i.eMailId !== undefined && i.eMailId !== null) ? i.eMailId : ''
                , hostelId: (i.hostelID !== undefined && i.hostelID !== null) ? i.hostelID : null
                , talukId: (i.talukid !== undefined && i.talukid !== null) ? i.talukid : null
                , districtCode: (i.districtcode !== undefined && i.districtcode !== null) ? i.districtcode : null
                , roleId: (i.roleId !== undefined && i.roleId !== null) ? i.roleId : null
                , token: (i.entryptedPwd !== undefined && i.entryptedPwd !== null) ? i.entryptedPwd : ''
                , hostelName: (i.hostelName !== undefined && i.hostelName !== null) ? i.hostelName : ''
                , talukName: (i.talukName !==undefined && i.talukName !==null) ? i.talukName : ''
                , districtName: (i.districtName !==undefined && i.districtName !==null) ? i.districtName : ''
                , hasBiometric: (i.hasBiometric !== undefined && i.hasBiometric !== null) ? i.hasBiometric : false
              }
              this._restApiService.getByParameters(PathConstants.MenuMaster_Get, { 'roleId': obj.roleId }).subscribe(response => {
                if (response !== undefined && response !== null && response.length !== 0) {
                  this.checkChildItems(response);
                  response.push({ label: 'Logout', icon: 'pi pi-power-off' });
                  this._authService.setMenu(response);
                  this._authService.login(obj);
                  let master = new Observable<any[]>();
                  master = this._masterService.initializeMaster();
                  master.subscribe(response => {});
                } else {
                  this._messageService.clear();
                  this._messageService.add({
                    key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
                    summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.MenuDataError
                  })
                }
              })
            });
          } else {
            this._messageService.clear();
            this._messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
              summary: ResponseMessage.SUMMARY_ERROR, detail: response.item2
            });
          }
        } else {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: response.item2
          })
        }
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.NetworkErrorMessage
        })
      }
    })
  }

  checkChildItems(data: any) {
    if (data.length !== 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].items.length !== 0) {
          //  continue;
          this.checkChildItems(data[i].items);
        } else {
          delete data[i].items;
        }
      }
    }
  }
}
