import Dexie from 'dexie';
import { QSDbItem } from '../types/base';

const DB_NAME = 'quastore';

class StoreDatabase extends Dexie {
  public store!: Dexie.Table<QSDbItem, number>;

  public constructor() {
    super(DB_NAME);
    this.version(1).stores({
      store: '[key+slot], &key, &slot, payload',
    });
  }
}

export default new StoreDatabase();
