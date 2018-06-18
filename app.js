/* global window,document */
import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import { csv as requestCsv } from 'd3-request';

// import Immutable from 'immutable';

// const { Map } = require('immutable')

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3NkcG0iLCJhIjoiY2lqbmN5eG9mMDBndHVmbTU5Mmg1djF6MiJ9.QqFCD7tcmccysN8GUClW8w';

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
        height: 500
      },
      data: null
    };

    requestCsv(DATA_URL, (error, response) => {
      if (!error) {
        const data = response.map(d => [Number(d.lng), Number(d.lat)]);
        const newData = this.getRandom(data, data.length / 2);
        this.setState({ data: newData });
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();

    this._fetchBasemap();
  }

  _fetchBasemap() {
    const layerTpl = {
      version: '1.3.0',
      stat_tag: 'API',
      layers: [
        {
          "type": "mapnik",
          "options": {
            "sql": "SELECT * FROM api_ny_adj_nnty_kd_zg_ds2_en_csv_v2_9928348",
            "cartocss": "#layer { polygon-fill: ramp([_2016], (#ffffff, #F69E8E,#FBBAA7,#FFD5BE,#FFFFE9,#ECF6BD,#E6F19D,#D2E573), jenks); polygon-opacity: 1; } #layer::outline { line-width: .1; line-color: #ffffff; line-opacity: 1; }",
            "cartocss_version": "2.3.0"
          }
        }
      ]
    };
    const params = `?stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;
    fetch(`https://jcalonso.carto.com/api/v1/map${params}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        
        this.setState({
          rasterStyle: {
            "version": 8,
            "sources": {
                "raster-tiles": {
                    "type": "raster",
                    "tiles": data.cdn_url.templates.https.subdomains.map(s =>
                      `${data.cdn_url.templates.https.url.replace('{s}', s)}/jcalonso/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png`
                    ),
                    "tileSize": 256
                }
            },
            "layers": [{
                "id": "simple-tiles",
                "type": "raster",
                "source": "raster-tiles",
                "minzoom": 0,
                "maxzoom": 22
            }]
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
    const { viewport, data, rasterStyle } = this.state;

    return (
      <MapGL
        {...viewport}

        // mapStyle="mapbox://styles/mapbox/dark-v9" // Mapbox default dark
        mapStyle="mapbox://styles/gsdpm/cioenuwii001maznontujohu8" // WorldBank Natural
        // mapStyle="mapbox://styles/gsdpm/cir6ljf470006bsmehhstmxeh" // WorldBank Grey
        layers={rasterStyle} // Carto layer
        //mapStyle='' // No basemap

        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <DeckGLOverlay viewport={viewport} data={data || []} />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
