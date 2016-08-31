// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import Box from './Box';
import Intl from '../utils/Intl';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.TITLE;

export default class Title extends Component {

  render () {
    const classes = [CLASS_ROOT];
    if (this.props.responsive) {
      classes.push(CLASS_ROOT + "--responsive");
    }
    if (this.props.onClick) {
      classes.push(CLASS_ROOT + "--interactive");
    }
    if (this.props.className) {
      classes.push(this.props.className);
    }

    const a11yTitle = this.props.a11yTitle ||
      Intl.getMessage(this.context.intl, 'Title');

    let content;
    if( typeof this.props.children === 'string' ) {
      content = (
        <span>{this.props.children}</span>
      );
    } else if (Array.isArray(this.props.children)) {
      content = this.props.children.map((child, index) => {
        if (child && typeof child === 'string') {
          return <span key={`title_${index}`}>{child}</span>;
        }
        return child;
      });
    } else {
      content = this.props.children;
    }

    return (
      <Box align="center" direction="row" responsive={false}
        className={classes.join(' ')} a11yTitle={a11yTitle}
        onClick={this.props.onClick}>
        {content}
      </Box>
    );
  }

}

Title.propTypes = {
  a11yTitle: PropTypes.string,
  onClick: PropTypes.func,
  responsive: PropTypes.bool
};

Title.contextTypes = {
  intl: PropTypes.object
};

Title.defaultProps = {
  responsive: true
};
