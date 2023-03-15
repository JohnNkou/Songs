import { createStore,applyMiddleware } from 'redux';
import { Reducer} from './newReducer.cjs';
import { saveUiInfo, checkReachability, timeAction, logAction, myThunk, ManageFastAccess } from '../middleware/index.js';
import { getStoreData, appState, curry, saveToLocalStorage } from './BrowserDb.cjs';
import { System } from './constant.cjs';

const storeData = getStoreData(appState),
fastAccess = {},
save = curry(saveToLocalStorage)(System.LOCALSTORAGE),
saveUiInfoCurried = curry(saveUiInfo)(save),
ManageFastAccessCurried = curry(ManageFastAccess)(fastAccess);


export const store = createStore(Reducer,storeData,applyMiddleware(myThunk,ManageFastAccessCurried,checkReachability,saveUiInfoCurried,logAction));

export const fAccess = fastAccess;