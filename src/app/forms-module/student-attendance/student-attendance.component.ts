import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.css']
})
export class StudentAttendanceComponent implements OnInit {

  district: any;
  taluk: any;
  hostelName: any
  attendanceDate: Date = new Date();
  studentOptions: SelectItem[];
  remarks: any;
  logged_user: User;
  studentAttendanceData: any = [];
  StudentAttendanceCols: any = [];
  showTable: boolean;
  students?: any;
  meals?: any;
  studentName: any;
  studentDetails: any = [];
  mealOptions: SelectItem[];
  mealType: any;
  selectedValue: boolean;
  loading: boolean;
  studentImage: string;
  isSubmitted: boolean;

  constructor(private authService: AuthService, private restApiService: RestAPIService, private masterService: MasterService, private datePipe: DatePipe, private messageService: MessageService) { }

  ngOnInit(): void {
    this.logged_user = this.authService.UserInfo;
    this.meals = this.masterService.getMaster('M')
    this.district = this.logged_user.districtName;
    this.taluk = this.logged_user.talukName;
    this.hostelName = this.logged_user.hostelName;
    this.selectedValue = true;
  }

  insertStudentAttendance() {
    const params = {
      'MealId': this.mealType,
      'HCode': this.logged_user.hostelId,
      'DCode': this.logged_user.districtCode,
      'TCode': this.logged_user.talukId,
      'AttendanceDate': this.datePipe.transform(this.attendanceDate, 'MM/dd/yyyy'),
      'SubmitStatus': 0
    }
    this.restApiService.post(PathConstants.StudentAttendance_Post, params).subscribe(res => {
      if (res) {
        this.showTable = true;
        this.loadStudents();
      } else {
        this.showTable = false;
      }
    });
  }


  loadStudents() {
    if (this.hostelName !== undefined && this.hostelName !== null && this.district !== undefined && this.district !== null &&
      this.taluk !== undefined && this.taluk !== null) {
      const params = {
        'DCode': this.logged_user.districtCode,
        'TCode': this.logged_user.talukId,
        'HCode': this.logged_user.hostelId,
        'MealsTypeId': this.mealType,
        'AttendanceDate': this.datePipe.transform(this.attendanceDate, 'MM/dd/yyyy'),
      }
          this.restApiService.getByParameters(PathConstants.StudentAttendance_Get, params).subscribe(res => {
            if (res !== undefined && res !== null) {
              if (res.length !== 0) {
                res.forEach(i => {
                  if (i.isSubmitted) {
                    console.log('sub', i.isSubmitted)
                    this.isSubmitted = true; //student attendance has been submitted already
                    i.canEdit = 'false'; //if details are submitted, then no edit/click action can be done
                  } else {
                    this.isSubmitted = false;
                    i.canEdit = 'true';
                  }
                  i.isPresent = (i.AttendanceStatus) ? 'true' : 'false'; //to show if student is present or absent
                  if(i.StudentFilename !== null && i.StudentFilename !== undefined && i.StudentFilename.trim() !== ''){
                  i.url = 'assets/layout/' + i.HostelID + '/' + 'Documents' + '/' + i.StudentFilename;
                  } else if(i.Gender === 1) {
                    i.url = 'assets/layout/images/maleicon.jpg';
                  }
                  else {
                    i.url = 'assets/layout/images/female.png';
                  }
                  i.AttendanceDate = this.datePipe.transform(new Date(i.AttendanceDate), 'dd/MM/yyyy');
                })
                this.studentAttendanceData = res;
              } else {
                this.isSubmitted = false;
                this.messageService.clear();
                this.messageService.add({
                  key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
                  summary: ResponseMessage.SEVERITY_WARNING, detail: ResponseMessage.WarningMessage
                });
              }
            } else {
              this.isSubmitted = false;
              this.messageService.clear();
              this.messageService.add({
                key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
                summary: ResponseMessage.SEVERITY_WARNING, detail: ResponseMessage.WarningMessage
              });
            }
          })
        }
  }

  onSelect(type) {
    let mealSelection = [];
    switch (type) {
      case 'M':
        this.meals.forEach(d => {
          mealSelection.push({ label: d.name, value: d.code })
        });
        this.mealOptions = mealSelection;
        this.mealOptions.unshift({ label: '-select', value: null });
        break;
    }
  }

  onClick(data, value) {
    this.loading = true;
    if (value === 1) {
      ///Present
      this.studentAttendanceData.forEach(i => {
        if (i.StudentId === data.StudentId)
          i.isPresent = 'false'; // present to absent
        this.loading = false;
      })
    } else {
      ///absent
      this.studentAttendanceData.forEach(i => {
        if (i.StudentId === data.StudentId)
          i.isPresent = 'true'; // absent to present
        this.loading = false;
      })
    }
    console.log('data', this.studentAttendanceData)
    const params = {
      'AttendanceId': data.StudentAttendnceId,
      'MealId': data.MealstypeId,
      'Status': (data.isPresent === 'true') ? 1 : 0,
      'TypeId': 2
    }
    this.restApiService.put(PathConstants.StudentAttendance_Put, params).subscribe(res => {
      if (res) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.UpdateMsg
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    })
  }

  onSubmit() {
    this.loading = true;
    const params = {
      'AttendanceId': this.logged_user.hostelId,
      'MealId': this.mealType,
      'Status': 0,
      'TypeId': 1
    }
    this.restApiService.put(PathConstants.StudentAttendance_Put, params).subscribe(res => {
      if (res) {
        this.loading = false;
        this.loadStudents();
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SubmitMessage
          
        });
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    })
  }
}
