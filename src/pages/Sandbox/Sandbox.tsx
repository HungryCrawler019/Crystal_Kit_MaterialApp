import React, { useState } from 'react';
import { BibjsonCard } from '../../components/publications/BibjsonCard';
import { BibFilter } from '../../components/publications/BibFilter';
import { CrossrefCard } from '../../components/publications/CrossrefCard';
import { DownloadButton } from '../../components/data-display/DownloadButton';
import { DownloadDropdown } from '../../components/data-display/DownloadDropdown';
import { PublicationButton } from '../../components/publications/PublicationButton';
import crossref from './crossref.json';
import { DataBlock } from '../../components/data-display/DataBlock';
import { NavbarDropdown } from '../../components/navigation/NavbarDropdown';
import { Markdown } from '../../components/data-display/Markdown';
import ReactMarkdown from 'react-markdown';
import { Dropdown } from '../../components/navigation/Dropdown';
import { Select } from '../../components/data-entry/Select';
import { Link } from '../../components/navigation/Link';
import { Navbar } from '../../components/navigation/Navbar/Navbar';
import periodicTableImage from '../../assets/images/periodictable.png';
import { ModalContextProvider, Modal, ModalTrigger } from '../../components/data-display/Modal';
import { Tab as ReactTab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs';
import { Tabs } from '../../components/navigation/Tabs';
import { DataTable } from '../../components/data-display/DataTable';
import { ColumnFormat } from '../../components/data-display/SearchUI/types';
import { Enlargeable } from '../../components/data-display/Enlargeable';
import { RangeSlider } from '../../components/data-entry/RangeSlider';
import { DualRangeSlider } from '../../components/data-entry/DualRangeSlider';
import { Switch } from '../../components/data-entry/Switch';

/**
 * View for testing out small new components
 */

export const Sandbox: React.FC = () => {
  const [state, setState] = useState({ value: [10, 45] });
  const [switchState, setSwitchState] = useState({ value: false });
  return (
    <>
      <h1 className="title">Sandbox</h1>
      <div>{state.value}</div>
      <div style={{ width: '300px' }}>
        <RangeSlider value={-1} domain={[-2, 3]} step={0.01} isLogScale />
      </div>
      <div style={{ width: '300px' }}>
        <RangeSlider value={-1} domain={[-2, 3]} step={0.1} />
      </div>
      {/* <DualRangeSlider
        value={state.value}
        domain={[0, 100]}
        step={1}
        setProps={setState}
        ticks={5}
      /> */}
      <DualRangeSlider value={[-1, 1]} domain={[-2, 3]} step={0.01} isLogScale />
      <Switch
        value={switchState.value}
        setProps={setSwitchState}
        hasLabel
        truthyLabel="Enabled"
        falsyLabel="Disabled"
      />
    </>
  );
};
