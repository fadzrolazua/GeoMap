import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    <div id="map-container">
      <div id="map"></div>
      <div id="button-controls">
        <button (click)="enableSearch()">🔍</button>
        <button (click)="zoomIn()">+</button>
        <button (click)="zoomHome()">🏠</button>
        <button (click)="zoomOut()">-</button>
      </div>
      @if(isSearch){
      <div class="search-panel">
        <input type="text" placeholder="Location.." [(ngModel)]="searchText" />
        <button (click)="searchLocation()">Go</button>
      </div>
      }
    </div>
  `,
  imports: [FormsModule],
  styleUrl: './map.css',
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private homeLocation: L.LatLngExpression = [3.139, 101.6869];

  isSearch: boolean = false;
  searchText: string = '';

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [3.139, 101.6869],
      zoom: 13,
      zoomControl: false,
      doubleClickZoom: false,
    });

    this.homeLocation = [3.139, 101.6869];

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }

  zoomHome() {
    this.map.setView(this.homeLocation, 13);
  }

  enableSearch() {
    this.isSearch = !this.isSearch;
  }

  searchLocation() {
    if (!this.searchText) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${this.searchText}`)
      .then((res) => res.json())
      .then((data: any[]) => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.map.setView([lat, lon], 13);
        } else {
          alert('Location not found');
        }
      });
  }
}
