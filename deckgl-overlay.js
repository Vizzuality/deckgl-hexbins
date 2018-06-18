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

const elevationScale = {min: 0, max: 2000};

const defaultProps = {
  radius: 20000,
  upperPercentile: 95,
  coverage: 1
};

export default class DeckGLOverlay extends Component {
  static get defaultColorRange() {
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

    const layers = [
      new HexagonLayer({
        id: 'heatmap',
        colorRange,
        coverage,
        data,
        elevationRange: [1, 2000],
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
