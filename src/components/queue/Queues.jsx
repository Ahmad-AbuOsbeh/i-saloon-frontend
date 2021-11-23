import { React, useState, useEffect } from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import instance from '../../API/axios';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import styles from './queue.module.css';
export default function Queues() {
  let queueState = useSelector((state) => state?.queueReducer?.acceptedTicket);
  const role = useSelector((state) => state?.authReducer?.role);

  const startWorkingHour = 8;
  const endWorkingHour = 17;
  const arrayLength = (endWorkingHour - startWorkingHour) * 60;
  const workingHoursArray = new Array(arrayLength).fill(0);
  const [finalWorkingHours, setfinalWorkingHours] = useState(workingHoursArray);
  const [renderedDivs, setrenderedDivs] = useState([]);
  const [AllQueues, setAllQueues] = useState([]);
  const [todaysQueue, setTodaysQueue] = useState([]);
  let renderedTickets = [];
  let check = new Date();
  let activeHour = check.getHours();
  const date = check.getFullYear() + '-' + Number(check.getMonth() + 1) + '-' + check.getDate();
  const { id } = useParams();

  // fetch queues
  async function fetchQueues() {
    const response = await instance.get(`/barber/queue/get/${id}/0/0`);
    setAllQueues(response.data);
  }

  // delete queue
  async function deleteQueueHandler(queueId) {
    const response = await instance.delete(`/barber/queue/delete/${queueId}/0/0`);
    fetchQueues();
  }

  useEffect(() => {
    let array = [];
    for (let i = 0; i < AllQueues.length; i++) {
      // if (AllQueues[i].time.split(' ')[1] === date) {
      array.push(AllQueues[i]);
      // }

      setTodaysQueue(array);
    }
  }, [AllQueues]);
  useEffect(() => {
    fetchQueues();
  }, []);

  // did update on all tickets
  useEffect(() => {
    let startIndex;
    let removedItems;
    let bookedArray;
    let startPercentage;
    let widthPercentage;
    let hour;
    let minute;

    todaysQueue.length &&
      todaysQueue?.map((item) => {
        hour = Number(item.time.split(' ')[0].split(':')[0]);

        minute = Number(item.time.split(' ')[0].split(':')[1]);

        startIndex = (hour - startWorkingHour) * 60 + minute;
        removedItems = Number(item.estimated_time);
        bookedArray = new Array(removedItems).fill(1);
        startPercentage = (startIndex / workingHoursArray.length) * 100;
        widthPercentage = (removedItems / workingHoursArray.length) * 100;
        if (workingHoursArray[startIndex] == 0 && workingHoursArray[startIndex + removedItems - 1] != 1) {
          workingHoursArray.splice(startIndex, removedItems, ...bookedArray);
          renderedTickets.push({
            div: (
              <div
                style={{
                  width: `${widthPercentage}%`,
                  height: '100%',
                  position: 'absolute',
                  left: `${startPercentage}%`,
                  backgroundColor: '#8E0505',
                  boxSizing: 'border-box',
                  border: 'solid 5px white',
                  display: 'inline-block',
                }}
              >
                {role === 'barber' && <DeleteForeverIcon style={{ position: 'absolute', right: '0', cursor: 'pointer' }} onClick={() => deleteQueueHandler(item.id)} />}

                {/* {activeHour > hour ? (
                  //   <p style={{ writingMode: 'vertical-lr', textOrientation: 'upright  ', position: 'absolute', top: '2rem' }}>completed</p>
                  <DoneAllIcon style={{ marginBottom: '-120px', marginLeft: '1rem' }} />
                ) : null}

                {activeHour == hour ? <CircularProgress style={{ marginBottom: '-8rem', marginLeft: '20%' }} /> : null} */}
              </div>
            ),
            text: (
              <p
                style={{
                  // width: `${widthPercentage}%`,
                  width: 'fit-content',
                  // width: '15px',
                  height: '100%',
                  position: 'absolute',
                  bottom: '-50%',
                  left: `${startPercentage}%`,
                  // backgroundColor: 'black',
                  // boxSizing: 'border-box',
                  // border: 'solid 1px white',
                  color: 'white',
                  // display: 'inline-block',
                  // fontSize: 'larger',
                  marginLeft: `${widthPercentage / 12}rem`,
                }}
              >
                {hour + ':' + minute + ' '}-{' '}
                {Number(minute) + Number(item.estimated_time) >= 60
                  ? Number(minute) + Number(item.estimated_time) <= 69
                    ? `${hour + 1}:0${Number(minute) + Number(item.estimated_time) - 60}`
                    : `${hour + 1}:${Number(minute) + Number(item.estimated_time) - 60}`
                  : `${hour}:${Number(minute) + Number(item.estimated_time)}`}
              </p>
            ),

            parameters: { widthPercentage, startPercentage, startIndex, removedItems },
          });
        } else {
          // alert('this time is full! please pick different time..');
        }
      });
    setfinalWorkingHours(workingHoursArray);
    setrenderedDivs(renderedTickets);
  }, [todaysQueue]);

  // for styling
  const style = {
    // queuecontainer: {
    //   backgroundColor: '#99154E',
    //   boxSizing: 'border-box',
    //   border: '#a38350 solid 1px ',
    //   width: `75rem`,
    //   height: '15rem',
    //   margin: 'auto',
    //   position: 'relative',
    // },
    timeLineContainer: {
      //   backgroundColor: 'black',
      boxSizing: 'border-box',

      //   border: '#a38350 solid 1px',
      width: `63.5rem`,
      height: '2rem',
      margin: 'auto',
      position: 'relative',
      justifyContent: 'center',
    },
  };
  return (
    <div className={styles.queue}>
      <p className={styles.date}>
        Booked Tickets on: <span className={styles.text}>{date}</span>
      </p>
      <div className={style.bigContainer}>
        <div style={style.timeLineContainer}>
          {/* <hr style={{ color: 'red' }} /> */}
          <p style={{ float: 'left', position: 'absolute', top: '-1rem', color: '#8E0505', fontWeight: 'bolder' }}>{startWorkingHour}:00</p>
          {renderedDivs?.map((item) => {
            return <>{item.text}</>;
          })}
          <p style={{ float: 'right', marginTop: '0rem', color: '#8E0505', fontWeight: 'bolder' }}>{endWorkingHour}:00</p>
        </div>
        <div className={styles.queuecontainer}>{renderedDivs?.map((item) => item.div)}</div>
      </div>
    </div>
  );
}
