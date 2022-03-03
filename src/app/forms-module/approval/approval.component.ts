import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {

  data: any[] = [];
  cols: any;
  login_user: User;
  filteredData: any[] = [];
  totalRecords: number;
  tabIndex: number;
  items: any;
  @BlockUI() blockUI: NgBlockUI;
  constructor(private _authService: AuthService, private _restApiService: RestAPIService
    , private _messageService: MessageService) { }

  ngOnInit(): void {  
    this.tabIndex = 0;
    this.items = [
      {'header': 'Pending'},
      {'header': 'Approved'},
      {'header': 'Disapproved'}
    ]
    this.cols = [
      { field: 'Districtname', header: 'District Name', width: '200px', align: 'left !important' },
      { field: 'Talukname', header: 'Taluk Name', width: '200px', align: 'left !important' },
      { field: 'HostelName', header: 'Hostel Name', width: '200px', align: 'left !important' },
      { field: 'ApprovalName', header: 'Approval Type', width: '200px', align: 'left !important' },
      { field: 'ApprovalTypeName', header: 'Request For', width: '200px', align: 'left !important' },
      { field: 'Remarks', header: 'Remarks', width: '200px', align: 'left !important'},
      { field: 'CreatedDate', header: 'Requested Date', width: '200px', align: 'center !important'},
      // { field: 'ApprovalStatusName', header: 'Approval Status', width: '200px'},
    ];
    this.onLoad();
  }

  onLoad() {
    this.data = [];
    const params = {
      'DCode': 0,
      'TCode': 0,
      'HostelId': 0,
    }
    this._restApiService.getByParameters(PathConstants.ApprovalDetails_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if(res.length !== 0) {
        res.Table.forEach(i => {
          this.data = res.Table.slice(0);
          this.filteredData = this.data.filter(e => {
            return (e.ApprovalStatus * 1) === this.tabIndex; 
          })
          this.totalRecords = this.filteredData.length;
        })
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        })
      }
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        })
      }
    });
  }

  onTabChange($event) {
    this.tabIndex = $event.index
    switch ($event.index) {
      case 0:
        this.filteredData = this.data.filter(e => {
          return (e.ApprovalStatus * 1) === $event.index; 
        })
        this.totalRecords = this.filteredData.length;
        break;
    
    case 1:
      this.filteredData = this.data.filter(e => {
        return (e.ApprovalStatus * 1) === $event.index; 
      })
      this.totalRecords = this.filteredData.length;
            break;
      case 2:
              this.filteredData = this.data.filter(e => {
                return (e.ApprovalStatus * 1) === $event.index; 
              })
              this.totalRecords = this.filteredData.length;
                    break;
    }
  }

  onUpdate(data, id) {
    let params = {};
    if (id === 1) {
      params = {
        'FacilityDetailId': data.Id,
        'ApprovalStatus': 1
      }
    } else {
      params = {
        'FacilityDetailId': data.Id,
        'ApprovalStatus': 2
      }
    }
    this._restApiService.put(PathConstants.ApprovalDetails_put, params).subscribe(res => {
      var message = (id === 1) ? 'Approved Successfully' : 'Disapproved Successfully';
      if (res !== undefined && res !== null) {
        if (res) {
          this.blockUI.stop();
          this.onLoad();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: message
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

}



