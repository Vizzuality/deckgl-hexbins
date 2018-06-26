/* global window */
import React, {Component} from 'react';
import DeckGL, {HexagonLayer} from 'deck.gl';

const LIGHT_SETTINGS = {
  lightsPosition: [-0.144528, 49.739968, 4000, -3.807751, 54.104682, 4000],
  ambientRatio: 0.8,
  diffuseRatio: 0.9,
  specularRatio: 0.5,
  lightsStrength: [0.5, 0.8, 0.5, 0.8],
  numberOfLights: 2
};

const colorRange = [
  [176, 215, 243],
  [134, 181, 223],
  [88, 145, 207],
  [0, 111, 191],
  [0, 85, 146],
  [0, 43, 73]
];

const elevationScale = {min: 0, max: 3000};

const defaultProps = {
  radius: 30000,
  upperPercentile: 95,
  coverage: 1
};

export default class DeckGLOverlay extends Component {
  static get defaultColorRange() {
    console.log(colorRange);
    return colorRange;
  }

  static get defaultViewport() {
    return {
      longitude: 20,
      latitude: 10,
      zoom: 2,
      minZoom: 1,
      maxZoom: 15,
      pitch: 30,
      bearing: 0
    };
  }

  constructor(props) {
    super(props);
    this.startAnimationTimer = null;
    this.intervalTimer = null;
    this.state = {
      elevationScale: elevationScale.max
    };

    // this._startAnimate = this._startAnimate.bind(this);
    // this._animateHeight = this._animateHeight.bind(this);
  }

  // componentDidMount() {
  //   this._animate();
  // }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.data.length !== this.props.data.length) {
  //     this._animate();
  //   }
  // }

  // componentWillUnmount() {
  //   this._stopAnimate();
  // }

  // _animate() {
  //   this._stopAnimate();

  //   // wait 1.5 secs to start animation so that all data are loaded
  //   this.startAnimationTimer = window.setTimeout(this._startAnimate, 100);
  // }

  // _startAnimate() {
  //   this.intervalTimer = window.setInterval(this._animateHeight, 3);
  // }

  // _stopAnimate() {
  //   window.clearTimeout(this.startAnimationTimer);
  //   window.clearTimeout(this.intervalTimer);
  // }

  // _animateHeight() {
  //   if (this.state.elevationScale === elevationScale.max) {
  //     this._stopAnimate();
  //   } else {
  //     this.setState({elevationScale: this.state.elevationScale + 1});
  //   }
  // }

  render() {
    const {viewport, data, radius, coverage, upperPercentile} = this.props;

    if (!data) {
      return null;
    }

    const colorRange1 = [
      [176,215,243,255],
      [134,181,223,255],
      [88,145,207,255],
      [0,111,191,255],
      [0,85,146,255],
      [0,43,73,255]
    ];

    const colorRange2 = [
      [222,255,211,255],
      [185,236,166,255],
      [144,205,122,255],
      [95,153,74,255],
      [54,115,32,255],
      [31,77,14,255]
    ];

    const colorRange3 = [
      [255,251,248,255],
      [255,228,211,255],
      [255,201,165,255],
      [241,145,82,255],
      [231,101,15,255],
      [174,70,2,255]
    ];

    const colorRange4 = [
      [254,233,255,255],
      [253,194,255,255],
      [252,145,255,255],
      [234,61,239,255],
      [181,18,185,255],
      [132,0,136,255]
    ];

    const layers = [
      new HexagonLayer({
        id: 'heatmap',
        colorRange: colorRange4,
        coverage,
        data,
        elevationRange: [1, 3000],
        elevationScale: this.state.elevationScale,
        extruded: true,
        getPosition: d => d,
        lightSettings: LIGHT_SETTINGS,
        onHover: this.props.onHover,
        opacity: 1,
        pickable: Boolean(this.props.onHover),
        radius,
        upperPercentile
      })
    ];

    return <DeckGL {...viewport} layers={layers} />;
  }
}

DeckGLOverlay.displayName = 'DeckGLOverlay';
DeckGLOverlay.defaultProps = defaultProps;
