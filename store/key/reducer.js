import { keyActionTypes } from './action'

const keyInitialState = {
  privateKey: '',
}

export default function reducer(state = keyInitialState, action) {
  switch (action.type) {
    case keyActionTypes.PRIVATEKEY:
      return Object.assign({}, state, {
        privateKey: action.data,
      })
    default:
      return state
  }
}