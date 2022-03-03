import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-monthlywiseintentapproval',
  templateUrl: './monthlywiseintentapproval.component.html',
  styleUrls: ['./monthlywiseintentapproval.component.css']
})



export class MonthlywiseintentapprovalComponent implements OnInit {
 
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
  login_user:User;
  date:any;
  tabIndex: number;
  cols:any;
  filteredData: any[] = [];
  data:any;
  showTable: boolean;
  hostelData: any = [];
  totalRecords: number;
  Districtcode: any;
  Talukid: any;
  HostelId: any;
  @ViewChild('f', { static: false }) monthlywiseintentapproval: NgForm;
 

  @BlockUI() blockUI: NgBlockUI;
  constructor(private restApiService: RestAPIService, private messageService: MessageService,
    private masterService: MasterService, private _datePipe: DatePipe,
     private _authService: AuthService, private _restApiService: RestAPIService
     , private _messageService: MessageService) { }

  ngOnInit(): void {
    this.tabIndex = 0;
   // this.logged_user = this._authService.UserInfo;
    // this.district = this.logged_user.districtName;
    // this.taluk = this.logged_user.talukName;
    // this.hostelName = this.logged_user.hostelName;

    // this.Districtcode = this.logged_user.districtCode;
    // this.Talukid = this.logged_user.talukId;
    // this.HostelId = this.logged_user.hostelId;

    this.login_user = this._authService.UserInfo;
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
      
    this.cols = [
      { field: 'Districtname', header: 'District ' },
      { field: 'Talukname', header: 'Taluk ' },
      { field: 'HostelName', header: 'Hostel ' },
      { field: 'ShortYear', header: 'Accounting Year' },
      { field: 'CommodityName', header: 'Commodity Name' },
      { field: 'UnitName', header: 'Unit' },
      { field: 'Qty', header: 'Quantity' },
      { field: 'MonthwiseDate',  header: 'Month'},
      { field: 'ApprovalStatusName', header: 'Approval Status'},

    ]
    //this.onLoad();
    //this.onView();
  }
  // onLoad() {
  //   this.data = [];
  //   const params = {
  //     'Districtcode' : this.Districtcode,
  //     'Talukid': this.Talukid,
  //     'HostelId': this.HostelId,  
  //     'AccountingId': 4,
  //   }
  //   this._restApiService.getByParameters(PathConstants.MonthlywiseIntent_Get, params).subscribe(res => {
  //     console.log(res)
  //     if (res !== null && res !== undefined) {
  //       if(res.length !== 0) {
  //       res.forEach(i => {
  //         this.data = res.slice(0);
  //         this.filteredData = this.data.filter(e => {
  //           return (e.ApprovalStatus * 1) === this.tabIndex; 
  //         })
  //         this.totalRecords = this.filteredData.length;
  //       })
        
  //     } else {
  //       this._messageService.clear();
  //       this._messageService.add({
  //         key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
  //         summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
  //       })
  //     }
  //     } else {
  //       this._messageService.clear();
  //       this._messageService.add({
  //         key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
  //         summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
  //       })
  //     }
  //   });
  // }
  
  onTabChange($event) {
    this.tabIndex = $event.index
    switch ($event.index) {
      case 0:
        this.filteredData = this.data.filter(e => {
          return (e.ApprovalStatus * 1) === $event.index; 
        })
        this.totalRecords = this.filteredData.length;
        break;
    
    case 1:
      this.filteredData = this.data.filter(e => {
        return (e.ApprovalStatus * 1) === $event.index; 
      })
      this.totalRecords = this.filteredData.length;
            break;
      case 2:
              this.filteredData = this.data.filter(e => {
                return (e.ApprovalStatus * 1) === $event.index; 
              })
              this.totalRecords = this.filteredData.length;
                    break;
    }
  }
 
  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    let hostelSelection = [];
    if (this.login_user.roleId !== undefined && this.login_user.roleId !== null) {
      switch (type) {
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          if ((this.login_user.roleId * 1) === 1) {
            this.districtOptions.unshift({ label: 'All', value: 0 });
          }
          this.districtOptions.unshift({ label: '-select-', value: null });
          break;
       console.log ("talukSelection")

        case 'T':
          this.taluks.forEach(t => {
            talukSelection.push({ label: t.name, value: t.code });
          })
          this.talukOptions = talukSelection;
          if ((this.login_user.roleId * 1) === 1 || (this.login_user.roleId * 1) === 2) {
            this.talukOptions.unshift({ label: 'All', value: 0 });
          }
          this.talukOptions.unshift({ label: '-select-', value: null });
          break;
      }
    }
  }


    loadHostelList() {
      this.hostelName = null;
      let hostelSelection = [];
      this.hostelOptions = [];
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'HostelId': (this.login_user.hostelId !== undefined && this.login_user.hostelId !== null) ? 
        this.login_user.hostelId : 0,
      }
      if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
      this.taluk !== null && this.taluk !== undefined) {
        this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
          if (res !== null && res !== undefined && res.length !== 0) {
            this.hostels = res.Table;
              this.hostels.forEach(h => {
                hostelSelection.push({ label: h.HostelName, value: h.Slno });
              })
             // this.onLoad();
          }
        })
      }
        this.hostelOptions = hostelSelection;
        if((this.login_user.roleId * 1) !== 4) {
        this.hostelOptions.unshift({ label: 'All', value: 0 });
      }
        this.hostelOptions.unshift({ label: '-select-', value: null });
      }
    
  
    
    // refreshFields(value) {
    //   if(value === 'D') {
    //     this.taluk = null;
    //     this.talukOptions = [];
    //   } 
    //  this.loadHostelList();
    // }

  // onView()
  // {
  //   this.showTable = true;
  //   const params = {
  //     'Districtcode' : this.Districtcode,
  //     'Talukid': this.Talukid,
  //     'HostelId': this.HostelId,
  //     'AccountingId': 4,
  //   };
    
  
  //   this.restApiService.getByParameters(PathConstants.MonthlywiseIntent_Get,params).subscribe(res => {
  //   console.log(res)
  //     if (res !== null && res !== undefined && res.length !== 0){
  //       this.data = res;
  //       res.forEach(r => {
  //         r.MonthwiseDate = this._datePipe.transform(r.date, 'yyyy-MM-dd');
  //       })
        
  //     }
  //   })
  // }
  
onRowSelect(event, selectedRow) {
}
loadTable() {
  
  this.data = [];
  if (this.district !== null && this.district !== undefined && this.taluk !== null && this.taluk !== undefined &&
    this.hostelName !== null && this.hostelName !== undefined && this.hostelName !== undefined) {
    this.loading = true;
    const params = {
      'Districtcode' : this.district,
      'Talukid': this.taluk,
      'HostelId': this.hostelName,
      'AccountingId': 4,

    }
    
    this.restApiService.getByParameters(PathConstants.MonthlywiseIntent_Get,params).subscribe(res => {
     console.log( this.district,this.taluk)
      if (res !== undefined && res !== null) {
        if (res.length !== 0) {
          this.data = res;
          this.loading = false;
          // this.onLoad();
        } else {
          
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          })
        }
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
        })
      }
    })
  }
}
  onUpdate(data, id) {
    let params = {};
    if (id === 1) {
      params = {
        'Id': data.Id,
        'ApprovalStatus': 1
      }
    } else {
      params = {
        'Id': data.Id,
        'ApprovalStatus': 2
      }
    }
    console.log(params)
    this._restApiService.put(PathConstants.MonthlywiseIntent_put, params).subscribe(res => {
      var message = (id === 1) ? 'Approved Successfully' : 'Disapproved Successfully';
      if (res !== undefined && res !== null) {
        if (res) {
          this.blockUI.stop();
          // this.onLoad();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: message
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

      }
    })

  }



}




