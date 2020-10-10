import { actionTypes } from './action'

const initialState = {
  releases: {},
  version: ''
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.RELEASES:
      return Object.assign({}, state, {
        releases: action.data,
      })
    case actionTypes.VERSION:
      return Object.assign({}, state, {
        version: action.data,
      })
    default:
      return state
  }
}