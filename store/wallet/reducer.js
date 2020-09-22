import { walletActionTypes } from './action'

const initialState = {
  balance: 0,
  nonce: 0,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case walletActionTypes.SETNONCE:
      return Object.assign({}, state, {
        nonce: action.data,
      })
    case walletActionTypes.SETBALANCE:
    return Object.assign({}, state, {
        balance: action.data,
    })
    default:
      return state
  }
}