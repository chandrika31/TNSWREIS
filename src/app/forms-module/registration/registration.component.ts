import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService, SelectItem } from 'primeng/api';
import { Registration } from 'src/app/interfaces/registration';
import { User } from 'src/app/interfaces/user';
import { MasterService } from 'src/app/services/master-data.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { TableConstants } from 'src/app/Common-Modules/table-constants';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  yearRange: string;
  genderOptions: SelectItem[];
  genders?: any;
  bloodGroupOptions: SelectItem[];
  bloodgroups?: any;
  motherTongueOptions: SelectItem[];
  languages?: any;
  religionOptions: SelectItem[];
  religions?: any;
  casteOptions: SelectItem[];
  castes?: any;
  schoolOptions: SelectItem[];
  schools?: any;
  districtOptions: SelectItem[];
  districts?: any;
  talukOptions: SelectItem[];
  taluks?: any;
  institutionType: string = '1';
  classOptions: SelectItem[];
  classes?: any;
  mediumOptions: SelectItem[];
  mediums?: any;
  subCasteOptions: SelectItem[];
  subcastes?: any;
  courseYearOptions: SelectItem[];
  isDisability: boolean = false;
  studentImage: any;
  incomeImg: any;
  tcImg: any;
  declarationImg: any;
  passbookImg: any;
  disableTaluk: boolean;
  ageTxt: string;
  logged_user: User;
  registeredCols: any;
  registeredDetails: any[] = [];
  loading: boolean;
  showDialog: boolean;
  enableScholarship: boolean;
  aadharNo: string;
  aadharValidationMsg: string;
  maxDate: Date = new Date();
  obj: Registration = {} as Registration;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _registrationForm: NgForm;
  @ViewChild('bankPassBook', { static: false }) _bankPassBook: ElementRef;
  @ViewChild('transferCertificate', { static: false }) _transferCertificate: ElementRef;
  @ViewChild('incomeCertificate', { static: false }) _incomeCertificate: ElementRef;
  @ViewChild('userFile', { static: false }) _studentImg: ElementRef;
  @ViewChild('declarationForm', { static: false }) _declarationForm: ElementRef;

  constructor(private _masterService: MasterService, private _d: DomSanitizer,
    private _datePipe: DatePipe, private _messageService: MessageService,
    private _restApiService: RestAPIService, private _authService: AuthService,
    private _tableConstants: TableConstants, private http: HttpClient) { }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 30;
    this.yearRange = start_year_range + ':' + current_year;
    this.logged_user = this._authService.UserInfo;
    this.bloodgroups = this._masterService.getMaster('BG');
    this.taluks = this._masterService.getTalukAll();
    this.genders = this._masterService.getMaster('GD');
    this.districts = this._masterService.getDistrictAll();
    this.languages = this._masterService.getMaster('MT');
    this.castes = this._masterService.getMaster('CS');
    this.classes = this._masterService.getMaster('CL');
    this.religions = this._masterService.getMaster('RL');
    this.mediums = this._masterService.getMaster('MD');
    this.subcastes = this._masterService.getMaster('SC');
    this.registeredCols = this._tableConstants.registrationColumns;
    this.defaultValues();
  }

  onSelectType() {
    this.classOptions = [];
  }

  onSelect(type) {
    let districtSelection = [];
    let genderSelection = [];
    let talukSelection = [];
    let bloodGroupSelection = [];
    let languageSelection = [];
    let casteSelection = [];
    let religionSelection = [];
    let classSelection = [];
    let mediumSelection = [];
    let subcasteSelection = [];
    let courseYearSelection = [];
    switch (type) {
      case 'GD':
        this.genders.forEach(g => {
          genderSelection.push({ label: g.name, value: g.code });
        })
        this.genderOptions = genderSelection;
        this.genderOptions.unshift({ label: '-select-', value: null });
        break;
      case 'BG':
        this.bloodgroups.forEach(b => {
          bloodGroupSelection.push({ label: b.name, value: b.code });
        })
        this.bloodGroupOptions = bloodGroupSelection;
        this.bloodGroupOptions.unshift({ label: '-select-', value: null });
        break;
      case 'MT':
        this.languages.forEach(m => {
          languageSelection.push({ label: m.name, value: m.code });
        })
        this.motherTongueOptions = languageSelection;
        this.motherTongueOptions.unshift({ label: '-select-', value: null });
        break;
      case 'DT':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select-', value: null });
        if (this.obj.distrctCode !== null && this.obj.distrctCode !== undefined) {
          this.disableTaluk = false;
        } else {
          this.disableTaluk = true;
        }
        break;
      case 'TK':
        if (this.obj.distrctCode !== undefined && this.obj.distrctCode !== null) {
          this.taluks.forEach(t => {
            if (t.dcode === this.obj.distrctCode) {
              talukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.talukOptions = talukSelection;
          this.talukOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'CT':
        this.castes.forEach(c => {
          casteSelection.push({ label: c.name, value: c.code });
        })
        this.casteOptions = casteSelection;
        this.casteOptions.unshift({ label: '-select-', value: null });
        break;
      case 'RL':
        this.religions.forEach(r => {
          religionSelection.push({ label: r.name, value: r.code });
        })
        this.religionOptions = religionSelection;
        this.religionOptions.unshift({ label: '-select-', value: null });
        break;
      case 'CL':
        var filtered_data = [];
        var courseYear = [];
        if (this.institutionType === '1') {
          filtered_data = this.classes.filter(f => {
            return f.type === 1 ;
          })
        } else {
          courseYear = this.classes.filter(c => {
            return (c.code * 1) <= 5;
          })
          filtered_data = this.classes.filter(f => {
            return f.type === 2;
          })
        }
        filtered_data.forEach(c => {
          classSelection.push({ label: c.name, value: c.code });
        })
        courseYear.forEach(y => {
          courseYearSelection.push({ label: y.name + ' Year', value: y.code });
        })
        this.courseYearOptions = courseYearSelection;
        this.courseYearOptions.unshift({ label: '-select-', value: null });
        this.classOptions = classSelection;
        this.classOptions.unshift({ label: '-select-', value: null });
        break;
      case 'MD':
        this.mediums.forEach(m => {
          mediumSelection.push({ label: m.name, value: m.code });
        })
        this.mediumOptions = mediumSelection;
        this.mediumOptions.unshift({ label: '-select-', value: null });
        break;
      case 'SC':
        if (this.obj.caste !== null && this.obj.caste !== undefined) {
          this.subcastes.forEach(m => {
            if ((m.casteId * 1) === (this.obj.caste * 1)) {
              subcasteSelection.push({ label: m.name, value: m.code });
            }
          })
        } else {
          subcasteSelection = [];
        }
        this.subCasteOptions = subcasteSelection;
        this.subCasteOptions.unshift({ label: '-select-', value: null });
        break;
    }
  }

  refreshFields(value) {
    if (value === 'D') {
      if (this.obj.distrctCode !== null && this.obj.distrctCode !== undefined) {
        this.disableTaluk = false;
      } else {
        this.disableTaluk = true;
      }
      this._registrationForm.form.controls['_taluk'].reset();
      this.obj.talukCode = null;
      this.talukOptions = [];
    } else if (value === 'C') {
      this._registrationForm.form.controls['_subcaste'].reset();
      this.obj.subCaste = null;
      this.subCasteOptions = [];
    }
  }

  checkScholardhipEligibility() {
    if (this.institutionType === '1') {
      if (this.obj.classId !== undefined && this.obj.classId !== null && (this.obj.classId * 1) > 7) {
        this.enableScholarship = true;
      } else {
        this.enableScholarship = false;
        this.obj.scholarshipId = '';
      }
    } else if (this.institutionType === '0') {
      this.enableScholarship = true;
    } else {
      this.enableScholarship = false;
    }
  }

  calculateAge() {
    let timeDiff = Math.abs(Date.now() - this.obj.dob.getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.obj.age = age;
    this.ageTxt = age + ' Years';
  }

  maskInput(value) {
    this.obj.aadharNo = value;
    var len = value.length;
    if (len > 11) {
      this.aadharNo = '*'.repeat(len - 4) + value.substr(8, 4);
    }
  }

  public uploadFile = (files) => {
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
    this.http.post(this._restApiService.BASEURL + PathConstants.FileUpload_Post, formData)
      .subscribe((event: any) => {
      }
      );
    return actualFilename;
  }

  onFileUpload($event, id) {
    const selectedFile = $event.target.files[0];
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    switch (id) {
      case 1:
        const s_url = window.URL.createObjectURL(selectedFile);
        this.studentImage = this._d.bypassSecurityTrustUrl(s_url);
        this.obj.studentFilename = this.uploadFile($event.target.files);
        break;
      case 2:
        const i_url = window.URL.createObjectURL(selectedFile);
        this.incomeImg = this._d.bypassSecurityTrustUrl(i_url);
        this.obj.incomeCertificateFilename = this.uploadFile($event.target.files);
        break;
      case 3:
        const t_url = window.URL.createObjectURL(selectedFile);
        this.tcImg = this._d.bypassSecurityTrustUrl(t_url);
        this.obj.tcFilename = this.uploadFile($event.target.files);
        break;
      case 4:
        const p_url = window.URL.createObjectURL(selectedFile);
        this.passbookImg = this._d.bypassSecurityTrustUrl(p_url);
        this.obj.bankPassbookFilename = this.uploadFile($event.target.files);
        break;
      case 5:
        const d_url = window.URL.createObjectURL(selectedFile);
        this.declarationImg = this._d.bypassSecurityTrustUrl(d_url);
        this.obj.declarationFilename = this.uploadFile($event.target.files);
        break;
    }

  }

  clearForm() {
    this._registrationForm.reset();
    this._registrationForm.form.markAsUntouched();
    this._registrationForm.form.markAsPristine();
    this._studentImg.nativeElement.value = null;
    this._bankPassBook.nativeElement.value = null;
    this._incomeCertificate.nativeElement.value = null;
    this._transferCertificate.nativeElement.value = null;
    this._declarationForm.nativeElement.value = null;
    this.defaultValues();
  }

  defaultValues() {
    this.maxDate = new Date();
    this.obj = {} as Registration;
    this.studentImage = '';
    this.disableTaluk = true;
    this.isDisability = false;
    this.enableScholarship = true;
    this.institutionType = '1';
    this.obj.incomeCertificateFilename = '';
    this.obj.bankPassbookFilename = '';
    this.obj.tcFilename = '';
    this.obj.studentFilename = '';
    this.obj.tcFilename = '';
    this.obj.bankPassbookFilename = '';
    this.obj.declarationFilename = '';
    this.obj.districtApproval = '0';
    this.obj.talukApproval = '0';
    this.obj.studentId = 0;
    this.obj.parentId = 0;
    this.obj.bankId = 0;
    this.obj.documentId = 0;
  }

  onSubmit() {
    this.blockUI.start();
    this.obj.dob = this._datePipe.transform(this.obj.dob, 'MM/dd/yyyy');
    this.obj.hostelId = this.logged_user.hostelId;
    this.obj.motherYIncome = 0;
    this.obj.fatherYIncome = 0;
    this.obj.scholarshipId = (this.obj.scholarshipId !== undefined) ? this.obj.scholarshipId : '';
    this.obj.micrNo = (this.obj.micrNo !== undefined && this.obj.micrNo !== null) ? this.obj.micrNo : '';
    this._restApiService.post(PathConstants.Registration_Post, this.obj).subscribe(response => {
      if (response !== undefined && response !== null) {
        if (response) {
          this.blockUI.stop();
          this.clearForm();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          })
        } else {
          this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          })
        }
      } else {
        this.blockUI.stop();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
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

  onView() {
    this.showDialog = true;
    this.registeredDetails = [];
    this.loading = true;
    const params = {
      'DCode': this.logged_user.districtCode,
      'TCode': this.logged_user.talukId,
      'HCode': this.logged_user.hostelId
    }
    
    this._restApiService.getByParameters(PathConstants.Registration_Get, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(r => {
          var len = r.aadharNo.toString().length;
          if (len > 11) {
            r.aadharNoMasked = '*'.repeat(len - 4) + r.aadharNo.substr(8, 4);
          }
        })
        this.registeredDetails = res.slice(0);
        this.loading = false;
      } else {
        this.loading = false;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        })
      }
    })
  }

  onEdit(row, index) {
    if (row !== undefined && row !== null) {
      this.obj = null;
      this.showDialog = false;
      this.obj = row;
      this.classOptions = [{ label: row.class, value: row.classId }];
      this.casteOptions = [{ label: row.casteName, value: row.caste }];
      this.talukOptions = [{ label: row.Talukname, value: row.talukCode }];
      this.genderOptions = [{ label: row.genderName, value: row.gender }];
      this.districtOptions = [{ label: row.Districtname, value: row.distrctCode }];
      this.religionOptions = [{ label: row.religionName, value: row.religion }];
      this.motherTongueOptions = [{ label: row.mothertongueName, value: row.motherTongue }];
      this.bloodGroupOptions = [{ label: row.bloodgroupName, value: row.bloodGroup }];
      this.mediumOptions = [{ label: row.mediumName, value: row.medium }];
      this.subCasteOptions = [{ label: row.subcasteName, value: row.subCaste }];
      this.courseYearOptions = [{ label: row.CourseYear, value: row.CourseYearId }];
      this.obj.dob = new Date(row.dob);
      this.ageTxt = this.obj.age + ' Years';
      this.institutionType = ((row.classId * 1) > 12) ? '0' : '1';
      this.studentImage = 'assets/layout/'+ this.logged_user.hostelId +'/Documents/'+ row.studentFilename;
      this.maskInput(this.obj.aadharNo);
    }
  }

  onDelete(row, index) {

  }

  validateAadhaar(aadhaarString) {
    // The multiplication table
    if (aadhaarString.length != 12) {
      this.aadharValidationMsg = 'Aadhaar numbers should be 12 digits !';
    } else {
      this.aadharValidationMsg = '';
    }
    if (aadhaarString.match(/[^$,.\d]/)) {
      this.aadharValidationMsg = 'Aadhaar numbers must contain only numbers !';
    } else {
      this.aadharValidationMsg = '';
    }
    var aadhaarArray = aadhaarString.split('');
    var toCheckChecksum = aadhaarArray.pop();
    if (this.generate(aadhaarArray) == toCheckChecksum) {
      this.aadharValidationMsg = '';
      this.maskInput(aadhaarString)
      return true;
    } else {
      this.aadharValidationMsg = 'Invalid Aadhar No!';
      this._registrationForm.form.controls._aadharno.invalid;
      if (this.aadharNo.length === 12) {
        setTimeout(() => {
          this.aadharNo = null;
          this.aadharValidationMsg = 'Please enter valid Aadhar No!';
    }, 300);
      }
      return false;
    }
  }

  // generates checksum
  generate(array) {
    var d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];
    // permutation table p
    var p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];
    // inverse table inv
    var inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];
    var c = 0;
    var invertedArray = array.reverse();
    for (var i = 0; i < invertedArray.length; i++) {
      c = d[c][p[((i + 1) % 8)][invertedArray[i]]];
    }
    return inv[c];
  }
}
