import {Button, Container, Row, Col, Card, ListGroup, ListGroupItem, InputGroup, FormControl, Form, Nav, Navbar} from 'react-bootstrap'
import Link from 'next/link'

import getConfig from 'next/config'

export default function Navigation() {

    const { publicRuntimeConfig } = getConfig()

    return (<>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
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

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <InputGroup className="mr-auto" style={{padding: 10}}>
                
            </InputGroup>
            
            <Nav style={{padding: 10}}>

                <Link href="/wallet" as={`/wallet`}>
                    <Nav.Link href="/wallet">Wallet</Nav.Link>
                </Link>

                <Link href="/contracts" as={`/contracts`}>
                    <Nav.Link href="/contracts">Contracts</Nav.Link>
                </Link>

                <Link href="/staking" as={`/staking`}>
                    <Nav.Link href="/staking">Staking</Nav.Link>
                </Link>

                <Nav.Link href={publicRuntimeConfig.NEXT_PUBLIC_EXPLORER_URL} target="explorer">Explorer</Nav.Link>
                <Nav.Link href={publicRuntimeConfig.NEXT_PUBLIC_EXPLORER_URL+'/faucet'}  target="explorer">Faucet</Nav.Link>

                <Link href="/settings" as={`/settings`}>
                    <Nav.Link href="/settings">Settings</Nav.Link>
                </Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
    </>
    )
}