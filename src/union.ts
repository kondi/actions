import { buildCreateReducer } from './create-reducer';
import {
  ActionFactory,
  ActionPredicate,
  DefinedActions,
  KeysOf,
  NakedAction,
  PayloadsOf,
  ScopeOf,
} from './types';
import { typedKeys } from './utils';

type PayloadsUnion<PS1, PS2> = PS1 & PS2 & Record<keyof PS1 & keyof PS2, never>;

export type ActionsUnion<
  A1 extends DefinedActions<any, any>,
  A2 extends DefinedActions<any, any>
> = {
  create: Record<KeysOf<A1> & KeysOf<A2>, never>;
} & DefinedActions<ScopeOf<A1> | ScopeOf<A2>, PayloadsUnion<PayloadsOf<A1>, PayloadsOf<A2>>>;

function actionsUnionPair<A1 extends DefinedActions<any, any>, A2 extends DefinedActions<any, any>>(
  actions1: A1,
  actions2: A2,
): ActionsUnion<A1, A2> {
  type ReturnType = ActionsUnion<A1, A2>;

  type S = ScopeOf<ReturnType>;
  type PS = PayloadsOf<ReturnType>;

  type K1 = KeysOf<A1>;
  type K2 = KeysOf<A2>;
  type K = Exclude<K1 | K2, K1 & K2>;

  const keys = [...typedKeys(actions1.is), ...typedKeys(actions2.is)].filter(
    key => !(key in actions1.is && key in actions2.is),
  ) as K[];

  const is = {} as ReturnType['is'];
  const itIsNot = (action: NakedAction) => false;
  keys.forEach(key => {
    const isInActions1 = key in actions1.is ? actions1.is[key as K1] : itIsNot;
    const isInActions2 = key in actions2.is ? actions2.is[key as K2] : itIsNot;
    const predicate = (action: NakedAction) => isInActions1(action) || isInActions2(action);
    is[key] = predicate as ActionPredicate<S, K, PS>;
  });

  const create = {} as ReturnType['create'];
  keys.forEach(key => {
    if (key in actions1.create) {
      create[key] = actions1.create[key] as ActionFactory<S, K, PS>;
    }
    if (key in actions2.create) {
      create[key] = actions2.create[key] as ActionFactory<S, K, PS>;
    }
  });

  return {
    create,
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

  <
    A1 extends DefinedActions<any, any>,
    A2 extends DefinedActions<any, any>,
    A3 extends DefinedActions<any, any>,
    A4 extends DefinedActions<any, any>,
    A5 extends DefinedActions<any, any>
  >(
    actions1: A1,
    actions2: A2,
    actions3: A3,
    actions4: A4,
    actions5: A5,
  ): ActionsUnion<ActionsUnion<ActionsUnion<ActionsUnion<A1, A2>, A3>, A4>, A5>;

  <
    A1 extends DefinedActions<any, any>,
    A2 extends DefinedActions<any, any>,
    A3 extends DefinedActions<any, any>,
    A4 extends DefinedActions<any, any>,
    A5 extends DefinedActions<any, any>,
    A6 extends DefinedActions<any, any>
  >(
    actions1: A1,
    actions2: A2,
    actions3: A3,
    actions4: A4,
    actions5: A5,
    actions6: A6,
  ): ActionsUnion<ActionsUnion<ActionsUnion<ActionsUnion<ActionsUnion<A1, A2>, A3>, A4>, A5>, A6>;

  (...actionsList: DefinedActions<any, any>[]): DefinedActions<any, any>;
}

function genericActionsUnion(...actionsList: DefinedActions<any, any>[]): DefinedActions<any, any> {
  return actionsList.reduce(actionsUnionPair);
}

export const actionsUnion = genericActionsUnion as ActionsUnionFunction;
