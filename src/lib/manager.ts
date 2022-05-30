import { QSConstructorOpts, QSRestoreOptions } from '../types/base';
import { getErrorMsg } from '../utils/log';
import QuaStore from './store';

interface ExQSConstructorOpts extends QSConstructorOpts {
  name: string;
}

const getTargetNames = (name: string) => {
  if (!name.includes('/')) {
    throw new Error(getErrorMsg('Invalid action name.'));
  }
  const slashIdx = name.indexOf('/');
  const storeName = name.slice(0, slashIdx);
  const targetName = name.slice(slashIdx + 1);
  return [storeName, targetName];
};

export const useStore = (name: string) => {
  const store = QuaStoreManager.stores[name];
  if (!store) {
    console.error(getErrorMsg('No matched store.'));
    return null;
  }
  return store;
};

const callMethod = (action: 'commit' | 'dispatch', name: string, payload?: unknown) => {
  const [storeName, targetName] = getTargetNames(name);
  const store = useStore(storeName);
  if (!store) {
    throw new Error(getErrorMsg(`Cannot find the certain store named. `));
  }
  return store[action](targetName, payload);
};

export const dispatch = (name: string, payload?: unknown) => {
  return callMethod('dispatch', name, payload) as Promise<void>;
};

export const commit = (name: string, payload: unknown) => {
  callMethod('commit', name, payload);
};

class QuaStoreManager {
  public static stores: Record<string, QuaStore> = {};
  public static createStore(opts: ExQSConstructorOpts) {
    const { name } = opts;
    if (!name) {
      throw new Error('Must specify the name of store.');
    }
    const newStore = new QuaStore(opts.name, opts);
    QuaStoreManager.stores[name] = newStore;
    return newStore;
  }
  public static register(name: string, store: QuaStore) {
    if (this.stores[name]) {
      throw new Error(getErrorMsg('The name has already been existed.'));
    }
    this.stores[name] = store;
  }
  public static unregister(name: string) {
    if (!this.stores[name]) {
      throw new Error(getErrorMsg(`Cannot find the certain store named "${name}".`));
    }
    delete this.stores[name];
  }
  public static getStore(name: string) {
    return useStore(name);
  }
  public static async persistStore(name: string, slot?: number | string) {
    const store = useStore(name);
    if (!store) {
      throw new Error(getErrorMsg(`Cannot find the certain store named "${name}".`));
    }
    await store.persist(slot);
  }
  public static async restoreStore(name: string, slot?: number | string, options?: QSRestoreOptions) {
    const store = useStore(name);
    if (!store) {
      throw new Error(getErrorMsg(`Cannot find the certain store named "${name}".`));
    }
    await store.restore(slot, options);
  }
}

export default QuaStoreManager;
