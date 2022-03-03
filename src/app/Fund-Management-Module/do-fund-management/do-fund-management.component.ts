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
  selector: 'app-do-fund-management',
  templateUrl: './do-fund-management.component.html',
  styleUrls: ['./do-fund-management.component.css']
})
export class DOFundManagementComponent implements OnInit {
  yearOptions: SelectItem[];
  year: any;
  years?: any;
  totalBudjetAmount: number;
  districtOptions: SelectItem[];
  districts?: any;
  district: any;
  blncAmount: number;
  totalDistrictAmt: number;
  AccHeadData: any = [];
  AccHeadCols: any = [];
  showTable: boolean;
  accYear: any;
  groupType: any;
  accHead: any;
  budgetAmount: number;
  districtAmount: number;
  accFundId: number;
  doFundId: number;
  accHeadId: number;
  showDialog: boolean;
  loading: boolean;
  accountHeadId: number;
  groupStart: number;
  DistrictFundData: any = [];
  DistrcitFundCols: any = [];

  @ViewChild('f', { static: false }) _doFundForm: NgForm;
  @BlockUI() blockUI: NgBlockUI;
  table: boolean;

  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY');
    this.districts = this.masterService.getMaster('DT');
    this.AccHeadCols = this.tableConstants.AccHeadColumns;
    // this.DistrcitFundCols = this.tableConstants.DistrictFundColumns;
    this.totalDistrictAmt = 0;
    this.doFundId = 0;
  }

  onSelect(type) {
    let yearSelection = [];
    let districtSelection = [];
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
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
    }
  }

  onSave() {
    const params = {
      'DOFundId': this.doFundId,
      'AccHeadFundId': this.accFundId,
      'AccHeadId': this.accountHeadId,
      'GroupTypeId': this.groupStart,
      'DCode': this.district,
      'DistrictFund': this.districtAmount,
      'AccYearId': this.year,
      'Flag': 1
    }
    this.restApiService.post(PathConstants.DOFundAllotment_Post, params).subscribe(res => {
      if (res) {
        var message = (this.doFundId === 0) ? ResponseMessage.SuccessMessage : ResponseMessage.UpdateMsg;
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

  //to load table data
  loadTable() {
    this.showTable = true;
    const params = {
      'AccountingYearId': this.year,
      'Type': 2
    }
    this.restApiService.getByParameters(PathConstants.AccHeadFundAllotment_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.Table.length !== 0) {
          res.Table.forEach(r => {
            this.accFundId = r.Id,
              this.accHeadId = r.AccHeadID,
              this.totalBudjetAmount = r.BudjetAmount,
              this.accountHeadId = r.AccountHeadID,
              this.groupStart = r.GroupStart
          })
          this.AccHeadData = res.Table;
        } else {
          this.AccHeadData = [];
          this.totalBudjetAmount = 0;
          this.messageService.clear();
          this.messageService.add({
            key: 'msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          })
        }
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 'msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
        })
      }
    })
  }

  loadDoFunds() {
    if (this.accHeadId !== null && this.accHeadId !== undefined && this.district !== null && this.district !== undefined) {
      const data = {
        'AccHeadFundId': this.accFundId,
        'DCode': this.district,
        'YearId': this.year,
        'Type': 1
      }
      this.restApiService.getByParameters(PathConstants.DOFundAllotment_Get, data).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.Table.length !== 0) {
            this.totalDistrictAmt = (res.Table[0].TotalDOBudjetAmount !== undefined && res.Table[0].TotalDOBudjetAmount !== null)
              ? (res.Table[0].TotalDOBudjetAmount * 1) : 0;
            this.blncAmount = this.budgetAmount - this.totalDistrictAmt; //to check available blnc
          } else {
            this.blncAmount = this.budgetAmount;
          }
          if (res.Table1.length !== 0) {
            this.districtAmount = (res.Table1[0].AllotedAmount * 1); //to get district fund if alloted
            this.doFundId = (res.Table1[0].DOFundId * 1);
          } else {
            this.districtAmount = 0;
            this.doFundId = 0;
          }
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.blncAmount = 0;
        }
      });
    }
    // this.table = true;
    // if (this.year !== null && this.year !== undefined && this.district !== null && this.district !== undefined) {
    //   this.blockUI.start();
    //   const params = {
    //     'AccHeadId':this.accFundId,
    //     'YearId': this.year,
    //     'Type': 0
    //   }
    //   this.restApiService.getByParameters(PathConstants.DOFundAllotment_Get, params).subscribe(res => {
    //     if (res !== null && res !== undefined) {
    //       if (res.Table.length !== 0) {
    //         console.log('j',res)
    //         this.DistrictFundData = res.Table;
    //         this.blockUI.stop();
    //       } else {
    //         this.blockUI.stop();
    //         this.DistrictFundData = [];
    //         this.messageService.clear();
    //         this.messageService.add({
    //           key: 'msg', severity: ResponseMessage.SEVERITY_WARNING,
    //           summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
    //         })
    //       }
    //     }
    //   })
    // }
  }

  //budget validation
  checkBudjetAmount() {
    if (this.districtAmount !== undefined && this.districtAmount !== null &&
      this.blncAmount !== undefined && this.blncAmount !== null &&
      this.districtAmount !== NaN && this.blncAmount !== NaN) {
      if ((this.blncAmount * 1) < (this.districtAmount * 1)) {
        var msg = 'Entering amount should not be greater than available budget amount !';
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
        this.districtAmount = null;
      }
    }
  }

  //dialog data
  onAdd(rowData) {
    // this.showTable = false;
    this.showDialog = true;
    this.accYear = rowData.ShortYear;
    this.groupType = rowData.GroupName;
    this.accHead = rowData.AccountHeadName;
    this.budgetAmount = rowData.Amount;
    this.accFundId = rowData.Id;  //fund id from rowdata
  }
//  onClose() {
//    this.loading = false;
//  }
  clearForm() {
    this.districtOptions = [];
    this.districtAmount = 0;
    this.totalDistrictAmt = 0;
    this.blncAmount = 0;
  }
}

