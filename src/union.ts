import { buildCreateReducer } from './create-reducer';
import { DefinedActions, NakedAction } from './types';
import { typedKeys } from './utils';

type PayloadsUnion<PS1, PS2> = (PS1 | PS2) &
  Pick<PS1, Exclude<keyof PS1, keyof PS2>> &
  Pick<PS2, Exclude<keyof PS2, keyof PS1>>;

export type ActionsUnion<
  A1 extends DefinedActions<any, any>,
  A2 extends DefinedActions<any, any>
> = {
  /**
   * @deprecated create is not allowed in actions union
   */
  create: never;
} & DefinedActions<
  A1['ȋnternal']['$scope'] | A2['ȋnternal']['$scope'],
  PayloadsUnion<A1['ȋnternal']['$payloads'], A2['ȋnternal']['$payloads']>
>;

function actionsUnionPair<A1 extends DefinedActions<any, any>, A2 extends DefinedActions<any, any>>(
  actions1: A1,
  actions2: A2,
): ActionsUnion<A1, A2> {
  type S1 = A1['ȋnternal']['$scope'];
  type S2 = A2['ȋnternal']['$scope'];
  type S = S1 | S2;

  type PS1 = A1['ȋnternal']['$payloads'];
  type PS2 = A2['ȋnternal']['$payloads'];
  type PS = ActionsUnion<A1, A2>['ȋnternal']['$payloads'];

  type MT1 = keyof PS1;
  type MT2 = keyof PS2;
  type MT = MT1 | MT2;

  const is = {} as ActionsUnion<A1, A2>['is'];
  const keys = [...typedKeys(actions1.is), ...typedKeys(actions2.is)] as MT[];
  keys.forEach(mainType => {
    const itIsNot = (action: NakedAction) => false;
    const isInActions1 = mainType in actions1.is ? actions1.is[mainType as MT1] : itIsNot;
    const isInActions2 = mainType in actions2.is ? actions2.is[mainType as MT2] : itIsNot;
    const predicate = (action: NakedAction) => isInActions1(action) || isInActions2(action);
    is[mainType] = predicate as any;
  });

  return {
    get create(): never {
      throw new Error('Do not use create of actions union');
    },
    is,
    createReducer: buildCreateReducer<S, PS>(is),
    get ȋnternal(): never {
      throw new Error('Do not use ȋnternal');
    },
  };
}

export interface ActionsUnionFunction {
  (): DefinedActions<never, never>;

  <A1 extends DefinedActions<any, any>, A2 extends DefinedActions<any, any>>(
    actions1: A1,
    actions2: A2,
  ): ActionsUnion<A1, A2>;

  <
    A1 extends DefinedActions<any, any>,
    A2 extends DefinedActions<any, any>,
    A3 extends DefinedActions<any, any>
  >(
    actions1: A1,
    actions2: A2,
    actions3: A3,
  ): ActionsUnion<ActionsUnion<A1, A2>, A3>;

  <
    A1 extends DefinedActions<any, any>,
    A2 extends DefinedActions<any, any>,
    A3 extends DefinedActions<any, any>,
    A4 extends DefinedActions<any, any>
  >(
    actions1: A1,
    actions2: A2,
    actions3: A3,
    actions4: A4,
  ): ActionsUnion<ActionsUnion<ActionsUnion<A1, A2>, A3>, A4>;

  (...actionsList: DefinedActions<any, any>[]): DefinedActions<any, any>;
}

function genericActionsUnion(...actionsList: DefinedActions<any, any>[]): DefinedActions<any, any> {
  return actionsList.reduce(actionsUnionPair);
}

export const actionsUnion = genericActionsUnion as ActionsUnionFunction;
