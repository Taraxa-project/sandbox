import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {useState, useEffect} from 'react';

import Link from 'next/link'

import Navbar from '../../components/navbar';
import Walletbar from '../../components/walletbar';

import {setSolidityVersion, setReleases} from '../../store/solidity/action'
import {setContractCompiled} from '../../store/contract/action'

import {Button, Container, Row, Col, Card, Form, ListGroup, Nav} from 'react-bootstrap'

export async function getServerSideProps(context) {
    let props = {
        name: context.query.id
    };

    return {props}
}

export function Contract({name, contracts, solidityReleases, solidityVersion, setSolidityVersion, setReleases, setContractCompiled, contractState}) {

    const [view, setView] = useState('source')

    function changeView(view) {
        setView(view)
    }

    function updateSolidityVersion(e) {
        e.preventDefault()
        const ver = e.target.value
        setSolidityVersion(ver);
    }

    function compile(solidityVersion, name, source) {
        fetch('/api/compile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({solidityVersion, name, source})
        })
        .then(res => res.json())
        .then(compiled => {
            if (compiled.error) {
                alert(`Error compiling ${name} with ${solidityVersion}: ${compiled.error}`);
            } else {
                setContractCompiled(compiled);
            }
        })
        
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
            <Container className="content">
                <Row>
                    <Col>
                        <h4 style={{paddingBottom: 10, margin: 0}}>{name}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} lg={4}>
                            Compiled: <span style={{color: contracts[name]?.compiled ? 'green' : 'red'}}>
                            {contracts[name]?.compiled ? contracts[name].solidityVersion.replace(/\.js$/, '').replace(/^soljson-/, '') : 'false'}
                            </span>
                    </Col>
                    <Col>
                            Deployed: <span style={{color: contracts[name]?.deployed ? 'green' : 'red'}}>{contracts[name]?.deployed ? 'true' : 'false'}</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} lg={10}>
                        <Nav variant="pills" defaultActiveKey={view} style={{marginBottom: 20, marginTop: 20}}>
                            <Nav.Item>
                                <Nav.Link eventKey="source" onClick={(() => {changeView('source')})}>Source</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="compile" onClick={(() => {changeView('compile')})}>Compile</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="deploy" onClick={(() => {changeView('deploy')})} disabled={contracts[name]?.compiled ? false : true}>Deploy</Nav.Link>
                            </Nav.Item>
                        </Nav>

                        {/* Source */}
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

                        {/* Compile */}
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
                                        <Form.Control id="selectSolidityVer" as="select" onChange={updateSolidityVersion} value={solidityVersion}>
                                            <option value={''}>Select Version</option>
                                            {Object.keys(solidityReleases).map(ver => (
                                                <option key={ver} value={ver}>{ver}</option>
                                            ))}
                                        </Form.Control>
                                        <br/>
                                        <Button onClick={() => {compile(solidityReleases[solidityVersion], name, contracts[name].text)}} disabled={!solidityVersion}>Compile</Button>
                                    </Col>
                                </Form.Group>
                            </Form>
                        </div>

                        {/* Deploy */}
                        <div style={{
                            display: view === 'deploy' ? 'block' : 'none',
                            marginBottom: 20
                        }}>
                            <Card>
                                <Card.Header>
                                    Deployment Wallet
                                </Card.Header>
                                <Card.Body style={{paddingTop: 0}}>
                                    <Walletbar/>
                                </Card.Body>
                            </Card>

                            <Card style={{marginTop: 10}}>
                                <Card.Header>
                                    Deploy Contract
                                </Card.Header>
                                <Card.Body >
                                    Deploy contract to network
                                </Card.Body>
                            </Card>
                            
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
      contracts: state.contract.filenames,
      contractState: state.contract.version,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      setReleases: bindActionCreators(setReleases, dispatch),
      setSolidityVersion: bindActionCreators(setSolidityVersion, dispatch),
      setContractCompiled: bindActionCreators(setContractCompiled, dispatch),
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(Contract)