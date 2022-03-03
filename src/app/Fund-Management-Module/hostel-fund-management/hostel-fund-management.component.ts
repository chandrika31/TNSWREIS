import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-hostel-fund-management',
  templateUrl: './hostel-fund-management.component.html',
  styleUrls: ['./hostel-fund-management.component.css']
})
export class HostelFundManagementComponent implements OnInit {

  yearOptions: SelectItem[];
  year: any;
  years?: any;
  districtOptions: SelectItem[];
  district: any;
  districts?: any;
  taluk: any;
  taluks?: any;
  talukOptions: SelectItem[];
  hostelName: any;
  hostels?: any;
  hostelOptions: SelectItem[];
  talukAmount: any;
  toFundId: number;
  hostelFundId: number;
  logged_user: User;
  blncAmount: number;
  totalHostelAmount: number;
  HostelFundData: any = [];
  HostelFundCols: any = [];
  showTable: boolean;
  accYear: any;
  groupType: any;
  accHead: any;
  budgetAmount: number;
  districtAmount: number;
  showTransfer: boolean;
  talukFund: number;
  dstrct: any;
  SelectTaluk: any;
  hostelAmount: number;
  accountHeadId: number;
  groupStart: number;
  HstlFundCols: any = [];
  HstlFundData: any = [];
  loading: boolean;

  @ViewChild('f', { static: false }) _hostelFundForm: NgForm;
  @BlockUI() blockUI: NgBlockUI;
  accFundId: any;
  totalBudget: any;
  table: boolean;

  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private authService: AuthService, private tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.logged_user = this.authService.UserInfo;
    this.years = this.masterService.getMaster('AY');
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.HostelFundCols = this.tableConstants.HostelFundColumns;
    this.HstlFundCols = this.tableConstants.HostelFundtable;
    console.log('enter', this.HostelFundCols)
    this.totalHostelAmount = 0;
    this.hostelFundId = 0;
  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    let yearSelection = [];
    switch (type) {
      case 'Y':
        this.years.forEach(y => {
          yearSelection.push({ label: y.name, value: y.code });
        })
        this.yearOptions = yearSelection;
        this.yearOptions.unshift({ label: '-select', value: null });
        break;
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        console.log('d', this.districts)
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select-', value: null });
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
    }
  }

  selectDistrict() {
    this.hostelName = null;
    this.hostelOptions = [];
    let hostelSelection = [];
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
        }
      })
    }
  }
  load() {
    const params = {
      'AccountingYearId': this.year,
      'Type': 2
    }
    this.restApiService.getByParameters(PathConstants.AccHeadFundAllotment_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.Table.length !== 0) {
          res.Table.forEach(r => {
            this.totalBudget = r.BudjetAmount,
            this.accountHeadId = r.AccountHeadID,
            this.groupStart = r.GroupStart
          })
        } else {
          this.totalBudget = 0;
        }
      } else {
        this.totalBudget = 0;
      }
    })
  }

  // to load taluk amount
  loadAmount() {
    this.showTable = true;
    this.hostelName = null;
    this.talukAmount = 0;
    if (this.district !== null && this.district !== undefined && this.taluk !== null && this.taluk !== undefined) {
      // this.blockUI.start();
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'AccYearId': this.year,
        'Type': 2
      }
      this.restApiService.getByParameters(PathConstants.TOFundAllotment_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.Table.length !== 0) {
            res.Table.forEach(r => {
              // this.talukFund = (r.TalukAmount !== undefined && r.TalukAmount !== null) ? r.TalukAmount : 0;
              this.toFundId = r.TOFundId;
              this.accFundId = r.AccHeadFundId;
              // this.district = r.Districtname;
              this.blockUI.stop();
            })
            this.HostelFundData = res.Table;
          } else {
            this.blockUI.stop();
            this.HostelFundData = [];
            this.messageService.clear();
            this.messageService.add({
              key: 'msg', severity: ResponseMessage.SEVERITY_WARNING,
              summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
            })
          }
        }
        else {
          this.blockUI.stop();
          this.HostelFundData = [];
          this.messageService.clear();
          this.messageService.add({
            key: 'msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          })
        }
      })
    }
    this.selectDistrict();
   
  }
  refreshFields(value) {
    if(value === 'D') {
      this.taluk = null;
      this.talukOptions = [];
    } 
    
  }
  onAdd(rowData) {
    this.showTransfer = true;
    this.accYear = rowData.ShortYear;
    this.groupType = rowData.GroupName;
    this.accHead = rowData.AccountHeadName;
    this.budgetAmount = rowData.Amount;
    this.dstrct = rowData.Districtname;
    this.SelectTaluk = rowData.Talukname;
    this.talukFund = rowData.TalukAmount;
  }

  onSave() {
    const params = {
      'HosteFundId': this.hostelFundId,
      'ToFundId': this.toFundId,
      'AccHeadFundId': this.accFundId,
      'AccHeadId': this.accountHeadId,
      'GroupTypeId': this.groupStart,
      'DCode': this.district,
      'TCode': this.taluk,
      'HCode': this.hostelName,
      'HostelAmount': this.hostelAmount,
      'AccYear': this.year,
      'Flag': 1
    }
    this.restApiService.post(PathConstants.HostelFundAllotment_Post, params).subscribe(res => {
      if (res) {
        var message = (this.hostelFundId === 0) ? ResponseMessage.SuccessMessage : ResponseMessage.UpdateMsg;
        this.clearForm();
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: message
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

  loadHostelFunds() {
    this.hostelAmount = null;
    if (this.accFundId !== undefined && this.accFundId !== null && this.hostelName !== null && this.hostelName !== undefined) {
      // this.blockUI.start();
      const data = {
        'AccHeadFundId': this.accFundId,
        'HCode': this.hostelName,
        'Type': 1
      }
      this.restApiService.getByParameters(PathConstants.HostelFundAllotment_Get, data).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.Table.length !== 0) {
            this.totalHostelAmount = (res.Table[0].TotalHostelFund !== undefined && res.Table[0].TotalHostelFund !== null)
              ? (res.Table[0].TotalHostelFund * 1) : 0;
            this.blncAmount = this.talukFund - this.totalHostelAmount;
            this.blockUI.stop();
          } else {
            this.blncAmount = this.talukFund;
          }
          if (res.Table1.length !== 0) {
            this.hostelAmount = (res.Table1[0].AllotedAmount * 1);
            this.hostelFundId = (res.Table1[0].HostelFundId * 1);
          } else {
            this.hostelAmount = 0;
            this.hostelFundId = 0;
          }
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.blncAmount = 0;
        }
      });
    }
    this.table = true;
    if (this.accFundId !== null && this.accFundId !== undefined && this.district !== null && this.district !== undefined 
      && this.taluk !== null && this.taluk !== undefined) {
      this.blockUI.start();
      const params = {
        'AccHeadFundId':this.accFundId,
        'DCode': this.district,
        'TCode': this.taluk,
        'Type': 2
      }
      this.restApiService.getByParameters(PathConstants.HostelFundAllotment_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.Table.length !== 0) {
            console.log('j',res)
            this.HstlFundData = res.Table;
            this.blockUI.stop();
          } else {
            this.blockUI.stop();
            this.HstlFundData = [];
            this.messageService.clear();
            this.messageService.add({
              key: 'msg', severity: ResponseMessage.SEVERITY_WARNING,
              summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
            })
          }
        }
      })
    }
  }

  checkBudjetAmount() {
    if (this.hostelAmount !== undefined && this.hostelAmount !== null &&
      this.blncAmount !== undefined && this.blncAmount !== null &&
      this.hostelAmount !== NaN && this.blncAmount !== NaN) {
      if ((this.blncAmount * 1) < (this.hostelAmount * 1)) {
        var msg = 'Entering amount should not be greater than budjet amount !';
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
        this.hostelAmount = null;
      }
    }
  }

  clearForm() {
    // this.hostelOptions = [];
    this.totalHostelAmount = 0;
    this.hostelAmount = 0;
    this.blncAmount = 0;
  }
}

