import { actionTypes } from './action'

const initialState = {
  sources: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADDSOURCE:
      const {name, text} = action.data;
      const temp = Object.assign({}, state);
      console.log('before', temp)
      temp.sources[name] = {text, loaded: (new Date()).valueOf()};
      console.log('after', temp)
      return Object.assign({}, state, temp);
    default:
      return state
  }
}