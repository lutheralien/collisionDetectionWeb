import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map-dialog',
  template: `
    <h2 mat-dialog-title>Select Location</h2>
    <mat-dialog-content>
      @if (isLoading) {
        <div class="loading-overlay">
          <mat-spinner></mat-spinner>
          <p>Detecting your location...</p>
        </div>
      }
      @if (!isLoading) {
        <mat-form-field appearance="fill" class="search-box">
          <input matInput
                 [formControl]="searchControl"
                 [matAutocomplete]="auto"
                 placeholder="Search for a place">
          <mat-autocomplete #auto="matAutocomplete" 
                            [displayWith]="displayFn"
                            (optionSelected)="onPlaceSelected($event)">
            @for (option of filteredOptions | async; track option) {
              <mat-option [value]="option">{{option.description}}</mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>
        @if (selectedLocation.address) {
          <div class="selected-location-info">
            <p><strong>Selected Address:</strong> {{selectedLocation.address}}</p>
            <p><strong>Latitude:</strong> {{selectedLocation.latitude}}</p>
            <p><strong>Longitude:</strong> {{selectedLocation.longitude}}</p>
          </div>
        }
        <google-map
          height="400px"
          width="100%"
          [center]="center"
          [zoom]="zoom"
          (mapClick)="onMapClick($event)">
          <map-marker [position]="markerPosition"></map-marker>
        </google-map>
      }
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button [mat-dialog-close]="selectedLocation" [disabled]="!selectedLocation.address" cdkFocusInitial>OK</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .loading-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
    }
    .search-box {
      width: 100%;
      margin-bottom: 10px;
    }
    .selected-location-info {
      margin-bottom: 10px;
      padding: 10px;
      background-color: #f0f0f0;
      border-radius: 4px;
    }
  `],
  standalone: true,
  imports: [
    GoogleMapsModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    CommonModule
]
})
export class MapDialogComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 15;
  markerPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  selectedLocation: { address: string; latitude: number; longitude: number } = {
    address: '',
    latitude: 0,
    longitude: 0
  };
  isLoading = true;
  searchControl = new FormControl('');
  autocompleteService: google.maps.places.AutocompleteService;
  placesService: google.maps.places.PlacesService;
  filteredOptions: Observable<google.maps.places.AutocompletePrediction[]>;

  constructor(
    public dialogRef: MatDialogRef<MapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { latitude: number; longitude: number },
    private ngZone: NgZone,
    private snackBar: MatSnackBar
  ) {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
    
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.getAutocompleteResults(value || ''))
    );
  }

  ngOnInit() {
    this.getUserLocation();
  }

  displayFn(prediction: google.maps.places.AutocompletePrediction): string {
    return prediction && prediction.description ? prediction.description : '';
  }

  private getAutocompleteResults(value: string): Observable<google.maps.places.AutocompletePrediction[]> {
    return new Observable(observer => {
      if (value) {
        this.autocompleteService.getPlacePredictions({ input: value }, (predictions, status) => {
          this.ngZone.run(() => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              observer.next(predictions);
            } else {
              observer.next([]);
            }
            observer.complete();
          });
        });
      } else {
        observer.next([]);
        observer.complete();
      }
    });
  }

  onPlaceSelected(event: any) {
    const placeId = event.option.value.place_id;
    this.placesService.getDetails(
      { placeId: placeId },
      (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          this.ngZone.run(() => {
            if (place.geometry && place.geometry.location) {
              this.center = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              };
              this.markerPosition = this.center;
              this.zoom = 17;
              this.selectedLocation = {
                address: place.formatted_address || 'Address not available',
                latitude: this.center.lat,
                longitude: this.center.lng
              };
              // Clear the search input
              this.searchControl.setValue('', { emitEvent: false });
              // Close the dialog with the selected location data
              this.dialogRef.close(this.selectedLocation);
            } else {
              console.error('Place geometry or location is undefined');
              this.showErrorMessage('Unable to locate the selected place. Please try another search.');
            }
          });
        } else {
          console.error('Place details request failed:', status);
          this.showErrorMessage('Failed to get place details. Please try again.');
        }
      }
    );
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.markerPosition = this.center;
          this.getAddressFromLatLng(this.center.lat, this.center.lng);
          this.isLoading = false;
        },
        (error) => {
          console.error('Error getting user location:', error);
          this.showErrorMessage('Unable to get your location. Using default location.');
          this.useDefaultOrProvidedLocation();
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.showErrorMessage('Geolocation is not supported. Using default location.');
      this.useDefaultOrProvidedLocation();
    }
  }

  useDefaultOrProvidedLocation() {
    this.center = {
      lat: this.data.latitude || 0,
      lng: this.data.longitude || 0
    };
    this.markerPosition = this.center;
    this.getAddressFromLatLng(this.center.lat, this.center.lng);
    this.isLoading = false;
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.getAddressFromLatLng(this.markerPosition.lat, this.markerPosition.lng);
    }
  }

  getAddressFromLatLng(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        this.selectedLocation = {
          address: results[0].formatted_address,
          latitude: lat,
          longitude: lng
        };
      } else {
        console.error('Geocoder failed due to: ' + status);
        this.showErrorMessage('Unable to find address for this location.');
        this.selectedLocation = {
          address: 'Address not found',
          latitude: lat,
          longitude: lng
        };
      }
    });
  }

  showErrorMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}