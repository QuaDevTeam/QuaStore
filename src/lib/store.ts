import { QSState, QSGetters, QSMutations, QSActions, QSConstructorOpts } from '../types/base';
import { getErrorMsg } from '../utils/log';
import db from './db';

class QuaStore {
  public state: QSState;
  public getters: QSGetters;
  private key: string;
  private mutations: QSMutations;
  private actions: QSActions;
  private innerGetters: QSGetters;

  public constructor(key: string, options: QSConstructorOpts) {
    this.key = key;

    this.state = options.state || {};
    this.actions = options.actions || {};
    this.mutations = options.mutations || {};
    this.innerGetters = options.getters || {};

    const thisKey = this.key;
    const thisState = this.state;
    this.getters = new Proxy<QSGetters>(this.innerGetters, {
      get: async function (target, prop, receiver) {
        const key = prop as string;
        const getter = target[key];
        if (typeof getter !== 'function') {
          throw new Error(getErrorMsg(`Invalid getter in store [${thisKey}]`));
        }
        return await getter(thisState);
      },
    });
  }

  public commit(key: string, payload?: unknown) {
    const mutation = this.mutations[key];
    if (!mutation) {
      throw new Error(getErrorMsg('No matched mutation found.'));
    }
    mutation(this.state, payload);
  }

  public async dispatch(key: string, payload?: unknown) {
    const action = this.actions[key];
    if (!action) {
      throw new Error(getErrorMsg('No matched action found.'));
    }
    await action(
      {
        state: this.state,
        commit: this.commit.bind(this),
      },
      payload,
    );
  }

  public async persist(slot: number) {
    await db.store.put({
      key: this.key,
      slot,
      payload: JSON.stringify(this.state),
    });
  }

  public async restore(slot: number) {
    const stored = await db.store.get({
      key: this.key,
      slot,
    });
    if (!stored) {
      return null;
    }
    if (stored) {
      this.state = JSON.parse(stored.payload);
    }
    return this;
  }
}

export default QuaStore;
