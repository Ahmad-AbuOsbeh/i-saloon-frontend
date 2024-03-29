import React from 'react';
import { useForm, useStep } from 'react-hooks-helper';
import { Names } from './Personal';
import { Address } from './Shop';
import { Contact } from './Hours';
import { Submit } from './Submit';
import { useHistory } from 'react-router';

const defaultData = {
  //step 1 Personal information
  role: 'barber',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  age: 18,
  profile_pic: {},
  gender: '',
  shop_name: '',
  shop_gender: '',
  city: '',
  address: '',
  phone_num: '',
  startingHour: '',
  endingHour: '',
  holidays: '',
};

const steps = [{ id: 'personal' }, { id: 'shop' }, { id: 'hours' }, { id: 'verification' }];

const BarberForm = () => {
  const history = useHistory();
  const [formData, setForm] = useForm(defaultData);
  const [imageFile, setImageFile] = React.useState({});
  const { step, navigation } = useStep({
    steps,
    initialStep: 0,
  });
  const cancel = () => {
    history.push('/');
  };
  const validateAll = (email = 'fake@fake.com', checkFields) => {
    let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

    if (!checkFields) {
      return 'Please fill all fields';
    }
    if (!validEmail) {
      return 'Please enter valid email';
    }
    if (checkFields && validEmail) {
      return ' ';
    }
  };
  const props = { formData, setForm, navigation, steps, cancel, validateAll, imageFile, setImageFile };

  switch (step.id) {
    case 'personal':
      return <Names {...props} />;
    case 'shop':
      return <Address {...props} />;
    case 'hours':
      return <Contact {...props} />;
    case 'verification':
      return <Submit {...props} />;
  }

  return (
    <div>
      <h1>Multi step form</h1>
    </div>
  );
};
export default BarberForm;
