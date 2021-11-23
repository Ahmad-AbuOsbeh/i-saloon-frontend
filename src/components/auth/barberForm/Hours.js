import React from 'react';
import { Container, TextField, Button, FormControl, Checkbox, InputLabel, Typography } from '@material-ui/core';
import useStyles from '../signUpStyles';
import CustomStepper from '../Stepper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import instance from '../../../API/axios';
import { storage } from '../../../firebase/firebase';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

export const Contact = ({ formData, setForm, navigation, steps, cancel, imageFile, setImageFile }) => {
  const { workingHours, holidays, endingHour, startingHour, profile_pic } = formData;
  const [localHolidays, setLocalHolidays] = React.useState([]);
  const [holi, setholi] = React.useState('');
  const days = [{ title: 'Monday' }, { title: 'Tuesday' }, { title: 'Wednesday' }, { title: 'Thursday' }, { title: 'Friday' }, { title: 'Saturday' }, { title: 'Sunday' }];

  // update holi
  React.useEffect(() => {
    setholi(localHolidays.join(',').replaceAll(',', ' '));
  }, [localHolidays]);

  async function finalData(e) {
    e.preventDefault();

    const startHour = convertTime(startingHour);
    const endHour = convertTime(endingHour);

    const userInfo = {
      email: formData.email,
      password: formData.password,
      age: formData.age,
      gender: formData.gender,
      city: formData.city,
      address: formData.address,
      phone_num: formData.phone_num,
      working_hours: `${startHour} -${endHour}`,
      holidays: holi,
      shop_name: formData.shop_name,
      shop_gender: formData.shop_gender,
      role: formData.role,
      firstName: formData.firstName,
      lastName: formData.lastName,
      profile_pic: imageFile,
    };

    //////////////////////////

    if (userInfo.profile_pic) {
      const file = userInfo.profile_pic;
      const directory = 'profile_pictures/barbers';
      const currentdate = new Date();
      const datetime = currentdate.getDate() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getFullYear() + '@' + currentdate.getHours() + ':' + currentdate.getMinutes();
      const name = datetime + ' - ' + file.name;
      const storageRef = storage.ref(`${directory}/${name}`);

      storageRef.put(file).on(
        'state_changed',
        (snapshot) => {
          //   Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              //   User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              //   User canceled the upload
              break;
            case 'storage/unknown':
              //   Unknown error occurred, inspect error.serverResponse
              break;
            default:
          }
        },
        () => {
          //   Upload completed successfully, now we can get the download URL
          storageRef.getDownloadURL().then(async (downloadURL) => {
            console.log('File available at', downloadURL);
            userInfo.profile_pic = downloadURL;

            let response = await instance.post('/sign-up', userInfo);
            localStorage.setItem('token', response.data.verification_token);
            navigation.next();
          });
        }
      );
    }

    //////////////////////////
  }
  function holidayHandler(e) {
    if (e.target.checked && localHolidays.indexOf(e.target.value) === -1) {
      setLocalHolidays([...localHolidays, e.target.value]);
    } else {
      setLocalHolidays(localHolidays.filter((item) => item !== e.target.value));
    }
  }
  function convertTime(time) {
    let hours = time.split(':')[0];
    let minutes = time.split(':')[1];
    let suffix = 'AM';
    if (hours >= 12) {
      suffix = 'PM';
      hours = hours - 12;
    }
    if (hours === 0) {
      hours = 12;
    }
    return `${hours}:${minutes} ${suffix}`;
  }
  React.useEffect(() => {
    setForm({
      target: {
        name: 'holidays', // form element
        value: localHolidays, // the data/url
      },
    });
  }, [localHolidays]);
  const classes = useStyles();
  return (
    <Container className={classes.container} maxWidth='xs'>
      <CustomStepper outSteps={steps} activeStep={steps.indexOf(steps[2])} />
      <h3 style={{ textAlign: 'center', color: '#fff' }}>Working Hours And Holidays</h3>
      <form onSubmit={finalData}>
        <FormControl fullWidth margin='normal'>
          <TextField
            id='time'
            label='Open On'
            name='startingHour'
            type='time'
            variant='outlined'
            value={startingHour}
            className={classes.TextField}
            onChange={setForm}
            InputLabelProps={{
              shrink: true,
              style: { color: '#fff' },
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <TextField
            id='time'
            label='Close On'
            name='endingHour'
            type='time'
            variant='outlined'
            className={classes.TextField}
            value={endingHour}
            onChange={setForm}
            InputLabelProps={{
              shrink: true,
              style: { color: '#fff' },
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <Autocomplete
            multiple
            id='checkboxes-tags-demo'
            options={days}
            disableCloseOnSelect
            disableClearable={true}
            getOptionLabel={(option) => option.title}
            renderOption={(option, { selected }) => (
              <Typography color='textSecondary'>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8, color: '#fff' }}
                  checked={localHolidays.includes(option.title)}
                  onChange={(e) => holidayHandler(e)}
                  value={option.title}
                />
                {option.title}
              </Typography>
            )}
            renderInput={(params) => <TextField {...params} variant='outlined' label='Holidays' className={classes.TextField} placeholder='Pick A Day' />}
          />
        </FormControl>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button style={{ width: '2%', marginRight: '1.5rem' }} variant='contained' className={classes.nextButton} onClick={() => navigation.previous()}>
            Back
          </Button>
          <Button style={{ width: '20%' }} className={classes.nextButton} variant='contained' type='submit'>
            Next
          </Button>
        </div>
        <Button variant='contained' fullWidth className={classes.nextButton} onClick={() => cancel()}>
          Cancel
        </Button>
      </form>
    </Container>
  );
};
