export const actionTypes = {
    RELEASES: 'RELEASES',
    VERSION: 'VERSION'
}

export const setReleases = (releases) => (dispatch) => {
    return dispatch({
        type: actionTypes.RELEASES,
        data: releases
    })
}

export const setSolidityVersion = (version) => (dispatch) => {
    return dispatch({
        type: actionTypes.VERSION,
        data: version
    })
}