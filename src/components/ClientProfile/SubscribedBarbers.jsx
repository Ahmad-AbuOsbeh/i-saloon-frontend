import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { PersonAddDisabledOutlined, PersonOutline, RateReviewOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import css from '../barber/styles/subscriber.module.scss';
import { Rating } from '@material-ui/lab';
import instance, { url } from '../../API/axios';
import CreateReview from './reviews/CreateReview';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

//generate random number between 1 and 5
function getRandomInt() {
  return Math.random() * Math.floor(5);
}

function SubscribedBarbers() {
  const { id } = useParams();
  let role = useSelector((state) => state?.authReducer?.role);

  const [barbers, setBarbers] = useState([]);
  const [review, setReview] = useState({});
  useEffect(() => {
    fetchSubscribedBarbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSubscribedBarbers() {
    const response = await instance.get(`barber/subs/0/${id}`);
    setBarbers(response.data);
  }

  // Unsubscribe Handler
  async function unSubscribeHandler(barberId) {
    const response = await instance.delete(`/client/subs/${barberId}/${id}`);
    fetchSubscribedBarbers();
  }

  // const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  function handleClose() {
    setShowModal(false);
  }
  return (
    <div className={css.container}>
      <div className={css.head}>
        <h2>Subscribers </h2>
        <span>{barbers?.rows?.length} subscriber </span>
      </div>
      {barbers.rows?.map((sub) => (
        <div className={css.card} key={sub.user_name}>
          <div className={css.start}>
            <img src={sub.profile_pic} alt={sub.name} />
            <div>
              <h3>{sub.user_name}</h3>
              <span>{sub.city}</span>
            </div>
          </div>

          <div className={css.body}>
            <Rating name='read-only' value={barbers.average ? barbers.average.average : getRandomInt()} readOnly precision={0.1} />
            <small style={{ textAlign: 'center' }}>{barbers?.average?.count} Rating</small>
          </div>

          <div className={css.end}>
            {role === 'client' && (
              <>
                <IconButton onClick={() => unSubscribeHandler(sub.barber_id)} className={css.icon} size='large'>
                  <PersonAddDisabledOutlined />
                </IconButton>

                <IconButton
                  className={css.icon}
                  onClick={() => {
                    setReview(sub);
                    setShowModal(true);
                  }}
                  size='large'
                >
                  <RateReviewOutlined />
                </IconButton>
              </>
            )}
            <Link to={`/barber-Profile/${sub.barber_id}`}>
              <IconButton className={css.icon} size='large'>
                <i class='far fa-user-circle'></i>
              </IconButton>
            </Link>
          </div>
        </div>
      ))}
      {showModal && <CreateReview showModal={showModal} fetch={fetchSubscribedBarbers} review={review} handleClose={handleClose} setShowModal={setShowModal} />}
    </div>
  );
}
export default SubscribedBarbers;
