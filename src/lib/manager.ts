import { QSConstructorOpts } from '../types/base';
import { getErrorMsg } from '../utils/log';
import QuaStore from './store';

interface ExQSConstructorOpts extends QSConstructorOpts {
  name: string;
}

export const useStore = (name: string) => {
  const store = QuaStoreManager.stores[name];
  if (!store) {
    console.error(getErrorMsg('No matched store.'));
    return null;
  }
  return store;
};

class QuaStoreManager {
  public static stores: Record<string, QuaStore> = {};
  public static createStore(opts: ExQSConstructorOpts) {
    const { name } = opts;
    if (!name) {
      throw new Error('Must specify the name of store.');
    }
    QuaStoreManager.stores[name] = new QuaStore(opts.name, opts);
  }
  public static getStore(name: string) {
    return useStore(name);
  }
}

export default QuaStoreManager;
