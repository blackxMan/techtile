(function () {
  'use strict';

  angular
    .module('parcels.backoffice')
    .controller('ParcelsController', ParcelsController);

  ParcelsController.$inject = ['$scope', '$state', '$window', 'parcelResolve', 'Authentication','$http', 'leafletData'];

  function ParcelsController($scope, $state, $window, parcel, Authentication,$http,leafletData) {
    var vm = this;

    parcel.bornAt = new Date(parcel.bornAt);

    vm.parcel = parcel;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.editParcelShape = editParcelShape;

    vm.parcelShape= undefined;

    // Remove existing Parcel
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.parcel.$remove(
          function(res){
            $state.go('backoffice.parcels.list')
          },
          function(err){
            console.log('err parcel');
          }
        );

      }
    }

    // Save Parcel
    function save(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.parcelForm');
        return false;
      }

      // Create a new parcel, or update the current instance
      vm.parcel.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('backoffice.parcels.list'); // should we send the User to the list or the updated Parcel's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.definedLayers = {
        mapbox_light: {
            name: 'Mapbox Light',
            type: 'mapbox',
            user: 'elesdoar',
            key: 'citojtj9e00022iqjmdzhrdwd',
            apiKey: 'pk.eyJ1IjoiZWxlc2RvYXIiLCJhIjoiY2l0bmcwaDNpMDQzMTJvbDRpaTltN2dlbiJ9.KDnhRVh9St6vpQovMI7iLg'
        },
        osm: {
            name: 'OpenStreetMap',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            type: 'xyz'
        },
        thunderforest_landscape: {
            name: 'Thunderforest Landscape',
            url: 'https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
            type: 'xyz',
            apiKey: 'f108a6bc9d584c19ac5beb086ae586c0'
        },
        thunderforest_opencyclemap: {
            name: 'Thunderforest OpenCycleMap',
            url: 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
            type: 'xyz',
            apiKey: 'f108a6bc9d584c19ac5beb086ae586c0'
        },
        mapbox_satellite: {
            name: 'Mapbox Wheat Paste',
            url: '//api.mapbox.com/styles/v1/{user}/{mapId}/tiles/256/{z}/{x}/{y}?access_token={apiKey}',
            type: 'xyz',
            options: {
                user: 'elesdoar',
                apiKey: 'pk.eyJ1IjoiZWxlc2RvYXIiLCJhIjoiY2l0bmcwaDNpMDQzMTJvbDRpaTltN2dlbiJ9.KDnhRVh9St6vpQovMI7iLg',
                mapId: 'citngqecv00362hphvm5m7myb'
            }
        }
    };

    angular.extend(vm, {
      london: {
          lat: 35.82560781396722,
          lng: -5.651092529296874,
          zoom: 13
      },
      controls: {
          draw: {
          },
          fullscreen: {
              position: 'topleft'
          }
      },
      layers: {
          baselayers: {
            osm: vm.definedLayers.osm,
            mapbox_light: vm.definedLayers.mapbox_light,
            thunderforest_landscape: vm.definedLayers.thunderforest_landscape,
            thunderforest_opencyclemap: vm.definedLayers.thunderforest_opencyclemap,
            mapbox_satellite: vm.definedLayers.mapbox_satellite,

          },
          overlays: {
              draw: {
                  name: 'draw',
                  type: 'group',
                  visible: true,
                  layerParams: {
                      showOnSelector: true
                  }
              }
          }
      }
  });

  function editParcelShape(){
    vm.parcelShape.editing.enable();
  }

  leafletData.getMap().then(function(map) {
     leafletData.getLayers().then(function(baselayers) {
        var drawnItems = baselayers.overlays.draw;
        map.on('draw:created', function (e) {
          vm.parcelShape = e.layer;
          //layer.editing.enable()
          drawnItems.addLayer(vm.parcelShape);
          console.log(JSON.stringify(vm.parcelShape.toGeoJSON()));
        });
     });
  });
  }
}());
