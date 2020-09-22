import { providerActionTypes } from './action'

const initialState = {
  http: 'http://localhost:7777',
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case providerActionTypes.HTTPPROVIDER:
      return Object.assign({}, state, {
        http: action.data,
      })
    default:
      return state
  }
}