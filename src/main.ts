import QuaStore from './lib/store';
import QuaStoreManager, { useStore, dispatch, commit } from './lib/manager';

interface ExtendedWindow extends Window {
  QuaStoreManager?: QuaStoreManager;
}

const exWindow = window as ExtendedWindow;

if (!exWindow.QuaStoreManager) {
  exWindow.QuaStoreManager = new QuaStoreManager();
}

export { QuaStore, QuaStoreManager, useStore, dispatch, commit };
