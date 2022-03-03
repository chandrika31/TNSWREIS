import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-hostelinfrastructure',
  templateUrl: './hostelinfrastructure.component.html',
  styleUrls: ['./hostelinfrastructure.component.css']
})
export class HostelinfrastructureComponent implements OnInit {

  login_user: any;
  hostelname: string;
  districtname: any;
  talukname: string;
  TotalArea: any;
  BuildingArea: any;
  NoOfFloor: any;
  // NoOfRoom: any;
  // Kitchen: any;
  // Bathroom: any;
  data: any;
  cols: any;
  disableFields: boolean;
  hostelinfras: any;
  Districtcode: any;
  Talukid: any;
  HostelId: any;
  CreatedDate: Date;
  hostelinfraId = 0;
  floorwiseId = 0;
  floor: any;
  studentStayingRoom: any;
  wardenStayingRoom: any;
  kitchen: any;
  bathroom: any;
  toilet: any;
  urinal: any;
  studentStudyingRoom: any;
  floorOptions: SelectItem[];
  showDialog: boolean;
  floorwisedetails?: any = [];
  floorwisedetail: any;
  floorwisedetaildata: any[] = [];
  library: any;
  hostelinfrastructureId: any;
  hostelInfraRow: any;
  filteredFloorData: any[] = [];
  playgroundCheck: boolean = false;
  wallCheck: boolean = false;
  rampCheck: boolean = false;

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) hostelinfrastructure: NgForm;
  @ViewChild('t', { static: false }) hostelinfrastructureextent: NgForm;
  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService, private messageService: MessageService, private _authService: AuthService,
    private _restApiService: RestAPIService, private _messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.login_user = this._authService.UserInfo;
    this.districtname = this.login_user.districtName;
    this.talukname = this.login_user.talukName;
    this.hostelname = this.login_user.hostelName;

    this.Districtcode = this.login_user.districtCode;
    this.Talukid = this.login_user.talukId;
    this.HostelId = this.login_user.hostelId;
    this.disableFields = true;
    this.onview();
    this.onLoad();
    this.cols = [
      { field: 'Districtname', header: 'District' },
      { field: 'Talukname', header: 'Taluk' },
      { field: 'HostelName', header: 'Hostel' },
      { field: 'TotalArea', header: 'Total Area' },
      { field: 'BuildingArea', header: 'Building Area' },
      { field: 'NoOfFloor', header: 'No Of Floor' },
      { field: 'PlaygroundCheck', header: 'PlayGround' },
      { field: 'CompoundWallCheck', header: 'Compound Wall' },
      { field: 'RampFacilityCheck', header: 'Ramp Facility' },
      // { field: 'NoOfRoom', header: 'No Of Room' },
      // { field: 'Kitchen', header: 'Kitchen' },
      // { field: 'Bathroom', header: 'Bathroom' },
      { field: 'CreatedDate', header: 'Created Date' },
    ]
    this.floorwisedetail = [
      { field: 'Districtname', header: 'District' },
      { field: 'Talukname', header: 'Taluk' },
      { field: 'HostelName', header: 'Hostel' },
      { field: 'FloorNo', header: 'Floors' },
      { field: 'StudentRoom', header: 'No of Student Rooms' },
      { field: 'WardenRoom', header: 'No of Warden Rooms' },
      { field: 'Library', header: 'No of Librarys' },
      { field: 'Kitchen', header: 'No of Kitchens' },
      { field: 'BathRoomNos', header: 'No of BathRooms' },
      { field: 'ToiletRoomNos', header: 'No of Toilets' },
      { field: 'UrinalNos', header: 'No of Urinal' },
      { field: 'StudyingArea', header: 'Studying Area' },

    ]
    this._restApiService.get(PathConstants.FloorWiseDetails_Get).subscribe(floorwisedetails => {
      this.floorwisedetails = floorwisedetails.slice(0);
    })
  }

  onSubmit() {
    this.blockUI.start();
    const params = {
      'Id': this.hostelinfraId,
      'Districtcode': this.Districtcode,
      'Talukid': this.Talukid,
      'HostelId': this.HostelId,
      'TotalArea': this.TotalArea,
      'BuildingArea': this.BuildingArea,
      'NoOfFloor': this.NoOfFloor,
      'PlaygroundCheck': (this.playgroundCheck) ? 1 : 0,
      'CompoundWallCheck': (this.wallCheck) ? 1 : 0,
      'RampFacilityCheck': (this.rampCheck) ? 1 : 0,
      // 'NoOfRoom': this.NoOfRoom,
      // 'Kitchen': this.Kitchen,
      // 'Bathroom': this.Bathroom,
      'Flag': 1,
    };
    //console.log(params)
    this.restApiService.post(PathConstants.HostelInfraStructure_Post, params).subscribe(res => {
      console.log(res)
      if (res !== undefined && res !== null) {
        if (res) {
          this.blockUI.stop();
          this.onview();
          this.onClear(1);
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

  onLoad() {
    const params = {
      'Districtcode': this.Districtcode,
      'Talukid': this.Talukid,
      'HostelId': this.HostelId
    };
    this._restApiService.getByParameters(PathConstants.HostelInfraStructureExtent_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.floorwisedetaildata = res;
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        })
      }
    });
  }

  onSelect(type) {
    let floorwiseSelection = [];
    switch (type) {
      case 'FD':
        this.filteredFloorData.forEach(c => {
          floorwiseSelection.push({ label: c.FloorName, value: c.FloorId });
        })
        this.floorOptions = floorwiseSelection;
        this.floorOptions.unshift({ label: '-select', value: null });
        break;

    }
  }

  onDataChecking() {
    if (this.floorwisedetaildata.length !== 0) {
      for (let i = 0; i < this.floorwisedetaildata.length; i++) {
        if ((this.floorwisedetaildata[i].FloorNo * 1) === (this.floor * 1)) {
          this.floor = null;
          this.floorOptions = [];
          this.messageService.clear();
          this.messageService.add({
            key: 't-dmsg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: 'Selected floor details is already exist please update'
          })
          break;
        } else {
          continue;
        }
      }
    }
  }

  onview() {
    const params = {
      'Districtcode': this.Districtcode,
      'Talukid': this.Talukid,
      'HostelId': this.HostelId
    };
    this.restApiService.getByParameters(PathConstants.HostelInfraStructure_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.Table.length !== 0) {
          this.disableFields = true;
          res.Table.forEach(r => {
            r.PlaygroundCheck = (r.PlaygroundCheck) ? 'Available' : 'Unavailable';
            r.CompoundWallCheck = (r.CompoundWallCheck) ? 'Available' : 'Unavailable';
            r.RampFacilityCheck = (r.RampFacilityCheck) ? 'Available' : 'Unavailable';
          })
          this.data = res.Table;
          this.hostelinfrastructureId = res.Table[0].Id;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_INFO,
            summary: ResponseMessage.SUMMARY_ALERT, life: 4000,
            detail: 'Existing Data for ' + this.hostelname
          })
        } else {
          this._messageService.clear();
          this.disableFields = false;
        }
      } else {
        this._messageService.clear();
        this.disableFields = false;
      }
    })
  }

  onUpdate() {
    const params = {
      'Id': this.floorwiseId,
      'HostelInfraStructureId': this.hostelinfrastructureId,
      'Districtcode': this.Districtcode,
      'Talukid': this.Talukid,
      'HostelId': this.HostelId,
      'FloorNo': this.floor,
      'StudentRoom': this.studentStayingRoom,
      'WardenRoom': this.wardenStayingRoom,
      'BathRoomNos': this.bathroom,
      'ToiletRoomNos': this.toilet,
      'UrinalNos': this.urinal,
      'StudyingArea': this.studentStudyingRoom,
      'Kitchen': this.kitchen,
      'Library': this.library,
      'Flag': 1,
    };

    console.log(params)
    this.restApiService.post(PathConstants.HostelInfraStructureExtent_Post, params).subscribe(res => {
      console.log(res)
      if (res !== undefined && res !== null) {
        if (res) {
          this.blockUI.stop();
          this.onClear(2);
          this.onLoad();
          this.showDialog = false;
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


  onClear(type) {
    if (type === 1) {
      this.hostelinfrastructure.form.markAsUntouched();
      this.hostelinfrastructure.form.markAsPristine();
      this.hostelinfraId = 0;
      this.NoOfFloor = null;
      this.TotalArea = null;
      this.BuildingArea = null;
      this.playgroundCheck = null;
    }
    else {
      //this.hostelinfrastructureextent.reset();
      this.hostelinfrastructureextent.form.markAsUntouched();
      this.hostelinfrastructureextent.form.markAsPristine();
      this.studentStayingRoom = null;
      this.wardenStayingRoom = null;
      this.library = null;
      this.kitchen = null;
      this.bathroom = null;
      this.toilet = null;
      this.urinal = null;
      this.studentStudyingRoom = null;
      this.floorwiseId = 0;
      this.floor = null;
      this.floorOptions = [];
      this.disableFields = true;
    }
  }


  onEdit(data) {
    this.showDialog = true;
    this.onLoad();
    this.hostelInfraRow = data;
    this.filteredFloorData = this.floorwisedetails.filter(f => {
      console.log('f', f.FloorId, this.hostelInfraRow.NoOfFloor)
      return (((f.FloorId * 1) - 1) < (this.hostelInfraRow.NoOfFloor * 1));
    })
  }

  // checkInput(type) {
  //   switch(type) {
  //     case 1:
  //   if(this.studentStayingRoom !== undefined && this.studentStayingRoom !== null) {
  //     if(this.wardenStayingRoom !== undefined && this.wardenStayingRoom !== null) {
  //       let balance = (this.hostelInfraRow.NoOfRoom * 1) - (this.wardenStayingRoom * 1);
  //       if((this.studentStayingRoom * 1) > (balance * 1)) {
  //         this.studentStayingRoom = null;
  //         this.messageService.clear();
  //         this.messageService.add({
  //           key: 't-dmsg', severity: ResponseMessage.SEVERITY_ERROR,
  //           summary: ResponseMessage.SUMMARY_ERROR, detail: 'Number of Student Staying Rooms Cannot Be greater than balance rooms - ' + balance
  //         })
  //       }
  //     } else if((this.studentStayingRoom * 1) > (this.hostelInfraRow.NoOfRoom * 1)) {
  //       this.studentStayingRoom = null;
  //       this.messageService.clear();
  //       this.messageService.add({
  //         key: 't-dmsg', severity: ResponseMessage.SEVERITY_ERROR,
  //         summary: ResponseMessage.SUMMARY_ERROR, detail: 'Number of Student Staying Rooms Cannot Be greater than allotted rooms - ' + this.hostelInfraRow.NoOfRoom
  //       })
  //     }
  //   }
  //   break;
  //   case 2:
  //     if(this.wardenStayingRoom !== undefined && this.wardenStayingRoom !== null) {
  //       if(this.studentStayingRoom !== undefined && this.studentStayingRoom !== null) {
  //         let balance = (this.hostelInfraRow.NoOfRoom * 1) - (this.studentStayingRoom * 1);
  //         if((this.wardenStayingRoom * 1) > (balance * 1)) {
  //           this.wardenStayingRoom = null;
  //           this.messageService.clear();
  //           this.messageService.add({
  //             key: 't-dmsg', severity: ResponseMessage.SEVERITY_ERROR,
  //             summary: ResponseMessage.SUMMARY_ERROR, detail: 'Number of Student Staying Rooms Cannot Be greater than balance rooms - ' + balance
  //           })
  //         }
  //       } else if((this.wardenStayingRoom * 1) > (this.hostelInfraRow.NoOfRoom * 1)) {
  //         this.wardenStayingRoom = null;
  //         this.messageService.clear();
  //         this.messageService.add({
  //           key: 't-dmsg', severity: ResponseMessage.SEVERITY_ERROR,
  //           summary: ResponseMessage.SUMMARY_ERROR, detail: 'Number of Student Staying Rooms Cannot Be greater than allotted rooms - ' + this.hostelInfraRow.NoOfRoom
  //         })
  //       }
  //     }
  //     break;
  //     case 3:
  //       if(this.kitchen !== undefined && this.kitchen !== null){
  //         if((this.kitchen * 1) > (this.hostelInfraRow.Kitchen * 1)) {
  //           this.kitchen = null;
  //           this.messageService.clear();
  //           this.messageService.add({
  //             key: 't-dmsg', severity: ResponseMessage.SEVERITY_ERROR,
  //             summary: ResponseMessage.SUMMARY_ERROR, detail: 'Number of Kitchen Cannot Be greater than Allotted no of Kitchen - ' + this.hostelInfraRow.Kitchen
  //           })
  //         }
  //       }
  //       break;
  //       case 4:
  //         if(this.bathroom !== undefined && this.bathroom !== null){
  //           if((this.bathroom * 1) > (this.hostelInfraRow.Bathroom * 1)) {
  //             this.Bathroom = null;
  //             this.messageService.clear();
  //             this.messageService.add({
  //               key: 't-dmsg', severity: ResponseMessage.SEVERITY_ERROR,
  //               summary: ResponseMessage.SUMMARY_ERROR, detail: 'Number of Bathroom Cannot Be greater than Allotted no of Bathroom - ' + this.hostelInfraRow.Bathroom
  //             })
  //           }
  //         }
  //         break;
  //   }

  // }

  onRowSelect(event, selectedRow) {
    console.log(selectedRow)
    this.hostelinfraId = selectedRow.Id;
    this.hostelname = selectedRow.HostelName;
    this.districtname = selectedRow.Districtname;
    this.talukname = selectedRow.Talukname;
    this.TotalArea = selectedRow.TotalArea;
    this.BuildingArea = selectedRow.BuildingArea;
    this.NoOfFloor = selectedRow.NoOfFloor;
    this.HostelId = selectedRow.HostelId;
    this.disableFields = false;
  }

  onRowSelect1(index, selectedRow) {
    this.floorwiseId = selectedRow.Id;
    this.floor = selectedRow.FloorNo;
    this.floorOptions = [{ label: selectedRow.FloorName, value: selectedRow.floor }];
    this.studentStayingRoom = selectedRow.StudentRoom;
    this.wardenStayingRoom = selectedRow.WardenRoom;
    this.library = selectedRow.Library;
    this.kitchen = selectedRow.Kitchen;
    this.bathroom = selectedRow.BathRoomNos;
    this.toilet = selectedRow.ToiletRoomNos;
    this.urinal = selectedRow.UrinalNos;
    this.studentStudyingRoom = selectedRow.StudyingArea;
    // this.floorwisedetaildata.splice(index,1);
  }
}
