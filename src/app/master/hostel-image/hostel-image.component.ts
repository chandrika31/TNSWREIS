import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { LocationService } from 'src/app/services/location.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/Interfaces/user';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-hostel-image',
  templateUrl: './hostel-image.component.html',
  styleUrls: ['./hostel-image.component.css']
})
export class HostelImageComponent implements OnInit {
  location: any;
  openCamera: boolean;
  login_user: User;
  hostelname: string;
  districtname: string;
  talukname: string;
  hostelImage: string;
  showCapture: boolean = false;
  disableCapture: boolean;
  public errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();

  constructor(private _locationService: LocationService, private restApiService: RestAPIService, private _authService: AuthService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.login_user = this._authService.UserInfo;
    this._locationService.getLocation();
    this.districtname = this.login_user.districtName;
    this.talukname = this.login_user.talukName;
    this.hostelname = this.login_user.hostelName;
    this.disableCapture = true;

    const params = {
      'Type': 0,
      'DCode': this.login_user.districtCode,
      'TCode': this.login_user.talukId,
      'HostelId': this.login_user.hostelId

    }
    this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.length !== 0) {
          res.Table.forEach(i => {
            if (i.HostelImage !== undefined && i.HostelImage !== null) {
              if (i.HostelImage.trim() !== '') {
                this.hostelImage = 'assets/layout/' + this.login_user.hostelId + '/' + i.HostelImage;
                this.showCapture = false;
              } else {
                this.hostelImage = '';
                this.showCapture = true;
              }
            } else {
              this.hostelImage = '';
              this.showCapture = true;
            }
          })
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
          })
        }
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        });
      }
    })
  }

  public webcamImage: WebcamImage = null;

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    console.log('img',this.webcamImage)
    var byteString = atob(this.webcamImage.imageAsDataUrl.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    this.openCamera = false;
    const params = {
      'HostelId': this.login_user.hostelId,
      'HostelImage': this.webcamImage,
      'Longitude': this.location.lng,
      'Latitude': this.location.lat,
    }
    this.restApiService.put(PathConstants.Hostel_put, params).subscribe(res => {
      if (res) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.CaptureSuccess
        });
      }
    });
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

  camera() {
    
    //this.location = this._locationService.getLocation();

  this._locationService.getLocation().then(pos=>
      {
        if(pos !== undefined && pos !== null) {
          if(pos.code !== 1) {
            this.disableCapture = false;
            this.openCamera = true;
            this.messageService.clear();
            this.location = pos;
          } else {
            this.disableCapture = true;
            this.openCamera = false;
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
              summary: ResponseMessage.SUMMARY_ALERT, detail: 'Please check if location is enabled and Try again !'
            });
          }
        } else {
          this.disableCapture = true;
          this.openCamera = false;
          this.messageService.clear();
          this.messageService.add({
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

}
