import Navbar from '../../components/navbar';
import Walletbar from '../../components/walletbar';

import {useState} from 'react';

import { connect } from 'react-redux'

import Link from 'next/link'

import {Button, Container, Row, Col, Card, Form, ListGroup, Nav} from 'react-bootstrap'

export async function getServerSideProps(context) {
    let props = {
        name: context.query.id
    };

    return {props}
}

export function Contract({name, contracts, solidityReleases}) {

    const [view, setView] = useState('source')

    function changeView(view) {
        setView(view)
    }

    return (
        <>
            <Navbar/>
            <Walletbar pageTitle={name}/>
            <Container className="content">
                <Row>
                    <Col xs={{order: 'last', col: 12}} lg={{order: 'first', col: 2}}>
                        <ListGroup>
                            {Object.keys(contracts).sort().map(contractName => (
                                <ListGroup.Item key={contractName} active={contractName === name}>
                                    {contractName === name ? contractName : ( <Link href="/contract/[id]" as={`/contract/${contractName}`}>
                                        <a>{`${contractName}`}</a>
                                    </Link>)}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col xs={12} lg={10}>
                        <Nav variant="pills" defaultActiveKey={view} style={{marginBottom: 20}}>
                            <Nav.Item>
                                <Nav.Link eventKey="source" onClick={(() => {changeView('source')})}>Source</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="compile" onClick={(() => {changeView('compile')})}>Compile</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="deploy" onClick={(() => {changeView('deploy')})}>Deploy</Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <textarea 
                            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                            style={{
                                fontSize: 14, 
                                fontFamily: 'courier', 
                                width: '100%', 
                                minHeight: 550, 
                                borderWidth: 1, 
                                borderColor: '#eee', 
                                borderStyle: 'solid', 
                                padding: 10,
                                display: view === 'source' ? 'block' : 'none',
                                marginBottom: 20
                            }} 
                            value={contracts[name]?.text}/>

                        <div style={{
                            display: view === 'compile' ? 'block' : 'none',
                            marginBottom: 20
                        }}>
                            <Form.Group as={Row} controlId="solidityChooser">
                                <Form.Label column sm="2">
                                    Solidity Version
                                </Form.Label>
                                <Col sm="2">
                                    <Form.Control as="select">
                                        {Object.keys(solidityReleases).map(ver => (
                                            <option key={ver} value={ver}>{ver}</option>
                                        ))}
                                        
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </div>

                        <div style={{
                            display: view === 'deploy' ? 'block' : 'none',
                            marginBottom: 20
                        }}>
                            ...deployment stuff
                        </div>
                    </Col>
                </Row>
            
            </Container>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
      solidityReleases: state.solidity.releases,
      contracts: state.contract.sources,
    }
}
  
export default connect(mapStateToProps)(Contract)