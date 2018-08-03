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
  typedKeys(payloads).forEach(key => {
    types[key] = scopeString(key, scope);
  });

  const create = {} as ActionFactories<S, PS>;
  typedKeys(payloads).forEach(key => {
    type K = typeof key;
    type PayloadedFactory = <P extends PS[K]>(payload: P) => ScopedAction<P, K, S>;
    const factory: PayloadedFactory = payload => ({
      type: types[key],
      payload,
    });
    create[key] = factory as ActionFactory<S, K, PS>;
  });

  const is = {} as ActionPredicates<S, PS>;
  typedKeys(payloads).forEach(key => {
    type K = typeof key;
    is[key] = (action): action is ScopedAction<PS[K], K, S> => action.type === types[key];
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
