import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-usermaster',
  templateUrl: './usermaster.component.html',
  styleUrls: ['./usermaster.component.css']
})
export class UsermasterComponent implements OnInit {

  userName: any;
  emailId: string;
  password: any;
  role: number;
  district: number;
  taluk: number;
  hostelName: any;
  selectedType: number;
  roleOptions: SelectItem[];
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  userMasterId: number;
  data: any = [];
  logged_user: User;
  // master
  roles?: any;
  districts?: any;
  taluks?: any;
  hostels?: any;
  // rolemethod
  showDistrict: boolean;
  showTaluk: boolean;
  showHostelName: boolean;
  checkEmail: boolean;
  @ViewChild('f', { static: false }) _usermaster: NgForm;

  constructor(private masterService: MasterService, private restApiService: RestAPIService,
    private messageService: MessageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.roles = this.masterService.getMaster('RM');
    this.logged_user = this.authService.UserInfo;
    this.onView();
  }
  // dropdown 
  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    let roleSelection = [];
    switch (type) {
      case 'R':
        this.roles.forEach(r => {
          roleSelection.push({ label: r.name, value: r.code });
        })
        this.roleOptions = roleSelection;
        this.roleOptions.unshift({ label: '-select', value: null });
        break;
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select', value: null });
        break;
      case 'T':
        this.taluks.forEach(t => {
          if (t.dcode === this.district) {
            talukSelection.push({ label: t.name, value: t.code });
          }
        })
        this.talukOptions = talukSelection;
        this.talukOptions.unshift({ label: '-select', value: null });
        break;
    }
  }
  refreshFields(value) {
    if(value === 'D') {
      this.taluk = null;
      this.talukOptions = [];
    } 
    this.selectDistrict();
  }
  // hstl based on district 
  selectDistrict() {
    this.hostelName = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    if(this.district !== undefined && this.district !== null && this.taluk !== undefined && this.taluk !== null){
    const params = {
      'Type': 1,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ?
        this.logged_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined) {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
          this.hostels.forEach(h => {
            hostelSelection.push({ label: h.HostelName, value: h.Slno });
          })
          this.hostelOptions = hostelSelection;
          this.hostelOptions.unshift({ label: '-select', value: null });
        };
      })
    }
  }
  }
  // role dropdown
  onRoleChange() {
    if (this.role != undefined && this.role !== null) {
      if (this.role === 1) {
        this.showDistrict = false;
        this.showTaluk = false;
        this.showHostelName = false;
      } else if (this.role === 2) {
        this.showTaluk = false;
        this.showDistrict = true;
        this.showHostelName = false;
      } else if (this.role === 3) {
        this.showDistrict = true;
        this.showTaluk = true;
        this.showHostelName = false;
      } else if (this.role === 4) {
        this.showDistrict = true;
        this.showTaluk = true;
        this.showHostelName = true
      } else {
        this.showDistrict = false;
        this.showTaluk = false;
        this.showHostelName = false;
      }
    }
  }

  checkIfEmailExists() {
    if (this.emailId !== undefined && this.emailId !== null && this.emailId.trim() !== '' &&
      this.data.length !== 0) {
      this.checkEmail = true;
      const entered_email: string = this.emailId.trim();
      const substr = entered_email.split('@');
      if (substr !== undefined && substr.length > 1) {
        const last_str = substr[1].split('.');
        if (last_str !== undefined && last_str.length > 1) {
          if (last_str[1].toLowerCase() === 'com' || last_str[1].toLowerCase() === 'in') {
            this.data.forEach(i => {
              const email: string = i.EMailId;
              if (email.trim() === entered_email) {
                this.messageService.clear();
                this.messageService.add({
                  key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR, life: 2000,
                  summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.EmailAlreadyExists
                })
                this.checkEmail = false;
                this.emailId = '';
              } else {
                this.checkEmail = false;
              }
            })
          }
        }
      }
    }
  }

  onSubmit() {
    const params = {
      'Id': this.userMasterId,
      'Districtcode': (this.district !== undefined && this.district !== null) ? this.district : 0,
      'HostelID': (this.hostelName !== undefined && this.hostelName !== null) ? this.hostelName : 0,
      'Talukid': (this.taluk !== undefined && this.taluk !== null) ? this.taluk : 0,
      'UserName': this.userName,
      'EMailId': this.emailId,
      'RoleId': (this.role !== undefined && this.role !== null) ? this.role : 0,
      'Pwd': this.password,
      'Flag': (this.selectedType * 1),
    }
    this.restApiService.post(PathConstants.UserMaster_Post, params).subscribe(res => {
      if (res) {
        this.clearForm();
        this.onView();
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    })
  }

  onView() {
    this.restApiService.get(PathConstants.UserMaster_Get).subscribe(res => {
      if (res !== null && res !== undefined && res.Table.length !== 0) {
        res.Table.forEach(i => {
          i.status = (i.Flag) ? 'Active' : 'Inactive';
        })
        this.data = res.Table;
      }
    })
  }

  onEdit(selectedRow) {
    if (selectedRow !== null && selectedRow !== undefined) {
      this.userMasterId = selectedRow.Id;
      this.role = selectedRow.RoleId;
      this.roleOptions = [{ label: selectedRow.Role, value: selectedRow.RoleId }];

      this.district = selectedRow.Districtcode;
      this.taluk = selectedRow.Talukid;
      this.talukOptions = [{ label: selectedRow.Talukname, value: selectedRow.Talukid }];
      this.hostelName = selectedRow.HostelID;
      this.hostelOptions = [{ label: selectedRow.HostelName, value: selectedRow.HostelID }];

      this.userName = selectedRow.UserName;
      this.emailId = selectedRow.EMailId;
      this.password = selectedRow.Pwd;
      this.districtOptions = [{ label: selectedRow.Districtname, value: selectedRow.Districtcode }];
      this.selectedType = selectedRow.Flag;
    }
    this.onRoleChange();
  }

  clearForm() {
    this._usermaster.reset();
    this.districtOptions = [];
    this.talukOptions = [];
    this.hostelOptions = [];
  }

}


