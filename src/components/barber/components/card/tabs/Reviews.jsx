import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import css from '../../../styles/reviews.module.scss';
import { Link } from 'react-router-dom';
import instance, { url } from '../../../../../API/axios';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { ExpandMore, ExpandLess, DeleteForeverOutlined, EditOutlined } from '@material-ui/icons';

function Reviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const barberId = id;

  let role = useSelector((state) => state?.authReducer?.role);
  // console.log('roleee', role);
  const user_id = useSelector((state) => state?.authReducer?.user?.id);
  let clientId;
  role === 'client' ? (clientId = user_id) : (clientId = 0);
  // console.log('client id', clientId);

  useEffect(() => {
    fetchReviews();
  }, []);

  // fetch Reviews
  async function fetchReviews() {
    let response = await instance.get(`client/reviews/${barberId}`);
    console.log('response.data', barberId, response.data);
    setReviews(response.data);
  }

  // delete review
  async function deleteReview(reviewId) {
    const response = await instance.delete(`/client/reviews/${reviewId}`);
    fetchReviews();
  }
  return (
    <div className={css.container}>
      <h2>
        Reviews <span>{reviews.length} Review</span>
      </h2>
      {reviews.map((rev) => (
        <div className={css.card} key={rev.id}>
          <div className={css.top}>
            <div className={css.rightbox}>
              <span className={css.icon1}>
                <EditOutlined />
              </span>
              <span className={css.icon2}>
                <DeleteForeverOutlined onClick={() => deleteReview(rev.id)} />
              </span>
            </div>
            <img src={`${url}${rev.profile_pic}`} alt='' />
            <div className={css.info}>
              <h3>{rev.user_name ? rev.user_name : 'Anonymous'} </h3>
              <span>{rev.city} </span>
            </div>
          </div>

          <div className={css.rating}>
            <Rating name='read-only' value={rev.rate} readOnly />
          </div>

          <div className={css.body}>
            <p>{rev.description}</p>
          </div>

          <div className={css.bottom}>
            <span className={css.date}> reviewed on : {rev.date.substring(0, 10)}</span>

            {rev.user_name && (
              <Link to={`/my-profile/${rev.id}`}>
                <div>
                  <Button variant='outlined' style={{ color: '#a38350' }} size='small'>
                    <span> view profile </span> <AccountCircleOutlinedIcon />
                  </Button>
                </div>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Reviews;
