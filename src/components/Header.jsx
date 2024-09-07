import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import patrimoinePic from './../assets/patrimoine.jpg'
import possessionPic from './../assets/possession.jpg'


const App = () => {
  return (
    <div>
      <Navbar bg="success" variant="dark" className='d-flex justify-content-center'>
        <Navbar.Brand href="/" className='fs-2 fw-bolder'>PatriMan</Navbar.Brand>
        {/* <Nav className="mr-auto">
          <LinkContainer to="/patrimoine">
            <Nav.Link>Patrimoine</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/possession">
            <Nav.Link>Possessions</Nav.Link>
          </LinkContainer>
        </Nav> */}
      </Navbar>
      <div className="container mt-4 d-flex justify-content-evenly align-center">
        <Card style={{ width: '19rem', height: '75vh', border: "1px solid black"}}>
          <Card.Img variant="top" src={patrimoinePic}/>
          <Card.Body className='container'>
            <Card.Title className='container mt-1'>Patrimoine</Card.Title>
            <Card.Text className='container'>
              "Prenez le contrôle de votre avenir financier dès aujourd'hui en commençant à gérer activement votre patrimoine !"
            </Card.Text>
            <LinkContainer to="patrimoine">
              <Button variant="success" className='container'>
               Stat graphique
              </Button>
            </LinkContainer>
          </Card.Body>
        </Card>

        <Card style={{ width: '19rem',  height: '75vh', border: "1px solid black" }}>
          <Card.Img variant="top" src={possessionPic} />
          <Card.Body>
            <Card.Title>Possessions</Card.Title>
            <Card.Text>
              "Consultez vos possessions dès maintenant pour avoir une vue d'ensemble précise de votre patrimoine !" </Card.Text>
            <LinkContainer to="possession">
              <Button variant="success" className='container'>
              Voir possession
              </Button>
            </LinkContainer>
          </Card.Body>
        </Card>

      </div>
    </div>
  );
};

export default App;
