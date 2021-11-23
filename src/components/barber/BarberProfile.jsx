import React, { useState, useEffect } from 'react';
import Card from './components/card/Card';
import Queues from '../queue/Queues';
import Services from './components/card/tabs/Services';
import Media from './components/Media';
import Products from './components/card/tabs/Products';
import Reviews from './components/card/tabs/Reviews';
import Subscribers from './components/card/tabs/Subscribers';
import ServiceButton from './components/services/ServiceButton';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';
import instance from '../../API/axios';


function BarberProfile() {
  let { id } = useParams();
  if (id === '1') {
    //default value for barber
    // id = 27;
  }
  const [tab, setTab] = useState('services');
  const [user, setUser] = useState({});
  const role = 'barber';

  // fetch barber
  async function fetchBarber() {
    const response = await instance.get(`/barber/user/${id}`);
    setUser(response.data);
  }

  // did mount
  useEffect(() => {
    fetchBarber();
  }, [id]);

  function changePick(e) {
    try {
      setTab(e.target.id);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <Card setUser={setUser} barberId={id} info={user} changePick={changePick} active={tab} />

      {/* <Queues /> */}

      {tab === 'queues' ? <Queues /> : tab === 'services' ? <Services barberId={id} /> : tab === 'products' ? <Products /> : tab === 'reviews' ? <Reviews /> : <Subscribers role={role} />}

      <Media />
    </div>
  );
}

export default BarberProfile;
