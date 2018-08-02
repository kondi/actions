import { ScopedString } from './scoped-string';

export interface NakedAction {
  type: string;
}

export interface ScopedAction<P, MT extends PropertyKey, S extends string> extends NakedAction {
  type: ScopedString<MT, S>;
  payload: P;
}

export type ActionFactory<S extends string, MT extends keyof PS, PS> = {} extends PS[MT]
  ? () => ScopedAction<never, MT, S>
  : <P extends PS[MT]>(payload: P) => ScopedAction<P, MT, S>;

export type ActionFactories<S extends string, PS> = { [MT in keyof PS]: ActionFactory<S, MT, PS> };

type ActionPredicate<S extends string, MT extends keyof PS, PS> = (
  action: NakedAction,
) => action is ScopedAction<PS[MT], MT, S>;

export type ActionPredicates<S extends string, PS> = {
  [MT in keyof PS]: ActionPredicate<S, MT, PS>
};

type ReducerCase<S extends string, MT extends keyof PS, PS, ST> = (
  state: ST,
  payload: PS[MT],
) => ST;

export type ReducerCases<S extends string, PS, ST> = {
  [MT in keyof PS]?: ReducerCase<S, MT, PS, ST>
};

type Reducer<S extends string, PS, ST> = (
  state: ST | undefined,
  action: ȊnternalAction<S, PS>,
) => ST;

export type CreateReducer<S extends string, PS> = <ST>(
  initialState: ST,
  cases: ReducerCases<S, PS, ST>,
) => Reducer<S, PS, ST>;

export type ActionTypes<S extends string, PS> = { [MT in keyof PS]: ScopedString<MT, S> };

type ȊnternalActionsMap<S extends string, PS> = { [MT in keyof PS]: ScopedAction<PS[MT], MT, S> };

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
