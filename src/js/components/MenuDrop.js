// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import KeyboardAccelerators from '../utils/KeyboardAccelerators';
import DOMUtils from '../utils/DOM';
import Drop from '../utils/Drop';
import Props from '../utils/Props';
import Box from './Box';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.MENU;

function isFunction (obj) {
  return obj && obj.constructor && obj.call && obj.apply;
}

// We have a separate module for the drop component
// so we can transfer the router context.
export default class MenuDrop extends Component {

  constructor(props, context) {
    super(props, context);

    this._onUpKeyPress = this._onUpKeyPress.bind(this);
    this._onDownKeyPress = this._onDownKeyPress.bind(this);
    this._processTab = this._processTab.bind(this);
  }

  getChildContext () {
    return {
      intl: this.props.intl,
      history: this.props.history,
      router: this.props.router,
      store: this.props.store
    };
  }

  componentDidMount () {
    this._originalFocusedElement = document.activeElement;
    this._keyboardHandlers = {
      tab: this._processTab,
      up: this._onUpKeyPress,
      left: this._onUpKeyPress,
      down: this._onDownKeyPress,
      right: this._onDownKeyPress
    };
    KeyboardAccelerators.startListeningToKeyboard(this, this._keyboardHandlers);

    let container = ReactDOM.findDOMNode(this.refs.navContainer);
    let menuItems = container.childNodes;
    for (let i = 0; i < menuItems.length; i++) {
      let classes = menuItems[i].className.toString();
      let tagName = menuItems[i].tagName.toLowerCase();
      // want to skip items of the menu that are not focusable.
      if (tagName !== 'button' && tagName !== 'a' &&
        classes.indexOf('check-box') === -1) {
        continue;
      }
      menuItems[i].setAttribute('role', 'menuitem');

      if (!menuItems[i].getAttribute('id')) {
        menuItems[i].setAttribute('id', `menu_item_${i}`);
      }
    }

    container.setAttribute('aria-activedescendant',
      menuItems[0].getAttribute('id'));

  }

  componentWillUnmount () {
    if (this._originalFocusedElement.focus) {
      this._originalFocusedElement.focus();
    } else if (this._originalFocusedElement.parentNode &&
      this._originalFocusedElement.parentNode.focus) {
      // required for IE11 and Edge
      this._originalFocusedElement.parentNode.focus();
    }
    KeyboardAccelerators.stopListeningToKeyboard(this, this._keyboardHandlers);
  }

  _processTab (event) {
    let container = ReactDOM.findDOMNode(this.refs.menuDrop);
    var items = container.getElementsByTagName('*');
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

  _onUpKeyPress (event) {
    event.preventDefault();
    var container = ReactDOM.findDOMNode(this.refs.navContainer);
    let menuItems = container.childNodes;
    if (!this.activeMenuItem) {
      let lastMenuItem = menuItems[menuItems.length - 1];
      this.activeMenuItem = lastMenuItem;
    } else if (this.activeMenuItem.previousSibling) {
      this.activeMenuItem = this.activeMenuItem.previousSibling;
    }

    let classes = this.activeMenuItem.className.split(/\s+/);
    let tagName = this.activeMenuItem.tagName.toLowerCase();
    // want to skip items of the menu that are not focusable.
    if (tagName !== 'button' && tagName !== 'a' &&
      classes.indexOf('check-box') === -1) {
      if (this.activeMenuItem === menuItems[0]) {
        return true;
      } else {
        // If this item is not focusable, check the next item.
        return this._onUpKeyPress(event);
      }
    }

    this.activeMenuItem.focus();
    container.setAttribute('aria-activedescendant',
      this.activeMenuItem.getAttribute('id'));
    // Stops KeyboardAccelerators from calling the other listeners.
    // Works limilar to event.stopPropagation().
    return true;
  }

  _onDownKeyPress (event) {
    event.preventDefault();
    var container = ReactDOM.findDOMNode(this.refs.navContainer);
    let menuItems = container.childNodes;
    if (!this.activeMenuItem) {
      this.activeMenuItem = menuItems[0];
    } else if (this.activeMenuItem.nextSibling) {
      this.activeMenuItem = this.activeMenuItem.nextSibling;
    }

    let classes = this.activeMenuItem.className.split(/\s+/);
    let tagName = this.activeMenuItem.tagName.toLowerCase();
    // want to skip items of the menu that are not focusable.
    if (tagName !== 'button' && tagName !== 'a' &&
      classes.indexOf('check-box') === -1) {
      if (this.activeMenuItem === menuItems[menuItems.length - 1]) {
        return true;
      } else {
        // If this item is not focusable, check the next item.
        return this._onDownKeyPress(event);
      }
    }

    this.activeMenuItem.focus();
    container.setAttribute('aria-activedescendant',
      this.activeMenuItem.getAttribute('id'));
    // Stops KeyboardAccelerators from calling the other listeners.
    // Works limilar to event.stopPropagation().
    return true;
  }

  render () {
    let { dropAlign, size, control, id, colorIndex, onClick } = this.props;
    let boxProps = Props.pick(this.props, Object.keys(Box.propTypes));
    // manage colorIndex at the outer menuDrop element
    delete boxProps.colorIndex;

    delete boxProps.onClick;

    delete boxProps.size;

    // Put nested Menus inline
    const children = React.Children.map(this.props.children, child => {
      let result = child;
      if (child && isFunction(child.type) &&
        child.type.prototype._renderMenuDrop) {
        result = React.cloneElement(child,
          {inline: 'explode', direction: 'column'});
      }
      return result;
    });

    let contents = [
      React.cloneElement(control, {key: 'control', fill: true}),
      <Box {...boxProps} key="nav" ref="navContainer"
        role="menu" tag="nav" className={`${CLASS_ROOT}__contents`}
        primary={false}>
        {children}
      </Box>
    ];

    if (dropAlign.bottom) {
      contents.reverse();
    }

    let classes = classnames(
      `${CLASS_ROOT}__drop`,
      {
        [`${CLASS_ROOT}__drop--align-right`]: dropAlign.right,
        [`${CLASS_ROOT}__drop--${size}`]: size
      }
    );

    return (
      <Box ref="menuDrop" id={id} className={classes} colorIndex={colorIndex}
        onClick={onClick}>
        {contents}
      </Box>
    );
  }
}

MenuDrop.propTypes = {
  ...Box.propTypes,
  control: PropTypes.node,
  dropAlign: Drop.alignPropType,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  router: PropTypes.any,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  store: PropTypes.any
};

MenuDrop.childContextTypes = {
  intl: PropTypes.any,
  history: PropTypes.any,
  router: PropTypes.any,
  store: PropTypes.any
};
