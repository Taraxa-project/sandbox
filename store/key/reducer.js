import { keyActionTypes } from './action'

const keyInitialState = {
  mnemonic: '',
}

export default function reducer(state = keyInitialState, action) {
  switch (action.type) {
    case keyActionTypes.MNEMONIC:
      return Object.assign({}, state, {
        mnemonic: action.data,
      })
    default:
      return state
  }
}