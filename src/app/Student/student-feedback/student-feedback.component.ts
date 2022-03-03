import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { NgForm } from '@angular/forms';
import { MasterService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-student-feedback',
  templateUrl: './student-feedback.component.html',
  styleUrls: ['./student-feedback.component.css']
})
export class StudentFeedbackComponent implements OnInit {
  hostelName: string;
  studentName: string;
  feedBack: string;
  replyMessage: string;
  login_user: User;
  cols: any;
  data: any = [];
  Districtid: number;
  Hostelid: number;
  TalukId: number;
  studentid: number;
  RowId: 0;
  replyDate = Date;
  tabIndex: number;
  items: any;
  filteredData: any[] = [];
  totalRecords: number;
  hideEdit: any;
  showDialog: boolean;
  editType: any;
  hostel: any;
  district: any;
  taluk: any;
  HostelId: number;
  talukOptions: SelectItem[];
  districtOptions: SelectItem[];
  DistrictId: number
  Districtcode: number;
  Districtcodes?: any;
  TalukIds?: any;
  hostelOptions: SelectItem[];
  districts?: any;
  taluks?: any;
  hostels?: any = [];
  loading: boolean;

  @ViewChild('f', { static: false }) studentFeedbackForm: NgForm;

  constructor(private _authService: AuthService,private _restApiService: RestAPIService,private _messageService: MessageService
    ,private http: HttpClient, private masterService: MasterService) { }

  ngOnInit(): void {
    this.tabIndex = 1;
    this.cols = [
      { field: 'Districtname', header: 'District Name', width: '200px', align: 'left !important'},
      { field: 'HostelName', header: 'Hostel Name', width: '200px', align: 'left !important'},
      { field: 'StudentName', header: 'Student Name', width: '200px', align: 'left !important'},
      { field: 'FBMessage', header: 'Feedback', width: '200px', align: 'left !important'},
      { field: 'ReplyMessage', header: 'Respond Feedback', width: '200px', align: 'left !important'},
    ];
    // this.onView();
    this.login_user = this._authService.UserInfo;
    this.Districtid = this.login_user.districtCode;
    this.Hostelid = this.login_user.hostelId;
    this.TalukId = this.login_user.talukId;
    this.studentid = this.login_user.userID;
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    let hostelSelection = [];
    if (this.login_user.roleId !== undefined && this.login_user.roleId !== null) {
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
        case 'T':
          this.taluks.forEach(t => {
            if (t.dcode === this.district) {
            talukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.talukOptions = talukSelection;
          if ((this.login_user.roleId * 1) === 1 || (this.login_user.roleId * 1) === 2) {
            this.talukOptions.unshift({ label: 'All', value: 0 });
          }
          this.talukOptions.unshift({ label: '-select-', value: null });
          break;
      }
    }
  }

  reloadFields(value) {
    if(value === 'D') {
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
      'HostelId': (this.login_user.hostelId !== undefined && this.login_user.hostelId !== null) ? 
      this.login_user.hostelId : 0,
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
    if((this.login_user.roleId * 1) !== 4) {
      this.hostelOptions.unshift({ label: 'All', value: 0 });
    }
    this.hostelOptions.unshift({ label: '-select-', value: null });
  }


  onSubmit() {
    const params = {
      'Slno': this.RowId,
      'ReplyMessage': this.replyMessage ,
      'ActionDate': this.replyDate,
    };
    this._restApiService.post(PathConstants.FeedBack_Post,params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          // this.blockUI.stop();
           this.onClear();
           this.onView();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });

        } else {
          // this.blockUI.stop();
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
      // this.blockUI.stop();
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })

      }
    })


  }


  onView() {
    this.data = [];
    this.tabIndex = 1;
    this.editType = 2;
    const params = {
      'Type' : this.editType,
       }
    this._restApiService.getByParameters(PathConstants.FeedBack_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.data = res.slice(0);
      }
    })
  }

  loadTable() {
    this.data = [];
    this.tabIndex = 0;
    if (this.district !== null && this.district !== undefined && this.taluk !== null && this.taluk !== undefined &&
      this.hostel !== null && this.hostel !== undefined && this.hostel !== undefined) {
      this.loading = true;
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'HostelId': this.hostel,
      }
      this._restApiService.getByParameters(PathConstants.FeedBackReport_Get,params).subscribe(res => {
        if (res.Table !== undefined && res.Table !== null) {
          if (res.Table.length !== 0) {
            this.data = res.Table;
            this.loading = false;
          } else {
            this.loading = false;
            this._messageService.clear();
            this._messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
              summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
            })
          }
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

  onrepliedFeedback() {
    this.data = [];
    this.tabIndex = 0;
    this.editType = 1;
    const params = {
      'Type' : this.editType,
       }
    this._restApiService.getByParameters(PathConstants.FeedBack_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.data = res.slice(0);
      }
    })
  }

  onEdit(data) {
    this.showDialog = true;
    this.RowId = data.Slno;
    this.studentName = data.StudentName;
    this.hostelName = data.HostelName;
    this.feedBack = data.FBMessage;

  }

  onClear() {
    this.studentFeedbackForm.form.markAsUntouched();
    this.studentFeedbackForm.form.markAsPristine();
    this.studentName = null;
    this.hostelName = null;
    this.feedBack = null;
    this.replyMessage = null;
  }


}
