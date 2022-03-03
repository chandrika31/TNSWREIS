import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { BlockUI, NgBlockUI } from 'ng-block-Ui';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
  RowID: 0;
  districtName: string;
  talukName: string;
  hostelName: string;
  attendanceDate: Date = new Date();
  noOfStudent: any;
  remarks: string;
  disableFields: boolean;
  login_user: User;
  maxDate: Date = new Date();
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild ('f', { static: false }) auditForm: NgForm;
  constructor(private _authService: AuthService,private _restApiService: RestAPIService,
    private _datepipe: DatePipe, private _messageService: MessageService) { }

  ngOnInit(): void {
    this.login_user = this._authService.UserInfo;
    this.districtName = this.login_user.districtName;
    this.talukName = this.login_user.talukName;
    this.hostelName = this.login_user.hostelName;
    var hasBiomteric = this.login_user.hasBiometric;
    if (hasBiomteric) {
      this.disableFields = true;    
    }
  }
  Displaymessage(){
    var hasBiomteric = this.login_user.hasBiometric;
    if (hasBiomteric) {
      this.disableFields = true;
      this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_INFO,
            summary: ResponseMessage.SUMMARY_REJECTED, detail: ResponseMessage.Biometricvalidate
          });
    }else{
      this.GetAttendanceInfo();
    }
    
  }
  onSubmit() {
    this.blockUI.start();
    const params = {
      'Id': this.RowID,
      'HostelID': this.login_user.hostelId,
      'Districtcode': this.login_user.districtCode,
      'Talukid': this.login_user.talukId,
      'AttendanceDate': this._datepipe.transform(this.attendanceDate, 'MM/dd/yyyy'),
      'NOOfStudent': this.noOfStudent,
      'Remarks': this.remarks,
      'Flag': 1,
    };
    this._restApiService.post(PathConstants.Attendance_Post, params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          this.blockUI.stop();
          this.onClear();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });

        } else {
          this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
        }
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockUI.stop();
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })

      }
    })
  }

  onClear(){
    this.auditForm.form.markAsUntouched();
    this.noOfStudent = null;
    this.remarks = null;
    this.attendanceDate = new Date();
    this.RowID = 0;
  }
  
  GetAttendanceInfo() {
    this.noOfStudent = null;
    this.remarks = null;
    this.RowID = 0;
    if(this.attendanceDate !== null && this.attendanceDate !== undefined) {
    const params = {
      'HostelID': this.login_user.hostelId,
      'Districtcode': this.login_user.districtCode,
      'Talukid': this.login_user.talukId,
      'FromDate': this._datepipe.transform(this.attendanceDate, 'MM/dd/yyyy'),
      'Todate': this._datepipe.transform(this.attendanceDate, 'MM/dd/yyyy')
    }
    this._restApiService.getByParameters(PathConstants.Attendance_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.Table.length !== 0) {
          this.disableFields = true;
          res.Table.forEach(r => {
            this.noOfStudent = r.NOOfStudent;
            this.remarks = r.Remarks;
            this.RowID = r.Id;
          })
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_INFO,
            summary: ResponseMessage.SUMMARY_ALERT, life: 4000,
            detail: 'Attendance already exist for ' + this._datepipe.transform(this.attendanceDate, 'dd/MM/yyyy')
          })
        } else {
          this._messageService.clear();
          this.disableFields = false;
        }
      } else {
        this._messageService.clear();
        this.disableFields = false;
      }
    })
  }

}
}