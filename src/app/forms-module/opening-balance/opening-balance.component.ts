import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ResponseMessage } from '../../Common-Modules/messages';
import { PathConstants } from '../../Common-Modules/PathConstants';
import { MasterService } from '../../services/master-data.service';
import { RestAPIService } from '../../services/restAPI.service';

@Component({
  selector: 'app-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.css']
})
export class OpeningBalanceComponent implements OnInit {

  commodityName: any;
  commodityOptions: SelectItem[];
  yearOptions: SelectItem[];;
  unit: any;
  year: any;
  taluk: any;
  hostelName: any;
  district: any;
  unitOptions: SelectItem[];
  quantity: any;
  OBCommData: any = [];
  openingBlncData: any = [];
  openingBlncCols: any;
  showTable: boolean;
  openingblncId: number;
  logged_user: User;
  units?: any;
  years?: any;
  commodities?: any;
  isDisabled: boolean;
  @ViewChild('f', { static: false }) _openingBalance: NgForm;


  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private authService: AuthService, private tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.units = this.masterService.getMaster('UN');
    this.years = this.masterService.getMaster('AY');
    this.commodities = this.masterService.getMaster('CM');
    this.logged_user = this.authService.UserInfo;
    this.district = this.logged_user.districtName;
    this.taluk = this.logged_user.talukName;
    this.hostelName = this.logged_user.hostelName;
    this.openingBlncCols = this.tableConstants.OpeningBalanceColumns;
    this.isDisabled = false
  }

  onSelect(type) {
    let unitSelection = [];
    let yearSelection = [];
    let commoditySelection = [];
    switch (type) {
      case 'U':
        this.units.forEach(u => {
          unitSelection.push({ label: u.name, value: u.code });
        })
        this.unitOptions = unitSelection;
        this.unitOptions.unshift({ label: '-select', value: null });
        break;
      case 'Y':
        var filtered_data = [];
        filtered_data = this.years.filter(y => {
          return y.type === 2;
        })
      filtered_data.forEach(y => {
          yearSelection.push({ label: y.name, value: y.code });
        })
        console.log('t',this.years)
        this.yearOptions = yearSelection;
        this.yearOptions.unshift({ label: '-select', value: null });
        break;
      case 'CN':
        this.commodities.forEach(c => {
          commoditySelection.push({ label: c.name, value: c.code });
        })
        this.commodityOptions = commoditySelection;
        this.commodityOptions.unshift({ label: '-select', value: null });
        this.quantity='';
        break;
       
    }
  }

  onSubmit() {
    const params = {
      'Id': this.openingblncId,
      'Districtcode': this.logged_user.districtCode,
      'Talukid': this.logged_user.talukId,
      'HostelId': this.logged_user.hostelId,
      'AccountingId': this.year,
      'CommodityId': this.commodityName,
      'UnitId': this.unit,
      'Qty': this.quantity,
      'Flag': 1
    }
    this.restApiService.post(PathConstants.OpeningBalance_Post, params).subscribe(res => {
      if (res) {
        this.clearform();
        this.onView();
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

  onEdit(selectedRow) {
    if (selectedRow !== null && selectedRow !== undefined) {
      this.openingblncId = selectedRow.Id;
      this.year = selectedRow.AccountingId;
      this.yearOptions = [{ label: selectedRow.ShortYear, value: selectedRow.AccountingId }];
      this.commodityName = selectedRow.CommodityId;
      this.commodityOptions = [{ label: selectedRow.CommodityName, value: selectedRow.CommodityId }];
      this.unit = selectedRow.UnitId;
      this.unitOptions = [{ label: selectedRow.UnitName, value: selectedRow.UnitId }];
      this.quantity = selectedRow.Qty
    }
  }

  onViewcheck() {
    this.isDisabled=false;
    if (this.year !== null && this.year !== undefined) {
      const params = {
        'Districtcode': this.logged_user.districtCode,
        'Talukid': this.logged_user.talukId,
        'HostelId': this.logged_user.hostelId,
        'AccountingId': this.year
      };
      this.restApiService.getByParameters(PathConstants.OpeningBalance_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            this.OBCommData = res;            
           this.OBCommData.forEach(d => {
            if ((this.commodityName) ===  d.CommodityId ) {  
              this.isDisabled=true; 
              this.messageService.clear();
              this.messageService.add({
                key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
                summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.ExistingdataMessage
              });
            }
          })           
          } else {
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
              summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
            });
          }
        } else {
          this.showTable = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          });
        }
      })
    } else {
      this.messageService.clear();
      this.messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
        summary: ResponseMessage.SUMMARY_WARNING, detail: 'Please select academic year to view data !'
      });
    }
  }

  clearform() {
    this.commodityOptions = [];
    this.yearOptions = [];
    this.unitOptions = [];
    this.quantity = [];
  }



  onView() {
    if (this.year !== null && this.year !== undefined) {
      const params = {
        'Districtcode': this.logged_user.districtCode,
        'Talukid': this.logged_user.talukId,
        'HostelId': this.logged_user.hostelId,
        'AccountingId': this.year
      };
      this.restApiService.getByParameters(PathConstants.OpeningBalance_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            this.showTable = true;
            this.openingBlncData = res;
          } else {
            this.showTable = false;
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
              summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
            });
          }
        } else {
          this.showTable = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          });
        }
      })
    } else {
      this.messageService.clear();
      this.messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
        summary: ResponseMessage.SUMMARY_WARNING, detail: 'Please select academic year to view data !'
      });
    }
  }
}
