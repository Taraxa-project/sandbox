import Navbar from '../components/navbar';

import {Button, Container, Row, Col, Card, ListGroup, ListGroupItem, InputGroup, FormControl, Form} from 'react-bootstrap'

export default function Contract({balance = 0}) {

    return (
        <>
            <Navbar/>
            <Container className="content">
          <Row>
            <Col xs={6}>
                <h2>Contract</h2>
            </Col>
            <Col xs={6}>
                
                    <Row>
                        <Col xs={12} style={{fontSize: 14, marginRight: 5}}>
                            <div className="text-right">
                                <span style={{width: 60, display: 'inline-block', textAlign: 'left'}}>Balance:</span> {balance.toLocaleString()} TARA
                            </div>
                        </Col>
                        <Col xs={12} style={{fontSize: 14, marginBottom: 10, marginRight: 5}}>
                            <div className="text-right">
                                <span style={{width: 60, display: 'inline-block', textAlign: 'left'}}>Stake:</span> {0} TARA
                            </div>
                        </Col>
                    </Row>
               
            </Col>
                   
          </Row>
          <Row>
            <Col sm={12} lg={6}>
                <Form>
                    <Card style={{marginBottom: 10}}>
                        <Card.Header>
                        Add a Smart Contract
                        </Card.Header>
                        <Card.Body>
                            <Form.Group controlId="contract.depositGas">
                                <Form.Control type="number" placeholder="Deposit Gas (optional)" />
                            </Form.Group>
                            <Form.Group controlId="contract.gasLimit">
                                <Form.Control type="number" min="0" placeholder="Gas Limit" />
                            </Form.Group>

                            <Form.File id="formcheck-api-regular">
                                <Form.File.Label>Select contract file:</Form.File.Label>
                                <Form.File.Input />
                            </Form.File>
                    
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="success">Upload Smart Contract</Button>
                        </Card.Footer>
                    </Card>
                </Form>
            </Col>
          </Row>
      </Container>
        </>
    )
}