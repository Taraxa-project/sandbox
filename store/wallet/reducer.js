import { walletActionTypes } from './action'

const initialState = {
  address: '',
  balance: 0,
  nonce: 0,
  privateKey: '',
  path: '',
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
    case walletActionTypes.PATH:
      return Object.assign({}, state, {
        path: action.data,
      })
    case walletActionTypes.PRIVATEKEY:
      return Object.assign({}, state, {
        privateKey: action.data,
      })
    case walletActionTypes.ADDRESS:
      return Object.assign({}, state, {
        address: action.data,
      })
    default:
      return state
  }
}