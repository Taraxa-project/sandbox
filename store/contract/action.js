export const actionTypes = {
    ADDSOURCE: 'ADDSOURCE',
}

export const addContractSource = (source) => (dispatch) => {
    return dispatch({
        type: actionTypes.ADDSOURCE,
        data: source
    })
}