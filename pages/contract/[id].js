import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {useState, useEffect} from 'react';
import { ethers } from 'ethers'

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

export function Contract({name, contracts, solidityReleases, solidityVersion, setSolidityVersion, setReleases, setContractCompiled, contractState, httpProvider, privateKey}) {

    const [view, setView] = useState('source')
    const [deploymentParams, setDeploymentParams] = useState({})

    async function deployContract(contractName, constructorParams, abi, bytecode) {
        try {
            const abiInputs = getConstructorInputs(contractName);
            const inputs = [];
            abiInputs.forEach(input => {
                inputs.push(constructorParams[input.name])
            })
            const provider = new ethers.providers.JsonRpcProvider(httpProvider);
            const account = new ethers.Wallet(privateKey)
            const wallet = account.connect(provider);
            const ContractFactory = ethers.ContractFactory;
    
            const factory = new ContractFactory(abi, bytecode, wallet)
    
            console.log('Deploy Contract', contractName, ...inputs);
            const deploymentTx = await factory.getDeployTransaction(...inputs);
            

            console.log('Deployment Tx', deploymentTx)
            // deploymentTx.from = wallet.address;
            // deploymentTx.to = wallet.address;
            // deploymentTx.nonce = 6;
            deploymentTx.value = 0;
            deploymentTx.chainId = 4444;
            // deploymentTx.gas = 21000;
            deploymentTx.gasPrice = 1e9;

            const txHex = ethers.utils.serializeTransaction( deploymentTx );
            console.log('Serialized tx', txHex);

            const gasEstimate = await wallet.estimateGas(deploymentTx);
            console.log('Gas Estimate', gasEstimate);
            // deploymentTx.gasLimit = gasEstimate;
            deploymentTx.gasLimit = 3000000;

            const sentTransaction = await wallet.sendTransaction(deploymentTx);

            updateDeploymentParams(contractName, {})

            console.log('Deployed Contract', sentTransaction)
            alert('Transaction hash: '+ sentTransaction.hash);

        } catch (e) {
            console.error(e);
            alert(e.message)
        }
    }

    function updateDeploymentParams(contractName, params) {
        setDeploymentParams(prevState => {
            const o = {};
            //todo: validate and convert types
            o[contractName] = params;
            return Object.assign({}, params);
        })
    }

    function updateDeploymentParam(contractName, name, type, value) {
        setDeploymentParams(prevState => {
            const o = {};
            o[contractName] = o[contractName] || {}
            //todo: validate and convert types
            o[contractName][name] = value;
            console.log('Set', o)
            return Object.assign({}, prevState, o);
        })
    }

    function changeView(view) {
        setView(view)
    }

    function updateSolidityVersion(e) {
        e.preventDefault()
        const ver = e.target.value
        setSolidityVersion(ver);
    }

    function compile(solidityVersion, name, source) {
        console.log('Compile contract', solidityVersion, name, source)
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
                console.log('Set contract compiled', compiled);
                setContractCompiled(compiled);
                setView('deploy');
            }
        })
        
    }

    function getConstructorInputs (contractName) {
        const meta = contracts[name]?.compiled[contractName]?.abi?.filter(abiFunction => abiFunction.type === 'constructor')[0] || [];
        return meta.inputs;
    }

    useEffect(() => {
        if (Object.keys(solidityReleases).length === 0) {
            fetch('https://solc-bin.ethereum.org/bin/list.json')
            .then(response => response.json())
            .then(data => {
                setReleases(data.releases)
            });
        }

        if (contracts[name]?.compiled) {
            setView('deploy');
        }
        
    }, [name, contracts])


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
                </Row>
                <Row>
                    <Col xs={12} lg={9}>
                        <Nav variant="pills" activeKey={view} style={{marginBottom: 20, marginTop: 20}}>
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
                                    Compiled Contracts
                                </Card.Header>
                                <ListGroup variant="flush">
                                    {Object.keys(contracts[name]?.compiled || {}).map(contractName => (
                                        <ListGroup.Item key={contractName}>
                                            <Form>
                                                <Form.Group as={Row} style={{marginBottom: 0}}>
                                                    <Form.Label column xs="12">
                                                        <div>{contractName}</div>
                                                    </Form.Label>
                                                    <Col xs="12">
                                                        <span style={{fontSize: 11}}>
                                                            Bytecode:
                                                        </span>
                                                        <textarea 
                                                            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                                                            style={{
                                                                fontSize: 12, 
                                                                fontFamily: 'courier', 
                                                                width: '100%', 
                                                                minHeight: 140, 
                                                                borderWidth: 1, 
                                                                borderColor: '#eee', 
                                                                borderStyle: 'solid', 
                                                                padding: 10,
                                                                marginBottom: 20,
                                                                whiteSpace: 'pre'
                                                        }} 
                                                        value={JSON.stringify(contracts[name]?.compiled[contractName]?.evm?.bytecode, null, 2)} readOnly/>

                                                        <span style={{fontSize: 11}}>
                                                            ABI:
                                                        </span>
                                                        <textarea 
                                                            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                                                            style={{
                                                                fontSize: 12, 
                                                                fontFamily: 'courier', 
                                                                width: '100%', 
                                                                minHeight: 200, 
                                                                borderWidth: 1, 
                                                                borderColor: '#eee', 
                                                                borderStyle: 'solid', 
                                                                padding: 10,
                                                                marginBottom: 20,
                                                                whiteSpace: 'pre'
                                                            }} 
                                                            value={JSON.stringify(contracts[name]?.compiled[contractName]?.abi || {}, null, 2)} readOnly/>
                                                    </Col>
                                                </Form.Group>
                                                   {getConstructorInputs(contractName).map(input => (
                                                                <Form.Group as={Row} key={input.name}>
                                                                    <Form.Label column xs="2" style={{fontSize: 11}}>{input.name} ({input.type})</Form.Label>
                                                                    <Col xs="10">
                                                                        <Form.Control type="text" placeholder="" value={deploymentParams[contractName] && deploymentParams[contractName][input.name] || ''} onChange={((e) => {
                                                                            e.preventDefault();
                                                                            updateDeploymentParam(contractName, input.name, input.type, e.target.value)
                                                                        })}/>
                                                                    </Col>
                                                                </Form.Group>
                                                            )
                                                        )
                                                    }
                                                    <Col xs="2">
                                                        <Button onClick={() => {
                                                            deployContract(contractName, deploymentParams[contractName], contracts[name]?.compiled[contractName]?.abi, contracts[name]?.compiled[contractName]?.evm?.bytecode)
                                                        }}>Deploy</Button>
                                                    </Col>
                                            </Form>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                            
                        </div>
                    </Col>

                    <Col xs={{order: 'last', cols: 12}} lg={{order: 'last', cols: 3}}>
                        All Files:
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
      privateKey: state.wallet.privateKey,
      httpProvider: state.provider.http,  
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      setReleases: bindActionCreators(setReleases, dispatch),
      setSolidityVersion: bindActionCreators(setSolidityVersion, dispatch),
      setContractCompiled: bindActionCreators(setContractCompiled, dispatch),
    }
}

export const getServerSideProps = async (ctx) => {
    return {props: {}}
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Contract)