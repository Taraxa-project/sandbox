import { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Navbar from '../components/navbar';
import Walletbar from '../components/walletbar';

import { setReleases } from '../store/solidity/action'


import {Button, Container, Row, Col, Card, Form} from 'react-bootstrap'

import { ethers } from 'ethers'

export function Contract({balance = 0, solidityReleases, setReleases}) {
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

    useEffect(() => {
        fetch('https://solc-bin.ethereum.org/bin/list.json')
        .then(response => response.json())
        .then(data => {
            setReleases(data.releases)
            console.log('Updated state with solidity releases', data.releases);
        });
    }, [])

    return (
        <>
            <Navbar/>
            <Walletbar pageTitle={"Contract"}/>
            <Container className="content">
                <Row>
                    <Col sm={12} lg={6}>
                        <Form>
                            <Card style={{marginBottom: 10}}>
                                <Card.Header>
                                    Add a Smart Contract
                                </Card.Header>
                                <Card.Body>

                                    <Form.File id="formcheck-api-regular">
                                        <Form.File.Label>Select solidity contract:</Form.File.Label>
                                        <Form.File.Input onChange={importFromFile} accept=".sol"/>
                                    </Form.File>
                            
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="success">Load Smart Contract</Button>
                                </Card.Footer>
                            </Card>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
      solidityReleases: state.solidity.releases,
      balance: state.wallet.balance,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setReleases: bindActionCreators(setReleases, dispatch),
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Contract)