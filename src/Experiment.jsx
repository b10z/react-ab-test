import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CoreExperiment from './CoreExperiment';
import emitter from './emitter';
import store from './store';
import storeCookie from './storeCookie';

emitter.addActiveVariantListener(function (
  experimentName,
  variantName,
  skipSave
) {
  if (skipSave) {
    return;
  }
  if (emitter.withCookie()) {
    storeCookie().setCookie('PUSHTELL_COOKIE-' + experimentName, variantName);
  } else {
    store.setItem('PUSHTELL-' + experimentName, variantName);
  }
});

export default class Experiment extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    defaultVariantName: PropTypes.string,
    userIdentifier: PropTypes.string,
    children: PropTypes.node,
  };

  static displayName = 'Pushtell.Experiment';

  win = () => {
    emitter.emitWin(this.props.name);
  };

  render() {
    return (
      <CoreExperiment {...this.props}>{this.props.children}</CoreExperiment>
    );
  }
}
