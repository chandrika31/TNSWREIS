import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-biometric-devicemapping',
  templateUrl: './biometric-devicemapping.component.html',
  styleUrls: ['./biometric-devicemapping.component.css']
})
export class BiometricDevicemappingComponent implements OnInit {
  hostel: any;
  hostelOptions: SelectItem[];
  bioMetric: any;
  selectedType: number;
  login_user: User;
  Hosteltypes?: any;
  district: number;
  districtOptions: SelectItem[];
  hostels?: any;
  districts?: any;
  nativeDistricts?: any;
  data:any;
  cols:any;
  biometricForm:any;
  DeviceId:any;
  HostelId:any;
  RowId: number;

  @ViewChild('f', { static: false }) _biometric: NgForm;
  @BlockUI() blockUI: NgBlockUI;

  constructor(private _masterService: MasterService,private _restApiService: RestAPIService,private _messageService: MessageService,private _authService: AuthService) { }

  ngOnInit(): void {
    this.login_user = this._authService.UserInfo;
    this.districts = this._masterService.getDistrictAll();
    this.cols = [
      
      {field:'Districtname',header:'District Name'},
      {field:'HostelName',header: 'Hostel Name'},
      {field:'DeviceId',header: 'Biometric Device Id'},
      {field:'Flag',header: 'Status'}
    ];
  }

  selectDistrict() {
    this.hostel = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    const params = {
      'Type': 1,
      'DCode': this.district,
      'TCode': (this.login_user.talukId !== undefined && this.login_user.talukId !== null) ?
      this.login_user.talukId : 0,
      'HostelId': (this.login_user.hostelId !== undefined && this.login_user.hostelId !== null) ?
        this.login_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined) {
      this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
          this.hostels.forEach(h => {
            hostelSelection.push({ label: h.HostelName, value: h.Slno });
          })
          this.hostelOptions = hostelSelection;
          this.hostelOptions.unshift({ label: '-select', value: null });
        };
      })
    }
  }


  onSelect(type) {
    let districtSelection = [];
    switch (type) {
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;

    }
    
  }

  onSubmit() {
    const params = {
      'Slno':this.RowId,
      'DeviceId': this.bioMetric,
      'HostelId': this.hostel,
      'Flag': (this.selectedType * 1),
    };
    this._restApiService.post(PathConstants.BioMetric_Post,params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          this.blockUI.stop();
           this.onClear();
           this.onView();
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

  onView(){
    this._restApiService.get(PathConstants.BioMetric_Get).subscribe(res => {
      if(res !== null && res !== undefined && res.length !==0) {
        this.data = res.Table;
        this.data.forEach(i => {
         i.Flag = (i.Flag) ? 'Active' : 'Inactive';
       })
       
      } 
      
    });

  }

  onClear() {
    this._biometric.reset();
    this._biometric.form.markAsUntouched();
    this._biometric.form.markAsPristine();
    this.bioMetric = null;
    this.hostel = null;
    this.hostelOptions = [];
    this.RowId = 0;
    this.district = null;
    this.districtOptions = [];
  }

  onRowSelect(selectedRow) {
    this.RowId = selectedRow.Slno;
    this.bioMetric = selectedRow.DeviceId;
    this.hostel = selectedRow.HostelId;
    this.hostelOptions = [{ label: selectedRow.HostelName, value: selectedRow.HostelId}];
    this.selectedType = selectedRow.Flag;
    this.district = selectedRow.Districtcode;
    this.districtOptions = [{ label: selectedRow.Districtname, value: selectedRow.Districtcode}];
}

}