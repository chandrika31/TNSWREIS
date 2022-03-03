import { Component, OnInit, ViewChild  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-approval-request',
  templateUrl: './approval-request.component.html',
  styleUrls: ['./approval-request.component.css']
})
export class ApprovalRequestComponent implements OnInit {
  districtName: string;
  talukName: string;
  hostelName: string;
  approvalType: number;
  ApprovaltypeOptions: SelectItem[];
  requestId: number;
  RequestidOptions: SelectItem[];
  login_user: User;
  Districtcode: number;
  TalukId: number;
  HostelId: number;
  approvallist?: any = [];
  districts?: any;
  taluks?: any;
  hostels?: any;
  data: any = [];
  cols: any;
  remarks: any;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) approvalForm: NgForm;
  constructor(private _authService: AuthService, private _restApiService: RestAPIService
    , private _messageService: MessageService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'Districtname', header: 'District Name', width: '200px', align: 'left !important'},
      { field: 'Talukname', header: 'Taluk Name', width: '200px', align: 'left !important'},
      { field: 'HostelName', header: 'Hostel Name', width: '200px', align: 'left !important'},
      { field: 'ApprovalName', header: 'Approval Type', width: '200px', align: 'left !important'},
      { field: 'ApprovalTypeName', header: 'Request For', width: '200px', align: 'left !important'},
      { field: 'Remarks', header: 'Remarks', width: '200px', align: 'left !important'},
      { field: 'CreatedDate', header: 'Requested Date', width: '200px', align: 'center !important'},
      { field: 'ApprovalStatusName', header: 'Approval Status', width: '200px', align: 'left !important'},
    ];
    this.login_user = this._authService.UserInfo;
    this.districtName = this.login_user.districtName;
    this.talukName = this.login_user.talukName;
    this.hostelName = this.login_user.hostelName;
    this.Districtcode = this.login_user.districtCode;
    this.TalukId = this.login_user.talukId;
    this.HostelId = this.login_user.hostelId;

    this._restApiService.get(PathConstants.ApprovalList_Get).subscribe(approvallist => {
      this.approvallist = approvallist;
    })
  }

  onSubmit() {
    const params = {
      'Id': 0,
      'HostelID': this.HostelId,
      'Districtcode': this.Districtcode,
      'Talukid': this.TalukId,
      'ApprovalType': this.approvalType,
      'RequestId': this.requestId,
      'Remarks': this.remarks,
      'Flag': 1
    };
    this._restApiService.post(PathConstants.ApprovalDetails_Post,params).subscribe(res => {
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

  onSelect(type) {
    let approvalSelection = [];
    switch (type) {
      case 'AL':
        this.approvallist.forEach(c => {
          approvalSelection.push({ label: c.Name, value: c.Id });
        })
        this.ApprovaltypeOptions = approvalSelection;
        this.ApprovaltypeOptions.unshift({ label: '-select', value: null });
        break;
    }
  }
  loadId() {
    if (this.approvalType !== undefined && this.approvalType !== null) {
      if (this.approvalType === 1) {
        this.requestId = this.login_user.hostelId;
        this.RequestidOptions = [{ label: this.login_user.username, value: this.login_user.hostelId }];
      } else if (this.approvalType === 2) {
        this.requestId = this.login_user.hostelId;
        this.RequestidOptions = [{ label: this.login_user.hostelName, value: this.login_user.hostelId }];

      } else {
        let studentSelection = [];
        const params = {
          'DCode': this.login_user.districtCode,
          'TCode': this.login_user.talukId,
          'HCode': this.login_user.hostelId
        }
        this._restApiService.getByParameters(PathConstants.Registration_Get, params).subscribe(res => {
          if (res !== undefined && res !== null && res.length !== 0) {
            res.forEach(r => {
              studentSelection.push({ label: r.studentName, value: r.studentId });

            })
            this.RequestidOptions = studentSelection;
            this.RequestidOptions.unshift({ label: '-select-', value: null })
          }
        })
      }
    }
  }

  onClear() {
    this.approvalForm.form.markAsUntouched();
    this.approvalType = null;
    this.ApprovaltypeOptions = [];
    this.requestId = null;
    this.RequestidOptions = [];
  }

  onView() {
    this.data = [];
    const params = {
   'DCode' : this.login_user.districtCode,
   'TCode' : this.login_user.talukId,
   'HostelId' : this.login_user.hostelId,
    }
    this._restApiService.getByParameters(PathConstants.ApprovalDetails_Get,params).subscribe(res =>{
      if (res !== null && res !== undefined && res.length !== 0) {
        res.Table.forEach(i => {
          this.data = res.Table;
    })
    
  } else {
    this._messageService.clear();
    this._messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
      summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
    })
  }
});
  }

}

