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
  const [sendAmount, setSendAmount] = useState(0);
  const [gasPrice, setGasPrice] = useState(1);

  async function send() {
    const provider = new ethers.providers.JsonRpcProvider(httpProvider);
    const account = new ethers.Wallet(privateKey)
    const wallet = account.connect(provider);

    const tx = await wallet.sendTransaction({
        // from: address,
        to: recipientAddress,
        
        //CONCERN: Made this change back due to undeflow, but now we must worry about overflow... 
        //value: ethers.BigNumber.from('0xde0b6b3a7640000').mul(ethers.BigNumber.from(sendAmount)),
        value: ethers.BigNumber.from(sendAmount  * 1e18),
        gasLimit: 21000,
        gasPrice
    });

    setRecipientAddress('')
    //setSendMemo('')
    setGasPrice(1)
  }

  function updateRecipientAddress(e) {
    const address = e.target.value;
    if (ethers.utils.isAddress(address)) {
      setRecipientAddress(address);
    } else {
      setRecipientAddress('');
    }
  }

  function updateSendAmount(e) {
      if (e.target.value) {
        setSendAmount(parseFloat(e.target.value));
      } else {
        setSendAmount('');
      }
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
                                <Form.Control type="text" placeholder="Recipient's Address" isInvalid={!recipientAddress} onChange={updateRecipientAddress}/>
                            </Form.Group>
                            <Form.Group controlId="walletSend.sendAmount">
                                <Form.Control type="number" min="0" placeholder="Amount" value={sendAmount} onChange={updateSendAmount} step="0.000000000000000001"/>
                            </Form.Group>
                            <Form.Group controlId="walletSend.gasPrice">
                                <Form.Label>Gas Price {gasPrice}</Form.Label>
                                <Form.Control type="range" custom min="0" max="100" onChange={updateGasPrice} value={gasPrice}/>
                            </Form.Group>
                    
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="success" disabled={!recipientAddress} onClick={send}>Send</Button>
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

export const getServerSideProps = async (ctx) => {
  return {props: {}}
}

export default connect(mapStateToProps)(Wallet)