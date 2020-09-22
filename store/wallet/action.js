import taraxa from "taraxa-js"

export const walletActionTypes = {
    SETNONCE: 'SETNONCE',
    SETBALANCE: 'SETBALANCE'
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