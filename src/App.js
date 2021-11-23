import AllBarbers from './components/allBarbers';
import ClientProfile from './components/ClientProfile/ClientProfile';
import BarberProfile from './components/barber/BarberProfile';
import Home from './components/home/';
import Login from './components/auth/Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './components/nav';
import { useSelector } from 'react-redux';
import Footer from './components/footer';
import CheckOut from './components/checkout/CheckOut';
import { handleSignUp } from '../src/store/actions';
import { useDispatch } from 'react-redux';
import { React, useState, useEffect } from 'react';
import cookie from 'react-cookies';

function App() {
  const dispatch = useDispatch();
  //did mount
  useEffect(() => {
    const user = cookie.load('user');
    if (user) {
      dispatch(handleSignUp(user));
    }
  }, []);

  return (
    <>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>

          <Route exact path='/barber-Profile/:id'>
            <BarberProfile />
          </Route>

          <Route exact path='/all-barbers'>
            <AllBarbers />
          </Route>
          <Route exact path='/my-profile/:id' component={ClientProfile} />
          <Route exact path='/sign' component={Login} />
          <Route exact path='/checkout/:id' component={CheckOut} />
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
