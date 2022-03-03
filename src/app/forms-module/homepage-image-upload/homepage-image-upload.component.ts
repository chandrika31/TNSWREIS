import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputText } from 'primeng/inputtext';
import { Alert } from 'selenium-webdriver';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';


@Component({
  selector: 'app-homepage-image-upload',
  templateUrl: './homepage-image-upload.component.html',
  styleUrls: ['./homepage-image-upload.component.css']
})
export class HomepageImageUploadComponent implements OnInit {

  date: Date = new Date();
  title: any;
  public formData = new FormData();
  NewFileName: string;
  ImageId: any;
  homeImageData: any = [];
  showTable: boolean;
  showDialog: boolean;
  homeImage: string;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) homeImageUploadForm: NgForm;
  @ViewChild('cd', { static: false }) _alert: ConfirmDialog;
  @ViewChild('file', { static: false }) _input: InputText;
  file: string;

  constructor(private http: HttpClient, private restApiService: RestAPIService, private _datePipe: DatePipe, private messageService: MessageService,
    private _confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.ImageId = 0;
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.formData = new FormData()
    let fileToUpload: any = <File>files[0];

    const folderName = 'Home' + '/Documents';
    const filename = fileToUpload.name + '^' + folderName;
    this.formData.append('file', fileToUpload, filename);
    this.NewFileName = fileToUpload.name;
    this.http.post(this.restApiService.BASEURL + PathConstants.HomePageImageUpload_Post, this.formData)
      .subscribe(event => {
      }
      );
  }

  onSubmit() {
    const params = {
      'ImageId': this.ImageId,
      'UploadDate': this._datePipe.transform(this.date, 'yyyy-MM-dd'),
      'ImageTitle': this.title,
      'ImageFilename': this.NewFileName,
      'Flag': 1
    }
    this.restApiService.post(PathConstants.HomePageImageUpload_Post, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        this.clearform();
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
    this.showTable = true;
    this.restApiService.get(PathConstants.HomePageImageUpload_Get).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.length !== 0) {
          res.forEach(i => {
            i.UploadDate = this._datePipe.transform(i.UploadDate, 'yyyy-MM-dd');
            i.url = 'assets/layout/' + 'Home' + '/Documents' + '/' + i.ImageFilename;
            this.showTable = true;
            this.homeImageData = res;
          })
        } else {
          this.showTable = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
          });
        }
      } else {
        this.showTable = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        });
      }
    })
  }

  showImage(url) {
    this.showDialog = true;
    this.homeImage = url;
  }

  onEdit(selectedRow) {
    if (selectedRow !== null && selectedRow !== undefined) {
      this.ImageId = selectedRow.ImageId;
      this.title = selectedRow.ImageTitle;
      this.NewFileName = selectedRow.ImageFilename;
      this._input.el.nativeElement = this.NewFileName;
      // var filePath = 'assets/layout/' + 'Home' + '/Documents' + '/' + this.NewFileName;
            
      // this.file = filePath;
    }
  }

  onDelete(rowData) { 
    // const params = {
    //   'ImageId': rowData.ImageId
    // } 
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._alert.disableModality();
        this.blockUI.start();
        this.restApiService.put(PathConstants.HomePageImageUpload_Put, { 'ImageId': rowData.ImageId }).subscribe(res => {
          if (res !== null && res !== undefined) {
            this.onView();
            this.blockUI.stop;
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
              summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.DeleteSuccessMsg
            });
          } else {
            this.blockUI.start();
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
              summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.DeleteFailMsg
            });
          }
        })
      },
      reject: () => {
        this.messageService.clear();
        this._alert.disableModality();
      }
    })
  }

  clearform() {
   this.homeImageUploadForm.reset();
  }
}
