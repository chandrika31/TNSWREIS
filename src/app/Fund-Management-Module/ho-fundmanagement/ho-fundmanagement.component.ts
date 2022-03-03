import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-ho-fundmanagement',
  templateUrl: './ho-fundmanagement.component.html',
  styleUrls: ['./ho-fundmanagement.component.css']
})
export class HOFundmanagementComponent implements OnInit {

  goNumber: any;
  yearOptions: SelectItem[];
  Date: any;
  budjetAmount: any;
  year: any;
  years?: any;
  hoFundId: number;
  headAmount: number;
  accountHead: any;
  headOptions: SelectItem[];
  groupTypeOptions: SelectItem[];
  groupType: any;
  groupTypes?: any;
  accHeads?: any;
  accHeadOptions: SelectItem[];
  blncAmount: number;
  showFields: boolean;
  totalAccHeadAmount: number;
  accFundId: number;
  AccountHeadData: any = [];
  AccountHeadCols: any = [];
  showTable: boolean;
  loading: boolean;

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild('f', { static: false }) _hoFundForm: NgForm;

  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private _datePipe: DatePipe, private tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY');
    this.restApiService.get(PathConstants.AccHeadType_Get).subscribe(res => {
      this.accHeads = res;
    });
    this.restApiService.get(PathConstants.GroupHeadType_Get).subscribe(res => {
      this.groupTypes = res;
    });
    this.totalAccHeadAmount = 0;
    this.accFundId = 0;
    this.AccountHeadCols = this.tableConstants.AccountHeadTable;
  }

  onSelect(type) {
    let yearSelection = [];
    let accSelection = [];
    let groupSelection = [];
    switch (type) {
      case 'AY':
        this.years.forEach(y => {
          yearSelection.push({ label: y.name, value: y.code });
        })
        this.yearOptions = yearSelection;
        this.yearOptions.unshift({ label: '-select', value: null });
      case 'AH':
        this.accHeads.forEach(a => {
          accSelection.push({ label: a.Column1, value: a.Id });
        })
        this.accHeadOptions = accSelection;
        this.accHeadOptions.unshift({ label: '-select', value: null });
        break;
      case 'GT':
        this.groupTypes.forEach(g => {
          groupSelection.push({ label: g.Column1, value: g.Id });
        })
        this.groupTypeOptions = groupSelection;
        this.groupTypeOptions.unshift({ label: '-select', value: null });
        break;
    }
  }

  onSave() {
    if (this.accountHead === null && this.accountHead === undefined) {
      const parameter = {
        'Id': this.accFundId,
        'HoFundId': this.hoFundId,
        'AccYear': this.year,
        'GoNumber': this.goNumber,
        'GoDate': this._datePipe.transform(this.Date, 'dd-MM-yyyy'),
        'BudjetAmount': this.budjetAmount,
        'Flag': 1
      }
      this.restApiService.post(PathConstants.HOFundAllotment_Post, parameter).subscribe(res => {
        if (res) {
          var message = (this.hoFundId === 0) ? ResponseMessage.SuccessMessage : ResponseMessage.UpdateMsg;
          this.refresh();
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
    if (this.accountHead !== null && this.accountHead !== undefined) {
      const params = {
        'Id': this.accFundId,
        'HoFundId': this.hoFundId,
        'AccYear': this.year,
        'GroupTypeId': this.groupType,
        'AccHeadId': this.accountHead,
        'Amount': this.headAmount,
        'Flag': 1
      }
      this.restApiService.post(PathConstants.AccHeadFundAllotment_Post, params).subscribe(res => {
        if (res) {
          var message = (this.accFundId === 0) ? ResponseMessage.SuccessMessage : ResponseMessage.UpdateMsg;
          this.refreshFields();
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
  }

  loadData() {
    this.showFields = false;
    this.blockUI.start();
    if(this.year !== undefined && this.year !== null){
    const params = {
      'AccountingYearId': this.year
    }
    this.restApiService.getByParameters(PathConstants.HOFundAllotment_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.length !== 0) {
          res.forEach(res => {
            this.goNumber = res.GONumber;
            this.Date = new Date(res.GODate);
            this.budjetAmount = res.BudjetAmount;
            this.hoFundId = res.HOFundId;
            this.blockUI.stop();
            this.showFields = true;
            this.refreshFields();
          })
        } else {
          this.showFields = false;
          this.blockUI.stop();
          this.refresh();
        }
      } else {
        this.showFields = false;
        this.blockUI.stop();
        this.refresh();
      }
    })
  } 
  }

  // load total account head budget amt so far, if any account head have entered their budget
  loadAmount() {
    this.showTable = true;
    this.blncAmount = 0;
    this.totalAccHeadAmount = 0;
    if (this.blncAmount === 0) {
      if(this.accountHead !== null && this.accountHead !== undefined && this.year !== null && this.year !== undefined && this.groupType !== null && this.groupType !== undefined){
      this.blockUI.start();
      const params = {
        'AccountingYearId': this.year,
        'AccHeadId': this.accountHead,
        'GroupTypeId': this.groupType,
        'Type': 1
      }
      this.restApiService.getByParameters(PathConstants.AccHeadFundAllotment_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.Table.length !== 0) {
            this.totalAccHeadAmount = (res.Table[0].TotalBudget !== undefined && res.Table[0].TotalBudget !== null)
              ? (res.Table[0].TotalBudget * 1) : 0;
            this.blncAmount = this.budjetAmount - this.totalAccHeadAmount;
            this.blockUI.stop();
          } 
          else {
            this.blncAmount = this.budjetAmount;
          }
          if (res.Table1.length !== 0) {
            this.headAmount = (res.Table1[0].AllotedAmount * 1);
            this.accFundId = (res.Table1[0].Id * 1);
          } else {
            this.headAmount = 0;
            this.accFundId = 0;
          }
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.blncAmount = 0;
        }
      });
    }
  }
  if(this.year !== undefined && this.year !== null){
    this.loading = true;
  const params = {
    'AccountingYearId': this.year,
    'Type': 2
  }
  this.restApiService.getByParameters(PathConstants.AccHeadFundAllotment_Get, params).subscribe(res => {
    if (res !== null && res !== undefined) {
      if (res.Table.length !== 0) {
        this.AccountHeadData = res.Table;
        this.loading =false;
      } else {
        this.loading = false;
        this.AccountHeadData = [];
        this.messageService.clear();
        this.messageService.add({
          key: 'msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
        })
      }
    } else {
      this.loading =false;
      this.messageService.clear();
      this.messageService.add({
        key: 'msg', severity: ResponseMessage.SEVERITY_WARNING,
        summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
      })
    }
 
})
  }
}

  checkBudjetAmount() {
    if (this.headAmount !== undefined && this.headAmount !== null &&
      this.blncAmount !== undefined && this.blncAmount !== null &&
      this.headAmount !== NaN && this.blncAmount !== NaN) {
      if ((this.blncAmount * 1) < (this.headAmount * 1)) {
        var msg = 'Entering amount should not be greater than available budjet amount !';
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
        this.headAmount = null;
      }
    }
  }
  // to refresh first row fields on loading data where data is empty
  refresh() {
    this.goNumber = null;
    this.Date = null;
    this.budjetAmount = null;
  }
  // to refresh second row fields after save 
  refreshFields() {
    this.groupTypeOptions = [];
    this.accHeadOptions = [];
    this.blncAmount = 0;
    this.headAmount = 0;
  }

   
}
