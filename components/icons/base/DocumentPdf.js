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
      a11yTitleId: 'document-pdf-title'
    };
  },

  render: function() {
    var className = 'control-icon control-icon-document-pdf';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }

    var a11yTitle = this.getGrommetIntlMessage(
      typeof this.props.a11yTitle !== "undefined" ?
        this.props.a11yTitle : "document-pdf");

    return (
      <svg version="1.1" viewBox="0 0 48 48" width="48px" height="48px" className={className} aria-labelledby={this.props.a11yTitleId}><title id={this.props.a11yTitleId}>{a11yTitle}</title><g id="document-pdf"><rect id="_x2E_svg_273_" x="0" y="0" fill="none" width="48" height="48"/><path fill="none" stroke="#231F20" strokeWidth="2" strokeMiterlimit="10" d="M12.5,25v7 M14.5,29c1.1046,0,2-0.8954,2-2&#xA;&#x9;&#x9;c0-1.1046-0.8954-2-2-2h-2v4H14.5z M19.5,31h3c1.1046,0,2-1.0945,2-2.2213V28v-0.7787c0-1.1055-0.8954-2.2213-2-2.2213h-3V31z"/><line fill="none" stroke="#231F20" strokeWidth="2" strokeMiterlimit="10" x1="32.5" y1="25" x2="26.5" y2="25"/><line fill="none" stroke="#231F20" strokeWidth="2" strokeMiterlimit="10" x1="27.5" y1="24" x2="27.5" y2="32"/><line fill="none" stroke="#231F20" strokeWidth="2" strokeMiterlimit="10" x1="31.5" y1="29" x2="26.5" y2="29"/><polyline fill="none" stroke="#231F20" strokeWidth="2" strokeMiterlimit="10" points="16.5,21 16.5,13 29.5002,13 34.5,17.9999 &#xA;&#x9;&#x9;34.5,35 15.5,35 &#x9;"/><polyline fill="none" stroke="#231F20" strokeWidth="2" strokeMiterlimit="10" points="28.5,14 28.5,19 34.5,19 &#x9;"/><path fill="none" stroke="#231F20" strokeWidth="2" strokeMiterlimit="10" d="M27.5,19"/></g></svg>
    );
  }

});

module.exports = Icon;