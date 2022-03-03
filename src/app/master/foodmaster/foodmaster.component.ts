import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-foodmaster',
  templateUrl: './foodmaster.component.html',
  styleUrls: ['./foodmaster.component.css']
})
export class FoodmasterComponent implements OnInit {

  BreakFast: string;
  Lunch: string;
  Snacks: string;
  Dinner: string;
  data: any;
  days?: any;
  cols: any;
  selectedday: number;
  daysOptions: SelectItem[];
  Slno: any;
  Hosteltypes?: any;
  Hostelfunctions?: any;
  HosteltypeOptions: SelectItem[];
  Hosteltype: number;

  public progress: number;
  public message: string;

  @ViewChild('f', { static: false }) foodmasterForm: NgForm;
  constructor(private http: HttpClient, private restApiService: RestAPIService,private _masterService: MasterService,
    private masterService: MasterService, private messageService: MessageService
  ) { }


  ngOnInit(): void {
    this.days = this.masterService.getMaster('FD');
     this.Hosteltypes = this._masterService.getMaster('HF');
    //this.Hosteltypes = this._masterService.getMaster('HT');

    this.cols = [
      { field: 'HostelTypeName', header: 'Hostel Type' },
      { field: 'Name', header: 'Weekdays:வார நாட்கள்' },
      { field: 'BreakFast', header: 'Breakfast:காலை உணவு' },
      { field: 'Lunch', header: 'Lunch:மதிய உணவு' },
      { field: 'Snacks', header: 'Snacks:சிற்றுண்டி' },
      { field: 'Dinner', header: 'Dinner:இரவு உணவு' },
    ];
  }
  onSelect(type) {
    this.data = [];
    let foodSelection = [];
    let hostelSelection = [];
    switch (type) {
      case 'D':
        this.days.forEach(d => {
          foodSelection.push({ label: d.name, value: d.code })
        });
        this.daysOptions = foodSelection;
        this.daysOptions.unshift({ label: '-select', value: null });
        break;
        case 'HF':
          this.Hosteltypes.forEach(h => {
            hostelSelection.push({ label: h.name, value: h.code });
          })
          this.HosteltypeOptions = hostelSelection;
          this.HosteltypeOptions.unshift({ label: '-select-', value: null });
            break;
    }
  }
  onSubmit() {
    const params = {
      'Slno': this.Slno != undefined ? this.Slno : 0,
      'HTypeId': this.Hosteltype,
      'DayId': this.selectedday,
      'Breakfast': this.BreakFast,
      'Lunch': this.Lunch,
      'Snacks': this.Snacks,
      'Dinner': this.Dinner,

    };


    this.restApiService.post(PathConstants.FoodMaster_Post, params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          
          this.onClear(); 
       
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

  onview() {
    this.data = [];
    if(this.Hosteltype !=undefined && this.Hosteltype != null)
    
    {
    const param=
    {
      'HTypeId' : this.Hosteltype
      
    }
    
    this.restApiService.getByParameters(PathConstants.FoodMaster_Get,param).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.data = res.Table;
       
      }
    });
  }
  else
  {
    this.messageService.clear();
    this.messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
      summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.SelectHostelType
    })
  }
  }

  onRowSelect(event, selectedRow) {
    this.Hosteltype = selectedRow.HTypeId;
    this.HosteltypeOptions = [{ label: selectedRow.HostelTypeName, value: selectedRow.HTypeId }];
    this.selectedday = selectedRow.DayId;
    this.daysOptions = [{ label: selectedRow.Name, value: selectedRow.DayId }];
    this.BreakFast = selectedRow.BreakFast;
    this.Lunch = selectedRow.Lunch;
    this.Snacks = selectedRow.Snacks;
    this.Dinner = selectedRow.Dinner;
  }

  onClear() {
    this.foodmasterForm.reset();
    this.Hosteltype = null;
    this.HosteltypeOptions = [];
    this.BreakFast = '',
      this.Lunch = '',
      this.Snacks = '',
      this.Dinner = '',
      this.daysOptions = [];
      this.data = [];

  }
}