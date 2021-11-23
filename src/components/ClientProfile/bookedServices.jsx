import React, { useState, useEffect } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from '../barber/styles/services.module.scss';
import instance from '../../API/axios';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

function BookedServices() {
  const [bookedServices, setBookedServices] = useState([]);
  const [prop, setProp] = useState([]);
  const { id } = useParams();
  const role = useSelector((state) => state?.authReducer?.role);

  // fetch booked services
  async function fetchBookedServices() {
    const response = await instance.get(`barber/queue/get/0/${id}/0`);
    setBookedServices(response.data);
  }

  // Did Mount
  useEffect(() => {
    // get bookedServices from backend
    fetchBookedServices();
  }, []);

  // handle Hide
  function handleHide(name) {
    if (prop.includes(name)) return setProp(() => prop.filter((desName) => desName !== name));
    setProp([...prop, name]);
  }

  // Delete Service handler
  function clientDeleteServiceHandler(service) {
    // delete service from backend
  }

  return (
    <div className={styles.outerContainer}>
      <h2>
        Booked Services <span>{bookedServices.length} Services</span>
      </h2>

      {bookedServices.length &&
        bookedServices?.map((ser) => (
          <div className={styles.container} key={ser.service_name}>
            <div className={!prop.includes(ser.service_name) ? styles.wrapper : styles.wrapper2}>
              <img src={ser.profile_pic} alt='' />
              <p>{ser.service_name}</p>
              <p>{ser.estimated_time} min</p>
              <div className={styles.btn}>
                <span onClick={() => handleHide(ser.service_name)}>more</span> &nbsp;
                <div>
                  {!prop.includes(ser.service_name) ? (
                    <ExpandMoreIcon onClick={() => handleHide(ser.service_name)} style={{ fontSize: 40 }} />
                  ) : (
                    <ExpandLessIcon onClick={() => handleHide(ser.service_name)} style={{ fontSize: 40 }} />
                  )}
                </div>
              </div>
              <p>{ser.price} JD</p>
              <div className={styles.deleteBtn}>{role === 'client' && <DeleteIcon onClick={() => clientDeleteServiceHandler(ser.service_id)} />}</div>
            </div>

            <div className={!prop.includes(ser.service_name) ? styles.hidden : styles.wrapper4}>
              <h5>
                <span>Barber Name:</span> {ser.user_name}
              </h5>
              <h5>
                <span>Service Date:</span> {ser.time.split(' ')[1]}
              </h5>
              <h5>
                <span>Service Time:</span> {ser.time.split(' ')[0]}
              </h5>
              <p>{ser.description}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default BookedServices;
