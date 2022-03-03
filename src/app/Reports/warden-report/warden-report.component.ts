import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-warden-report',
  templateUrl: './warden-report.component.html',
  styleUrls: ['./warden-report.component.css']
})
export class WardenReportComponent implements OnInit {
  districtOptions: SelectItem[];
  district: any;
  talukOptions: SelectItem[];
  taluk: any;
  statusOptions: SelectItem[];
  status: any;
  wardenDetailsCols: any;
  wardenDetails: any[] = [];
  wardenDetailsAll: any[] = [];
  loading: boolean;
  totalRecords: number;
  districts?: any;
  taluks?: any;
  logged_user: User;
  show: boolean;
  wardenName: any;
  endDate: any;
  joinDate: any;
  wardenId: number;
  showTransfer: boolean;
  @ViewChild('cd', { static: false }) _alert: ConfirmDialog;
  hostelName: any;
  hostelOptions: SelectItem[];
  districtName: any;
  talukName: any;
  hostels?: any;
  data: any;
  roleId: number;
  transferButton: boolean;
  editButton: boolean;

  constructor(private _tableConstants: TableConstants, private _restApiService: RestAPIService,
    private _messageService: MessageService, private _authService: AuthService,
    private _masterService: MasterService, private _datePipe: DatePipe, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.wardenDetailsCols = this._tableConstants.wardenDetailsReportColumns;
      this.districts = this._masterService.getMaster('DT');
      this.taluks = this._masterService.getMaster('TK');
    this.logged_user = this._authService.UserInfo;  
    // this.roleId = (this.logged_user.roleId * 1)
    this.editButton = (this.logged_user.roleId !== 1 * 1) ? true : false;
    this.transferButton = (this.logged_user.roleId === 1 * 1) ? true : false;
    this.statusOptions = [
      { label: '-select-', value: null },
      { label: 'All', value: 0 },
      { label: 'Active', value: 1 },
      { label: 'InActive', value: 2 }
    ]
  }

  onSelect(value) {
    let districtSelection = [];
    let talukSelection = [];
    if (this.logged_user.roleId !== undefined && this.logged_user.roleId !== null) {
      switch (value) {
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          if ((this.logged_user.roleId * 1) === 1) {
            this.districtOptions.unshift({ label: 'All', value: 0 });
          }
          this.districtOptions.unshift({ label: '-select-', value: null });
          break;
        case 'T':
            this.taluks.forEach(t => {
              if (t.dcode === this.district) {
                talukSelection.push({ label: t.name, value: t.code });
              }
            })
            this.talukOptions = talukSelection;
            if ((this.logged_user.roleId * 1) === 1 || (this.logged_user.roleId * 1) === 2) {
              this.talukOptions.unshift({ label: 'All', value: 0 });
            }
            this.talukOptions.unshift({ label: '-select-', value: null });
          break;
      }
    }
  }

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
      this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
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

  loadTable() {
    this.wardenDetails = [];
    this.wardenDetailsAll = [];
    if (this.district !== undefined && this.district !== null && this.taluk !== undefined &&
      this.taluk !== null) {
      this.loading = true;
      const params = {
        'Districtcode': this.district,
        'Talukid': this.taluk,
        'HostelId': ((this.logged_user.roleId * 1) === 4) ? this.logged_user.hostelId : 0
      }
      this._restApiService.post(PathConstants.WardenDetails_Report_Post, params).subscribe(res => {
        if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
          res.Table.forEach(r => {
            r.HostelJoinedDate = this._datePipe.transform(r.HostelJoinedDate, 'yyyy-MM-dd');
            r.ServiceJoinedDate = this._datePipe.transform(r.ServiceJoinedDate, 'yyyy-MM-dd');
            r.EndDate = (r.EndDate !== null) ? this._datePipe.transform(r.EndDate, 'yyyy-MM-dd') : null;
            r.disableTransfer = (r.EndDate !== null) ? 'true' : 'false';
          })
          this.wardenDetailsAll = res.Table.slice(0);
          this.wardenDetails = res.Table;
          this.loading = false;
        } else {
          this.loading = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          })
        }
      })
    }
  }

  filterTable() {
    if (this.wardenDetailsAll.length !== 0 && this.status !== undefined && this.status !== null) {
      if (this.status === 1) {
        this.wardenDetails = this.wardenDetailsAll.filter(f => {
          return f.Flag;
        })
      } else if (this.status === 2) {
        this.wardenDetails = this.wardenDetailsAll.filter(f => {
          return !f.Flag;
        })
      } else {
        this.wardenDetails = this.wardenDetailsAll;
      }
    }
  }
  onEdit(row) {
    this.show = true;
    this.wardenName = row.WardenName;
    this.joinDate = row.HostelJoinedDate;
    this.wardenId = row.WardenId;
    console.log('n', row)
    
  }
  onDiscontinue(row) {
    this.show = true;
    this.wardenName = row.WardenName;
    this.joinDate = row.HostelJoinedDate;
    this.wardenId = row.WardenId;
    console.log('n', row)
    
  }
  onTransfer(rowData) {
    this.showTransfer = true;
    this.wardenName = rowData.WardenName;
    this.joinDate = rowData.HostelJoinedDate;
    this.wardenId = rowData.WardenId;
    this.data = rowData;
  }

  Transfer(data) {
console.log('g',this.data)
const params = {
  'Name': this.data.WardenName,
  'GenderId': 1,
  'DOB': this.data.DOB,
  'Qualification': this.data.QId,
  'HostelId': this.hostelName,
  'HostelJoinedDate': this.data.HostelJoinedDate,
  'ServiceJoinedDate': this.data.ServiceJoinedDate,
  'Designation': this.data.Designation,
  'EMail': this.data.EMail,
  'PhoneNo': this.data.PhoneNo,
  'AlternateNo': this.data.AlternateNo,
  'Address1': this.data.Address1,
  'Address2': this.data.Address2,
  'Districtcode': this.districtName,
  'Talukid': this.talukName,
  'Pincode': this.data.Pincode,
  'Flag': 1,
  'WardenId': 0,
  'WardenImage':''
}
this._restApiService.post(PathConstants.Warden_post, params).subscribe(res => {
  if (res) {
    console.log('res',res);
    this.clear();
    this._messageService.clear();
    this._messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
      summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SubmitMessage
    });
  } else {
    this._messageService.clear();
    this._messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
      summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
    });
  }
}, (err: HttpErrorResponse) => {
  if (err.status === 0 || err.status === 400) {
    this._messageService.clear();
    this._messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
      summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
    })
  }
})
}
 
  onSubmit() {
    const params = {
      'WardenId': this.wardenId,
      'EndDate': this._datePipe.transform(this.endDate, 'yyyy-MM-dd'),
    }
    this._restApiService.put(PathConstants.Warden_Put, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.loadTable();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.EndDateMsg
        });
        this.endDate = '';
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    })
  }
  clear() {
    this.hostelOptions = [];
  }
}





