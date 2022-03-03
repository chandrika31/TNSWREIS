import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PathConstants } from '../Common-Modules/PathConstants';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-id-card-info',
  templateUrl: './id-card-info.component.html',
  styleUrls: ['./id-card-info.component.css']
})
export class IdCardInfoComponent implements OnInit {
  name: any;
  class: any;
  section: any;
  dob: any;
  userImage: any;
  bloodGroup: any;
  medium: any;
  contactNo: number;
  fatherContact: number;
  guardian: any;
  address: any;
  district: any;
  taluk: any;
  hostelName: any;
  studentName: any;
  districts?: any;
  taluks?: any;
  hostels?: any;
  students?: any;
  studentOptions: SelectItem[];
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  Show: boolean;
  studentDetails: any = [];
  emisNo: any;
  logged_user: User;
  guardianMobileNo: any;

  constructor(private restApiService: RestAPIService, private masterService: MasterService, private authService: AuthService) { }

  ngOnInit(): void {
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.logged_user = this.authService.UserInfo;
  }
  loadStudents() {
    this.students = [];
    this.studentName = null;
    this.studentOptions = [];
    if (this.hostelName !== undefined && this.hostelName !== null && this.district !== undefined && this.district !== null &&
      this.taluk !== undefined && this.taluk !== null) {
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'HCode': this.hostelName
      }
      this.restApiService.getByParameters(PathConstants.Registration_Get, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.studentDetails = res.slice(0);
          this.students = res;
        }
      })
    }
  }
  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    let studentSelection = [];
    switch (type) {
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select', value: null });
        break;
      case 'T':
        this.taluks.forEach(t => {
          if (t.dcode === this.district) {
            talukSelection.push({ label: t.name, value: t.code });
          }
        })
        this.talukOptions = talukSelection;
        this.talukOptions.unshift({ label: '-select', value: null });
        break;
      case 'SN':
        this.students.forEach(n => {
          studentSelection.push({ label: n.studentName, value: n.studentId })
        });
        this.studentOptions = studentSelection;
        this.studentOptions.unshift({ label: '-select', value: null });
        break;
    }
  }
  // hstl based on district 
  selectDistrict() {
    this.hostelName = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    if(this.district !== undefined && this.district !== null && this.taluk !== undefined && this.taluk !== null){
    const params = {
      'Type': 1,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ?
        this.logged_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined) {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
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
  }

  fillDetails() {
    this.Show = true;
    if(this.studentName !== undefined && this.studentName !== null &&
      this.studentDetails.length !== 0) {
        this.studentDetails.forEach(s => {
          if((s.studentId * 1) === this.studentName) {
            this.userImage = (s.studentFilename.trim() !== '' && s.studentFilename !== null && s.studentFilename !== undefined) ? s.studentFilename : 'assets/layout/' + s.hostelId + '/' + 'Documents' + '/' + s.studentFilename ;
            this.emisNo = s.emisno;
            this.name = s.studentName;
            this.class = s.class;
            this.dob = s.dob;
            this.bloodGroup = s.bloodgroupName;
            this.medium = s.mediumName;
            this.contactNo = s.fatherMoileNo;
            this.guardianMobileNo = (s.guardianMobileNo !== null) ? s.guardianMobileNo : '-';
            this.address = s.address1 + ',' + s.address2 +  ',' + s.landmark + ','+ s.Districtname +',' + s.Talukname + ',' +  s.pincode
          }
        })
      }
  }

}
