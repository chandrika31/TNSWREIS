import { Component, OnInit, ViewChild } from '@angular/core';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Table } from 'primeng/table';
import { Checkbox } from 'primeng/checkbox';
import { BooleanLiteral } from 'typescript';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-employeeattendance-details',
  templateUrl: './employeeattendance-details.component.html',
  styleUrls: ['./employeeattendance-details.component.css']
})
export class EmployeeattendanceDetailsComponent implements OnInit {
  districtName: string;
  talukName: string;
  hostelName: string;
  attendanceDate: Date = new Date();
  cols: any;
  data: any[] = [];
  login_user: User;
  Districtcode: number;
  TalukId: number;
  HostelId: number;
  selectedType: number;
  maxDate: Date = new Date();
  city: any;
  remarks: any;
  employeeName: string;
  showediticon: boolean;
  status: Boolean;
  empId: number;
  disableSubmit: boolean;

  @ViewChild('t', { static: false }) table: Table;
  @ViewChild('checkbox', { static: false }) checkbox: Checkbox;
  constructor(private _authService: AuthService, private _restApiService: RestAPIService
    , private _messageService: MessageService, private _datepipe: DatePipe, private _confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.cols = [
      { field: 'FirstName', header: 'Employee Name', width: '100px', align: 'left !important' },
      { field: 'DesignationName', header: 'Designation', width: '100px', align: 'left !important' },
      { field: 'Remarks', header: 'Remarks', width: '100px', align: 'left !important' }
    ];
    this.login_user = this._authService.UserInfo;
    this.districtName = this.login_user.districtName;
    this.talukName = this.login_user.talukName;
    this.hostelName = this.login_user.hostelName;
    this.onView();
  }

  onView() {
    this.data = [];
    const params = {
      'DCode' : this.login_user.districtCode,
      'TCode' : this.login_user.talukId,
      'HostelId': this.login_user.hostelId,
      'FromDate': this._datepipe.transform(this.attendanceDate, 'MM/dd/yyyy'),
      'Todate': this._datepipe.transform(this.attendanceDate, 'MM/dd/yyyy')
    }
    this._restApiService.getByParameters(PathConstants.EmployeeAttendance_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.Table.length !== 0) {
          res.Table.forEach(i => {
            i.status = (i.PresenAbsent) ? 'Present' : 'Absent';
          })
          this.data = res.Table;
          this.showediticon = false;
          this.disableSubmit = true;

        } else {
          const params = {
            'DCode': this.login_user.districtCode,
            'TCode': this.login_user.talukId,
            'HostelId': this.login_user.hostelId,
          }
          this._restApiService.getByParameters(PathConstants.EmployeeDetails_Get, params).subscribe(res => {
            if (res !== null && res !== undefined && res.length !== 0) {
              res.Table.forEach(i => {
                i.status = 'Present';
                i.Remarks = 'Present';
                i.AttendanceId = 0;
                i.PresenAbsent = 1; 
                i.AttendanceDate = this._datepipe.transform(this.attendanceDate, 'MM/dd/yyyy');
                this.disableSubmit = false;
              })
              this.data = res.Table;
              this.showediticon = true;
            } else {
              this.showediticon = false;
              this.disableSubmit = true;
              this._messageService.clear();
              this._messageService.add({
                key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
                summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
              })
            }
          });
        }
      }
    });
  }

  onEnter() {
    this.data.forEach(e => {
      if (this.empId === e.Id) {
        e.Remarks = this.remarks;
        e.presenAbsent = (this.selectedType * 1);
        e.status = ((this.selectedType * 1) === 1) ? 'Present' : 'Absent';
      }
    })
    this.table.value = this.data;
    this.onClear();
  }

  onSubmit() {
    this._restApiService.post(PathConstants.EmployeeAttendance_Post, this.data).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          //this.blockUI.stop();
          this.onClear();
          this.data = [];
          this.onView();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });
        } else {
          //this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
        }
      } else {
        //this.blockUI.stop();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      //this.blockUI.stop();
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

  onEdit(rowData) {
    this.empId = rowData.Id;
    if (rowData.presenAbsent === 0) {
      this._confirmationService.confirm({
        message: 'You have already marked absent for - ' + rowData.FirstName + '. Do you want to change?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.employeeName = rowData.FirstName;
          this.selectedType = 0;
          this.remarks = rowData.Remarks;
        },
        reject: () => {
          this.data.forEach(e => {
            if (this.empId === e.Id) {
              
            } else {
             
            }
          })
          this.table.value = this.data;
        }
      });
    } else {
      this.employeeName = rowData.FirstName;
      this.selectedType = 0;
      this.empId = rowData.Id;
    }
  }

  onClear() {
    this.employeeName = null;
    this.selectedType = null;
    this.remarks = null;
  }

  onRowSelect(event, selectedRow) {

  }


}
