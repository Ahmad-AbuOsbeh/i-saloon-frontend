import React, { useState, useEffect } from 'react';
import css from '../barber/styles/booking.module.scss';
import { AddCircleOutlineOutlined, AddCircleOutlined } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import instance, { url } from '../../API/axios';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';
import BookModal from '../checkout/BookModal';

function CheckOut() {
  let { id } = useParams();

  const [listOfServices, setListOfServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);

  function addToCart(ser) {
    if (cart.filter((e) => e.id === ser.id).length > 0) {
      setCart(cart.filter((item) => item.id !== ser.id));
      setTotal(total - ser.price);
      return;
    }
    setCart([...cart, ser]);
    setTotal(total + ser.price);
  }

  // fetch servicess
  async function fetchServices() {
    const services = await instance.get(`/barber/services/0/${id}`);
    setListOfServices(services.data.rows);
  }

  // fetch barber
  async function fetchBarber() {
    const response = await instance.get(`/barber/user/${id}`);
    console.log('user', response.data);
    setUser(response.data);
  }

  useEffect(() => {
    fetchServices();
    fetchBarber();
  }, []);

  //handleClose
  function handleClose() {
    setShowModal(false);
  }

  return (
    <div className={css.container}>
      <h2>Choose Services</h2>
      <div className={css.checkOut}>
        <div className={css.services}>
          {listOfServices.map((ser) => (
            <div className={css.card} key={ser.service_name}>
              <div onClick={() => addToCart(ser)}>{cart.filter((e) => e.id === ser.id).length > 0 ? <AddCircleOutlined /> : <AddCircleOutlineOutlined />}</div>
              <div>
                <h4>{ser.service_name}</h4>
                <span>{ser.estimated_time} min</span>
              </div>
              <div>
                <span>{ser.price} JD</span>
              </div>
            </div>
          ))}
        </div>

        <div className={css.bill}>
          <div className={css.pic}>
            <img src={user?.profile_pic} alt='' />
          </div>
          <div className={css.text}>
            <h5>{user?.shop_name}</h5>
            <span>{user?.address}</span>
          </div>
          {cart.length > 0 &&
            cart.map((ser) => (
              <div key={ser.service_name} className={css.selectedService}>
                <div>
                  <span>{ser.service_name}</span>
                  <span>{ser.estimated_time} min</span>
                </div>
                <span>{ser.price} JD</span>
              </div>
            ))}
          <span>Total: {total} JD</span>
          <Button
            size='small'
            onClick={() => {
              setShowModal(true);
            }}
            className={css.btn}
            variant='outlined'
          >
            Date
          </Button>
          {showModal && <BookModal showModal={showModal} handleClose={handleClose} barberId={id} cart={cart} />}
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
