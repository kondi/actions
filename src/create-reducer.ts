import { ActionPredicates, CreateReducer, ReducerCases } from './types';
import { typedKeys } from './utils';

export function buildCreateReducer<S extends string, PS>(
  predicates: ActionPredicates<S, PS>,
): CreateReducer<S, PS> {
  return <ST>(initialState: ST, cases: ReducerCases<S, PS, ST>) => {
    const mainTypes = typedKeys(cases);
    return (state: ST = initialState, action) => {
      for (let i = 0; i < mainTypes.length; i++) {
        const mainType = mainTypes[i];
        if (predicates[mainType](action)) {
          const currentCase = cases[mainType];
          if (currentCase) {
            return currentCase(state, action.payload);
          }
        }
      }
      return state;
    };
  };
}
