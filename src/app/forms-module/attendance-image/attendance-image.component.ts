import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { LocationService } from 'src/app/services/location.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { DatePipe } from '@angular/common';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Component({
  selector: 'app-attendance-image',
  templateUrl: './attendance-image.component.html',
  styleUrls: ['./attendance-image.component.css']
})
export class AttendanceImageComponent implements OnInit {
  date: Date = new Date();
  districts: any;
  districtname: any;
  DistrictId: number;
  HostelId: number;
  taluks: any;
  TalukId: number
  talukname: string;
  hostelname: string;
  remarks: any;
  openCamera: boolean;
  location: any = [];
  login_user: User;
  public errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  hostelName: any;
  Districtcode: any;
  data: any;
  noOfStudent: number;
  attendanceId: number;
  uploadimage: any;
  Slno: any;
  cols: any;
  showDialog: boolean;
  hostelImage: string;
  imagecount: number;
  yearRange: string;
  disableCapture: boolean;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) attendanceimageForm: NgForm;
  constructor(private _locationService: LocationService, private restApiService: RestAPIService, private _authService: AuthService, private masterService: MasterService, private datepipe: DatePipe
    , private _messageService: MessageService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'DistrictName', header: 'District', width: '100px' },
      { field: 'TalukName', header: 'Taluk', width: '100px' },
      { field: 'HostelName', header: 'Hostel', width: '100px' },
      { field: 'CreatedDate', header: 'Date', width: '100px' },
      { field: 'Latitude', header: 'Latitude', width: '100px' },
      { field: 'Longitude', header: 'Longitude', width: '100px' },
      { field: 'Remarks', header: 'Remarks', width: '100px' },
    ];
    this.Slno = 0;
    this.imagecount = 0;
    this.noOfStudent = 0;
    this.login_user = this._authService.UserInfo;
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.login_user = this._authService.UserInfo;
    this.hostelname = this.login_user.hostelName;
    this.HostelId = this.login_user.hostelId;
    this.DistrictId = this.login_user.districtCode;
    this.TalukId = this.login_user.talukId;
    this.districts.forEach(d => {
      if (this.DistrictId == d.code) {
        this.districtname = d.name
      }
    });
    this.taluks.forEach(d => {
      if (this.TalukId == d.code) {
        this.talukname = d.name
      }
    });
   // this._locationService.getLocation();
    this.GetAttendanceInfo();
    this.onView();
    this.disableCapture = true;
  }
  public webcamImage: WebcamImage = null;

  onSubmit() {
    if (this.imagecount === 5) {
      this._messageService.clear();
      this._messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
        summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.AttendanceimageRestrict
      });
    }
    else {
      const params = {
        'Slno': this.Slno != undefined ? this.Slno : 0,
        'Id': 0,
        'Uploaddate':this.datepipe.transform(this.date, 'MM/dd/yyyy'), 
        'Districtcode': this.DistrictId,
        'Talukid': this.TalukId,
        'HostelID': this.HostelId,
        'AttendanceId': this.attendanceId,
        'Remarks': this.remarks,
        'Latitute': this.location.lat,
        'Longitude': this.location.lng,
        'uploadImage': this.webcamImage,
        'Flag': 1,
        'isMobile' : 0
      }
      this.restApiService.post(PathConstants.AttendanceImage_Post, params).subscribe(res => {
        if (res.Item1) {
          this.onView();
          //  this.blockUI.stop();
          //  this.onClear();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: res.Item2
          });
        }
        else {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: res.Item2
          });
        }
      });
    }
  }

  GetAttendanceInfo() {
    var hasBiomteric = this.login_user.hasBiometric;
    let biometricId = null;
    this.noOfStudent = 0;
    this.blockUI.start();
    if (hasBiomteric) {
      const params = {
        'HostelId': this.login_user.hostelId,
        'FromDate': '',
        'ToDate': '',
        'Type': 1
      }
      this.restApiService.getByParameters(PathConstants.Consumption_Get, params).subscribe(res => {
        if (res) {
          biometricId = res[0].DeviceId;
        } else {
          biometricId = null;
        }
        const BM_params = {
          'Code': biometricId,
          'Date': this.datepipe.transform(this.date, 'MM/dd/yyyy'),
          'Type': 2
        }
        this.restApiService.getByParameters(PathConstants.BioMetricsForConsumption_Get, BM_params).subscribe(res => {
          if (res !== undefined && res !== null) {
            if (res.length !== 0) {
              this.blockUI.stop();
              this.noOfStudent = (res[0].StudentCount !== undefined && res[0].StudentCount !== null) ? (res[0].StudentCount * 1) : 0;
            } else {
              this.noOfStudent = 0;
              this.blockUI.stop();
            }
          } else {
            this.noOfStudent = 0;
            this.blockUI.stop();
          }
        })
      })
    } else {
      const params = {
        'HostelID': (this.login_user.hostelId != undefined && this.login_user.hostelId != null) ? this.login_user.hostelId : 0,
        'Districtcode': (this.login_user.districtCode != undefined && this.login_user.districtCode != null) ? this.login_user.districtCode : 0,
        'Talukid': (this.login_user.talukId != undefined && this.login_user.talukId != null) ? this.login_user.talukId : 0,
        'FromDate': this.datepipe.transform(this.date, 'MM/dd/yyyy'),
        'Todate': this.datepipe.transform(this.date, 'MM/dd/yyyy')
      }
      this.restApiService.getByParameters(PathConstants.Attendance_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          res.Table.forEach(element => {
            this.noOfStudent = element.NOOfStudent;
            this.attendanceId = element.Id
            this.blockUI.stop();
          });;
        }
        else {
          this.blockUI.stop();
          this.noOfStudent = 0;
          this.attendanceId = 0;
        }
      });
      //new line added
      this.blockUI.stop();
    }

  }

  onView() {
    this.data = [];
    const params = {
      'HostelID': this.HostelId,
      'Districtcode': this.DistrictId,
      'Talukid': this.TalukId,
      'FromDate': this.datepipe.transform(this.date, 'MM/dd/yyyy'),
      'Todate': this.datepipe.transform(this.date, 'MM/dd/yyyy'),
    }
    this.restApiService.getByParameters(PathConstants.AttendanceImage_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        res.Table.forEach(i => {
          i.url = 'assets/layout/' + i.HostelID + '/' + i.ImageName;
        })
        this.data = res.Table;
        this.imagecount = res.Table.length;
      }
      else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_ALERT, detail: ResponseMessage.SelectUploadDate
        });
      }
    });
  }

  showImage(url) {
    this.showDialog = true;
    this.hostelImage = url;
  }

  camera() {
    this._locationService.getLocation().then(pos=>
      {
        if(pos !== undefined && pos !== null) {
          if(pos.code !== 1) {
            this.disableCapture = false;
            this.openCamera = true;
            this._messageService.clear();
            this.location = pos;
          } else {
            this.disableCapture = true;
            this.openCamera = false;
            this._messageService.clear();
            this._messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
              summary: ResponseMessage.SUMMARY_ALERT, detail: 'Please check if location is enabled and Try again !'
            });
          }
        } else {
          this.disableCapture = true;
          this.openCamera = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_ALERT, detail: 'Please check if location is enabled and Try again !'
          });
        }
      });
    }

  capture() {
    this.captureImage();
  }

  captureImage() {
    this.trigger.next();
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    var byteString = atob(this.webcamImage.imageAsDataUrl.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    this.openCamera = false;
  }

  onRowSelect(event, selectedRow) {
  }

  onClear() {
    this.attendanceimageForm.form.markAsUntouched();
    this.attendanceimageForm.form.markAsPristine();
    this.date = new Date();
    this.webcamImage = null;
    this.openCamera = false;
    this.data = [];
    this.disableCapture = true;
  }
}

