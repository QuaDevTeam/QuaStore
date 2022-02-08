import { QSState, QSGetters, QSMutations, QSActions, QSConstructorOpts } from '../types/base';
import db from './db';

class QuaStore {
  public state: QSState;
  public getters: QSGetters;
  private key: string;
  private mutations: QSMutations;
  private actions: QSActions;

  public constructor(key: string, options: QSConstructorOpts) {
    this.key = key;
    this.state = options.state || {};
    this.actions = options.actions || {};
    this.mutations = options.mutations || {};
    this.getters = options.getters || {};
  }

  public commit(key: string, payload?: unknown) {
    const mutation = this.mutations[key];
    if (!mutation) {
      throw new Error('No matched mutation found.');
    }
    mutation(this.state, payload);
  }

  public async dispatch(key: string, payload?: unknown) {
    const action = this.actions[key];
    if (!action) {
      throw new Error('No matched action found.');
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
