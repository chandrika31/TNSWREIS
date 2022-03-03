import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MasterService } from 'src/app/services/master-data.service';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-biometricattendancecount',
  templateUrl: './biometricattendancecount.component.html',
  styleUrls: ['./biometricattendancecount.component.css']
})


export class BiometricattendancecountComponent implements OnInit {

  hostel: any;
  district: any;
  taluk: any;
  HostelId: number
  Hosteltamilname: string;
  Hosteltype: number;
  Hosteltypes?: any;
  talukOptions: SelectItem[];
  districtOptions: SelectItem[];
  DistrictId: number
  Districtcode: number;
  Districtcodes?: any;
  TalukId: number;
  TalukIds?: any;
  hostelOptions: SelectItem[];
  Buildingno: any;
  Street: any;
  Landmark: string;
  upload: any;
  pincode: any;
  Longitude: any;
  Latitude: any;
  Radius: any;
  Totalstudent: any;
  mobileNo: any;
  daysOptions: SelectItem[];
  disableTaluk: boolean = true;
  masterData?: any = [];
  days?: any = [];
  data: any = [];
  Table2?: any;
  Slno: any;
  cols: any;
  login_user: User;
  districts?: any;
  taluks?: any;
  hostels?: any = [];
  role: number;
  isDistrict: boolean;
  isTaluk: boolean;
  isHostel: boolean;
  biometricattendancecountCols: any;
  biometricattendancecountData: any = [];
  loading: boolean;
  datepipe: any;
  
    MonthYear:any;
    Mmonth : any;
    Myear : any;


  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService, private _authService: AuthService,
    private _messageService: MessageService, private tableConstants: TableConstants, 
    private _datePipe: DatePipe, private _router: Router ) { }

  ngOnInit(): void {
    this.biometricattendancecountCols = this.tableConstants.biometricattendancecountColumns
    this.Slno = 0;
    this.login_user = this._authService.UserInfo;
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
            talukSelection.push({ label: t.name, value: t.code });
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
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': (this.login_user.hostelId !== undefined && this.login_user.hostelId !== null) ? 
      this.login_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
    this.taluk !== null && this.taluk !== undefined && this.taluk !== 'All') {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
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

  loadTable() {
    this.biometricattendancecountData = [];
      this.loading = true;
      this.Mmonth = this._datePipe.transform(this.MonthYear, 'MM');
      this.Myear = this._datePipe.transform(this.MonthYear, 'yyyy');
      console.log(this.Myear,this.Mmonth)
      const params = {
          'serialno':'BJ2C192661709',
          'month': this.Mmonth,
          'year':  this.Myear
      }
      this.restApiService.getByParameters(PathConstants.GetBDAttendancecount_Get,params).subscribe(res => {
        if (res.Table !== undefined && res.Table !== null) {
          if (res.Table.length !== 0) {
            this.biometricattendancecountData = res.Table;
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
  
  onEdit(){
    this._router.navigate(['/BiometricAttendance'])
  }
  onRowSelect(event, selectedRow) {

  }
  
}

