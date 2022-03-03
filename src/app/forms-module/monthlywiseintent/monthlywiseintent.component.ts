import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ResponseMessage } from '../../Common-Modules/messages';
import { PathConstants } from '../../Common-Modules/PathConstants';
import { MasterService } from '../../services/master-data.service';
import { RestAPIService } from '../../services/restAPI.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-monthlywiseintent',
  templateUrl: './monthlywiseintent.component.html',
  styleUrls: ['./monthlywiseintent.component.css']
})
export class MonthlywiseintentComponent implements OnInit {

  commodityName: any;
  commodityOptions: SelectItem[];
  yearOptions:  SelectItem[];;
  unit: any;
  year: any;
  taluk: any;
  Districtcode: any;
  Talukid: any;
  HostelId: any;
  hostelName: any;
  district: any;
  unitOptions:  SelectItem[];
  quantity: any;
  data: any = [];
  showTable: boolean;
  monthwiseint: number;
  logged_user: User;
  units?: any;
  years?: any;
  commodities?: any;
  cols:any;
  date: 'MM';
 
  @ViewChild('f', { static: false }) monthlywiseintent: NgForm;


  constructor(private masterService: MasterService, private datepipe: DatePipe, private restApiService: RestAPIService, private messageService: MessageService,
    private authService: AuthService) { }


  ngOnInit(): void {
    this.units = this.masterService.getMaster('UN');
    this.years = this.masterService.getMaster('AY');
    this.commodities = this.masterService.getMaster('CM');
    this.logged_user = this.authService.UserInfo;
    this.district = this.logged_user.districtName;
    this.taluk = this.logged_user.talukName;
    this.hostelName = this.logged_user.hostelName;

    this.Districtcode = this.logged_user.districtCode;
    this.Talukid = this.logged_user.talukId;
    this.HostelId = this.logged_user.hostelId;

    this.cols = [
      // { field: 'Districtname', header: 'District code' },
      // { field: 'Talukname', header: 'Taluk id' },
      // { field: 'HostelName', header: 'Hostel Id' },
      { field: 'ShortYear', header: 'Accounting Year' },
      { field: 'CommodityName', header: 'Commodity Name' },
      { field: 'UnitName', header: 'Unit' },
      { field: 'Qty', header: 'Quantity' },
      { field: 'MonthwiseDate',  header: 'Month'},
      { field: 'ApprovalStatusName', header: 'Approval Status'},

    ]
  }
  onSelect(type) {
    this.data =[];
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
          this.years.forEach(y => {
            yearSelection.push({ label: y.name, value: y.code });
          })
          this.yearOptions = yearSelection;
          this.yearOptions.unshift({ label: '-select', value: null });
          break;
          case 'CN':
          this.commodities.forEach(c => {
            commoditySelection.push({ label: c.name, value: c.code });
          })
          this.commodityOptions = commoditySelection;
          this.commodityOptions.unshift({ label: '-select', value: null });
          break;
}
}
onSubmit() {
  const params = {
    'Id': this.monthwiseint,
    // 'Districtcode': this.district,
    // 'Talukid': this.taluk,
    // 'HostelId': this.hostelName,
    'Districtcode' : this.Districtcode,
    'Talukid': this.Talukid,
    'HostelId': this.HostelId,
    'AccountingId': this.year,
    'CommodityId': this.commodityName,
    'UnitId': this.unit,
    'Qty': this.quantity,
    'Flag': 1,
    'MonthwiseDate': this.datepipe.transform(this.date,'yyyy-MM-dd'), 

  }
  
  this.restApiService.post(PathConstants.MonthlywiseIntent_Post,params).subscribe(res => {
   console.log(res)
      if (res) {
      this.clearform();
      this.messageService.clear();
      this.messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
        summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
      });
    }else {
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

onRowSelect(event, selectedRow) {
  if(selectedRow !== null && selectedRow !== undefined){
    this.monthwiseint = selectedRow.Id;
    this.year = selectedRow.AccountingId;
    this.yearOptions = [{ label: selectedRow.ShortYear, value: selectedRow.AccountingId }];
    this.commodityName = selectedRow.CommodityId;
    this.commodityOptions = [{ label: selectedRow.CommodityName, value: selectedRow.CommodityId }];
    this.unit = selectedRow.UnitId;
    this.unitOptions = [{ label: selectedRow.UnitName, value: selectedRow.UnitId }];
    this.quantity = selectedRow.Qty
  }
}
  

onView() {
  if (this.year !== null && this.year !== undefined) {
  this.showTable = true;
  const params = {
    'Districtcode' : this.Districtcode,
    'Talukid': this.Talukid,
    'HostelId': this.HostelId,  
    'AccountingId': this.year,
  };
  this.data =[];
  this.restApiService.getByParameters(PathConstants.MonthlywiseIntent_Get,params).subscribe(res => {
   if (res !== null && res !== undefined) {
          if (res.length !== 0) {
      this.data = res;
      res.forEach(r => {
        r.MonthwiseDate = this.datepipe.transform(r.date, 'yyyy-MM-dd');
      });
  }else {
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
}else {
    this.messageService.clear();
    this.messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
      summary: ResponseMessage.SUMMARY_WARNING, detail: 'Please select academic year to view data !'
    });
  }
}



clearform(){
  this.data = [];
  this.commodityOptions = [];
  this.yearOptions = [];
  this.unitOptions = [];
  this.quantity = [];
}
}
