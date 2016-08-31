// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { getCurrentLocale } from '../utils/Locale';
import SkipLinks from './SkipLinks';

import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.APP;

let supportedLocales = ['en-US', 'pt-BR'];

function localesSupported() {
  return global.Intl && supportedLocales.every(function (locale) {
    return Intl.NumberFormat.supportedLocalesOf(locale)[0] === locale &&
            Intl.DateTimeFormat.supportedLocalesOf(locale)[0] === locale;
  });
}

if (! localesSupported()) {
  require('intl');
  require('intl/locale-data/jsonp/en-US.js');
  require('intl/locale-data/jsonp/pt-BR.js');
  Intl.NumberFormat = IntlPolyfill.NumberFormat;
  Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
}

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      lang: 'en-US'
    };
  }

  componentDidMount() {
    var lang = getCurrentLocale();
    if (this.props.lang) {
      lang = this.props.lang;
    }
    if (!document.documentElement.getAttribute('lang')) {
      document.documentElement.setAttribute('lang', lang);
    }
    this.setState({lang: lang});
  }

  render() {
    const { centered, children, className, inline } = this.props;
    const { lang } = this.state;

    const classes = classnames(
      'grommet',
      className,
      CLASS_ROOT, {
        [`${CLASS_ROOT}--centered`]: centered,
        [`${CLASS_ROOT}--inline`]: inline
      }
    );

    return (
      <div lang={lang} className={classes}>
        {children}
        <SkipLinks />
        <div className={`${CLASS_ROOT}__announcer`} aria-live='polite' />
      </div>
    );
  }
}

App.defaultProps = {
  centered: true
};

App.propTypes = {
  centered: PropTypes.bool
};
