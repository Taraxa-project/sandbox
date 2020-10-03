import { useEffect, useState } from "react";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ethers } from 'ethers'

import QRCode from 'qrcode.react';

import Link from 'next/link'
import Router from 'next/router'

import {Button, Container, Row, Col, Card, ListGroup, ListGroupItem, InputGroup, FormControl, Form, Dropdown} from 'react-bootstrap'

import Navbar from '../components/navbar';

import { getBalance, getNonce, setPath, setPrivateKey, setAddress } from '../store/wallet/action'

export function Home({privateKey, address = '', path, mnemonic, httpProvider, balance, nonce, getBalance, getNonce, setPath, setPrivateKey, setAddress}) {
  const basePath = `m/44'/60'/0'/0/`;
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendMemo, setSendMemo] = useState('');
  const [gasPrice, setGasPrice] = useState(1);

  async function send() {
    const provider = new ethers.providers.JsonRpcProvider(httpProvider);
    const account = new ethers.Wallet(privateKey)
    const wallet = account.connect(provider);

    const tx = await wallet.sendTransaction({
        // from: address,
        to: recipientAddress,
        value: sendAmount,
        gasLimit: 21000,
        gasPrice
    });

    console.log(tx)

    setRecipientAddress('')
    setSendAmount('')
    setSendMemo('')
    setGasPrice(1)
  }

  function updateRecipientAddress(e) {
    setRecipientAddress(e.target.value);
  }

  function updateSendAmount(e) {
      if (e.target.value) {
        setSendAmount(parseInt(e.target.value));
      } else {
        setSendAmount('');
      }
  }

  function updateSendMemo(e) {
    setSendMemo(e.target.value);
  }

  function updateGasPrice(e) {
    setGasPrice(parseInt(e.target.value));
  }

  async function copyAddress() {
    await navigator.clipboard.writeText(address);
  }

  function setWalletAddress(i) {
    const newWallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${i}`)
    setPath(i);
    setPrivateKey(newWallet.privateKey);
    setAddress(newWallet.address);
    getBalance(httpProvider, newWallet.address);
    getNonce(httpProvider, newWallet.address);    
  }

  useEffect(() => {
    if(privateKey){
        let wallet = new ethers.Wallet(privateKey)
        setAddress(wallet.address);
    }

    if (address) {
        getBalance(httpProvider, address);
        getNonce(httpProvider, address);    
    }
  }, [privateKey, address]);

  return (
        <>
        <Navbar/>
        <Container className="content">
          <Row>
            <Col xs={6}>
                <h2>Wallet</h2>
            </Col>
            
            <Col xs={4}>
                
                    <Row>
                        <Col xs={12} style={{fontSize: 14, marginRight: 5}}>
                            <div className="text-right">
                                <span style={{width: 60, display: 'inline-block', textAlign: 'left'}}>Balance:</span> {balance.toLocaleString()} TARA
                            </div>
                        </Col>
                        <Col xs={12} style={{fontSize: 14, marginBottom: 10, marginRight: 5}}>
                            <div className="text-right">
                                <span style={{width: 60, display: 'inline-block', textAlign: 'left'}}>Stake:</span> {0} TARA
                            </div>
                        </Col>
                    </Row>
               
            </Col>
            <Col xs={2}>
              <div className="text-right">
              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-basic">
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
          <Row>
            <Col sm={12} lg={7}>
                <Form>
                    <Card style={{marginBottom: 10}}>
                        <Card.Header>
                        Send TARA
                        </Card.Header>
                        <Card.Body>
                            <Form.Group controlId="walletSend.recipientAddress">
                                <Form.Control type="text" placeholder="Recipient's Address" value={recipientAddress} onChange={updateRecipientAddress}/>
                            </Form.Group>
                            <Form.Group controlId="walletSend.sendAmount">
                                <Form.Control type="number" min="1" placeholder="Amount" value={sendAmount} onChange={updateSendAmount}/>
                            </Form.Group>
                            <Form.Group controlId="walletSend.memo">
                                <Form.Control type="text" placeholder="Memo" value={sendMemo} onChange={updateSendMemo}/>
                            </Form.Group>
                            <Form.Group controlId="walletSend.gasPrice">
                                <Form.Label>Gas Price {gasPrice}</Form.Label>
                                <Form.Control type="range" custom min="0" max="100" onChange={updateGasPrice} value={gasPrice}/>
                            </Form.Group>
                    
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="success" onClick={send}>Send</Button>
                        </Card.Footer>
                    </Card>
                </Form>
            </Col>
            <Col lg={5}>
                <Card>
                    <Card.Header>
                        Receive TARA
                    </Card.Header>
                    <Card.Body className="text-center">
                        <Card.Text>
                                <span style={{fontSize: 12}}>{address}</span>
                        </Card.Text>
                    
                        <QRCode value={address} size={235}/>
                        
                    </Card.Body>
                    <Card.Footer className="text-center">
                        <Button variant="link" onClick={copyAddress}>Copy Address</Button>
                    </Card.Footer>
                </Card>
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
    nonce: state.wallet.nonce,
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)