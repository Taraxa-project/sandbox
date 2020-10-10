export const actionTypes = {
    ADDSOURCE: 'ADDSOURCE',
    COMPILED: 'COMPILED',
    DEPLOYED: 'DEPLOYED'
}

export const addContractSource = (data) => (dispatch) => {
    return dispatch({
        type: actionTypes.ADDSOURCE,
        data
    })
}

export const setContractCompiled = (data) => (dispatch) => {
    return dispatch({
        type: actionTypes.COMPILED,
        data
    })
}

export const setContractDeployed = (data) => (dispatch) => {
    return dispatch({
        type: actionTypes.DEPLOYED,
        data
    })
}