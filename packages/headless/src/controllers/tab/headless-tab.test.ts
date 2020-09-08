import {MockEngine, buildMockEngine} from '../../test/mock-engine';
import {TabProps, buildTab, Tab} from './headless-tab';
import {updateConstantQuery} from '../../features/constant-query/constant-query-actions';

describe('Tab', () => {
  const expression = 'abc123';
  let engine: MockEngine;
  let props: TabProps;
  let tab: Tab;

  function initTab() {
    tab = buildTab(engine, props);
  }

  beforeEach(() => {
    engine = buildMockEngine();
    engine.state.constantQuery = {cq: '', isInitialized: false};
    props = {
      expression,
      initialState: {
        isActive: false,
      },
    };
  });

  describe('initalization', () => {
    it('calls #updateConstantQuery if isActive is true', () => {
      props = {
        expression,
        initialState: {
          isActive: true,
        },
      };
      initTab();

      const action = updateConstantQuery(expression);
      expect(engine.actions).toContainEqual(action);
    });
  });

  it('#select calls #updateConstantQuery', () => {
    initTab();
    tab.select();
    const action = updateConstantQuery(expression);
    expect(engine.actions).toContainEqual(action);
  });

  it('#state.isActive is false by default', () => {
    initTab();
    expect(tab.state.isActive).toBe(false);
  });

  it('#state.isActive is true if the tabs cq matches the active cq', () => {
    props.expression = 'abc123';
    initTab();
    engine.state.constantQuery = {
      isInitialized: true,
      cq: props.expression,
    };
    expect(tab.state.isActive).toBe(true);
  });
});
