import { React, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import instance from '../../../../API/axios';
import { useSelector, useDispatch } from 'react-redux';
import { getProductsAction } from '../../../../store/actions';
import { storage } from '../../../../firebase/firebase';
const useStyles = makeStyles((theme) => ({
  root: {
    float: 'left',

    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 300,
    },
    closeIcon: {
      float: 'right',
      backgroundColor: '#a38350',
      color: 'secondary',
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a38350',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '0.3rem solid #a38350',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  Savebutton: {
    margin: theme.spacing(1),
  },
  Closebutton: {
    margin: theme.spacing(1),
  },
}));
export default function CreateProductModal({ showModal, handleClose, handleOpen }) {
  const dispatch = useDispatch();
  const id = useSelector((state) => state?.authReducer?.user?.id);

  const strId = id.toString();
  const classes = useStyles();
  const [productData, setProductData] = useState({ barberID: id });

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      console.log('productData.productImg', productData.productImg);
      if (productData.productImg) {
        const file = productData.productImg;
        const directory = 'products';

        const name = new Date() + '-' + file.name;
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
              productData.productImg = downloadURL;
              const response = await instance.post('/barber/products', productData);
              const products = await instance.get(`/barber/products/0/${id}`);
              dispatch(getProductsAction(products.data));
              handleClose();
              setProductData({ barberID: id });
            });
          }
        );
      }
    } catch (e) {
      console.log('ADD Product Error', e.message);
    }
  };

  const handleChange = (e) => {
    if (e.target.name == 'productImg') {
      setProductData({ ...productData, [e.target.name]: e.target.files[0] });
    } else {
      setProductData({ ...productData, [e.target.name]: e.target.value });
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={showModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showModal}>
          <div className={classes.paper}>
            <CloseIcon className={classes.closeIcon} onClick={handleClose} />
            <form className={classes.root} onSubmit={submitHandler} noValidate autoComplete='off'>
              <h2 id='transition-modal-title'>Add Product</h2>

              {/* <button onClick={() => uploadImage('products', img)}>firebase</button> */}
              <div>
                <TextField id='standard-error' onChange={(e) => handleChange(e)} label='productName' name='productName' defaultValue={''} variant='outlined' />
                <TextField onChange={(e) => handleChange(e)} id='standard-error-helper-text' label='productDescrp' name='productDescrp' defaultValue={''} variant='outlined' />
              </div>
              <div>
                <TextField id='filled-error' type='number' onChange={(e) => handleChange(e)} label='productPrice in JD' defaultValue={''} name='productPrice' variant='outlined' />
                <TextField
                  className={classes.email}
                  onChange={(e) => handleChange(e)}
                  id='filled-error-helper-text'
                  type='number'
                  label='discount in %'
                  defaultValue={''}
                  name='discount'
                  variant='outlined'
                />
              </div>

              <div>
                <TextField onChange={(e) => handleChange(e)} type='date' id='outlined-error' placeHolder=' discount endDate' name='endDate' defaultValue={''} variant='outlined' />

                <TextField onChange={(e) => handleChange(e)} id='outlined-error-helper-text' placeHolder='productImg' name='productImg' type='file' defaultValue={''} variant='outlined' />
              </div>
              <Button onClick={handleClose} variant='contained' size='large' className={classes.Closebutton} startIcon={<CloseIcon />}>
                Close
              </Button>
              <Button variant='contained' size='large' type='submit' className={classes.Savebutton} startIcon={<SaveIcon />}>
                Create
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
