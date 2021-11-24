import { React, useState } from 'react';
import styles from './style/recom.module.css';
import instance, { url } from '../../API/axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function RatedCard({ barber, clientSubscriptions, fetchClientSubscriptions }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  let role = useSelector((state) => state?.authReducer?.role);
  const id = useSelector((state) => state?.authReducer?.user?.id);
  let clientId;
  role === 'client' ? (clientId = id) : (clientId = 0);

  // subscribe handler
  async function subscribeHandler(barberId) {
    const response = await instance.post(`/client/subs`, { clientId, barberId });
    fetchClientSubscriptions();
    setIsSubscribed(true);
  }

  // Unsubscribe Handler
  async function unSubscribeHandler(barberId) {
    const response = await instance.delete(`/client/subs/${barberId}/${clientId}`);
    fetchClientSubscriptions();
    setIsSubscribed(false);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.imgArea}>
        <div className={styles.innerArea}>
          <img src={`${barber.profile_pic}`} alt='' />
        </div>
      </div>
      <div className={`${styles.icon} ${styles.arrow}`}>
        <i className='fas fa-arrow-left'></i>
      </div>
      <div className={`${styles.icon} ${styles.dots}`}>
        <i className='fas fa-ellipsis-v'></i>
      </div>
      <div className={styles.name}>{barber.user_name}</div>
      <div className={styles.about}>{barber.city}</div>
      <div className={styles.socialIcons}>
        <a href='#' className={styles.fb}>
          <i className='fab fa-facebook-f'></i>
        </a>
        <a href='#' className={styles.twitter}>
          <i className='fab fa-twitter'></i>
        </a>
        <a href='#' className={styles.insta}>
          <i className='fab fa-instagram'></i>
        </a>
        <a href='#' className={styles.yt}>
          <i className='fab fa-youtube'></i>
        </a>
      </div>
      <div className={styles.buttons}>
        <Link to={`/barber-Profile/${barber.id}`}>
          <button>Visit Profile</button>
        </Link>

        {clientSubscriptions.includes(barber.id) ? (
          <button
            onClick={() => {
              unSubscribeHandler(barber.id);
            }}
          >
            UnSubscribe
          </button>
        ) : (
          <button
            onClick={() => {
              subscribeHandler(barber.id);
            }}
          >
            Subscribe
          </button>
        )}
      </div>
    </div>
  );
}

export default RatedCard;
