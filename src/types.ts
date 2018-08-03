import { ScopedString } from './scoped-string';

export interface NakedAction {
  type: string;
}

export interface ScopedAction<P, K extends PropertyKey, S extends string> extends NakedAction {
  type: ScopedString<K, S>;
  payload: P;
}

export type ActionFactory<S extends string, K extends keyof PS, PS> = {} extends PS[K]
  ? (payload?: PS[K]) => ScopedAction<PS[K], K, S>
  : <P extends PS[K]>(payload: P) => ScopedAction<P, K, S>;

export type ActionFactories<S extends string, PS> = { [K in keyof PS]: ActionFactory<S, K, PS> };

export type ActionPredicate<S extends string, K extends keyof PS, PS> = (
  action: NakedAction,
) => action is ScopedAction<PS[K], K, S>;

export type ActionPredicates<S extends string, PS> = { [K in keyof PS]: ActionPredicate<S, K, PS> };

type ReducerCase<S extends string, K extends keyof PS, PS, ST> = (state: ST, payload: PS[K]) => ST;

export type ReducerCases<S extends string, PS, ST> = {
  [K in keyof PS]?: ReducerCase<S, K, PS, ST>
};

type Reducer<S extends string, PS, ST> = (
  state: ST | undefined,
  action: ȊnternalAction<S, PS>,
) => ST;

export type CreateReducer<S extends string, PS> = <ST>(
  initialState: ST,
  cases: ReducerCases<S, PS, ST>,
) => Reducer<S, PS, ST>;

export type ActionTypes<S extends string, PS> = { [K in keyof PS]: ScopedString<K, S> };

type ȊnternalActionsMap<S extends string, PS> = { [K in keyof PS]: ScopedAction<PS[K], K, S> };

type ȊnternalAction<S extends string, PS> = ȊnternalActionsMap<S, PS>[keyof ȊnternalActionsMap<
  S,
  PS
>];

export interface DefinedActions<S extends string, PS> {
  create: ActionFactories<S, PS>;
  is: ActionPredicates<S, PS>;
  createReducer: CreateReducer<S, PS>;
  /**
   * @deprecated For internal use only, throws an exception when accessed.
   */
  ȋnternal: {
    $scope: S;
    $payloads: PS;
    $action: ȊnternalAction<S, PS>;
  };
}

export interface ȊnternalDefinedActionsExtension<S extends string, PS> {
  ȋnternalPayloads: PS;
}

export type ActionOf<A extends DefinedActions<any, any>> = A['ȋnternal']['$action'];
export type ScopeOf<A extends DefinedActions<any, any>> = A['ȋnternal']['$scope'];
export type PayloadsOf<A extends DefinedActions<any, any>> = A['ȋnternal']['$payloads'];
export type KeysOf<A extends DefinedActions<any, any>> = keyof PayloadsOf<A>;
