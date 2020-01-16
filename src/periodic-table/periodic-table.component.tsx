import * as React from "react";
import './periodic-table.module.less';
import { MatElement, TABLE } from "./table";
import { PeriodicElement } from "./periodic-element/periodic-element.component";

export interface TableProps {
  /** dictionnary of disabled elements */
  disabledElement: {[symbol:string]: boolean};
  /** dictionnary of enabled elements  */
  enabledElement: {[symbol:string]: boolean};
  /** Callback who gets called once the user clicked an element; the clicked element is passed **/
  onElementClicked: (mat: MatElement) => void;
}

// Ultimately, we'll allow people to pass a specific component by using render props
// the goal is to allow people to insert whatever you want there
export function TableSpacer() {
  return (<React.Fragment>
    <div className="first-span"></div>
    <div className="second-span"></div>
    <div className="third-span"></div>
    <div className="separator-span"></div>
    <div className="first-lower-span"></div>
    <div className="second-lower-span"></div>
  </React.Fragment>);
}

//TODO(chab) use RXJS for handling state
export function Table({disabledElement, enabledElement, onElementClicked}: TableProps) {
  return (
    <div className="table-container">
      <TableSpacer/>
      {TABLE.map((element: MatElement) =>
          <PeriodicElement onElementClicked={(element) => onElementClicked(element) }
            key={`${element.symbol}--${element.elementNumber}`}
            disabled={disabledElement[element.symbol]} enabled={enabledElement[element.symbol]} element={element}/>
      )}
    </div>)
}

