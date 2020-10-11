import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Link from 'next/link'

import Navbar from '../components/navbar';
import Walletbar from '../components/walletbar';

import { addContractSource } from '../store/contract/action'

import {Button, Container, Row, Col, Card, Form, ListGroup} from 'react-bootstrap'

export function Contracts({contracts, addContractSource, version}) {

    function importFromFile(e) {
        e.preventDefault();
        const name = e.target.files[0].name;
        const reader = new FileReader()
        reader.onload = async (e) => { 
          const text = (e.target.result)
            addContractSource({
                name,
                text
            });
        };
        reader.readAsText(e.target.files[0])
    }

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
                            </Card>
                        </Form>
                    </Col>
                    <Col sm={12} lg={6}>
                        <Form>
                            <Card style={{marginBottom: 10}}>
                                <Card.Header>
                                    Contracts
                                </Card.Header>
                                    <ListGroup>
                                        {Object.keys(contracts).sort().map(name => (
                                            <ListGroup.Item key={name}>
                                                 <Link href="/contract/[id]" as={`/contract/${name}`}>
                                                    <a>{`${name}`}</a>
                                                </Link>
                                                <ul className="fileList">
                                                    <li style={{fontSize: 11}}>Created: {new Date(contracts[name]?.loaded).toLocaleString()}</li>
                                                    <li style={{fontSize: 11}}>Source Size: {contracts[name]?.text?.length}</li>
                                                    <li style={{fontSize: 11}}>Compiled: {contracts[name]?.compiled ? 'true' : 'false'}</li>
                                                    <li style={{fontSize: 11}}>Deployed: {contracts[name]?.deployed ? 'true' : 'false'}</li>
                                                </ul>
                                            </ListGroup.Item>
                                        ))}
                                   </ListGroup>
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
      contracts: state.contract.filenames,
      version: state.contract.version,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addContractSource: bindActionCreators(addContractSource, dispatch),
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Contracts)