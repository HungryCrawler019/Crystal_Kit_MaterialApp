/**
 *
 *  App bootstrapping. See index.html
 *
 */
import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom';
import './styles.less';
import { SelectableTable } from './periodic-table/table-state';
import { TableFilter } from './periodic-table/periodic-filter/table-filter';
import { StandalonePeriodicComponent } from './periodic-table/periodic-element/standalone-periodic-component';
import { useElements } from './periodic-table/periodic-table-state/table-store';
import { PeriodicContext } from './periodic-table/periodic-table-state/periodic-selection-context';
import { TableLayout } from './periodic-table/periodic-table-component/periodic-table.component';
import Simple3DSceneComponent from './crystal-toolkit-components/components-v2/Simple3DScene/Simple3DSceneComponent.react';
import {
  AnimationStyle,
  Renderer
} from './crystal-toolkit-components/components-v2/Simple3DScene/constants';
import { scene, scene2 } from './crystal-toolkit-components/components-v2/scene/mike';
import { s2, s4 } from './crystal-toolkit-components/components-v2/scene/simple-scene';
import Grid from './search-page/card-grid';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Select from './search-page/group-space-search/property-search';
import TagSearch from './search-page/tags/tag-search';
import ExportableGrid from './search-page/exportable-grid';

const mountNodeSelector = 'app';
const mountNode = document.getElementById(mountNodeSelector);

let elements: any[] = [];

function SelectedComponent() {
  const { enabledElements } = useElements();
  // try to delete the key in the store instead
  const getElementsList = () => Object.keys(enabledElements).filter(el => enabledElements[el]);

  return (
    <div className="cmp-list" style={{ margin: '10px', display: 'flex' }}>
      {getElementsList().map((elt: any) => (
        <StandalonePeriodicComponent
          key={elt}
          size={50}
          disabled={false}
          enabled={false}
          hidden={false}
          element={elt}
          onElementClicked={() => {}}
          onElementHovered={() => {}}
        />
      ))}
    </div>
  );
}

const vis = { atoms: true };

function SceneSwitcher() {
  const [_scene, setScene] = useState(s2) as any;
  const [_vis, setVisibility] = useState(vis) as any;
  const [_anim, setAnim] = useState(AnimationStyle.NONE) as any;

  return (
    <div>
      <div onClick={() => setScene(s2)}> SCENE A </div>
      <div onClick={() => setScene(scene2)}> SCENE B </div>
      <div onClick={() => setScene(scene)}> SCENE C </div>
      <div onClick={() => setScene(scene2)}> SCENE D </div>
      <div onClick={() => setAnim(AnimationStyle.PLAY)}> PLAY </div>
      <div onClick={() => setAnim(AnimationStyle.NONE)}> NONE </div>
      <div onClick={() => setAnim(AnimationStyle.SLIDER)}> SLIDER </div>
      <div
        onClick={() => {
          vis.atoms = !vis.atoms;
          setVisibility({ ...vis });
        }}
      >
        {' '}
        TOGGLE VIS{' '}
      </div>
      <Simple3DSceneComponent
        sceneSize={'30vw'}
        animation={_anim}
        settings={{
          staticScene: false,
          renderer: Renderer.WEBGL,
          extractAxis: false,
          isMultiSelectionEnabled: true,
          secondaryObjectView: true
        }}
        data={_scene}
        debug={true}
        toggleVisibility={_vis}
      />
    </div>
  );
}

function SelectedComponentSimple() {
  const { enabledElements } = useElements();
  // try to delete the key in the store instead
  const getElementsList = () => Object.keys(enabledElements).filter(el => enabledElements[el]);
  return (
    <ul>
      {getElementsList().map(el => (
        <li key={el}>{el}</li>
      ))}
    </ul>
  );
}

function TestComponent(props: any) {
  const [d, sd] = useState(props.d as any);
  const [z, sz] = useState(props.e as any);
  const [sel, ss] = useState(2);

  return (
    <div>
      <div
        onClick={() => {
          console.log('CLICKED');
          ss(1);
          sz(['Cl', 'Na', 'Be']);
          sd(['K', 'Be']);
        }}
      >
        CLICK ME
      </div>
      <PeriodicContext>
        <div>
          <SelectableTable
            forwardOuterChange={true}
            maxElementSelectable={sel}
            hiddenElements={props.e}
            onStateChange={a => {
              console.log('new elements', a);
            }}
            enabledElements={z}
            disabledElements={d}
          />
          <TableFilter />
          <SelectedComponent />
          <div>{props.toString()}</div>
        </div>
      </PeriodicContext>
      )
    </div>
  );
}

ReactDOM.render(
  <>
    <ExportableGrid />
  </>,

  mountNode
);
console.log('RUNNING in', process.env.NODE_ENV, 'DEBUGGING IS', process.env.DEBUG);

/*<CameraContextWrapper>
        <SceneSwitcher />
      <>
        <Simple3DSceneComponent
          settings={{ renderer: Renderer.WEBGL, extractAxis: false }}
          data={scene}
          debug={true}
          toggleVisibility={{}}
        />
        <Simple3DSceneComponent
          settings={{ renderer: Renderer.WEBGL, extractAxis: true }}
          data={scene2}
          debug={false}
          toggleVisibility={{}}
        />
        <Simple3DSceneComponent data={scene3} debug={false} toggleVisibility={{}} />
      </>
    </CameraContextWrapper>*/
/*
<div>
  {<TestComponent d={['B']} b={[]} e={[]} />}
  {
    <PeriodicContext>
      <div>
        <div>
          <SelectableTable
            maxElementSelectable={2}
            forceTableLayout={TableLayout.COMPACT}
            hiddenElements={[]}
            onStateChange={enabledElements => {
              elements = Object.keys(enabledElements).filter(el => enabledElements[el]);
            }}
            enabledElements={[]}
            disabledElements={['H', 'C']}
          />
          <TableFilter />
          <SelectableTable
            maxElementSelectable={1}
            forceTableLayout={TableLayout.MAP}
            enabledElements={['H', 'C']}
            disabledElements={[]}
            hiddenElements={[]}
          />
        </div>
        <SelectedComponentSimple />
      </div>
    </PeriodicContext>
  }
</div>
*/
