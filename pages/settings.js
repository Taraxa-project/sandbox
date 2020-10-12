import { useEffect, useRef, useState } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Link from 'next/link'
import Router from 'next/router'

import styles from '../styles/Login.module.css'

import {Button, Container, Row, Col, Card, ListGroup, ListGroupItem, Form, Navbar} from 'react-bootstrap'

import { ethers } from 'ethers'
import { setMnemonic } from '../store/key/action'
import { setAddress, setPath, setPrivateKey } from '../store/wallet/action'

import { setHttpProvider } from '../store/provider/action'

export function Login({mnemonic, address, privateKey, path, httpProvider, setHttpProvider, setMnemonic, setPath, setPrivateKey, setAddress}) {
    const inputFile = useRef(null) 
    const [newMnemonic, setNewMnemonic] = useState(mnemonic);
    const [newPath, setNewPath] = useState(path);
    const [newAddress, setNewAddress] = useState(address);
    const [newPrivateKey, setNewPrivateKey] = useState(privateKey);
    const [newHttpProvider, setNewHttpProvider] = useState(httpProvider);

    function createNewMnemonic() {
      const wallet = ethers.Wallet.createRandom();
      setNewMnemonic(wallet.mnemonic.phrase);
      setNewPath(wallet.mnemonic.path);
      setNewPrivateKey(wallet.privateKey);
      setNewAddress(wallet.address);
    }

    function importFromFile(e) {
        e.preventDefault();
        const reader = new FileReader()
        reader.onload = async (e) => { 
          const text = (e.target.result)
          try {
            const newWallet = ethers.Wallet.fromMnemonic(text);
            setNewMnemonic(text);
          } catch (e) {
              alert('Could not import key: ' + e.message);
          }
        };
        reader.readAsText(e.target.files[0])
    }

    function onUploadClick() {
        // `current` points to the mounted file input element
        inputFile.current.click();
    }

    function updateHttpProvider(e) {
        setNewHttpProvider(e.target.value)
    }

    function login() {
        setHttpProvider(newHttpProvider);
        setMnemonic(newMnemonic);
        setPath(0);
        setPrivateKey(newPrivateKey);
        setAddress(newAddress);
        Router.push('/wallet')
    }

    useEffect(() => {
        if(!newMnemonic) {
            createNewMnemonic();
        }
    })

  return (
    <div className={styles.container}>
      <Navbar bg="dark" variant="dark">
        <Link href="/" as={`/`}>
            <Navbar.Brand href="/">
                <img
                alt=""
                src="/taraxa_logo.png"
                width="106"
                height="32"
                className="d-inline-block align-top"
                style={{marginBottom: '9px'}}
                />{' '}
            </Navbar.Brand>
        </Link>
      </Navbar>

      <Container className="content">
          <Row className="align-items-center">
            <Col sm={12} lg={5}>
              <div style={{width: 360, marginLeft: 'auto', marginRight: 'auto'}}>
                <h2>Welcome to Taraxa Sandbox</h2>
                  <p>Please enter your wallet's private key, and <br/>
                  Taraxa Explorer API address to continue.</p>
              </div>
            </Col>
            <Col>
            <Card>
              <Card.Header>
                Login
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group controlId="loginForm.privateKey">
                    <Form.Label>Mnemonic Phrase</Form.Label>
                    <Form.Control as="textarea" rows="3" value={newMnemonic} readOnly/>
                  </Form.Group>
                  <Button variant="outline-dark" onClick={createNewMnemonic} style={{margin: 5}}>Generate New Phrase</Button>{' '}
                  <Button variant="outline-dark" onClick={onUploadClick} style={{margin: 5}}>Import from a file</Button>{' '}
                  <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={importFromFile}/>
                  <Button variant="outline-dark" href={"data:text/plain,"+encodeURIComponent(newMnemonic)} download={'taraxa_mnemonic.txt'} style={{margin: 5}}>Download Phrase</Button>
                  <br/><br/>
                  <Form.Group controlId="loginForm.httpAPI">
                    <Form.Label>HTTP API</Form.Label>
                    <Form.Control type="text" placeholder="http://localhost:7777" value={newHttpProvider} onChange={updateHttpProvider}/>
                  </Form.Group>
                  <br/>
                  <Button variant="success" onClick={login}>Login</Button>
                </Form>
              </Card.Body>
            </Card>
            </Col>
          </Row>
      </Container>
    </div>
  )
}

const mapStateToProps = (state) => {
    return {
      address: state.wallet.address,
      path: state.wallet.path,
      privateKey: state.wallet.privateKey,
      mnemonic: state.key.mnemonic,
      httpProvider: state.provider.http,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setHttpProvider: bindActionCreators(setHttpProvider, dispatch),
        setMnemonic: bindActionCreators(setMnemonic, dispatch),
        setPath: bindActionCreators(setPath, dispatch),
        setPrivateKey: bindActionCreators(setPrivateKey, dispatch),
        setAddress: bindActionCreators(setAddress, dispatch),
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Login)