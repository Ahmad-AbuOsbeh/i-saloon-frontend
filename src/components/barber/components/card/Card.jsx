import React, { useState, useEffect } from 'react';
import { Grade, MenuBookOutlined, SubscriptionsOutlined, LocalGroceryStoreOutlined, RateReviewOutlined } from '@material-ui/icons';
import styles from '../../styles/card.module.css';
import AccountSettings from '../../../ClientProfile/AccountSettings';
import instance, { url } from '../../../../API/axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FcOvertime } from 'react-icons/fc';

function Card({ info, changePick, active, setUser, barberId }) {
  const role = useSelector((state) => state?.authReducer?.role);
  const isloggedIn = useSelector((state) => state?.authReducer?.isLoggedIn);
  const userId = useSelector((state) => state?.authReducer?.user?.id);
  let clientId = userId;
  const barberIds = Number(barberId);
  let { id } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [clientSubscriptions, setClientSubscriptions] = useState([]);
  const [barberSubscribers, setbarberSubscribers] = useState([]);
  const [rating, setrating] = useState(0);
  const [randomSubs, setrandomSubs] = useState(0);

  // fetch client subscriptions
  async function fetchClientSubscriptions() {
    let clientSubs = [];
    const response = await instance.get(`/barber/subs/0/${clientId}`);
    response.data.rows.map((sub) => clientSubs.push(sub.barber_id));
    setClientSubscriptions(clientSubs);
  }
  //fetch Subscribers
  async function fetchSubscribers() {
    const response = await instance.get(`/barber/subs/${id}/0`);
    setbarberSubscribers(response.data.rows);
  }
  // did mount
  useEffect(() => {
    fetchClientSubscriptions();
    fetchSubscribers();
    //info?.rating ? info.rating : randomNumbers('rating')
    setrating(randomNumbers('rating'));
    setrandomSubs(randomNumbers('subscribers'));
  }, []);

  // subscribe handler
  async function subscribeHandler(barberId) {
    const response = await instance.post(`/client/subs`, { clientId, barberId });
    fetchClientSubscriptions();
  }

  // Unsubscribe Handler
  async function unSubscribeHandler(barberId) {
    const response = await instance.delete(`/client/subs/${barberId}/${clientId}`);
    fetchClientSubscriptions();
  }

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  function randomNumbers(type) {
    if (type === 'rating') return (Math.random() * 5).toFixed(2);

    if (type === 'subscribers') return Math.round(Math.random() * 1000);
  }

  const fields = ['user_name', 'age', 'gender', 'city', 'address', 'profile_pic', 'phone_num', 'holidays', 'shop_name', 'shop_gender', 'state', 'id'];
  const visibility = userId === Number(barberId) ? 'none' : 'inline';

  return (
    <div className={styles.container}>
      <div className={styles.innerwrap}>
        <section className={`${styles.section1} ${styles.clearfix}`}>
          <div>
            <div className={`${styles.row} ${styles.grid} ${styles.clearfix}`}>
              {role === 'barber' && userId === barberIds && isloggedIn && (
                <div className={styles.edit} onClick={() => handleOpen()}>
                  <i class='far fa-edit'></i>
                </div>
              )}
              <div className={`${styles.col2} ${styles.first}`}>
                <img src={info.profile_pic} alt='' />
                <h1 style={{ color: '#f2f2f2' }}>{`${info.user_name}`}</h1>

                {role === 'client' && (
                  <>
                    {clientSubscriptions.includes(Number(barberId)) ? (
                      <span
                        style={{ display: visibility }}
                        onClick={() => {
                          unSubscribeHandler(info.id);
                        }}
                      >
                        UnSubscribe
                      </span>
                    ) : (
                      <span
                        style={{ display: visibility }}
                        onClick={() => {
                          subscribeHandler(info.id);
                        }}
                      >
                        Subscribe
                      </span>
                    )}
                  </>
                )}
                <div className={styles.infoData}>
                  <h3>
                    {' '}
                    <h3>Shop : </h3> {info.shop_name}
                  </h3>
                  <h3>
                    {' '}
                    <h3>Address : </h3> {info.address}
                  </h3>
                  <h3>
                    {' '}
                    <h3>Mobile : </h3> {info.phone_num}
                  </h3>
                </div>
              </div>

              <div className={`${styles.col2} ${styles.last}`}>
                <div className={`${styles.grid} ${styles.clearfix}`}>
                  <div className={`${styles.col3} ${styles.first}`}>
                    <h1>
                      {rating} &nbsp; <Grade className={`${styles.star}`} style={{ fontSize: 31 }} />
                    </h1>
                    <span>Rating</span>
                  </div>
                  <div className={`${styles.col3}`}>
                    <h1>{barberSubscribers.length ? barberSubscribers.length : randomSubs}</h1>
                    <span>Subscribers</span>
                  </div>
                  <div className={`${styles.col3} ${styles.last}`}>
                    <h3>{info.working_hours}</h3>
                    <span>Working Hours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.row} ${styles.clearfix}`}>
              <ul className={`${styles.row2tab} ${styles.clearfix}`}>
                <li onClick={changePick} id='queues' className={active === 'queues' ? styles.pick : ''}>
                  <div className={styles.icon}>
                    <FcOvertime onClick={changePick} id='queues' style={{ fontSize: 25 }} />
                    <span onClick={changePick} id='queues' style={{ marginLeft: '10px' }}>
                      Queues
                    </span>
                  </div>
                </li>

                <li onClick={changePick} id='services' className={active === 'services' ? styles.pick : ''}>
                  <div className={styles.icon}>
                    <MenuBookOutlined onClick={changePick} id='services' style={{ fontSize: 25 }} />{' '}
                    <span onClick={changePick} id='services' style={{ marginLeft: '10px' }}>
                      Services
                    </span>
                  </div>
                </li>
                <li onClick={changePick} id='products' className={active === 'products' ? styles.pick : ''}>
                  <div className={styles.icon}>
                    <LocalGroceryStoreOutlined onClick={changePick} id='products' style={{ fontSize: 25 }} />{' '}
                    <span onClick={changePick} id='products' style={{ marginLeft: '10px' }}>
                      Products
                    </span>
                  </div>
                </li>
                <li onClick={changePick} id='reviews' className={active === 'reviews' ? styles.pick : ''}>
                  <div className={styles.icon}>
                    <RateReviewOutlined onClick={changePick} id='reviews' style={{ fontSize: 25 }} />
                    <span onClick={changePick} id='reviews' style={{ marginLeft: '10px' }}>
                      Reviews
                    </span>
                  </div>
                </li>
                <li onClick={changePick} id='subs' className={active === 'subs' ? styles.pick : ''}>
                  <div className={styles.icon}>
                    <SubscriptionsOutlined onClick={changePick} id='subs' style={{ fontSize: 25 }} />
                    <span onClick={changePick} id='subs' style={{ marginLeft: '10px' }}>
                      Subscribers
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
        {showModal && <AccountSettings setUser={setUser} fields={fields} userType={'barber'} user={info} handleClose={handleClose} showModal={showModal} />}
        {/* <section className={`${styles.section2} ${styles.clearfix}`}></section> */}
      </div>
    </div>
  );
}

export default Card;
