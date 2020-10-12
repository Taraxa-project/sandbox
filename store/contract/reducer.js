import { actionTypes } from './action'

const initialState = {
  version: 0,
  filenames: {},
}

export default function reducer(state = initialState, action) {
  const temp = Object.assign({}, state);
  temp.version = state.version + 1;

  switch (action.type) {
    case actionTypes.ADDSOURCE:
      const {text, name: sourceName} = action.data;
      temp.filenames[sourceName] = {text, loaded: (new Date()).valueOf(), compiled: false, deployed: false};
      return Object.assign({}, state, temp);
    case actionTypes.COMPILED:
      const {name: compiledName, solidityVersion, compiled} = action.data;
      temp.filenames[compiledName] = Object.assign(temp.filenames[compiledName], {solidityVersion, compiled, deployed: false});
      return Object.assign({}, state, temp);
    case actionTypes.DEPLOYED:
      const {name: deployedName, address} = action.data;
      temp.filenames[deployedName].deployed = Object.assign(temp.filenames[compiledName], {deployed: address});
      return Object.assign({}, state, temp);
    default:
      return state
  }
}