import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MasterService } from 'src/app/services/master-data.service';
import { NgForm } from '@angular/forms';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent implements OnInit {
  fromdate: Date = new Date();
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  district: string;
  districts?: any;
  taluk: string;
  taluks?: any;
  data: any;
  attendanceImgdata: any
  todate: Date = new Date();
  cols: any;
  colsAttendance: any;
  hostelName: number;
  hostels?: any;
  hostelOptions: SelectItem[];
  role: number;
  checkEmail: boolean;
  login_user: User;
  showDialog: boolean;
  showDialogLargeImg: boolean;
  ImageUrl: string;

  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService, private messageService: MessageService, private datepipe: DatePipe, private authService: AuthService) { }

  ngOnInit(): void {
    this.showDialogLargeImg = false;
    this.showDialog = false;
    this.login_user = this.authService.UserInfo;
    this.hostelName = this.login_user.hostelId;
    this.role = this.login_user.roleId;
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.cols = [
      { field: 'AttendanceDate', header: 'Date' },
      { field: 'DistrictName', header: 'District' },
      { field: 'TalukName', header: 'Taluk' },
      { field: 'HostelName', header: 'Hostel Name' },
      { field: 'NOOfStudent', header: 'Total Student' },
      { field: 'Remarks', header: 'Remarks' },
    ];

    this.colsAttendance = [
      { field: 'Uploaddate', header: 'Upload Date' },
      { field: 'CreatedDate', header: 'System Date' },
    ];
  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    let hostelSelection = [];
    switch (type) {
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        if ((this.login_user.roleId * 1) === 1) {
          this.districtOptions.unshift({ label: 'All', value: 0 });
        }
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
      case 'TK':
        this.taluks.forEach(t => {
          if (t.dcode === this.district) {
            talukSelection.push({ label: t.name, value: t.code });
          }
        });
        this.talukOptions = talukSelection;
        if ((this.login_user.roleId * 1) === 1 || (this.login_user.roleId * 1) === 2) {
          this.talukOptions.unshift({ label: 'All', value: 0 });
        }
        this.talukOptions.unshift({ label: '-select-', value: null });
        break;
    }
  }

  loadHostelList() {
    let hostelSelection = [];
    const params = {
      'Type': 0,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': ((this.login_user.roleId * 1) === 4) ? this.login_user.hostelId : 0
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
      this.taluk !== null && this.taluk !== undefined) {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
          this.hostels.forEach(h => {
            hostelSelection.push({ label: h.HostelName, value: h.Slno });
          })
        }
      })
    }
    this.hostelOptions = hostelSelection;
    if ((this.login_user.roleId * 1) !== 4) {
      this.hostelOptions.unshift({ label: 'All', value: 0 });
    }
    this.hostelOptions.unshift({ label: '-select-', value: null });
  }

  refreshFields(value) {
    if (value === 'D') {
      this.taluk = null;
      this.talukOptions = [];
    }
    this.loadHostelList();
  }

  loadAttendance() {
    this.data = [];
    const params = {
      'HostelID': this.hostelName != undefined && this.hostelName != null ? this.hostelName : 0,
      'Districtcode': this.district != undefined && this.district != null ? this.district : 0,
      'Talukid': this.taluk != undefined && this.taluk != null ? this.taluk : 0,
      'FromDate': this.datepipe.transform(this.fromdate, 'MM/dd/yyyy'),
      'Todate': this.datepipe.transform(this.todate, 'MM/dd/yyyy')
    }
    this.restApiService.getByParameters(PathConstants.Attendance_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.Table.length !== 0) {
          res.Table.forEach(r => {
            r.AttendanceDate = this.datepipe.transform(r.AttendanceDate, 'dd/MM/yyyy');
          })
          this.data = res.Table;
        } else {
          console.log('j')
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          })
        }
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
        })
      }
    });
  }

  showImage(Id) {
    this.showDialog = true;
    const params = {
      'AttendanceId': Id != undefined && Id != null ? Id : 0
    }
    this.restApiService.getByParameters(PathConstants.AttendanceImageDetails_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        res.Table.forEach(i => {
          i.url = 'assets/layout/' + i.HostelID + '/' + i.ImageName;
          i.CreatedDate = this.datepipe.transform(i.CreatedDate, 'dd/MM/yyyy');
          i.Uploaddate = this.datepipe.transform(i.Uploaddate, 'dd/MM/yyyy');
        });
        this.attendanceImgdata = res.Table;
      }
    });
  }

  LargeImage(url) {
    this.showDialogLargeImg = true;
    this.ImageUrl = url
  }
}
