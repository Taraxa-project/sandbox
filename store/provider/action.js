export const providerActionTypes = {
    HTTPPROVIDER: 'HTTPPROVIDER',
}

export const setHttpProvider = (provider) => (dispatch) => {
    return dispatch({
        type: providerActionTypes.HTTPPROVIDER,
        data: provider
    })
}