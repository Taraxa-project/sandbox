import { useEffect, useState } from "react";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ethers } from 'ethers'

import QRCode from 'qrcode.react';

import {Button, Container, Row, Col, Card, Form, Dropdown} from 'react-bootstrap'

import Navbar from '../components/navbar';
import Walletbar from '../components/walletbar';

export function Wallet({privateKey, address = '', httpProvider, balance, nonce}) {
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

  return (
        <>
        <Navbar/>
        <Walletbar pageTitle="Wallet"/>
        <Container className="content">
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
    httpProvider: state.provider.http,
    balance: state.wallet.balance,
    nonce: state.wallet.nonce,
  }
}

export default connect(mapStateToProps)(Wallet)