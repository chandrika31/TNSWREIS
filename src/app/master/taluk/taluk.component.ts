import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-Ui';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-taluk',
  templateUrl: './taluk.component.html',
  styleUrls: ['./taluk.component.css']
})
export class TalukComponent implements OnInit {


  data: any;
  taluk: any
  selectedCategory: any = null;
  districtOptions: SelectItem[];
  selectdistrict: any
  selectedType: number;
  cols: any
  Talukid: number;
  classes?: any;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) talukForm: NgForm;

  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService, private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.classes = this.masterService.getMaster('DT');

    this.cols = [

      { field: 'Districtcode', header: 'ID', width: '72px' },
      { field: 'Districtname', header: 'District' },
      { field: 'Talukname', header: 'Taluk Name' },
      { field: 'Flag', header: 'Status' },


    ];

  }

  onSelect() {

    this.classes = this.masterService.getMaster('DT');
    let districtSelection = [];
    this.classes.forEach(d => {
      districtSelection.push({ label: d.name, value: d.code })
    });
    this.districtOptions = districtSelection;
    this.districtOptions.unshift({ label: '-select', value: null });
  }



  onSubmit() {
    this.blockUI.start();
    const params = {
      'Talukid': this.Talukid != undefined ? this.Talukid : 0,
      'Districtcode': this.selectdistrict.value,
      'Talukname': this.taluk,
      'Talukcode': "A",
      'Flag': (this.selectedType * 1),
    };
    this.restApiService.post(PathConstants.TalukMaster_post, params).subscribe(res => {
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
    this.restApiService.get(PathConstants.TalukMaster_Get).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.data = res.Table;
        this.data.forEach(i => {
          i.Flag = (i.Flag) ? 'Active' : 'Inactive';
        })
      }
    });
  }

  onRowSelect(event, selectedRow) {
    this.Talukid = selectedRow.Talukid;
    this.classes = this.masterService.getMaster('DT');

    this.taluk = selectedRow.Talukname;
    let districtSelection = [];
    this.classes.forEach(d => {
      if (selectedRow.Districtcode == d.code) {
        districtSelection.push({ label: d.name, value: d.code })
      }
    });
    this.districtOptions = districtSelection;

    this.selectdistrict = districtSelection[0];

    this.selectedType = selectedRow.Flag;
  }
  onClear() {
    this.talukForm.reset();
    this.talukForm.form.markAsUntouched();
    this.talukForm.form.markAsPristine();
    this.taluk = '';
    this.districtOptions = [];
    this.data = [];
  }
}
