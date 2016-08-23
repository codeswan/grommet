// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import KeyboardAccelerators from '../utils/KeyboardAccelerators';
import DOMUtils from '../utils/DOM';
import Drop from '../utils/Drop';
import Intl from '../utils/Intl';
import Props from '../utils/Props';
import Responsive from '../utils/Responsive';
import Box from './Box';
import Button from './Button';
import MenuDrop from './MenuDrop';
import DropCaretIcon from './icons/base/Down';
import MoreIcon from './icons/base/More';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.MENU;

export default class Menu extends Component {

  constructor(props, context) {
    super(props, context);

    this._onOpen = this._onOpen.bind(this);
    this._onClose = this._onClose.bind(this);
    this._onSink = this._onSink.bind(this);
    this._onResponsive = this._onResponsive.bind(this);
    this._onFocusControl = this._onFocusControl.bind(this);
    this._onBlurControl = this._onBlurControl.bind(this);

    this._menuItems = [];
    this._menuChildren = React.Children.map(this.props.children, (element, i) => {
      return React.cloneElement(element, { ref: (c) => this._menuItems.push(c) });
    });

    this._totalSpace = 0;
    this._numOfItems = 0;
    this._breakWidths = [];

    let inline;
    if (props.hasOwnProperty('inline')) {
      inline = props.inline;
    } else {
      inline = (! props.label && ! props.icon);
    }

    let responsive;
    if (props.hasOwnProperty('responsive')) {
      responsive = props.responsive;
    } else {
      responsive = (inline && 'row' === props.direction);
    }

    this.state = {
      // state may be 'collapsed', 'focused' or 'expanded' (active).
      state: 'collapsed',
      initialInline: inline,
      inline: inline,
      responsive: responsive,
      dropId: 'menuDrop'
    };
  }

  componentDidMount () {
    if (this.refs.control) {
      let controlElement = this.refs.control.firstChild;
      this.setState({
        dropId: 'menu-drop-' + DOMUtils.generateId(controlElement),
        controlHeight: controlElement.clientHeight
      });
    }

    if (this._menuItems.length > 0 && this.state.inline && this.props.direction === 'row') {
      this._menuItems.forEach((item) => {
        this._totalSpace += ReactDOM.findDOMNode(item).offsetWidth;
        this._numOfItems += 1;
        this._breakWidths.push(this._totalSpace);
      });

      console.log(this._totalSpace);
      console.log(this._numOfItems);
      console.log(this._breakWidths);
    }

    if (this.state.responsive) {
      this._responsive = Responsive.start(this._onResponsive);
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.inline !== nextProps.inline) {
      this.setState({ inline: nextProps.inline });
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.state !== prevState.state) {
      let activeKeyboardHandlers = {
        esc: this._onClose
      };
      let focusedKeyboardHandlers = {
        space: this._onOpen,
        down: this._onOpen,
        enter: this._onOpen
      };

      switch (this.state.state) {
        case 'collapsed':
          KeyboardAccelerators.stopListeningToKeyboard(
            this, focusedKeyboardHandlers
          );
          KeyboardAccelerators.stopListeningToKeyboard(
            this, activeKeyboardHandlers
          );
          document.removeEventListener('click', this._onClose);
          if (this._drop) {
            this._drop.remove();
            this._drop = null;
          }
          break;
        case 'focused':
          KeyboardAccelerators.stopListeningToKeyboard(
            this, activeKeyboardHandlers
          );
          KeyboardAccelerators.startListeningToKeyboard(
            this, focusedKeyboardHandlers
          );
          break;
        case 'expanded':
          KeyboardAccelerators.stopListeningToKeyboard(
            this, focusedKeyboardHandlers
          );
          KeyboardAccelerators.startListeningToKeyboard(
            this, activeKeyboardHandlers
          );
          document.addEventListener('click', this._onClose);
          this._drop = Drop.add(this.refs.control,
            this._renderMenuDrop(),
            {
              align: this.props.dropAlign,
              colorIndex: this.props.dropColorIndex
            });
          break;
      }
    } else if (this.state.state === 'expanded') {
      this._drop.render(this._renderMenuDrop());
    }
  }

  componentWillUnmount () {
    document.removeEventListener('click', this._onClose);
    KeyboardAccelerators.stopListeningToKeyboard(this);
    if (this._drop) {
      this._drop.remove();
    }
    if (this._responsive) {
      this._responsive.stop();
    }
  }

  _onOpen () {
    this.setState({state: 'expanded'});
  }

  _onClose () {
    this.setState({state: 'collapsed'});
  }

  _onSink (event) {
    event.stopPropagation();
    // need to go native to prevent closing via document
    event.nativeEvent.stopImmediatePropagation();
  }

  _onResponsive (small) {
    // deactivate if we change resolutions
    let newState = this.state.state;
    if (this.state.state === 'expanded') {
      newState = 'focused';
    }
    if (small) {
      this.setState({inline: false, active: newState, controlCollapsed: true});
    } else {
      this.setState({
        inline: this.state.initialInline,
        active: newState,
        state: 'collapsed',
        controlCollapsed: false
      });
    }
  }

  _onFocusControl () {
    this.setState({state: 'focused'});
  }

  _onBlurControl () {
    if (this.state.state === 'focused') {
      this.setState({state: 'collapsed'});
    }
  }

  _renderControlContents () {
    let icon, label;

    // If this is a collapsed inline Menu, use any icon and/or label provided,
    // revert to default icon if neither.
    if (this.props.icon) {
      icon = React.cloneElement(this.props.icon, {key: 'icon'});
    }
    if (this.props.label) {
      label = [
        <span key="label" className={`${CLASS_ROOT}__control-label`}>
          {this.props.label}
        </span>,
        <DropCaretIcon key="caret" a11yTitle='menu-down'
          a11yTitleId='menu-down-id' />
      ];
    }
    if (! icon && ! label) {
      icon = <MoreIcon key="icon" />;
    }
    return [icon, label];
  }

  _renderMenuDrop () {
    let closeLabel = Intl.getMessage(this.context.intl, 'Close');
    let menuLabel = Intl.getMessage(this.context.intl, 'Menu');
    let menuTitle = (
      `${closeLabel} ${this.props.a11yTitle || this.props.label || ''} ` +
      `${menuLabel}`
    );

    let control = (
      <Button plain={true} className={`${CLASS_ROOT}__control`}
        a11yTitle={menuTitle}
        style={{lineHeight: this.state.controlHeight + 'px'}}
        onClick={this._onClose}>
        {this._renderControlContents()}
      </Button>
    );

    let boxProps = Props.pick(this.props, Object.keys(Box.propTypes));
    let onClick = this.props.closeOnClick ? this._onClose : this._onSink;

    return (
      <MenuDrop {...boxProps} {...this.context}
        dropAlign={this.props.dropAlign}
        size={this.props.size}
        onClick={onClick}
        id={this.state.dropId}
        control={control}>
        {this.props.children}
      </MenuDrop>
    );
  }

  render () {
    let classes = classnames(
      CLASS_ROOT,
      this.props.className,
      {
        [`${CLASS_ROOT}--${this.props.direction}`]: this.props.direction,
        [`${CLASS_ROOT}--${this.props.size}`]: this.props.size,
        [`${CLASS_ROOT}--primary`]: this.props.primary,
        [`${CLASS_ROOT}--inline`]: this.state.inline,
        [`${CLASS_ROOT}--explode`]: 'explode' === this.state.inline,
        [`${CLASS_ROOT}--controlled`]: !this.state.inline,
        [`${CLASS_ROOT}__control`]: !this.state.inline,
        [`${CLASS_ROOT}--labelled`]: !this.state.inline && this.props.label
      }
    );

    if (this.state.inline) {
      let boxProps = Props.pick(this.props, Object.keys(Box.propTypes));
      let label;
      if ('explode' === this.state.inline) {
        label = (
          <div className={`${CLASS_ROOT}__label`}>
            {this.props.label}
          </div>
        );
      }

      return (
        <Box {...boxProps} tag="nav" id={this.props.id}
          className={classes} primary={false}>
          {label}
          {this._menuChildren}
        </Box>
      );

    } else {
      let controlContents = this._renderControlContents();
      let openLabel = Intl.getMessage(this.context.intl, 'Open');
      let menuLabel = Intl.getMessage(this.context.intl, 'Menu');
      let menuTitle = (
        `${openLabel} ${this.props.a11yTitle || this.props.label || ''} ` +
        `${menuLabel}`
      );

      return (
        <div ref="control">
          <Button plain={true} id={this.props.id}
            className={classes}
            tabIndex="0"
            style={{lineHeight: this.state.controlHeight + 'px'}}
            onClick={this._onOpen}
            a11yTitle={menuTitle}
            onFocus={this._onFocusControl}
            onBlur={this._onBlurControl}>
            {controlContents}
          </Button>
        </div>
      );

    }
  }
}

Menu.propTypes = {
  closeOnClick: PropTypes.bool,
  dropAlign: Drop.alignPropType,
  dropColorIndex: PropTypes.string,
  icon: PropTypes.node,
  id: PropTypes.string,
  inline: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['expand'])]),
  label: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  ...Box.propTypes
};

Menu.contextTypes = {
  intl: PropTypes.any,
  history: PropTypes.any,
  router: PropTypes.any,
  store: PropTypes.any
};

Menu.defaultProps = {
  closeOnClick: true,
  direction: 'column',
  dropAlign: {top: 'top', left: 'left'},
  pad: 'none'
};
