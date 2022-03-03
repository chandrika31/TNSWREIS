import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-hostel-go',
  templateUrl: './hostel-go.component.html',
  styleUrls: ['./hostel-go.component.css']
})
export class HostelGoComponent implements OnInit {
  Mslno: 0;
  gono: any;
  goDate: any;
  remarks: any;
  logged_user: User;
  totalstudent: any;
  hostel: any;
  hostels?: any;
  hostelOptions: SelectItem[];
  district: any;
  districts?: any;
  districtOptions: SelectItem[];
  taluk: any;
  taluks?: any;
  talukIdOptions: SelectItem[];
  data: any;
  cols: any;
  disableTaluk: boolean = true;
  @ViewChild('f', { static: false }) hostelgoForm: NgForm;
  constructor(private restApiService: RestAPIService, private messageService: MessageService,
    private masterService: MasterService, private _datePipe: DatePipe, private authService: AuthService) { }

  ngOnInit(): void {
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.logged_user = this.authService.UserInfo;
    this.cols = [
      { field: 'HostelID', header: 'Hostel ID' },
      { field: 'HostelName', header: 'Hostel Name' },
      { field: 'GoNumber', header: 'Go Number' },
      { field: 'gdate', header: 'Go Date' },
      { field: 'AllotmentStudent', header: 'Total Student' },
      { field: 'Districtname', header: 'District Name' },
      { field: 'Talukname', header: 'Taluk Name' },
      { field: 'Remarks', header: 'Remarks' },
    ];
  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    switch (type) {
      case 'DT':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
      case 'TK':
        if (this.district !== undefined && this.district !== null) {
          this.taluks.forEach(t => {
            if (t.dcode === this.district) {
              talukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.talukIdOptions = talukSelection;
          this.talukIdOptions.unshift({ label: '-select-', value: null });
        }
        break;
    }
  }

  refreshFields(value) {
    if(value === 'D') {
      this.taluk = null;
      this.talukIdOptions = [];
    }
    this.loadHostelList();
  }
  onSave() {
    const params = {
      'Slno': this.Mslno,
      'hostelid': this.hostel,
      'Districtcode': this.district,
      'Talukid': this.taluk,
      'GoNo': this.gono,
      'GoDate': this._datePipe.transform(this.goDate, 'yyyy-MM-dd'),
      'Remarks': this.remarks,
      'TotalStudent': this.totalstudent,
      'Flag': true
    };
    this.restApiService.post(PathConstants.Hostelgo_post, params).subscribe(res => {
      if (res) {
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

  clearform() {
    this.hostelgoForm.reset();
    this.districtOptions = [];
    this.talukIdOptions = [];
    this.hostelOptions = [];
  }

  onView() {
    const params = {
      'DCode': this.logged_user.districtCode,
      'TCode': this.logged_user.talukId,
      'HostelId': this.logged_user.hostelId
    }
    this.restApiService.getByParameters(PathConstants.Hostelgo_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if(res.length !== 0) {
          res.Table.forEach(r => {
            r.gdate = this._datePipe.transform(r.GoDate, 'dd/MM/yyyy');
          })
        this.data = res.Table;
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
        })
      }
    });
  }

  loadHostelList() {
    const Params = {
      'Type': 0,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ?
        this.logged_user.hostelId : 0,
    }
    this.restApiService.getByParameters(PathConstants.Hostel_Get, Params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.hostels = res.Table;
        let hostelSelection = [];
        this.hostels.forEach(t => {
          hostelSelection.push({ label: t.HostelName, value: t.Slno });
        })
        this.hostelOptions = hostelSelection;
        this.hostelOptions.unshift({ label: '-select-', value: null });
      }
    });
  }

  onRowSelect(event, selectedRow) {
    this.Mslno = selectedRow.RID;
    this.gono = selectedRow.GoNumber;
    this.goDate = new Date(selectedRow.GoDate);
    this.remarks = selectedRow.Remarks;
    this.totalstudent = selectedRow.AllotmentStudent;
    this.districtOptions = [{ label: selectedRow.Districtname, value: selectedRow.Districtcode }];
    this.talukIdOptions = [{ label: selectedRow.Talukname, value: selectedRow.Talukid }];
    this.hostelOptions = [{ label: selectedRow.HostelName, value: selectedRow.HostelID }];
     this.hostel =  selectedRow.HostelID;
      this.district = selectedRow.Districtcode;
      this.taluk = selectedRow.Talukid;
  }
}




