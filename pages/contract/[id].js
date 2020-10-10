import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {useState} from 'react';

import Link from 'next/link'

import Navbar from '../../components/navbar';
import Walletbar from '../../components/walletbar';

import {setSolidityVersion} from '../../store/solidity/action'

import {Button, Container, Row, Col, Card, Form, ListGroup, Nav} from 'react-bootstrap'

export async function getServerSideProps(context) {
    let props = {
        name: context.query.id
    };

    return {props}
}

export function Contract({name, contracts, solidityReleases, solidityVersion, setSolidityVersion, compiled, deployed}) {

    const [view, setView] = useState('source')

    function changeView(view) {
        setView(view)
    }

    function updateSolidityVersion(e) {
        const ver = e.target.value
        console.log('update solidity version', ver)
        setSolidityVersion(ver);
    }

    return (
        <>
            <Navbar/>
            <Walletbar pageTitle={name}/>
            <Container className="content">
                <Row>
                    <Col>
                        <h3 style={{paddingBottom: 10}}>{name}</h3>
                        <p>
                            Compiled: {compiled}<br/>
                            Deployed: {deployed}
                        </p>
                    </Col>
                </Row>
                <Row>
                   
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
                            value={contracts[name]?.text} readOnly/>

                        <div style={{
                            display: view === 'compile' ? 'block' : 'none',
                            marginBottom: 20
                        }}>
                            <Form>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">
                                        Solidity Version
                                    </Form.Label>
                                    <Col sm="2">
                                        <Form.Control id="selectSolidityVer" as="select" onChange={updateSolidityVersion} defaultValue={solidityVersion}>
                                            {Object.keys(solidityReleases).map(ver => (
                                                <option key={ver} value={ver}>{ver}</option>
                                            ))}
                                        </Form.Control>
                                        <br/>
                                        <Button>Compile</Button>
                                    </Col>
                                </Form.Group>
                            </Form>
                        </div>

                        <div style={{
                            display: view === 'deploy' ? 'block' : 'none',
                            marginBottom: 20
                        }}>
                            ...deployment stuff
                        </div>
                    </Col>

                    <Col xs={{order: 'last', cols: 12}} lg={{order: 'last', cols: 2}}>
                        Files:
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
                </Row>
            
            </Container>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
      solidityReleases: state.solidity.releases,
      solidityVersion: state.solidity.version,
      contracts: state.contract.sources,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      setSolidityVersion: bindActionCreators(setSolidityVersion, dispatch),
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(Contract)