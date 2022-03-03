
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-feedingchargestype',
  templateUrl: './feedingchargestype.component.html',
  styleUrls: ['./feedingchargestype.component.css']
})
export class FeedingchargestypeComponent implements OnInit {

  AccountingyearOptions:SelectItem[];
  feedingchargeOptions:SelectItem[];
  data:any = [];
  cols:any;
  Accountingyear:any;
  Accountingyears?:any;
  feedingcharge:number;
  feedingcharges?:any;
  _School:any;
  _College:any;
  School:any;
  College:any;
  selectedType :number;
  TypeId:number;
 
  feedtype?: any = [];
  masterData?: any = [];
  feedingselection?:any = [];

  FeedingCharges:any
  feedchargeId=0;

  showTable: boolean;

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) FeedingChargesType: NgForm;

  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService,  private messageService: MessageService, 
    private _restApiService: RestAPIService, 
  ) { }
  
  initializeMaster(): Observable<any[]> {
   
  return of(this.feedtype);
}

  ngOnInit(): void {
   
    this._restApiService.get(PathConstants.FeedingChargesType_Get).subscribe(feedtype => {
      this.feedtype = feedtype;
    })
    this.Accountingyears = this.masterService.getMaster('AY');
    //this.feedingcharges = this.masterService.getMaster('FC');
    this.cols = [
      { field: 'AccountingYear', header: 'Accounting Year' },
      { field: 'FeedingChargeName', header: 'FeedingChargesType' },
      { field: 'School', header: 'Amount For School' },
      { field: 'College', header: 'Amount For College' },
      { field: 'status',  header: 'Status'},
    ]
    }

    onSelect(type) {
   this.data = [];
    let yearSelection = [];
    let feedingselection =[];
    this.masterData = [];
      switch (type) {
      case 'AY':

        this.Accountingyears.forEach(y => {
          yearSelection.push({ label: y.name, value: y.code });
        })
        this.AccountingyearOptions = yearSelection;
        this.AccountingyearOptions.unshift({ label: '-select', value: null });
        break;
      }

   
        switch (type) {
          case 'FC':
         
            if (this.feedtype.Table !== undefined && this.feedtype.Table !== null) {
              this.feedtype.Table.forEach(c => {
                feedingselection.push({ label:c.Name, value: c.Typeid });
            })
            this.feedingchargeOptions = feedingselection;
            this.feedingchargeOptions.unshift({ label: '-select', value: null });
      } else {
        this.masterData = []; 
      }
        break;
      }
       
    }
    

  onSubmit( )
{
  this.blockUI.start();
  const params = {
              
    'Id':this.feedchargeId,
    'TypeId': this.feedingcharge,
    'School': this.School,
    'College': this.College,
    'AccountingYearId': this.Accountingyear,
    'Flag': (this.selectedType * 1)
  };
  console.log(params)
  this.restApiService.post(PathConstants.FeedingChargesDetail_Post, params).subscribe(res => {
    console.log(res)
    if (res !== undefined && res !== null) {
      if (res) {
        this.blockUI.stop();
        this.onview();
        this.onClear();
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
        });
      } else {
        this.blockUI.stop();
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    } else {
      this.messageService.clear();
      this.messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
        summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
      });
    }
  }, (err: HttpErrorResponse) => {
    this.blockUI.stop();
    if (err.status === 0 || err.status === 400) {
      this.messageService.clear();
      this.messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
        summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
      })

    }
  })
}


onview() {
  
   if (this.Accountingyear !== null && this.Accountingyear !== undefined) {
    const params = {
      'AccountingYearId': this.Accountingyear      

    };
    this.restApiService.getByParameters(PathConstants.FeedingChargesDetail_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
          res.Table.forEach(i => {
                i.status = (i.Flag) ? 'Active' : 'Inactive';
                })
          this.showTable = true;
          this.data = res.Table;
          }
          
         else {
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


onClear()
{
  this.feedchargeId=0;
  this.FeedingChargesType.reset();
  this.FeedingChargesType.form.markAsUntouched();
  this.FeedingChargesType.form.markAsPristine();
  this.FeedingCharges=''
}

onRowSelect(event, selectedRow)
{
  console.log(selectedRow)
 this.feedchargeId = selectedRow.Id; 
 this.Accountingyear = selectedRow.AccountingYearId;
 this.AccountingyearOptions = [{ label: selectedRow.AccountingYear, value: selectedRow.AccountingYearId }];
 this.feedingcharge = selectedRow.TypeId;
 this.feedingchargeOptions = [{ label: selectedRow.FeedingChargeName, value: selectedRow.TypeId }];
 this.School = selectedRow.School;
 this.College = selectedRow.College;
 this.selectedType = selectedRow.Flag;

}

    }
