import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-commodity-master',
  templateUrl: './commodity-master.component.html',
  styleUrls: ['./commodity-master.component.css']
})
export class CommodityMasterComponent implements OnInit {
  
  commodityName: string;
  commodityTamilName: string;
  selectedType: number;
  commodityGroup: number;
  cgroupOptions: SelectItem [];
  commodityId: number;
  data: any = [];
  showTable: boolean;
  commodityGroups?: any;

  @ViewChild('f', { static: false }) _commodityMaster: NgForm;


  constructor(private restApiService: RestAPIService, private messageService: MessageService, private masterService: MasterService) { }

  ngOnInit(): void {
    this.commodityId = 0;
    this.commodityGroups = this.masterService.getMaster('CG');
  }
// dropdown
  onSelect(type) {
    let groupSelection = [];

    switch (type) {
      case 'C':
        this.commodityGroups.forEach(g => {
          groupSelection.push({ label: g.name, value: g.code });
        })
        this.cgroupOptions = groupSelection;
        this.cgroupOptions.unshift({ label: '-select-', value: null });
        break;
      }
    }
  onSave(){

  const params = {
    'Id': this.commodityId,
    'Name': this.commodityName,
    'NameTamil': this.commodityTamilName,
    'CommodityGroupId': this.commodityGroup,
    'Flag': (this.selectedType * 1)
  };

  this.restApiService.post(PathConstants.CommodityMaster_Post,params).subscribe(res => {
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
  clearform() {
    this._commodityMaster.reset();
    this.cgroupOptions = [];
  }
  onView() {
     this.showTable = true;
     this.restApiService.get(PathConstants.CommodityMaster_Get).subscribe(res => {
       if (res !== null && res !== undefined && res.length !== 0){
         res.forEach(i => {
           i.status = (i.Flag) ? 'Active' : 'Inactive';
         })
         this.data = res;
       }
     })
  }
  onEdit(selectedRow) {
    if(selectedRow !== null && selectedRow !==undefined){
      this.commodityId = selectedRow.Id;
      this.commodityName = selectedRow.Name;
      this.commodityTamilName = selectedRow.NameTamil;
      this.commodityGroup = selectedRow.CommodityGroupId;
      this.cgroupOptions = [{ label: selectedRow.CommodityGroup, value: selectedRow.CommodityGroupId }];
      this.selectedType =selectedRow.Flag;
    }
  }
}

