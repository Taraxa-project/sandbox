import { actionTypes } from './action'

const initialState = {
  releases: {},
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.RELEASES:
      return Object.assign({}, state, {
        releases: action.data,
      })
    default:
      return state
  }
}