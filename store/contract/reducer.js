import { actionTypes } from './action'

const initialState = {
  sources: {},
}

export default function reducer(state = initialState, action) {
  const temp = Object.assign({}, state);
  let name = action?.data?.name;
  switch (action.type) {
    case actionTypes.ADDSOURCE:
      const {text} = action.data;
      temp.sources[name] = {text, loaded: (new Date()).valueOf(), compiled: false, deployed: false};
      return Object.assign({}, state, temp);
    case actionTypes.COMPILED:
      const {solidityVersion} = action.data;
      temp.sources[action.data].compiled = solidityVersion;
      return Object.assign({}, state, temp);
    case actionTypes.DEPLOYED:
      const {address} = action.data;
      temp.sources[action.data].deployed = address;
      return Object.assign({}, state, temp);
    default:
      return state
  }
}