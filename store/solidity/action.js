export const actionTypes = {
    RELEASES: 'RELEASES',
}

export const setReleases = (releases) => (dispatch) => {
    return dispatch({
        type: actionTypes.RELEASES,
        data: releases
    })
}