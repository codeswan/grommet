// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import CloseIcon from './icons/base/Close';
import KeyboardAccelerators from '../utils/KeyboardAccelerators';
import DOMUtils from '../utils/DOM';
import Button from './Button';
import Intl from '../utils/Intl';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.LAYER;
const APP = CSSClassnames.APP;

class LayerContents extends Component {

  constructor(props, context) {
    super(props, context);

    this._onClick = this._onClick.bind(this);
    this._processTab = this._processTab.bind(this);
  }

  getChildContext () {
    return {
      history: this.props.history,
      intl: this.props.intl,
      router: this.props.router,
      store: this.props.store
    };
  }

  componentDidMount () {
    this.refs.anchorStep.focus();

    this._keyboardHandlers = {
      tab: this._processTab
    };

    if (this.props.onClose) {
      const layerParent = this.refs.container.parentNode;
      this._keyboardHandlers.esc = this.props.onClose;
      layerParent.addEventListener('click', this._onClick.bind(this));
    }

    KeyboardAccelerators.startListeningToKeyboard(
      this, this._keyboardHandlers
    );
  }

  componentDidUpdate () {
    if (this.props.hidden) {
      KeyboardAccelerators.stopListeningToKeyboard(
        this, this._keyboardHandlers
      );
    };
  }

  componentWillUnmount () {
    const layerParent = this.refs.container.parentNode;

    KeyboardAccelerators.stopListeningToKeyboard(
      this, this._keyboardHandlers
    );

    if (this.props.onClose) {
      layerParent.removeEventListener('click', this._onClick.bind(this));
    }
  }

  _onClick (event) {
    const layerContents = this.refs.container;

    if (layerContents && !layerContents.contains(event.target)) {
      this.props.onClose();
    }
  }

  _processTab (event) {
    var items = this.refs.container.getElementsByTagName('*');
    items = DOMUtils.filterByFocusable(items);

    if (!items || items.length === 0) {
      event.preventDefault();
    } else {
      if (event.shiftKey) {
        if (event.target === items[0]) {
          items[items.length - 1].focus();
          event.preventDefault();
        }
      } else if (event.target === items[items.length - 1]) {
        items[0].focus();
        event.preventDefault();
      }
    }
  }

  render () {
    var closer = null;

    if (typeof this.props.closer === 'object') {
      closer = this.props.closer;

    } else if (this.props.onClose && this.props.closer) {
      let closeLabel = Intl.getMessage(this.context.intl, 'Close');
      let layerLabel = Intl.getMessage(this.context.intl, 'Layer');
      let a11yTitle =
        `${closeLabel} ${this.props.a11yTitle || ''} ${layerLabel}`;

      closer = (
        <div className={CLASS_ROOT + "__closer"}>
          <Button plain={true} onClick={this.props.onClose}>
            <CloseIcon a11yTitle={a11yTitle} />
          </Button>
        </div>
      );
    }

    return (
      <div ref="container" className={CLASS_ROOT + "__container"}>
        <a tabIndex="-1" aria-hidden='true'
          ref='anchorStep' />
        {closer}
        {this.props.children}
      </div>
    );
  }
}

LayerContents.propTypes = {
  a11yTitle: PropTypes.string,
  closer: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.bool
  ]),
  history: PropTypes.object,
  intl: PropTypes.object,
  onClose: PropTypes.func,
  router: PropTypes.any,
  store: PropTypes.any
};

// Because Layer creates a new DOM render context, the context
// is not transfered. For now, we hard code these specific ones.
// TODO: Either figure out how to introspect the context and transfer
// whatever we find or have callers explicitly indicate which parts
// of the context to transfer somehow.
LayerContents.childContextTypes = {
  history: PropTypes.object,
  intl: PropTypes.object,
  router: PropTypes.any,
  store: PropTypes.object
};

export default class Layer extends Component {

  componentDidMount () {
    window.scrollTo(0, 0);
    this._originalFocusedElement = document.activeElement;
    this._addLayer();
    this._renderLayer();
  }

  componentDidUpdate () {
    this._renderLayer();
  }

  componentWillUnmount () {

    if (this._originalFocusedElement) {
      if (this._originalFocusedElement.focus) {
        // wait for the fixed positining to come back to normal
        // see layer styling for reference
        setTimeout(() => {
          this._originalFocusedElement.focus();
        }, 0);
      } else if (this._originalFocusedElement.parentNode &&
        this._originalFocusedElement.parentNode.focus) {
        // required for IE11 and Edge
        this._originalFocusedElement.parentNode.focus();
      }
    }

    this._removeLayer();
  }

  _classesFromProps () {
    var classes = ['grommet', CLASS_ROOT];
    if (this.props.align) {
      classes.push(CLASS_ROOT + "--align-" + this.props.align);
    }
    if (this.props.flush) {
      classes.push(CLASS_ROOT + "--flush");
    }
    if (this.props.hidden) {
      classes.push(CLASS_ROOT + "--hidden");
    }
    if (this.props.peek) {
      classes.push(CLASS_ROOT + "--peek");
    }
    if (this.props.closer) {
      classes.push(CLASS_ROOT + "--closeable");
    }
    if (this.props.className) {
      classes.push(this.props.className);
    }
    return classes;
  }

  _addLayer () {
    var element = document.createElement('div');
    if (this.props.id) {
      element.id = this.props.id;
    }
    element.className = this._classesFromProps().join(' ');
    // insert before .app, if possible.
    var appElements = document.querySelectorAll(`.${APP}`);
    var beforeElement;
    if (appElements.length > 0) {
      beforeElement = appElements[0];
    } else {
      beforeElement = document.body.firstChild;
    }
    if (beforeElement) {
      this._element =
        beforeElement.parentNode.insertBefore(element, beforeElement);
    }
  }

  _handleAriaHidden (hideOverlay) {
    const ariaHidden = hideOverlay || false;
    this._element.setAttribute('aria-hidden', ariaHidden);
    const grommetApps = document.querySelectorAll(`.${APP}`);

    if (grommetApps) {
      Array.prototype.slice.call(grommetApps).forEach((grommetApp) => {
        grommetApp.setAttribute('aria-hidden', !ariaHidden);
      });
    }
  }

  _renderLayer () {
    if (this._element) {
      this._element.className = this._classesFromProps().join(' ');
      var contents = (
        <LayerContents {...this.props}
          history={this.context.history}
          intl={this.context.intl}
          router={this.context.router}
          store={this.context.store} />
      );
      ReactDOM.render(contents, this._element);
      this._handleAriaHidden(this.props.hidden);
    }
  }

  _removeLayer () {
    this._element.removeEventListener('animationend', this._onAnimationEnd);
    this._handleAriaHidden(true);

    ReactDOM.unmountComponentAtNode(this._element);
    this._element.parentNode.removeChild(this._element);
    this._element = null;
  }

  render () {
    return (<span style={{display: 'none'}} />);
  }

}

Layer.propTypes = {
  align: PropTypes.oneOf(['center', 'top', 'bottom', 'left', 'right']),
  closer: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.bool
  ]),
  flush: PropTypes.bool,
  hidden: PropTypes.bool,
  peek: PropTypes.bool,
  onClose: PropTypes.func
};

Layer.contextTypes = {
  router: PropTypes.any,
  history: PropTypes.object,
  intl: PropTypes.object,
  store: PropTypes.object
};

Layer.defaultProps = {
  align: 'center'
};
