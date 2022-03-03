import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  public lat;
  public lng;

  constructor() {
  }

  getLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resp => {
          console.log('res', resp)
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
          err => {
            console.log('err', err);
            reject(err);
          });
    }).catch(error => error);
}
  
}
