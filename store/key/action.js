export const keyActionTypes = {
    PRIVATEKEY: 'PRIVATEKEY',
}

export const setPrivateKey = (privateKey) => (dispatch) => {
    return dispatch({
        type: keyActionTypes.PRIVATEKEY,
        data: privateKey
    })
}