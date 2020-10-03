import taraxa from "taraxa-js"

export const walletActionTypes = {
    SETNONCE: 'SETNONCE',
    SETBALANCE: 'SETBALANCE',
    PRIVATEKEY: 'PRIVATEKEY',
    PATH: 'PATH',
    ADDRESS: 'ADDRESS'
}

export const getBalance = (rpcHost, address) => async (dispatch) => {
    taraxa.set({host: rpcHost})

    try {
        const nonce = await taraxa.eth.getBalance(address.toLowerCase());
        return dispatch({
            type: walletActionTypes.SETBALANCE,
            data: nonce
        })
    } catch (e) {
        console.error('Get balance error', e);
    }
}

export const getNonce = (rpcHost, address) => async (dispatch) => {
    const [host, port] = rpcHost.split(':')
    taraxa.set({host: rpcHost})

    try {
        const nonce = await taraxa.eth.getTransactionCount(address.toLowerCase());
        return dispatch({
            type: walletActionTypes.SETNONCE,
            data: nonce
        })
    } catch (e) {
        console.error('Get nonce error', e);
    }
}

export const setPath = (path) => (dispatch) => {
    return dispatch({
        type: walletActionTypes.PATH,
        data: path
    })
}

export const setPrivateKey = (privateKey) => (dispatch) => {
    return dispatch({
        type: walletActionTypes.PRIVATEKEY,
        data: privateKey
    })
}

export const setAddress = (address) => (dispatch) => {
    return dispatch({
        type: walletActionTypes.ADDRESS,
        data: address
    })
}