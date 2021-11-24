import { React, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import instance, { url } from '../../../API/axios';
import { useSelector, useDispatch } from 'react-redux';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import zIndex from '@material-ui/core/styles/zIndex';
import { getQueuesAction } from '../../../store/actions';
import styles from '../styles/requests.module.css';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #a38350',
    backgroundColor: '#1f2024',
    height: '20rem',
    minWidth: '35rem',
    paddingTop: '2rem',
    color: '#f1f1f1',
    zIndex: '8888811111111111156465135',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: '#1f2024',
      border: `#a38350 solid 1px`,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: '#a38350',
      },
    },
    '& .MuiListItemIcon-root': {
      color: '#f1f1f1',
    },
  },
}))(MenuItem);

export default function RequestTickets() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [allTickets, setAllTickets] = useState([]);
  const dispatch = useDispatch();
  let barberId = useSelector((state) => state?.authReducer?.user?.id);
  let client_id = useSelector((state) => state?.authReducer?.user?.id);

  // fetch tickets
  async function fetchTickets() {
    const response = await instance.get(`/barber/requests/${barberId}`);
    setAllTickets(response.data);
  }
  // did mount
  useEffect(() => {
    fetchTickets();
  }, []);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // deleteTicket
  async function deleteTicket(ticketId) {
    const response = await instance.delete(`/barber/requests/${ticketId}`);
    fetchTickets();
  }

  // addToQueue
  async function addToQueue(ticket) {
    // { barbarId, serviseId, clientId, time }
    let ticketData = {
      barbarId: ticket.barber_id,
      serviseId: ticket.service_id,
      clientId: ticket.client_id,
      time: ticket.time,
      id: ticket.id,
    };
    const response = await instance.post(`/barber/queue/post`, ticketData);
    // deleteTicket(ticket.id);
    fetchTickets();

    // dispatch(getQueuesAction(!queueState));
  }

  return (
    <>
      <div className={styles.notification} style={{ position: 'relative', zIndex: '51551313515' }}>
        {!allTickets.length ? (
          <NotificationsIcon
            aria-controls='customized-menu'
            variant='contained'
            aria-haspopup='true'
            onClick={handleClick}
            style={{
              color: '#f1f1f1',
              fontSize: 29,
              position: 'absolute',
              top: '-22px',
            }}
          />
        ) : (
          <>
            <h6 style={{ position: 'absolute', top: '-70px', right: '-35px', color: 'red' }}>{allTickets.length}</h6>
            <NotificationsActiveIcon
              variant='contained'
              aria-controls='customized-menu'
              aria-haspopup='true'
              onClick={handleClick}
              style={{
                color: '#f1f1f1',
                fontSize: 29,
                position: 'absolute',
                top: '-22px',
              }}
            />
          </>
        )}
        {/* <NotificationsNoneIcon aria-controls='customized-menu' aria-haspopup='true' variant='contained' onClick={handleClick} /> */}

        <StyledMenu id='customized-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} style={{ paddingTop: '50px' }}>
          {allTickets?.map((ticket) => {
            return (
              <StyledMenuItem key={ticket.id} id='iiii' style={{ display: 'block', margin: 'auto', minWidth: '35rem' }}>
                <ListItemIcon
                  style={{
                    // marginTop:'1rem',
                    width: '35rem',
                    height: '5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={url + ticket.profile_pic}
                    style={{
                      width: '5rem',
                      height: '5rem',
                      marginButton: '3rem',
                    }}
                    fontSize='small'
                  />
                  <h5 className={styles.userName}>{ticket.user_name}</h5>
                  <h5 className={styles.serviceName}>{ticket.service_name}</h5>

                  <h5 className={styles.serTime}>{ticket.estimated_time} min</h5>

                  <h5 className={styles.serDate}>{ticket.time}</h5>
                  <span className={styles.accept}>
                    <CheckCircleOutlineIcon onClick={() => addToQueue(ticket)} />
                  </span>
                  <span className={styles.decline}>
                    <HighlightOffIcon onClick={() => deleteTicket(ticket.id)} />
                  </span>
                </ListItemIcon>
              </StyledMenuItem>
            );
          })}
        </StyledMenu>
      </div>
    </>
  );
}
