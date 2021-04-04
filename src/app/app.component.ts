import { ChefService } from './chef.service';
import { Component } from '@angular/core';

import { ICountry, IState, ICity } from 'country-state-city'
import csc from 'country-state-city'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  allIndianCities: ICity[] = [];
  selectedCity: any;
  chefs: any[] = [];
  filteredCities: any[] = [];
  search: string = '';


  isLocationDropDownOpen = false;

  constructor(private chefService: ChefService) {
    //getting all the indian cities with latitude and longitude!
    this.allIndianCities = csc.getCitiesOfCountry("IN");
    this.selectedCity = this.allIndianCities.find((city: ICity) => city.name === 'Bangalore Urban');
    this.search = this.selectedCity.name;
    this.getChefs();
  }

  getChefs() {
    let query = {
      "location": {
        "latitude": this.selectedCity.latitude,
        "longitude": this.selectedCity.longitude
      }
    }
    this.chefService.getChefs(query).subscribe((data: any) => {
      this.chefs = data.data.response;
    })
  }

  locationDropDown() {
    this.isLocationDropDownOpen = !this.isLocationDropDownOpen;
    if (this.isLocationDropDownOpen) this.search = '';
    else this.search = this.selectedCity.name;
  }

  searchForLocation(event: any) {
    if (event.target.value.length > 2) {
      this.filteredCities = this.allIndianCities.filter((city: ICity) =>
        city.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
    }
  }

  selectLocation(location: any) {
    this.selectedCity = location;
    this.search = location.name;
    this.filteredCities = [];
    this.getChefs();
  }

  detectLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((a: any) => {
        //api is noot very much good, so i used this closest method to find city near to respecive cordinates!
        this.selectedCity = this.allIndianCities.reduce((prev: any, curr: any) => {
          return (Math.abs(+curr.latitude - a.coords.latitude) < Math.abs(+prev.latitude - a.coords.latitude) && Math.abs(+curr.longitude - a.coords.longitude) < Math.abs(+prev.longitude - a.coords.longitude) ? curr : prev);
        });

        this.isLocationDropDownOpen = false;
        this.getChefs();

      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

}
