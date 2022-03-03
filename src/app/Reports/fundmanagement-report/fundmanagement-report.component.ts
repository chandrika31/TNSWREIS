import { Component, OnInit } from '@angular/core';
import { SelectItem, TreeNode } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-fundmanagement-report',
  templateUrl: './fundmanagement-report.component.html',
  styleUrls: ['./fundmanagement-report.component.css']
})
export class FundmanagementReportComponent implements OnInit {
  accYear: any;
  district: any;
  districtOptions: SelectItem[];
  yearOptions: SelectItem[];
  districts?: any;
  years?: any;
  budjetAmount: number;
  fundData: any[] = [];
  treeData: TreeNode[] = [];
  cols: any = [];
  accHead: any;
  accHeadOptions: SelectItem[];
  accHeads?: any;
  loading: boolean;

  constructor(private masterService: MasterService, private restApiService: RestAPIService) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY');
    this.districts = this.masterService.getMaster('DT');
    this.budjetAmount = 0;
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'amount', header: 'Budjet Amount' },
      //   { field: 'type', header: 'Budjet Amount' }
    ];
    this.restApiService.get(PathConstants.AccHeadType_Get).subscribe(res => {
      this.accHeads = res;
    });
  }


  onSelect(type) {
    let yearSelection = [];
    let districtSelection = [];
    let accSelection = [];
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
        this.districtOptions.unshift({ label: 'All', value: 0 });
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
      case 'A':
        this.accHeads.forEach(a => {
          accSelection.push({ label: a.Column1, value: a.Id });
        })
        this.accHeadOptions = accSelection;
        this.accHeadOptions.unshift({ label: 'All', value: 0 });
        this.accHeadOptions.unshift({ label: '-select', value: null });
        break;
    }
  }

  loadBudjet() {
    this.budjetAmount = 0;
    if (this.accYear !== null && this.accYear !== undefined) {
      const params = {
        'AccountingYearId': this.accYear
      }
      this.restApiService.getByParameters(PathConstants.HOFundAllotment_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            res.forEach(res => {
              this.budjetAmount = res.BudjetAmount;
            })
          } else {
            this.budjetAmount = 0;
          }
        } else {
          this.budjetAmount = 0;
        }
      });
    }
  }

  loadTable() {
    // this.district !== null && this.district !== undefined
    this.loading = true;
    this.fundData = [];
    this.treeData = [];
    if (this.accHead !== undefined && this.accHead !== null && this.accYear !== null && this.accYear !== undefined) {
      const params = {
        //'DCode': this.district,
        'AccHead': this.accHead,
        'AccountingYear': this.accYear
      }
      this.restApiService.getByParameters(PathConstants.FundManagementReport_Get, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.loading = false;
          this.fundData = res;
          this.constructTreeData()
        } else {
          this.loading = false;
        }
      })
    }
  }

  constructTreeData() {
    this.loading = true;
    this.treeData = [];
    if (this.fundData.length !== 0) {
      ///extracting unique data (district, taluk, hostel)
      var acchead_hash = Object.create(null),
        accHead = [];
      var district_hash = Object.create(null),
        district = [];
      var taluk_hash = Object.create(null),
        taluk = [];
      var hostel_hash = Object.create(null),
        hostel = [];
      this.fundData.forEach(function (o) {
        /// match and bind unique values
        var akey = ['AccHeadFundId'].map(function (a) { return o[a]; }).join('|');
        var key = ['TOFundId', 'HOFundId', 'DOFundId'].map(function (k) { return o[k]; }).join('|');
        var dkey = ['DOFundId', 'AccHeadFundId'].map(function (d) { return o[d]; }).join('|');
        if (!acchead_hash[akey]) {
          acchead_hash[akey] = {
            name: o.AccHeadName,
            amount: o.Amount,
            accHeadId: o.AccHeadFundId,
            talukFundId: o.TOFundId,
            hostelFundId: o.HostelFundId,
            districtFundId: o.DOFundId,
            hashType: 'ACCOUNTHEAD'
          };
          accHead.push(acchead_hash[akey]);
        }
        if (!district_hash[dkey]) {
          district_hash[dkey] = {
            name: o.Districtname,
            amount: o.DistrictAmount,
            accHeadId: o.AccHeadFundId,
            talukFundId: o.TOFundId,
            hostelFundId: o.HostelFundId,
            districtFundId: o.DOFundId,
            hashType: 'DISTRICT'
          };
          district.push(district_hash[dkey]);
        }
        if (!taluk_hash[key] && o.TOFundId !== null) {
          taluk_hash[key] = {
            name: o.Talukname,
            amount: o.TalukAmount,
            accHeadId: o.AccHeadFundId,
            talukFundId: o.TOFundId,
            hostelFundId: o.HostelFundId,
            districtFundId: o.DOFundId,
            hashType: 'TALUK'
          };
          taluk.push(taluk_hash[key]);
        }
        if (!hostel_hash[key] && o.HostelFundId !== null) {
          hostel_hash[key] = {
            name: o.HostelName,
            amount: o.HostelFund,
            accHeadId: o.AccHeadFundId,
            talukFundId: o.TOFundId,
            hostelFundId: o.HostelFundId,
            districtFundId: o.DOFundId,
            hashType: 'HOSTEL'
          };
          hostel.push(hostel_hash[key]);
        }
      })
      ///creating a treenode and adding parent and child to it
      var treeNode = [];
      // pushing children based on each row in parent data
      var treeChild = [];
      var districtChild = [];
      var talukChild = [];
      var hostelChild = [];
       let a_sno = 0;
      for (let a = 0; a < accHead.length; a++) {
        a_sno = a_sno + 1;
        accHead[a].slno = a_sno;
        let d_sno = 0;
        districtChild = [];
        for (let d = 0; d < district.length; d++) {
          talukChild = [];
        let t_sno = 0;
        for (let t = 0; t < taluk.length; t++) {
          hostelChild = [];
          let h_sno = 0;
        for (let h = 0; h < hostel.length; h++) {
              if (taluk[t].talukFundId === hostel[h].talukFundId && taluk[t].districtFundId === hostel[h].districtFundId) {
                h_sno = h_sno + 1;
                hostel[h].slno = h_sno;
                hostelChild.push({
                  "data": hostel[h] //children (treenode-4)
                })
              }
            }
            if (district[d].districtFundId === taluk[t].districtFundId) {
              t_sno = t_sno + 1;
              taluk[t].slno = t_sno;
              talukChild.push({
                "data": taluk[t], //children to district(parent)/parent to hostel(children) (treenode-3)
                "children": hostelChild //inner children to taluk
              })
            }
          }
          console.log('tc+hc', hostelChild, talukChild)
          if(accHead[a].accHeadId === district[d].accHeadId) {
          d_sno = d_sno + 1;
          district[d].slno = d_sno;
          districtChild.push({
            "data": district[d], //children to district(parent)/parent to hostel(children) (treenode-3)
            "children": talukChild //inner children to taluk
          })
        }
          console.log('dc', districtChild)
        }
        treeNode.push({
          "data": accHead[a], //parent (treenode-1)
          "children": districtChild //children with inner children
        })
      }

      this.treeData = treeNode; //assigning treenode to tree table data
      this.loading = false;
    } else {
      this.loading = false;
    }
    console.log('data', accHead, district, taluk, hostel)
  }

  public getColor(name: string): string {
    var colorCode: string;
    if (name === 'TALUK') {
      colorCode = "#e3f2fd"
    } else if (name === 'HOSTEL') {
      colorCode = "#d2d4d7";
    } else {
      colorCode = "white";
    }
    return colorCode;
  }
}
