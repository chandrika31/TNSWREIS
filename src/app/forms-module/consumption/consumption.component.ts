import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ThisReceiver, ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-consumption',
  templateUrl: './consumption.component.html',
  styleUrls: ['./consumption.component.css']
})
export class ConsumptionComponent implements OnInit {
  consumption: any;
  consumptionOptions: SelectItem[];
  consumptions?: any = [];
  date: any;
  commodityOptions: SelectItem[];
  commodity: any;
  commodities?: any = [];
  unitOptions: SelectItem[];
  unit: any;
  units?: any = [];
  openingBalance: any;
  requiredQty: any;
  closingBalance: any;
  consumptionCols: any;
  consumptionData: any[] = [];
  consumptionId: number = 0;
  loading: boolean;
  consumedList: any[] = [];
  showDialog: boolean;
  toDate: any;
  fromDate: any;
  // showAlertBox: boolean;
  maxDate: Date = new Date();
  logged_user: User;
  biometricId: any;
  disableReqQty: boolean;
  studentCount: any;
  remainingBalance: number;
  allUnits: any[] = [];
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _consumptionForm: NgForm;
  @ViewChild('cd', { static: false }) _alert: ConfirmDialog;

  constructor(private _tableConstants: TableConstants, private _masterService: MasterService,
    private _datePipe: DatePipe, private _restApiService: RestAPIService, private _authService: AuthService,
    private _messageService: MessageService, private _confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.consumptionCols = this._tableConstants.consumptionDetailsColumns;
    this.consumptions = this._masterService.getMaster('CT');
    this.commodities = this._masterService.getMaster('CM');
    this.units = this._masterService.getMaster('UN');
    this.logged_user = this._authService.UserInfo;
    this.disableReqQty = false;
    const params = {
      'HostelId': this.logged_user.hostelId,
      'FromDate': '',
      'ToDate': '',
      'Type': 1
    }
    this._restApiService.getByParameters(PathConstants.Consumption_Get, params).subscribe(res => {
      if (res) {
        this.biometricId = res[0].DeviceId;
      } else {
        console.log('No Device Id found for this hostel');
      }
    })
  }

  onSelect(id) {
    let consumptionSelection = [];
    let commoditySelection = [];
    let unitSelection = [];
    switch (id) {
      case 'CF':
        if (this.consumptions.length !== 0) {
          this.consumptions.forEach(c => {
            consumptionSelection.push({ label: c.name, value: c.code });
          })
        }
        this.consumptionOptions = consumptionSelection;
        this.consumptionOptions.unshift({ label: '-select-', value: null });
        break;
      case 'CM':
        if (this.commodities.length !== 0) {
          this.commodities.forEach(c => {
            commoditySelection.push({ label: c.name, value: c.code });
          })
        }
        this.commodityOptions = commoditySelection;
        this.commodityOptions.unshift({ label: '-select-', value: null });
        break;
      case 'UN':
        if (this.units.length !== 0) {
          this.units.forEach(u => {
            unitSelection.push({ label: u.name, value: u.code });
          })
        }
        this.allUnits = unitSelection.slice(0);
          ///commodity - unit restriction
    if(this.commodity !== undefined && this.commodity !== null) {
      if(this.commodity.value !== undefined && this.commodity.value !== null) {
        var filteredData = [];
        if((this.commodity.value * 1) === 18) {
          filteredData = this.allUnits.filter(f => {
            return (f.value * 1) === 3
          })
        } else if((this.commodity.value * 1) === 13) {
          filteredData = this.allUnits.filter(f => {
            return (f.value * 1) === 4
          })
        } else {
          filteredData = this.allUnits;
        }
      }
    }
    this.unitOptions = filteredData;
    this.unitOptions.unshift({ label: '-select-', value: null });
    break;
    }
  }

  loadStudentCount() {
    ///Get student biometric present count
    this.loadOB();
    this.closingBalance = 0;
    this.blockUI.start();
    const BM_params = {
      'Code': this.biometricId,
      'Date': this._datePipe.transform(this.date, 'MM/dd/yyyy'),
      'Type': 2
    }
    this.studentCount = 0;
    this._restApiService.getByParameters(PathConstants.BioMetricsForConsumption_Get, BM_params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res.length !== 0) {
          this.blockUI.stop();
          this.studentCount = (res[0].StudentCount !== undefined && res[0].StudentCount !== null) ? (res[0].StudentCount * 1) : 0;
        } else {
          this.studentCount = 0;
          this.blockUI.stop();
        }
      } else {
        this.studentCount = 0;
        this.blockUI.stop();
      }
    })
  }

  loadOB() {
    let Qty = 0;
    this.openingBalance = 0;
    this.requiredQty = 0;
    this.closingBalance = 0;
    this.unitOptions = [];
    this.unit = null;
    ///Get OB for consumption(calculated[(OB + Purchase) - Consumption])
    if(this.commodity !== undefined && this.commodity !== null && this.date !== undefined && this.date !== null) {
    this.blockUI.start();
    const OB_params = {
      'Commodity': (this.commodity.value !== null && this.commodity.value !== undefined) ? this.commodity.value : 0,
      'Date': this._datePipe.transform(this.date, 'MM/dd/yyyy'),
      'Code': this.logged_user.hostelId,
      'Type': 1
    }
    this._restApiService.getByParameters(PathConstants.QuantityForConsumption_Get, OB_params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res.length !== 0) {
          var OB = (res[0].OBQty !== undefined && res[0].OBQty !== null) ? (res[0].OBQty * 1) : 0;
          var Purchase = (res[0].PurchaseQty !== undefined && res[0].PurchaseQty !== null) ? (res[0].PurchaseQty * 1) : 0;
          var Consumption = (res[0].ConsumptionQty !== undefined && res[0].ConsumptionQty !== null) ? (res[0].ConsumptionQty * 1) : 0;
          this.openingBalance = ((OB + Purchase) - Consumption).toFixed(3);
          this.openingBalance = (this.openingBalance * 1);
          console.log('ob', this.openingBalance)
        } else {
          this.blockUI.stop();
        }
      } else {
        this.blockUI.stop();
      }
      /// Get the required qty calculation(from FoodEntitlement -> QTY/Student * no.of student present)
      const params = {
        'Commodity': (this.commodity.value !== null && this.commodity.value !== undefined) ? this.commodity.value : 0,
        'Date': this._datePipe.transform(this.date, 'MM/dd/yyyy')
      }
      this._restApiService.getByParameters(PathConstants.QuantityForConsumption_Get, params).subscribe(res => {
        if (res !== undefined && res !== null) {
          if (res.length !== 0) {
            this.blockUI.stop();
            Qty = (res[0].Quantity !== undefined && res[0].Quantity !== null) ? (res[0].Quantity * 1) : 0;
            this.requiredQty = (this.openingBalance !== 0) ? (Qty * this.studentCount) : 0;
            this.closingBalance = (this.openingBalance - (this.requiredQty * 1)).toFixed(3);
            this.disableReqQty = ((this.requiredQty * 1) === 0 && this.openingBalance !== 0) ? false : true;
          } else {
            this.blockUI.stop();
          }
        } else {
          this.blockUI.stop();
        }
      })
    })
  }

  }

  onEnter() {
    var canEnter = false;
    if(this.consumptionData.length !== 0) {
      for(let c = 0; c < this.consumptionData.length; c++) {
      if(this.consumptionData[c].CommodityId === this.commodity.value && this.consumptionData[c].ConsumptionType === this.consumption.value) {
        canEnter = false;
        this._messageService.clear();
                this._messageService.add({
                  key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
                  summary: ResponseMessage.SUMMARY_INVALID, detail: 'Cannot enter duplicate record !'
                });
        break;
      } else {
        continue;
      }
    }
  } else {
    canEnter = true;
  }
  if(canEnter) {
    this.calculateBalance();
    if ((this.remainingBalance * 1) >= 0) {
      this.consumptionData.push({
        'Id': (this.consumptionId !== undefined && this.consumptionId !== null) ? this.consumptionId : 0,
        'ConsumptionType': this.consumption.value,
        'cDate': this._datePipe.transform(this.date, 'yyyy-MM-dd'),
        'ConsumptionDate': this._datePipe.transform(this.date, 'MM/dd/yyyy'),
        'cdateToEdit': this.date,
        'Consumption': this.consumption.label,
        'CommodityId': this.commodity.value,
        'Commodity': this.commodity.label,
        'UnitId': this.unit.value,
        'Unit': this.unit.label,
        'StudentCount': this.studentCount,
        'OB': this.openingBalance,
        'QTY': this.requiredQty,
        'CB': this.closingBalance,
        'HostelId': this.logged_user.hostelId,
        'TalukCode': this.logged_user.talukId,
        'DistrictCode': this.logged_user.districtCode
      })
      //  this.clearForm();
      // this._consumptionForm.form.controls._consumption.reset();
      // this._consumptionForm.form.controls._commodity.reset();
      // this._consumptionForm.form.controls._unit.reset();
      this.date = null;
      this.commodity = null;
      this.commodityOptions = [];
      this.unit = null;
      this.unitOptions = [];
      this.consumption = null;
      this.consumptionOptions = [];
      this.openingBalance = 0;
      this.studentCount = 0;
      this.requiredQty = 0;
      this.closingBalance = 0;
    }
  }
  }

  calculateBalance() {
    if (this.openingBalance !== undefined && this.openingBalance !== null &&
      this.requiredQty !== undefined && this.requiredQty !== null) {
      const entered_qty = (this.requiredQty * 1);
      const opening_bal = (this.openingBalance * 1);
      let remaining_bal = 0;
      if (this.consumptionData.length !== 0) {
        this.consumptionData.forEach(c => {
          if (c.CommodityId === this.commodity.value) {
            remaining_bal += c.QTY
          }
        })
        remaining_bal = opening_bal - remaining_bal;
        this.remainingBalance = (remaining_bal - entered_qty);
      } else {
        remaining_bal = opening_bal;
        this.remainingBalance = opening_bal;
      }
      this.closingBalance = (remaining_bal - entered_qty).toFixed(3);
      var msg = '';
      if (entered_qty > remaining_bal) {
        msg = 'Quantity entered : ' + entered_qty + ' cannot be greater than available balance : ' + remaining_bal;
        this._consumptionForm.controls._requiredqty.reset();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
      } else {
        // this.closingBalance = (remaining_bal - entered_qty).toFixed(3);
        msg = '';
        this._messageService.clear();
      }
    }
  }

  onEdit(row, index, type) {
    if (index !== undefined && index !== null && this.consumptionData.length !== 0) {
      this.consumptionData.splice(index, 1);
    }
    if (row !== undefined && row !== null) {
      if (type === 2) {
        this.showDialog = false;
        this.consumptionId = row.Id;
        this.date = new Date(row.ConsumptionDate);
      } else {
        this.consumptionId = 0;
      }
      this.date = new Date(row.cdateToEdit);
      this.consumption = { label: row.Consumption, value: row.ConsumptionType };
      this.consumptionOptions = [{ label: row.Consumption, value: row.ConsumptionType }];
      this.commodity = { label: row.Commodity, value: row.CommodityId };
      this.commodityOptions = [{ label: row.Commodity, value: row.CommodityId }];
      this.unit = { label: row.Unit, value: row.UnitId };
      this.unitOptions = [{ label: row.Unit, value: row.UnitId }];
      this.studentCount = (row.StudentCount * 1);
      this.consumptionId = row.Id;
      this.openingBalance = (row.OB * 1).toFixed(3);
      this.requiredQty = (row.QTY * 1).toFixed(3);
      this.closingBalance = (row.CB * 1).toFixed(3);
    }
  }

  onDelete(data, index, type) {
    if (index !== undefined && index !== null) {
      if (type === 1) {
        this.consumptionData.splice(index, 1);
      } else {
        this._confirmationService.confirm({
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this._alert.disableModality();
            this.blockUI.start();
            this._restApiService.put(PathConstants.Consumption_Delete, { 'Id': data.Id }).subscribe(res => {
              if (res !== undefined && res !== null) {
                if (res) {
                  this.blockUI.stop();
                  this._messageService.clear();
                  this._messageService.add({
                    key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
                    summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.DeleteSuccessMsg
                  });
                  this.consumedList.splice(index, 1);
                } else {
                  this.blockUI.stop();
                  this._messageService.clear();
                  this._messageService.add({
                    key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
                    summary: ResponseMessage.SUMMARY_INVALID, detail: ResponseMessage.DeleteFailMsg
                  });
                }
              } else {
                // this.loading = false;
                this.blockUI.stop();
                this._messageService.clear();
                this._messageService.add({
                  key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
                  summary: ResponseMessage.SUMMARY_INVALID, detail: ResponseMessage.ErrorMessage
                });
              }
            })
          },
          reject: () => {
            this._messageService.clear();
            this._alert.disableModality();
          }
        });
      }
    }
  }

  onView() {
    this.showDialog = true;
    this.fromDate = null;
    this.toDate = null;
    this.consumedList = [];
  }

  onDateSelect() {
    this.consumedList = [];
    this.checkValidDateSelection();
    if (this.fromDate !== undefined && this.fromDate !== null &&
      this.toDate !== undefined && this.toDate !== null) {
      this.loading = true;
      const params = {
        'FromDate': this._datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        'ToDate': this._datePipe.transform(this.toDate, 'yyyy-MM-dd'),
        'HostelId': this.logged_user.hostelId,
        'Type': 2
      }
      this._restApiService.getByParameters(PathConstants.Consumption_Get, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          res.forEach(r => {
            r.cDate = this._datePipe.transform(r.ConsumptionDate, 'dd/MM/yyyy');
          })
          this.consumedList = res.slice(0);
          this.loading = false;
        } else {
          this.loading = false;
          this.showDialog = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
          });
        }
      }, (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 0 || err.status === 400) {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          })
        }
      })
    }
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' &&
      this.toDate !== '' && this.fromDate !== null && this.toDate !== null) {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR, life: 5000,
          summary: ResponseMessage.SUMMARY_INVALID, detail: ResponseMessage.ValidDateErrorMessage
        });
        this.fromDate = null; this.toDate = null;
      }
      return this.fromDate, this.toDate;
    }
  }

  onSave() {
    this.blockUI.start();
    // this.consumptionData.forEach(c => {
    //   c.ConsumptionDate = this._datePipe.transform(c.ConsumptionDate, 'MM/dd/yyyy');
    // })
    this._restApiService.post(PathConstants.Consumption_Post, this.consumptionData).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          this.blockUI.stop();
          this.onClearAll();
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
        this.blockUI.stop();
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
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.NetworkErrorMessage
        })
      }
    })
  }

  onClearAll() {
    this.consumptionId = 0;
    //   this._consumptionForm.reset();
    this.openingBalance = 0;
    this.closingBalance = 0;
    this.requiredQty = 0;
    this._consumptionForm.form.markAsUntouched();
    this._consumptionForm.form.markAsPristine();
    this.consumptionData = [];
    this.consumedList = [];
    this.commodityOptions = [];
    this.consumptionOptions = [];
    this.unitOptions = [];
    this.loading = false;
  }

  clearForm() {
    this.consumptionId = 0;
    this._consumptionForm.reset();
    this.commodityOptions = [];
    this.consumptionOptions = [];
    this.unitOptions = [];
    this.date = new Date();
  }
}
