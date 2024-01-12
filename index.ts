/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// @ts-nocheck TODO remove when fixed

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


let markers: google.maps.Marker[] = [];
let directionsRenderer: google.maps.DirectionsRenderer;
interface CamionRoutes {
  [key: string]: google.maps.LatLng[];
}

const camionRoutes: CamionRoutes = {
  'camion1': [
    { lat: 36.881, lng: 10.243 }, // Waypoint 1
    { lat: 36.882, lng: 10.244 }, // Waypoint 2
    // Add additional waypoints for Camion 1
  ],
  'camion2': [
    { lat: 36.883, lng: 10.245 }, // Waypoint 1
    { lat: 36.884, lng: 10.246 }, // Waypoint 2
    // Add additional waypoints for Camion 2
  ],
  'camion3': [
    { lat: 36.885, lng: 10.247 }, // Waypoint 1
    { lat: 36.886, lng: 10.248 }, // Waypoint 2
    // Add additional waypoints for Camion 3
  ],
  // Define routes for additional camions as needed
};

function initAutocomplete() {
  
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 36.8833298, lng: 10.249999 },
      zoom: 13,
      mapTypeId: "roadmap",
    }
  );

  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input") as HTMLInputElement;
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
  });

  // use a Material Icon as font


  

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon as string,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

    directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
  
}


function calculateAndDisplayRoute(
  directionsService: google.maps.DirectionsService, 
  waypoints: google.maps.LatLng[]
): void {
  if (waypoints.length < 2) {
    console.error('You must provide at least two waypoints for the route.');
    return;
  }

  const origin = waypoints.shift()!;
  const destination = waypoints.pop()!;
  
  directionsService.route(
    {
      origin: origin,
      destination: destination,
      waypoints: waypoints.map((point) => ({ location: point, stopover: true })),
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    },
    (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    }
  );
}


function showDetails(camionId: string): void {
  const camionElements = document.querySelectorAll('.list-group-item');
  camionElements.forEach((el) => {
    el.classList.remove('active');
  });

  const selectedCamion = document.getElementById(camionId);
  selectedCamion?.classList.add('active');

  const directionsService = new google.maps.DirectionsService();
  calculateAndDisplayRoute(directionsService, camionRoutes[camionId]);
}
declare global {
  interface Window {
    initAutocomplete: () => void;
    showDetails: () => void;
  }
}
window.initAutocomplete = initAutocomplete;
window.showDetails = showDetails;
export {};
