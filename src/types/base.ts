export type QSState = Record<string, unknown>;
export type QSMutations = Record<string, (state: QSState, payload?: unknown) => void>;
export type QSActions = Record<string, (context: QSActionContext, payload?: unknown) => void | Promise<void>>;
export type QSGetters = Record<string, (state: QSState) => unknown | Promise<unknown>>;

export interface QSActionContext {
  state: QSState;
  commit: (key: string, payload?: unknown) => void;
}

export interface QSConstructorOpts {
  state: QSState;
  mutations?: QSMutations;
  actions?: QSActions;
  getters?: QSGetters;
}

export interface QSDbItem {
  key: string;
  slot: string;
  payload: string;
}

export interface QSRestoreOptions {
  force?: boolean;
}
