import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-purchase-upload',
  templateUrl: './purchase-upload.component.html',
  styleUrls: ['./purchase-upload.component.css']
})
export class PurchaseUploadComponent implements OnInit {
  billNo: any;
  billFileName: any;
  billDate: any;
  billAmount: any;
  orderId: any;
  logged_user: User;
  @BlockUI() blockUI: NgBlockUI;

  constructor(private _restApiService: RestAPIService, private _authService: AuthService, 
    private _datePipe: DatePipe, private _http: HttpClient, private _messageService: MessageService) { }

  ngOnInit(): void {
    this.logged_user = this._authService.UserInfo;
  }

  onSearch() {
    this.billAmount = null;
    this.billDate = null;
    if(this.billNo !== undefined && this.billNo !== null) {
      this.blockUI.start();
      const params = {
        'HostelId': this.logged_user.hostelId,
        'BillNo': this.billNo
      }
      this._restApiService.getByParameters(PathConstants.PurchaseDocumentUpload_Get, params).subscribe(res => {
        if(res !== undefined && res !== null && res.length !== 0) {
          this.blockUI.stop();
          res.forEach(i => {
            this.billAmount = (i.BillAmount * 1);
            this.billDate = this._datePipe.transform(i.BillDate, 'yyyy-MM-dd');
            this.orderId = i.OrderId;
          })
        } else {
          this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.NoBillMsg
          })
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

   public onFileUpload = (files) => {
        if (files.length === 0) {
          return;
        }
        var formData = new FormData()
        let fileToUpload: any = <File>files[0];
        let actualFilename = '';
        const folderName = this.logged_user.hostelId + '/' + 'Documents';
        const filename = fileToUpload.name + '^' + folderName;
        formData.append('file', fileToUpload, filename);
        actualFilename = fileToUpload.name;
        this._http.post(this._restApiService.BASEURL + PathConstants.FileUpload_Post, formData)
          .subscribe((event: any) => {
            this.billFileName = actualFilename;
          }
          );
      }

      onUpload() {
        const params = {
          'OrderId': this.orderId,
          'BillFileName': this.billFileName,
          'HostelId': this.logged_user.hostelId,
          'DistrictCode': this.logged_user.districtCode,
          'TalukCode': this.logged_user.talukId
        }
        this._restApiService.post(PathConstants.PurchaseDocumentUpload_Post, params).subscribe(res => {
          if(res) {
            this.blockUI.stop();
            this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.UploadSucess
          })
          } else {
            this.blockUI.stop();
            this._messageService.clear();
            this._messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
              summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.UploadFail
            })
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
