import { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Link from 'next/link'

import Navbar from '../components/navbar';
import Walletbar from '../components/walletbar';

import { setReleases } from '../store/solidity/action'
import { addContractSource } from '../store/contract/action'

import {Button, Container, Row, Col, Card, Form} from 'react-bootstrap'

import { ethers } from 'ethers'

export function Contracts({balance = 0, contracts, solidityReleases, setReleases, addContractSource}) {

    function importFromFile(e) {
        e.preventDefault();
        const name = e.target.files[0].name;
        const reader = new FileReader()
        reader.onload = async (e) => { 
          const text = (e.target.result)
          try {
            addContractSource({
                name,
                text
            });
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
        });
    }, [])

    return (
        <>
            <Navbar/>
            <Walletbar pageTitle={"Contracts"}/>
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
                    <Col sm={12} lg={6}>
                        <Form>
                            <Card style={{marginBottom: 10}}>
                                <Card.Header>
                                    Contracts
                                </Card.Header>
                                <Card.Body>
                                    <ul className="fileList">
                                        {Object.keys(contracts).sort().map(name => (
                                            <li key={name}>
                                                 <Link href="/contract/[id]" as={`/contract/${name}`}>
                                                    <a>{`${name}`}</a>
                                                </Link>
                                                <ul>
                                                    <li style={{fontSize: 11}}>Created: {new Date(contracts[name]?.loaded).toLocaleString()}</li>
                                                    <li style={{fontSize: 11}}>Source Size: {contracts[name]?.text?.length}</li>
                                                    <li style={{fontSize: 11}}>Compiled: {contracts[name]?.compiled ? 'true' : 'false'}</li>
                                                    <li style={{fontSize: 11}}>Deployed: {contracts[name]?.deployed ? 'true' : 'false'}</li>
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                               
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
      contracts: state.contract.sources,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setReleases: bindActionCreators(setReleases, dispatch),
        addContractSource: bindActionCreators(addContractSource, dispatch),
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Contracts)