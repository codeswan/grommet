// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes, Children } from 'react';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.SPLIT;
const BREAK_WIDTH = 720; //adds the breakpoint of single/multiple split

export default class Split extends Component {

  constructor(props, context) {
    super(props, context);

    this._onResize = this._onResize.bind(this);
    this._layout = this._layout.bind(this);

    this.state = { responsive: null };
  }

  componentDidMount () {
    window.addEventListener('resize', this._onResize);
    this._layout();
  }

  componentWillReceiveProps (nextProps) {
    // If we change the number of visible children, trigger a resize event
    // so things like Table header can adjust. This will go away once
    // CSS supports per element media queries.
    // The 500ms delay is loosely tied to the CSS animation duration.
    // We want any animations to finish before triggering the resize.
    // TODO: consider using an animation end event instead of a timer.
    if (this._nonNullChildCount(nextProps) !==
      this._nonNullChildCount(this.props)) {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(function () {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
      }, 500);
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._onResize);
  }

  // Support function for componentWillReceiveProps()
  _nonNullChildCount (props) {
    let result = 0;
    React.Children.forEach(props.children, function (child) {
      if (child !== null) result += 1;
    });
    return result;
  }

  _onResize () {
    // debounce
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(this._layout, 50);
  }

  _setResponsive (responsive) {
    if (this.state.responsive !== responsive) {
      this.setState({responsive: responsive});
      if (this.props.onResponsive) {
        this.props.onResponsive(responsive);
      }
    }
  }

  _layout () {
    const splitElement = this.refs.split;
    if (splitElement) {
      if (splitElement.offsetWidth < BREAK_WIDTH &&
        this.props.showOnResponsive === 'priority') {
        this._setResponsive('single');
      } else {
        this._setResponsive('multiple');
      }
    }
  }

  render () {
    const { priority } = this.props;
    const { responsive } = this.state;
    let classes = [CLASS_ROOT];
    if (this.props.flex) {
      classes.push(CLASS_ROOT + "--flex-" + this.props.flex);
    }
    if (this.props.fixed) {
      classes.push(CLASS_ROOT + "--fixed");
    }
    if (this.props.separator) {
      classes.push(CLASS_ROOT + "--separator");
    }
    if (this.props.className) {
      classes.push(this.props.className);
    }

    const elements = Children.toArray(this.props.children).filter(
      (element) => element
    );
    const children = elements.map((element, index) => {
      // When we only have room to show one child, hide the appropriate one
      if ('single' === responsive &&
        (('left' === priority && index > 0) ||
        ('right' === priority && index === 0 &&
          elements.length > 1))) {
        element = React.cloneElement(element, { style: { display: 'none' } });
      }
      return element;
    });

    return (
      <div ref="split" className={classes.join(' ')}>
        {children}
      </div>
    );
  }
}

Split.propTypes = {
  fixed: PropTypes.bool,
  flex: PropTypes.oneOf(['left', 'right', 'both']),
  priority: PropTypes.oneOf(['left', 'right']),
  separator: PropTypes.bool,
  showOnResponsive: PropTypes.oneOf(['priority', 'both'])
};

Split.defaultProps = {
  fixed: true,
  flex: 'both',
  priority: 'right',
  showOnResponsive: 'priority'
};
