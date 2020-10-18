import { useEffect, useState } from "react";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {ethers} from 'ethers'

import {Container, Row, Col, Card, Form, Dropdown, Table} from 'react-bootstrap'

import { getBalance, getNonce, setPath, setPrivateKey, setAddress } from '../store/wallet/action'

export function WalletBar({pageTitle = '', privateKey, address = '', path, mnemonic, httpProvider, balance=0, staking=0, getBalance, getNonce, setPath, setPrivateKey, setAddress}) {
  const basePath = `m/44'/60'/0'/0/`;

  function setWalletAddress(i) {
    const newWallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${i}`)
    setPath(i);
    setPrivateKey(newWallet.privateKey);
    setAddress(newWallet.address);
    getBalance(httpProvider, newWallet.address);
    getNonce(httpProvider, newWallet.address);    
  }

  useEffect(() => {
    if(privateKey && !address){
        let wallet = new ethers.Wallet(privateKey)
        setAddress(wallet.address);
    }
  }, [privateKey]);

  useEffect(() => {
    if (address) {
        getBalance(httpProvider, address);
        getNonce(httpProvider, address);    
    }
  }, [httpProvider, address]);

  return (
        <>
        <Container className="walletbar">
          <Row>
            <Col xs={{order: 'last', cols: 12}} lg={9}>
                <Table style={{margin: 0}}>
                    <tbody>
                        <tr>
                            <td style={{width: 60, margin: 0, padding: 0, paddingRight: 5, fontSize: 12, border: 'none', textAlign: 'left'}}>
                                Address:
                            </td>
                            <td style={{maxWidth: 150, margin: 0, padding: 1, fontSize: 12, border: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                {address}
                            </td>
                        </tr>
                        <tr>
                            <td style={{margin: 0, padding: 0, paddingRight: 5, fontSize: 12, border: 'none', textAlign: 'left'}}>
                                Balance:
                            </td>
                            <td style={{margin: 0, padding: 1, fontSize: 12, border: 'none'}}>
                                {ethers.FixedNumber.fromValue(balance.toString(), 18, "fixed").round(6).toString()} TARA
                            </td>
                        </tr>
                        <tr>
                            <td style={{margin: 0, padding: 0, paddingRight: 5, fontSize: 12, border: 'none', textAlign: 'left'}}>
                                Staking:
                            </td>
                            <td style={{margin: 0, padding: 1, fontSize: 12, border: 'none'}}>
                                {ethers.FixedNumber.fromValue(staking.toString(), 18, "fixed").round(6).toString()} TARA
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            
            <Col xs={12} lg={{order: 'last', cols: 2}} className={"my-auto"} >
              <div className="text-right">
              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-basic" style={{padding: 0, marginBottom: 10}}>
                  Address # {path}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {Array.from(Array(10).keys()).map((i) => {
                    return (<Dropdown.Item key={`dd${i}`} onClick={() => {setWalletAddress(i)}}>{i} {basePath}{i}</Dropdown.Item>)
                  })}
                                    
                </Dropdown.Menu>
              </Dropdown>
              </div>
              
            </Col>
          </Row>
      </Container>
      </>
  )
}

const mapStateToProps = (state) => {
  return {
    address: state.wallet.address,
    privateKey: state.wallet.privateKey,
    path: state.wallet.path,
    mnemonic: state.key.mnemonic,
    httpProvider: state.provider.http,
    balance: state.wallet.balance,
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
      getBalance: bindActionCreators(getBalance, dispatch),
      getNonce: bindActionCreators(getNonce, dispatch),
      setPath: bindActionCreators(setPath, dispatch),
      setPrivateKey: bindActionCreators(setPrivateKey, dispatch),
      setAddress: bindActionCreators(setAddress, dispatch),
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(WalletBar)