import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit {

  district: any;
  taluk: any;
  hostel: any;
  studentData: any[] = [];
  studentCols: any;
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  districts?: any;
  taluks?: any;
  hostels?: any;
  logged_user: User;
  loading: boolean;
  showDialog: boolean;
  studentName: string;
  studentId: any;
  student: any = {};
  roleId: number;
  dApproval: any;
  tApproval: number;
  hostelName: string;
  @BlockUI() blockUI: NgBlockUI;
  constructor(private _masterService: MasterService, private _restApiService: RestAPIService, private _tableConstants: TableConstants,
    private _messageService: MessageService, private _authService: AuthService, private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.studentCols = this._tableConstants.studentDetailsColumns;
    this.districts = this._masterService.getMaster('DT');
    this.taluks = this._masterService.getMaster('TK');
    this.logged_user = this._authService.UserInfo;
    this.roleId = (this.logged_user.roleId * 1);
  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    if (this.roleId !== undefined && this.roleId !== null) {
      switch (type) {
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
            talukSelection.push({ label: t.name, value: t.code });
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

  reloadFields(value) {
    if (value === 'D') {
      this.taluk = null;
      this.talukOptions = [];
    }
    this.loadHostelList();
  }

  loadHostelList() {
    this.hostel = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    const params = {
      'Type': 0,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ?
        this.logged_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
      this.taluk !== null && this.taluk !== undefined && this.taluk !== 'All') {
      this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
          this.hostels.forEach(h => {
            hostelSelection.push({ label: h.HostelName, value: h.Slno });
          })
        }
      })
    }
    this.hostelOptions = hostelSelection;
    if ((this.logged_user.roleId * 1) !== 4) {
      this.hostelOptions.unshift({ label: 'All', value: 0 });
    }
    this.hostelOptions.unshift({ label: '-select-', value: null });
  }


  loadTable() {
    this.studentData = [];
    if (this.district !== null && this.district !== undefined && this.taluk !== null && this.taluk !== undefined &&
      this.hostel !== null && this.hostel !== undefined && this.hostel !== undefined) {
      this.loading = true;
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'HCode': this.hostel
      }
      this._restApiService.getByParameters(PathConstants.Registration_Get, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          res.forEach(r => {
            r.isDApproved = (r.districtApproval !== null && r.districtApproval !== 0 && (r.districtApproval)) ? 'true' : 'false';
            r.isTAprroved = (r.talukApproval !== null && r.talukApproval !== 0 && (r.talukApproval)) ? 'true' : 'false';
            if (this.roleId === 1 || this.roleId === 4) {
              if (r.districtApproval !== null && r.districtApproval !== 0 && (r.districtApproval)) {
                r.dstatus = 'Approved !';
              } else if (r.districtApproval === null || r.districtApproval !== 1 || (!r.districtApproval)) {
                r.dstatus = 'Pending !';
              }
              if (r.talukApproval !== null && r.talukApproval !== 0 && (r.talukApproval)) {
                r.tstatus = 'Approved !';
              } else if (r.talukApproval !== null && r.talukApproval !== 1 && (!r.talukApproval)) {
                r.tstatus = 'Pending !';
              }
            } else if (this.roleId === 2) {
              if (r.districtApproval !== null && r.districtApproval !== 0 && (r.districtApproval)) {
                r.dstatus = 'Approved !';
              }
            } else if (this.roleId === 3) {
              if (r.talukApproval !== null && r.talukApproval !== 0 && (r.talukApproval)) {
                r.tstatus = 'Approved !';
              }
            }
          })
          this.studentData = res;
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

  selectForApproval(row) {
    if (row !== undefined && row !== null) {
      this.showDialog = true;
      this.studentName = row.studentName;
      this.hostelName = row.HostelName;
      this.student = {
        'hostelId': (row.hostelId !== undefined && row.hostelId !== null) ? row.hostelId : 0,
        'emisno': (row.emisno !== undefined) ? row.emisno : null,
        'academicYear': (row.AcademicYear !== undefined) ? row.AcademicYear : null,
      }
      this.studentId = (row.studentId !== undefined && row.studentId !== null) ? row.studentId : 0;
      this.dApproval = (row.districtApproval !== undefined && row.districtApproval !== null) ? ((row.districtApproval) ? 1 : 0) : null;
      this.tApproval = (row.talukApproval !== undefined && row.talukApproval !== null) ? ((row.talukApproval) ? 1 : 0) : null;
    } else {
      this.showDialog = false;
    }
  }

  onApprove() {
    this.blockUI.start();
    const params = {
      'studentId': this.studentId,
      'districtApproval': (this.roleId === 2) ? 1 : this.dApproval,
      'talukApproval': (this.roleId === 3) ? 1 : this.tApproval
    }
    this._restApiService.put(PathConstants.Registration_Put, params).subscribe(res => {
      if (res) {
        if(this.roleId === 2) {
          this.insertStudentTransferDetails();
        }
        this.blockUI.stop();
        this.studentId = null;
        this.showDialog = false;
        this.loadTable();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.ApprovalSuccess
        })
      } else {
        this.blockUI.stop();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    })
  }

  insertStudentTransferDetails() {
    const params = [];
    params.push({
      'Id': 0,
      'HostelId': this.student.hostelId,
      'StudentId': this.studentId,
      'AcademicYear': this.student.academicYear,
      'EMISNO': this.student.emisno,
      'Remarks': '',
      'AcademicStatus': 1, //approved (default pass)
      'Flag': 0 // default(insert)
    })
    this._restApiService.post(PathConstants.StudentTransferDetails_Post, params).subscribe(res => {
      if (res) {
        console.log('student data is inserted successfully')
      } else {
        console.log('student data is not inserted')
      }
    })
  }
}
