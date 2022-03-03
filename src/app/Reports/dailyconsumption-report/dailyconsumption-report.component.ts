import { DatePipe } from '@angular/common';
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
  selector: 'app-dailyconsumption-report',
  templateUrl: './dailyconsumption-report.component.html',
  styleUrls: ['./dailyconsumption-report.component.css']
})
export class DailyconsumptionReportComponent implements OnInit {
 
  district: any;
  taluk: any;
  hostelName: any;
  consumptionCols: any;
  consumptionDetails: any[] = [];
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  toDate: any;
  fromDate: any;
  districts?: any;
  taluks?: any;
  hostels?: any;
  loading: boolean;
  logged_user: User;

  constructor(private masterService: MasterService, private restApiService: RestAPIService, private _tableConstants: TableConstants,
    private _messageService: MessageService, private _authService: AuthService, private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.consumptionCols = this._tableConstants.consumptionReportColumns;
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.logged_user = this._authService.UserInfo;
  }

  onSelect(value) {
    let districtSelection = [];
    let talukSelection = [];
    if (this.logged_user.roleId !== undefined && this.logged_user.roleId !== null) {
      switch (value) {
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          if ((this.logged_user.roleId * 1) === 1) {
            this.districtOptions.unshift({ label: 'All', value: 0 });
          }
          this.districtOptions.unshift({ label: '-select-', value: 'null' });
          break;
        case 'T':
            this.taluks.forEach(t => {
              if (t.dcode === this.district) {
                talukSelection.push({ label: t.name, value: t.code });
              }
            })
            this.talukOptions = talukSelection;
            if ((this.logged_user.roleId * 1) === 1 || (this.logged_user.roleId * 1) === 2) {
              this.talukOptions.unshift({ label: 'All', value: 0 });
            }
            this.talukOptions.unshift({ label: '-select-', value: 'null' });
          break;
         
      }
    }
  }

  loadHostelList() {
    let hostelSelection = [];
    const params = {
      'Type' : 0,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': ((this.logged_user.roleId * 1) === 4) ? this.logged_user.hostelId : 0
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
    this.taluk !== null && this.taluk !== undefined) {
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
      if((this.logged_user.roleId * 1) !== 4) {
      this.hostelOptions.unshift({ label: 'All', value: 0 });
    }
      this.hostelOptions.unshift({ label: '-select-', value: null });
    }
   
    refreshFields(value) {
      if(value === 'D') {
        this.taluk = null;
        this.talukOptions = [];
      } 
      this.loadHostelList();
    }

    loadTable() {
      this.consumptionDetails = [];
      if(this.district !== null && this.district !== undefined && this.taluk !==null && this.taluk !==undefined &&
        this.hostelName !== null && this.hostelName !== undefined && this.fromDate !== null && this.hostelName !==undefined &&
        this.toDate !==null && this.toDate !== undefined) {
      this.loading = true;
      const params = {
        'Districtcode': this.district,
        'Talukid': this.taluk,
        'HostelId': this.hostelName ,
        'FromDate': this._datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        'ToDate': this._datePipe.transform(this.toDate, 'yyyy-MM-dd')
      }
      this.restApiService.post(PathConstants.DailyConsumption_Report_Post, params).subscribe(res => {
        if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
          res.Table.forEach(r => {
            r.ConsumptionDate = this._datePipe.transform(r.ConsumptionDate, 'dd/MM/yyyy');
          })
          this.consumptionDetails = res.Table;
          this.loading = false;
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
    }
  }

