import {Button, Container, Row, Col, Card, ListGroup, ListGroupItem, InputGroup, FormControl, Form, Nav, Navbar} from 'react-bootstrap'
import Link from 'next/link'

export default function Navigation() {

    const explorerUrl = process.env.NEXT_PUBLIC_EXPLORER_URL || 'http://localhost:3000'

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

                <Link href="/contract" as={`/contract`}>
                    <Nav.Link href="/contract">Contract</Nav.Link>
                </Link>

                <Link href="/validator" as={`/validator`}>
                    <Nav.Link href="/validator">Validator</Nav.Link>
                </Link>

                <Nav.Link href={explorerUrl}>Explorer</Nav.Link>
                <Nav.Link href={explorerUrl+'/faucet'}>Faucet</Nav.Link>

                <Link href="/settings" as={`/settings`}>
                    <Nav.Link href="/settings">Settings</Nav.Link>
                </Link>
                
                <Link href="/logout" as={`/logout`}>
                    <Nav.Link href="/logout">Logout</Nav.Link>
                </Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
    </>
    )
}