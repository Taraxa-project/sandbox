export const keyActionTypes = {
    MNEMONIC: 'MNEMONIC',
}

export const setMnemonic = (mnemonic) => (dispatch) => {
    return dispatch({
        type: keyActionTypes.MNEMONIC,
        data: mnemonic
    })
}