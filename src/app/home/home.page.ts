import { Component, OnInit } from '@angular/core';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

import { Geolocation } from '@capacitor/geolocation';

import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  // private latitude: number | any;
  // private longitude: number | any;

  constructor() { }

  mapView: MapView | any;
  userLocationGraphic: Graphic | any;

  async ngOnInit() {
    //throw new Error("Method not implemented.");

    // this.longitude = 129.11859194142883;
    // this.latitude = 37.308873341329154;

    // const position = await Geolocation.getCurrentPosition();
    // this.latitude = position.coords.latitude;
    // this.longitude = position.coords.longitude;

    const map = new Map({
      basemap: "topo-vector"
    });
    

    //   const view = new MapView({
    //     container: "container",
    //     map: map,
    //     zoom: 10,
    //     center: [this.longitude, this.latitude]
    //   })
    
    this.mapView = new MapView({
      container: "container",
      map: map,
      zoom: 10
    });
    let weatherServiceFL = new ImageryLayer({url: WeatherServiceURL});
    map.add(weatherServiceFL)
    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
        this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }
} 
const WeatherServiceURL = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer'