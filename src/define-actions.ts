import { buildCreateReducer } from './create-reducer';
import { scopeString } from './scoped-string';
import {
  ActionFactories,
  ActionFactory,
  ActionPredicates,
  ActionTypes,
  DefinedActions,
  ScopedAction,
} from './types';
import { typedKeys } from './utils';

export function defineActions<S extends string, PS>(scope: S, payloads: PS): DefinedActions<S, PS> {
  const types = {} as ActionTypes<S, PS>;
  typedKeys(payloads).forEach(mainType => {
    types[mainType] = scopeString(mainType, scope);
  });

  const create = {} as ActionFactories<S, PS>;
  typedKeys(payloads).forEach(mainType => {
    type MT = typeof mainType;
    type PayloadedFactory = <P extends PS[MT]>(payload: P) => ScopedAction<P, MT, S>;
    const factory: PayloadedFactory = payload => ({
      type: types[mainType],
      payload,
    });
    create[mainType] = factory as ActionFactory<S, MT, PS>;
  });

  const is = {} as ActionPredicates<S, PS>;
  typedKeys(payloads).forEach(mainType => {
    type MT = typeof mainType;
    is[mainType] = (action): action is ScopedAction<PS[MT], MT, S> =>
      action.type === types[mainType];
  });

  return {
    create,
    is,
    createReducer: buildCreateReducer(is),
    get ȋnternal(): never {
      throw new Error('Do not use ȋnternal');
    },
  };
}
