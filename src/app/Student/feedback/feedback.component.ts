import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  StudentRegistrationDATA: any = [];
  emailid : any;
  existingmail : any;
  studentexistingID: any;
  hostelName: string;
  studentName: string;
  feedBack: string;
  login_user: User;
  cols: any;
  data: any = [];
  Districtid: number;
  Hostelid: number;
  TalukId: number;
  studentid: number;
  feedBackFileName: string;
  public formData = new FormData();
  feedBackImage: any = '';
  @ViewChild('f', { static: false }) feedbackForm: NgForm;
  constructor(private _authService: AuthService,private _restApiService: RestAPIService,private _messageService: MessageService
    ,private http: HttpClient, private _d: DomSanitizer) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'Districtname', header: 'District Name', width: '200px', align: 'left !important'},
      { field: 'HostelName', header: 'Hostel Name', width: '200px', align: 'left !important'},
      { field: 'StudentName', header: 'Student Name', width: '200px', align: 'left !important'},
      { field: 'FBMessage', header: 'Feedback', width: '200px', align: 'left !important'},
      { field: 'ReplyMessage', header: 'Reply Message', width: '200px', align: 'left !important'},
    ];
    
    
    this.login_user = this._authService.UserInfo;
    this.hostelName = this.login_user.hostelName;
    this.studentName = this.login_user.username
    this.Districtid = this.login_user.districtCode;
    this.Hostelid = this.login_user.hostelId;
    this.TalukId = this.login_user.talukId;
    this.studentid = this.login_user.userID;
    this.emailid = this.login_user.emailId
    this.checkRegistrationExists();  
    
  }
  public uploadFile = (event) => {
    const selectedFile = event.target.files[0];
    {
      const url = window.URL.createObjectURL(selectedFile);
      this.feedBackImage = this._d.bypassSecurityTrustUrl(url);
    }
    this.formData = new FormData()
    let fileToUpload: any = <File>event.target.files[0];
    const folderName = this.login_user.hostelId + '/' + 'Documents';
    const filename = fileToUpload.name + '^' + folderName;
    this.formData.append('file', fileToUpload, filename);
    this.feedBackFileName = fileToUpload.name;
    this.http.post(this._restApiService.BASEURL + PathConstants.FileUpload_Post, this.formData)
      .subscribe(event => {
      }
      );
  }
  onSubmit() {
    const params = {
      'Slno': 0,
      'HostelId': this.Hostelid,
      'DistrictId': this.Districtid,
      'TalukId': this.TalukId,
      'StudentId': this.studentexistingID,
      'FBMessage': this.feedBack,
      'ImgFileName': this.feedBackFileName,
      'Flag': 1,
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
  onClear() {
    this.feedbackForm.form.markAsUntouched();
    this.feedbackForm.form.markAsPristine();
    this.feedBack = null;
    this.feedBackFileName = null;
  }
  onView() {
  
    const params = {
      'StudentId': this.studentexistingID, 
      'Type' : 0,
       }
    this._restApiService.getByParameters(PathConstants.FeedBack_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.data = res.slice(0);
      }
    })
  }
  checkRegistrationExists() {   
    this.StudentRegistrationDATA=[]
    this._restApiService.get(PathConstants.StudentRegistration_Get).subscribe(r => {
      this.StudentRegistrationDATA = r;     
       if (this.StudentRegistrationDATA.length !== 0) {  
        for (let i = 0; i < this.StudentRegistrationDATA.length; i++) {   
          this.existingmail = (this.StudentRegistrationDATA[i].EmailId);      
          if (this.existingmail === this.emailid) {           
            this.studentexistingID = this.StudentRegistrationDATA[i].StudentId; 
            this.onView();            
            break; //break the loop
          } else {  
            continue;  //continuing the loop
          }
        }
      }    
    });
  }
}


