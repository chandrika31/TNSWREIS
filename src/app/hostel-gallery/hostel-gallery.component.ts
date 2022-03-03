import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-hostel-gallery',
  templateUrl: './hostel-gallery.component.html',
  styleUrls: ['./hostel-gallery.component.css']
})
export class HostelGalleryComponent implements OnInit {

  district: any;
  taluk: any;
  hostelName: any;
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  districts?: any;
  taluks?: any;
  hostels?; any;
  images: any[] = [];
  homeImageData: any = [];
  logged_user: User;
  disableFields: boolean;
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  show: boolean = false;
  readonly: boolean;
  hostel: any;
  constructor(private masterService: MasterService, private restApiService: RestAPIService, private authService: AuthService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.show = false;
    this.readonly = true;
    this.disableFields = true;
    this.districts = this.masterService.getDistrictAll();
    this.taluks = this.masterService.getTalukAll();
    this.logged_user = this.authService.UserInfo;
    this.district = this.logged_user.districtName;
    this.taluk = this.logged_user.talukName;
    this.hostelName = this.logged_user.hostelName;
    if (this.logged_user.roleId === 1) {
      this.disableFields = false;
      this.show = true;
    }
    const params = {
      'HCode': this.logged_user.hostelId
    }
    this.restApiService.getByParameters(PathConstants.HostelGallery_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.Table.length !== 0) {
          res.Table.forEach(i => {
            i.previewImageSrc = '../../assets/layout/' + this.logged_user.hostelId + '/Events/2021-2022/' + i.Image;
            i.thumbnailImageSrc = '../../assets/layout/' + this.logged_user.hostelId + '/Events/2021-2022/' + i.Image;
            i.alt = i.ImageDescription;
          })
          this.images = res.Table;
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoImageMsg
          });
        }
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    })
  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    switch (type) {
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select', value: null });
        break;
      case 'T':
        this.taluks.forEach(t => {
          if (t.dcode === this.district) {
            talukSelection.push({ label: t.name, value: t.code });
          }
        })
        this.talukOptions = talukSelection;
        this.talukOptions.unshift({ label: '-select', value: null });
        break;
    }
  }

  refreshFields(value) {
    if (value === 'D') {
      this.taluk = null;
      this.talukOptions = [];
    }
    this.selectDistrict();
  }

  // hstl based on district 
  selectDistrict() {
    this.hostelName = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    if (this.district !== undefined && this.district !== null && this.taluk !== undefined && this.taluk !== null) {
      const params = {
        'Type': 1,
        'DCode': this.district,
        'TCode': this.taluk,
        'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ?
          this.logged_user.hostelId : 0,
      }
      if (this.district !== null && this.district !== undefined) {
        this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
          if (res !== null && res !== undefined && res.length !== 0) {
            this.hostels = res.Table;
            this.hostels.forEach(h => {
              hostelSelection.push({ label: h.HostelName, value: h.Slno });
            })
            this.hostelOptions = hostelSelection;
            this.hostelOptions.unshift({ label: '-select', value: null });
          };
        })
      }
    }
  }

  loadImages() {
    if (this.hostel !== null && this.hostel !== undefined) {
      const params = {
        'HCode': this.hostel
      }

      // var path = 'assets/layout/' + this.logged_user.hostelId + '/Events/2021-2022';
      this.restApiService.getByParameters(PathConstants.HostelGallery_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.Table.length !== 0) {
            res.Table.forEach(i => {
              i.previewImageSrc = '../../assets/layout/' + this.logged_user.hostelId + '/Events/2021-2022/' + i.Image;
              i.thumbnailImageSrc = '../../assets/layout/' + this.logged_user.hostelId + '/Events/2021-2022/' + i.Image;
              i.alt = i.ImageDescription;
            })
            this.images = res.Table;
          } else {
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
              summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoImageMsg
            });
          }
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
        }
      })
    }
  }

}
