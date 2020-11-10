import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import { useDeepCompareDebounce, useQuery } from '../../../../utils/hooks';
import {
  FilterGroup,
  FilterType,
  FilterId,
  ActiveFilter,
  SearchState,
  Column,
  initColumns,
  initFilterGroups
} from '../constants';
import { SearchUIProps } from '../../SearchUI';
import { useHistory } from 'react-router-dom';
import { getDelimiter, parseElements } from '../../utils';
import useDeepCompareEffect from 'use-deep-compare-effect';

/**
 * Two contexts are invoked inside the SearchUI component
 * SearchUIContext exposes the search state to all of its consumers
 * SearchUIContextActions exposes the methods (i.e. actions) for modifying the search state
 */
const SearchUIContext = React.createContext<SearchState | undefined>(undefined);
const SearchUIContextActions = React.createContext<any | undefined>(undefined);

const initialState: SearchState = {
  columns: [],
  filterGroups: [],
  filterValues: {},
  activeFilters: [],
  results: [],
  totalResults: 0,
  resultsPerPage: 15,
  page: 1,
  loading: true,
  sortColumn: FilterId.MP_ID,
  sortDirection: 'asc'
};

/**
 * Method for initializing and updating the search state's active filters.
 * Returns a full state object
 * Optionally accepts a filterValues argument which represents a new hash map
 * of values for building the activeFilters list.
 * The activeFilters list is recomputed whenever a filter is modified in the UI.
 */
const getState = (
  currentState: SearchState, 
  filterValues = { ...currentState.filterValues }
): SearchState => {
  const activeFilters: ActiveFilter[] = [];
  currentState.filterGroups.forEach(g => {
    g.filters.forEach(f => {
      switch (f.type) {
        case FilterType.SLIDER:
          // if (!f.hasOwnProperty('props')) f.props = {domain: [0, 100]};
          // if (f.hasOwnProperty('props') && f.props.hasOwnProperty('domain')) f.props.domain = [0, 100];  
          // if (!filterValues.hasOwnProperty(f.id)) filterValues[f.id] = f.props.domain;
          if (
            filterValues[f.id][0] !== f.props.domain[0] ||
            filterValues[f.id][1] !== f.props.domain[1]
          ) {
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: filterValues[f.id],
              defaultValue: f.props.domain,
              searchParams: [
                {
                  field: f.id + '_min',
                  value: filterValues[f.id][0]
                },
                {
                  field: f.id + '_max',
                  value: filterValues[f.id][1]
                }
              ]
            });
          }
          break;
        case FilterType.MATERIALS_INPUT:
          if (filterValues[f.id] !== '') {
            /**
             * If the input controls the elements param,
             * parse the input's value into an array of valid elements.
             * Otherwise, use the raw input value for the param.
             */
            let parsedValue = filterValues[f.id];
            if (f.id === 'elements') {
              const delimiter = getDelimiter(filterValues[f.id]);
              parsedValue = parseElements(filterValues[f.id], delimiter);
              f.props.enabledElements = parsedValue;
            }
            activeFilters.push({
              id: f.id,
              displayName: f.props.field,
              value: parsedValue,
              defaultValue: '',
              searchParams: [
                {
                  field: f.props.field,
                  value: parsedValue
                }
              ]
            });
          }
          break;
        default:
          // if (!filterValues.hasOwnProperty(f.id)) filterValues[f.id] = undefined;
          if (filterValues[f.id] !== undefined && filterValues[f.id] !== null ) {
            activeFilters.push({
              id: f.id,
              displayName: f.name ? f.name : f.id,
              value: filterValues[f.id],
              defaultValue: undefined,
              searchParams: [
                {
                  field: f.id,
                  value: filterValues[f.id]
                }
              ]
            });
          }
      }
    });
  });
  return { ...currentState, filterValues, activeFilters };
};

// const initState = (state: SearchState, columns: Column[], filterGroups: FilterGroup[]): SearchState => {
//   state.columns = initColumns(columns);
//   const { initializedGroups, initializedValues } = initFilterGroups(filterGroups);
//   state.filterGroups = initializedGroups;
//   state.filterValues = initializedValues;
//   return getState(state);
// };

const getResetFiltersAndValues = (state: SearchState) => {
  const filterValues = state.filterValues;
  let activeFilters = state.activeFilters;
  activeFilters.forEach(a => {
    filterValues[a.id] = a.defaultValue;
  });
  activeFilters = [];
  return {
    filterValues,
    activeFilters
  };
};

/**
 * Component that wraps all of its children in providers for SearchUIContext and SearchUIContextActions
 * Accepts the same props as SearchUI and uses them to build the context state
 */
export const SearchUIContextProvider: React.FC<SearchUIProps> = ({
  columns,
  filterGroups,
  baseURL,
  apiKey,
  children
}) => {
  const query = useQuery();
  const history = useHistory();
  const [state, setState] = useState(() => {
    initialState.columns = initColumns(columns);
    const { initializedGroups, initializedValues } = initFilterGroups(filterGroups, query);
    initialState.filterGroups = initializedGroups;
    initialState.filterValues = initializedValues;
    return getState(initialState);
  });
  const debouncedActiveFilters = useDeepCompareDebounce(state.activeFilters, 500);

  const actions = {
    setPage: (value: number) => {
      setState(currentState => ({ ...currentState, page: value }));
    },
    setResultsPerPage: (value: number) => {
      setState(currentState => ({ ...currentState, resultsPerPage: value }));
    },
    setFilterValue: (value: any, id: string) => {
      setState(currentState =>
        getState(currentState, { ...currentState.filterValues, [id]: value })
      );
    },
    setFilterWithOverrides: (value: any, id: string, overrideFields: string[]) => {
      setState(currentState => {
        let newFilterValues = {[id]: value};
        overrideFields.forEach((field) => {
          const activeFilter = currentState.activeFilters.find((a) => a.id === field);
          if (activeFilter) newFilterValues[field] = activeFilter.defaultValue;
        });
        return getState(currentState, { ...currentState.filterValues, ...newFilterValues });
      });
    },
    resetAllFiltersExcept: (value: any, id: string) => {
      setState(currentState => {
        const { activeFilters, filterValues } = getResetFiltersAndValues(currentState);
        return getState({ ...currentState, activeFilters }, { ...filterValues, [id]: value });
      });
    },
    setFilterProps: (props: Object, filterId: string, groupId: string) => {
      const filterGroups = state.filterGroups;
      const group = filterGroups.find(g => g.name === groupId);
      const filter = group?.filters.find(f => f.id === filterId);
      if (filter) filter.props = { ...filter.props, ...props };
      const stateWithNewFilterProps = { ...state, filterGroups: filterGroups };
      const newState =
        filter && filter.props.hasOwnProperty('parsedValue')
          ? getState(stateWithNewFilterProps)
          : stateWithNewFilterProps;
      setState({ ...newState });
    },
    toggleGroup: (groupId: string) => {
      const filterGroups = state.filterGroups.map((g) => {
        if (g.name !== groupId) {
          g.collapsed = true;
        } else {
          g.collapsed = !g.collapsed;
        }
        return g;
      });
      // const group = filterGroups.find(g => g.name === groupId);
      // if (group) group.collapsed = !group.collapsed;
      setState({ ...state, filterGroups: filterGroups });
    },
    getData: (showLoading: boolean = false) => {
      setState(currentState => {
        let isLoading = showLoading;
        let minLoadTime = 1000;
        let minLoadTimeReached = false;
        let params: any = {};
        currentState.activeFilters.forEach(a => {
          a.searchParams?.forEach(s => {
            params[s.field] = s.value;
          });
        });
        params.fields = currentState.columns.map(d => d.selector);
        params.limit = currentState.resultsPerPage;
        params.skip = (currentState.page - 1) * currentState.resultsPerPage;
        axios
          .get(baseURL, {
            params: params,
            paramsSerializer: p => {
              return qs.stringify(p, { arrayFormat: 'comma' });
            },
            headers: apiKey
              ? {
                  'X-Api-Key': apiKey
                }
              : null
          })
          .then(result => {
            console.log(result);
            isLoading = false;
            const loadingValue = minLoadTimeReached ? false : true;
            setState(currentState => {
              return {
                ...currentState,
                results: result.data.data,
                totalResults: result.data.meta.total,
                loading: loadingValue
              };
            });
          })
          .catch(error => {
            console.log(error);
            isLoading = false;
            const loadingValue = minLoadTimeReached ? false : true;
            setState(currentState => {
              return {
                ...currentState,
                results: [],
                totalResults: 0,
                loading: loadingValue
              };
            });
          });

        if (showLoading) {
          setTimeout(() => {
            if (!isLoading) {
              setState(currentState => {
                return { ...currentState, loading: false };
              });
            } else {
              minLoadTimeReached = true;
            }
          }, minLoadTime);
        }

        return {
          ...currentState,
          loading: showLoading
        };
      });
    },
    resetFilters: () => {
      setState(currentState => {
        const { activeFilters, filterValues } = getResetFiltersAndValues(currentState);
        return {
          ...currentState,
          filterValues,
          activeFilters
        };
      });
    }
  };

  // useEffect(() => {
  //   // if (state.activeFilters.length === debouncedActiveFilters.length) {
  //     actions.getData(true);
  //     let query = new URLSearchParams();
  //     debouncedActiveFilters.forEach(d => {
  //       d.searchParams?.forEach((param) => query.set(param.field, param.value));
  //     });
  //     history.push({search: query.toString()});
  //   // }
  // }, [debouncedActiveFilters, state.resultsPerPage, state.page]);

  useDeepCompareEffect(() => {
      actions.getData(true);
      let query = new URLSearchParams();
      state.activeFilters.forEach(d => {
        d.searchParams?.forEach((param) => query.set(param.field, param.value));
      });
      history.push({search: query.toString()});
  }, [state.activeFilters]);

  useEffect(() => {
    actions.getData(false);
  }, [state.resultsPerPage, state.page]);

  return (
    <SearchUIContext.Provider value={state}>
      <SearchUIContextActions.Provider value={actions}>{children}</SearchUIContextActions.Provider>
    </SearchUIContext.Provider>
  );
};

/**
 * Custom hook for consuming the SearchUIContext
 * Must only be used by child components of SearchUIContextProvider
 * The context returns one property called "state"
 */
export const useSearchUIContext = () => {
  const context = React.useContext(SearchUIContext);
  if (context === undefined) {
    throw new Error('useMaterialsSearch must be used within a MaterialsSearchProvider');
  }
  return context;
};

/**
 * Custom hook for consuming the SearchUIContextActions
 * Must only be used by child components of SearchUIContextProvider
 * The context returns one property called "actions"
 */
export const useSearchUIContextActions = () => {
  const context = React.useContext(SearchUIContextActions);
  if (context === undefined) {
    throw new Error('useMaterialsSearch must be used within a MaterialsSearchProvider');
  }
  return context;
};
