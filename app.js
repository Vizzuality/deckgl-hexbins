/* global window,document */
import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import { csv as requestCsv } from 'd3-request';

// import Immutable from 'immutable';

// const { Map } = require('immutable')

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1Ijoibmctdml6enVhbGl0eSIsImEiOiJjanYyNG4xMGIweWJiNGVva3JtZXpqenIzIn0.r6qoeCK9Fszv1zQ1_IqK_Q#5.8/18.677435/86.425009/0';


// Source data CSV
// const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv'; // eslint-disable-line
const DATA_URL = 'project-locations.csv'; // eslint-disable-line

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rasterStyle: {},
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500,
        latitude: 27.826330006771975 ,
        longitude: 86.75519263499336,
        zoom: 7,
        maxZoom:18,
        minZoom:3
      },
      data: null
    };

    // requestCsv(DATA_URL, (error, response) => {
    //   if (!error) {
    //     const data = response.map(d => [Number(d.lng), Number(d.lat)]);
    //     const newData = this.getRandom(data, data.length / 2);
    //     this.setState({ data: newData });
    //   }
    // });

  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();

    this._fetchRasters();
  }

// const colorRamp1 = [#E84C2F, #F98B77, #FECCC3, #FFFFE9, #E7F890, #C6E337, #96B304];
// const colorRamp2 = [#EA6C0F, #FFBC1F, #FFF10F, #F1CBAF, #EA73FF, #D52EF2, #750588];
// const colorRamp3 = [#005592, #71A4DB, #B0D7F3, #E7E1FC, #EA73FF, #D52EF2, #680D7A];
// const colorRamp4 = [#EA6C0F, #FFBC1F, #FFF10F, #95FF62, #0FBEFF, #1F7DFF, #0F14EA];
// const colorRamp4 = [#F47760, #F69E8E, #FFD5BE, #FFFFE9, #ECF6BD, #D2E573, #C2DA4D];
// const colorRamp4 = [#F69E8E, #FBB8AC, #FFD5BE, #FFFFE9, #ECF6BD, #D2E573, #C2DA4D];

  _fetchRasters() {
    const layerTpl = {
      version: '1.3.0',
      stat_tag: 'API',
      layers: [
        // buckets styles –sergio's comment–

      ]
    };
    const params = `?stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;
    fetch(`./data/test.geojson`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //console.log(data);
        this.setState({
          rasterStyle: {
            "version": 8,
            "sources": {
                "choro-tiles": {
                    "type": "geojson",
                    "data": data
                },
                "boundary-tiles": {
                  "type": "raster",
                  "tiles": [`https://api.mapbox.com/styles/v1/wri/cjhfaeph33ami2socjqjf2zwz/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`],
                  "tileSize": 256
                },
                "fanny-tiles": {
                  "type": "raster",
                  "tiles": [`https://api.mapbox.com/styles/v1/fannycc/cjoy4zgqt2u3f2rpbb2pnva1j/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`],
                  "tileSize": 256
                },
                "Ari-NF_Basemap": {
                  "type": "raster",
                  "tiles": [`https://api.mapbox.com/styles/v1/ng-vizzuality/ck1um16dt06pt1dqkjlurla5q.html?fresh=true&title=true&access_token=${MAPBOX_TOKEN}`],
                  "tileSize": 256
                },
                "fc-tiles": {
                  "type": "raster",
                  "tiles": [`https://api.mapbox.com/styles/v1/fannycc/ck222p8uf1sca1cpa2o3rdeb4/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`],
                  "tileSize": 256
                },
                "satelite-tiles": {
                    "type": "raster",
                    "tiles": ['http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
                    "tileSize": 256
                },
                "grey-tiles": {
                    "type": "raster",
                    "tiles": [`https://api.mapbox.com/styles/v1/gsdpm/cir6ljf470006bsmehhstmxeh/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`],
                    "tileSize": 256
                },
                "natural-tiles": {
                    "type": "raster",
                    "tiles": [`https://api.mapbox.com/styles/v1/gsdpm/cioenuwii001maznontujohu8/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`],
                    "tileSize": 256
                },
                "dark-tiles": {
                    "type": "raster",
                    "tiles": [`https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`],
                    "tileSize": 256
                },
                "carbon-monxide": {
                    "type": "raster",
                    "tiles": [`https://api.mapbox.com/styles/v1/wri/cjqwmiokq01lx2rk7pii4qy4n/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`],
                    "tileSize": 256
                },
                "everest": {
                  "type": "raster",
                  "tiles": [`https://storage.googleapis.com/gee-tmp/everest_tiles/{z}/{x}/{y}.png`],
                  "tileSize": 256
              },
              "landsat_service": {
                "type": "raster",
                "tiles": [`https://production-api.globalforestwatch.org/v2/landsat-tiles/2017/{z}/{x}/{y}`],
                "tileSize": 256
            },
            "cropland": {
              "type": "raster",
              "tiles": [`https://storage.googleapis.com/forest-forward/tilesets/cropland/{z}/{x}/{y}.png`],
              "tileSize": 256
          },

            },
            "layers": [
              {
                "id": "basemap-tiles",
                "type": "raster",
                "source": "Ari-NF_Basemap",
                "minzoom": 0,
                "maxzoom": 22
              },
              {
                "id": "boundary-tiles",
                "type": "raster",
                "source": "cropland",
                "minzoom": 0,
                "maxzoom": 22
              },
              // {
              //   "id": "simple-tiles",
              //   "type": "geojson",
              //   "source": "choro-tiles",
              //   type: 'fill',
              //   paint: {
              //     'fill-color': {
              //       property: 'Shape_len',
              //       stops: [
              //         [0.0, '#4286f4'],
              //         [100, '#4286f4'],

              //       ]
              //     },
              //     'fill-opacity': 1.0
              //   }
              // }
            ]
          }
        })
      }).catch((err) => {
        console.error(err);
      });
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  render() {
    const { viewport, data, rasterStyle, baseMapStyle } = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle={rasterStyle} // Carto layer
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <DeckGLOverlay viewport={viewport} data={data || []} />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
