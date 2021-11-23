import React, { useState } from 'react';
import { Container, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import useStyles from '../signUpStyles';
import CustomStepper from '../Stepper';
import instance from '../../../API/axios';
import { storage } from '../../../firebase/firebase';

const cities = ['Amman', 'Irbid', 'Az Zarqa', 'Al Aqabah', 'As Salt', 'Jarash', 'Al Mafraq', 'Maan', 'Al Karak', 'At Tafilah', 'Ajlun', 'Madaba'];
export const Address = ({ formData, setForm, navigation, steps, cancel, imageFile, setImageFile }) => {
  const { gender, city, address, age, profile_pic } = formData;
  const valid = gender && city && address && age;
  const [showAlert, setShowAlert] = React.useState(false);
  const [image, setImage] = useState({});

  async function validate() {
    const userInfo = {
      email: formData.email,
      password: formData.password,
      age: formData.age,
      gender: formData.gender,
      city: formData.city,
      address: formData.address,
      phone_num: formData.phone_num,
      role: formData.role,
      firstName: formData.firstName,
      lastName: formData.lastName,
      profile_pic: imageFile,
    };

    ////////////////////////////////

    if (userInfo.profile_pic) {
      const file = userInfo.profile_pic;
      const directory = 'profile_pictures/clients';
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

            if (valid) {
              let response = await instance.post('/sign-up', userInfo);
              localStorage.setItem('token', response.data.verification_token);
              navigation.next();
            } else {
              setShowAlert(true);
            }
          });
        }
      );
    }

    //////////////////////
  }
  React.useEffect(() => {
    setImage(profile_pic);
  });
  const classes = useStyles();
  return (
    <Container className={classes.container} maxWidth='xs'>
      <CustomStepper outSteps={steps} activeStep={steps.indexOf(steps[1])} />
      <h3 style={{ textAlign: 'center', color: '#f1f1f1' }}>Contact Information</h3>
      <FormControl variant='outlined' fullWidth margin='normal'>
        <InputLabel id='demo-simple-select-outlined-label'>Gender</InputLabel>
        <Select
          labelId='demo-simple-select-outlined-label'
          id='demo-simple-select-outlined'
          value={gender}
          name='gender'
          onChange={setForm}
          label='Gender'
          fullWidth
          className={classes.TextField}
          InputLabelProps={{
            style: { color: '#fff' },
          }}
        >
          <MenuItem className={classes.TextField} value='male'>
            Male
          </MenuItem>
          <MenuItem className={classes.TextField} value='female'>
            Female
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl variant='outlined' fullWidth margin='normal'>
        <InputLabel id='city'>Home City</InputLabel>
        <Select labelId='city' id='city' value={city} name='city' onChange={setForm} label='Home City' fullWidth className={classes.TextField}>
          {cities.map((city, key) => (
            <MenuItem key={key} value={city}>
              {city}
            </MenuItem>
          ))}
          ;
        </Select>
      </FormControl>
      <TextField label='Address' name='address' value={address} onChange={setForm} margin='normal' variant='outlined' autoComplete='off' fullWidth className={classes.TextField} />
      <TextField label='Age' name='age' type='number' value={age} onChange={setForm} margin='normal' variant='outlined' autoComplete='off' fullWidth className={classes.TextField} />
      <FormControl fullWidth margin='normal'>
        {showAlert ? <Alert severity='error'>All fields are required</Alert> : null}
      </FormControl>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button style={{ width: '20%', marginRight: '1.5rem' }} variant='contained' className={classes.nextButton} onClick={() => navigation.previous()}>
          Back
        </Button>
        <Button style={{ width: '20%' }} className={classes.nextButton} variant='contained' onClick={() => validate()}>
          Next
        </Button>
      </div>
      <Button variant='contained' fullWidth className={classes.nextButton} onClick={() => cancel()}>
        Cancel
      </Button>
    </Container>
  );
};
