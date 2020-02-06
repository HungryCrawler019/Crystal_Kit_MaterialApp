import React, { Component } from "react";
import PropTypes from "prop-types";

import ReactJson from "react-json-view";

/**
 * JSONViewComponent renders JSON using
 * react-json-view from @mac-s-g
 */
export class JSONViewComponent extends Component {
  static propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks
     */
    id: PropTypes.string,
    type : PropTypes.oneOf(['array', 'object']),
    // see documentation at https://github.com/mac-s-g/react-json-view
    src: PropTypes.object,
    name: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    theme: PropTypes.string,
    style: PropTypes.object,
    iconStyle:  PropTypes.oneOf(['circle', 'triangle', 'square']),
    identWidth: PropTypes.number,
    collapsed: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    collapseStringsAfterLength: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number
    ]),
    groupArraysAfterLength: PropTypes.number,
    enableClipboard: PropTypes.bool,
    displayObjectSize: PropTypes.bool,
    displayDataTypes: PropTypes.bool,
    defaultValue: PropTypes.object,
    sortKeys: PropTypes.bool,
    validationMessage: PropTypes.string,

    /**
     * Dash-assigned callback that should be called whenever any of the
     * properties change
     */
    setProps: PropTypes.func
  };

  // https://github.com/mac-s-g/react-json-view/blob/39f7b6b2e73a873b974f0801c260d90d76cccdae/index.d.ts
  static defaultProps = {
    src: null,
    name: false,
    theme: "rjv-default",
    style: {},
    iconStyle: "circle",
    identWidth: 8,
    collapsed: false,
    collapseStringsAfterLength: false,
    groupArraysAfterLength: 100,
    enableClipboard: true,
    displayObjectSize: false,
    displayDataTypes: false,
    defaultValue: null,
    sortKeys: false,
    validationMessage: "Validation Error"
  };

  constructor(public props: any) {
    super(props);
  }

  render() {
    const {
      src,
      name,
      theme,
      style,
      iconStyle,
      identWidth,
      collapsed,
      collapseStringsAfterLength,
      groupArraysAfterLength,
      enableClipboard,
      displayObjectSize,
      displayDataTypes,
      defaultValue,
      sortKeys,
      validationMessage
    } = this.props as any;

    return (
      <ReactJson
        src={src}
        name={name}
        theme={theme}
        style={style}
        iconStyle={iconStyle}
        indentWidth={identWidth}
        collapsed={collapsed}
        collapseStringsAfterLength={collapseStringsAfterLength}
        groupArraysAfterLength={groupArraysAfterLength}
        enableClipboard={enableClipboard}
        displayObjectSize={displayObjectSize}
        displayDataTypes={displayDataTypes}
        defaultValue={defaultValue}
        sortKeys={sortKeys}
        validationMessage={validationMessage}
        onEdit={(e) => {
        }}
        onAdd={(a) => {
        }}
        onDelete={(d) => {
        }}
      />
    );
  }
}

