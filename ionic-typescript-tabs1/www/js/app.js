// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  
})


.controller('AppCtrl', function ($scope) {
    $scope.location = { lat: 0, lon: 0};

    $scope.getLocation = function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            $scope.location.lat = position.coords.latitude;
            $scope.location.lon = position.coords.longitude;

            //var geocoder = new google.maps.Geocoder();
            //var goo = new google();
            
            //var latlng = new google.maps.LatLng(lat, lng);
            //var request = {
            //    latLng: latlng
            //};
        }, function (error) { $scope.error = error },
        { maximumAge: 3000, timeout: 5000, enableHighAccuracy: false });
    }
    //google.maps.event.addDomListener(window, 'load', initialize());

    var map = null;
    var searchManager = null;
    var currInfobox = null;

    // credentials: 'Autte28nvmWuCEFIxW3LE2Ntm-8LZwKb0sA0XKCNfWMP4KettL00dZmTMTkVHeqS',
    //function GetMap() {
    //    var map = new Microsoft.Maps.Map('#divMap', {
    //        credentials: 'Autte28nvmWuCEFIxW3LE2Ntm-8LZwKb0sA0XKCNfWMP4KettL00dZmTMTkVHeqS',
    //        center: new Microsoft.Maps.Location(51.50632, -0.12714),
    //        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
    //        zoom: 10
    //    });
    //    console.log("Hey map initialized!!");

    //    //Add your post map load code here.
    //}
    //function GetMap() {
    //    Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', {
    //        callback: function () {
    //            map = new Microsoft.Maps.Map(document.getElementById('divMap'),
    //            {
    //                credentials: "Autte28nvmWuCEFIxW3LE2Ntm-8LZwKb0sA0XKCNfWMP4KettL00dZmTMTkVHeqS",
    //                mapTypeId: Microsoft.Maps.MapTypeId.road,
    //                enableClickableLogo: false,
    //                enableSearchLogo: false,
    //                center: new Microsoft.Maps.Location(47.603561, -122.329437),
    //                zoom: 10,
    //                theme: new Microsoft.Maps.Themes.BingTheme()
    //            });
    //        }
    //    });
    //}
    
    function createSearchManager() {
        map.addComponent('searchManager', new Microsoft.Maps.Search.SearchManager(map));
        searchManager = map.getComponent('searchManager');
    }

    $scope.LoadSearchModule = function() {
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', { callback: searchRequest })
    }

    function searchRequest() {
        createSearchManager();
        var query = document.getElementById('txtSearch').value;
        var request =
            {
                query: query,
                count: 20,
                startIndex: 0,
                bounds: map.getBounds(),
                callback: search_onSearchSuccess,
                errorCallback: search_onSearchFailure
            };
        searchManager.search(request);
    }

    function search_onSearchSuccess(result, userData) {
        map.entities.clear();
        var searchResults = result && result.searchResults;
        if (searchResults) {
            for (var i = 0; i < searchResults.length; i++) {
                search_createMapPin(searchResults[i]);
            }
            if (result.searchRegion && result.searchRegion.mapBounds) {
                map.setView({ bounds: result.searchRegion.mapBounds.locationRect });
            }
            else {
                alert('No results');
            }
        }
    }

    function search_createMapPin(result) {
        if (result) {
            var pin = new Microsoft.Maps.Pushpin(result.location, null);
            Microsoft.Maps.Events.addHandler(pin, 'click', function () {
                search_showInfoBox(result)
            });
            map.entities.push(pin);
        }
    }

    function search_showInfoBox(result) {
        if (currInfobox) {
            currInfobox.setOptions({ visible: true });
            map.entities.remove(currInfobox);
        }
        currInfobox = new Microsoft.Maps.Infobox(
            result.location,
            {
                title: result.name,
                description: [result.address, result.city, result.state,
                  result.country, result.phone].join(' '),
                showPointer: true,
                titleAction: null,
                titleClickHandler: null
            });
        currInfobox.setOptions({ visible: true });
        map.entities.push(currInfobox);
    }

    function search_onSearchFailure(result, userData) {
        console.log('Search  failed');
    }

    
    //GetMap();
    

})
