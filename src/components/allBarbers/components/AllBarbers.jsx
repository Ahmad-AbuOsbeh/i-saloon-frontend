import React, { useState, useEffect } from 'react';
import RatedCard from '../../home/RatedCard';
import styles from '../style/AllBarbers.module.css';
import { useSelector } from 'react-redux';
import instance, { url } from '../../../API/axios';

function AllBarbers({ allBarbers }) {
  const [clientSubscriptions, setClientSubscriptions] = useState([]);
  let role = useSelector((state) => state?.authReducer?.role);
  const id = useSelector((state) => state?.authReducer?.user?.id);
  let clientId;
  role === 'client' ? (clientId = id) : (clientId = 0);

  // fetch client subscriptions
  async function fetchClientSubscriptions() {
    let clientSubs = [];
    const response = await instance.get(`/barber/subs/0/${clientId}`);
    response.data.rows.map((sub) => clientSubs.push(sub.barber_id));
    setClientSubscriptions(clientSubs);
  }
  useEffect(() => {
    fetchClientSubscriptions();
  }, []);

  return (
    <div className={styles.container}>
      {allBarbers.map((barber) => (
        <RatedCard barber={barber} clientSubscriptions={clientSubscriptions} fetchClientSubscriptions={fetchClientSubscriptions} key={barber.id} />
      ))}
    </div>
  );
}

export default AllBarbers;
