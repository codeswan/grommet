// (C) Copyright 2014-2015 Hewlett-Packard Development Company

var React = require('react');
var IntlMixin = require('../../../mixins/GrommetIntlMixin');

var Icon = React.createClass({

  propTypes: {
    a11yTitle: React.PropTypes.string,
    a11yTitleId: React.PropTypes.string
  },

  mixins: [IntlMixin],

  getDefaultProps: function () {
    return {
      a11yTitleId: 'document-powerpoint-title'
    };
  },

  render: function() {
    var className = 'control-icon control-icon-document-powerpoint';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }

    var a11yTitle = this.getGrommetIntlMessage(
      typeof this.props.a11yTitle !== "undefined" ?
        this.props.a11yTitle : "document-powerpoint");

    return (
      <svg version="1.1" viewBox="0 0 48 48" width="48px" height="48px" className={className} aria-labelledby={this.props.a11yTitleId}><title id={this.props.a11yTitleId}>{a11yTitle}</title><g id="document-powerpoint"><rect id="_x2E_svg_277_" x="0" y="0" fill="none" width="48" height="48"/><polyline fill="none" stroke="#231F20" strokeWidth="2" strokeMiterlimit="10" points="16.5,21 16.5,13 29.5002,13 34.5,17.9999 &#xA;&#x9;&#x9;34.5,35 15.5,35 &#x9;"/><polyline fill="none" stroke="#231F20" strokeWidth="2" strokeMiterlimit="10" points="28.5,14 28.5,19 34.5,19 &#x9;"/><path fill="none" stroke="#231F20" strokeWidth="2" strokeMiterlimit="10" d="M27.5,19"/><g><path fill="#231F20" d="M15.2898,22.9497h3.6772c2.1474,0,3.4459,1.2729,3.4459,3.1117v0.0261&#xA;&#x9;&#x9;&#x9;c0,2.0822-1.6201,3.1619-3.6385,3.1619h-1.5042v2.7003h-1.9803V22.9497z M18.8385,27.4888c0.9899,0,1.5684-0.592,1.5684-1.3637&#xA;&#x9;&#x9;&#x9;V26.1c0-0.8875-0.6171-1.3627-1.607-1.3627h-1.5298v2.7515H18.8385z"/></g></g></svg>
    );
  }

});

module.exports = Icon;