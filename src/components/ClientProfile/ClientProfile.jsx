import { React, useEffect, useState } from 'react';
import ClientCard from './ClientCard';
import SubscribedBarbers from './SubscribedBarbers';
import BookedServices from './bookedServices';
import AccountSettings from './AccountSettings';
import instance from '../../API/axios';
import { useParams } from 'react-router';

const fields = ['user_name', 'password', 'gender', 'city', 'profile_pic', 'phone_num', 'email'];
export default function ClientProfile() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('bookedServices');
  const [client, setClient] = useState({});
  const [subscribedBarbers, setSubscribedBarbers] = useState([]);

  const { id } = useParams();
  async function fetchClient() {
    let res = await instance.get(`client/user/${id}`);
    setClient(res.data);
  }
  //generate random number between 1 and 20
  function getRandomInt() {
    return Math.floor(Math.random() * 20) + 1;
  }

  // fetch subscribed barbers
  async function fetchSubscribedBarbers() {
    const response = await instance.get(`barber/subs/0/${id}`);

    setSubscribedBarbers(response.data.rows);
  }
  useEffect(() => {
    fetchClient();
    fetchSubscribedBarbers();
  }, []);

  function changePick(e) {
    try {
      setActiveTab(e.target.id);
    } catch (err) {
      console.error(err);
    }
  }

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && <AccountSettings handleOpen={handleOpen} user={client} fields={fields} handleClose={handleClose} userType={'client'} showModal={showModal} setUser={setClient} />}
      <ClientCard info={client} getRandomInt={getRandomInt} subscribedBarbers={subscribedBarbers} changePick={changePick} active={activeTab} handleOpen={handleOpen} />
      {activeTab === 'bookedServices' ? <BookedServices /> : null}
      {activeTab === 'subscribedBarbers' ? <SubscribedBarbers /> : null}
    </>
  );
}
