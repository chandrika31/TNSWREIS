import { Component, OnInit,ViewChild } from '@angular/core';
import {RadioButtonModule} from 'primeng/radiobutton';
import { MessageService } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-Ui';
import { ResponseMessage } from 'src/app/Common-Modules/messages';

@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.css']
})
export class DistrictComponent implements OnInit {

  data:any;
  district:any
  selectedType:number;
  districtcode:number;
  cols:any
  selectedCategory: any = null;
  Districtname:any

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) districtForm: NgForm;

  constructor(  private restApiService: RestAPIService, 
    private masterService: MasterService, private messageService: MessageService
   ) { }


  ngOnInit(): void {
   
    this.cols = [

      {field:'Districtcode',header: 'ID' },
      {field:'Districtname',header: 'District'},
      {field:'Flag',header: 'Status'},

    ];
  }


  onSubmit() {
    const params = {
      'Districtcode': this.districtcode != undefined ? this.districtcode :0, 
      'Districtname': this.Districtname, 
      'Flag': (this.selectedType * 1),
    };
      this.restApiService.post(PathConstants.DistrictMaster_post, params).subscribe(res => {
        if(res !== undefined && res !== null) {
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
  onview(){
    this.restApiService.get(PathConstants.DistrictMaster_Get).subscribe(res => {
      if(res !== null && res !== undefined && res.length !==0) {
        this.data = res.Table;
        this.data.forEach(i => {
         i.Flag = (i.Flag) ? 'Active' : 'Inactive';
       })
       
      } 
      
    });

  }
  

  onRowSelect(event, selectedRow) {

    this.Districtname = selectedRow.Districtname;
    this.districtcode = selectedRow.Districtcode;
  }
  onClear(){
    this.districtForm.reset();
    this.districtForm.form.markAsUntouched();
    this.districtForm.form.markAsPristine();
    this.district=''
  }
}

    