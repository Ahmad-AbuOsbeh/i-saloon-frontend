import { React, useEffect, useState } from 'react';
import { AddShoppingCart, Edit, VisibilityOffSharp } from '@material-ui/icons/';
import Button from '@material-ui/core/Button';
import AddProduct from '../../products/ProductButton';
import styles from '../../../styles/products.module.scss';
import instance, { url } from '../../../../../API/axios';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsAction } from '../../../../../store/actions';
import DeleteForever from '@material-ui/icons/DeleteForever';
import UpdateProductModal from '../../products/UpdateProductModal';
import { useParams } from 'react-router';
import ProductModal from './util/ProductModal';
import { storage } from '../../../../../firebase/firebase';

function Products() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.productsReducer);
  const [barberProducts, setBarberProducts] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [product, setProduct] = useState({});
  const [open, setOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState({});
  const role = useSelector((state) => state?.authReducer?.role);
  const isloggedIn = useSelector((state) => state?.authReducer?.isLoggedIn);
  const userId = useSelector((state) => state?.authReducer?.user?.id);
  let { id } = useParams();

  // get barber products from API
  async function fetchProducts() {
    const response = await instance.get(`/barber/products/0/${id}`);

    console.log(response.data, 'api test');

    dispatch(getProductsAction(response.data));
    setBarberProducts(state.barberProducts);
  }
  // did mount
  useEffect(() => {
    fetchProducts();
  }, []);

  //did update on global state products
  useEffect(() => {
    setBarberProducts(state.barberProducts);
  }, [state.barberProducts]);

  // delete Product Handler
  async function deleteProductHandler(product) {
    // '/products/:productID/:barberID'
    const response = await instance.delete(`/barber/products/${product.id}/${product.barber_id}`);
    let pictureRef = storage.refFromURL(product.product_image);
    pictureRef.delete().then(function () {
      console.log('image deleted');
    });

    fetchProducts(); // ehhh daaaahhh
  }

  const handleOpen = (pro) => {
    setShowUpdateForm(true);
    setProduct(pro);
  };

  const handleClose = () => {
    setShowUpdateForm(false);
  };

  // on submmit update product form
  async function onSubmitUpdate(e, product, productData, setProductData) {
    try {
      e.preventDefault();
      // setProductData({ ...productData, barberID: 1 });
      let updatedProduct = {
        productImg: productData.productImg ? productData.productImg : product.product_image,
        productName: productData.productName ? productData.productName : product.product_name,
        productPrice: productData.productPrice ? productData.productPrice : product.price,
        productDescrp: productData.productDescrp ? productData.productDescrp : product.description,
        discount: productData.discount ? productData.discount : product.discount,
        endDate: productData.endDate ? productData.endDate : product.end_date,
      };
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
              updatedProduct.productImg = downloadURL;
              const response = await instance.put(`/barber/products/${product.id}/1`, updatedProduct);
              fetchProducts();
              handleClose();
              setProductData({});
              let pictureRef = storage.refFromURL(product.product_image);
              pictureRef.delete().then(function () {
                console.log('image deleted');
              });
            });
          }
        );
      } else {
        const response = await instance.put(`/barber/products/${product.id}/1`, updatedProduct);
        fetchProducts();
        handleClose();
        setProductData({});
      }
    } catch (e) {
      console.log('update Product Error', e.message);
    }
  }

  function addToCart(id) {
    // console.log(id);
  }

  function handleModalOpen(pro) {
    setActiveProduct(pro);
    setOpen(true);
  }

  function handleModalClose() {
    setOpen(false);
  }

  const barberIds = Number(id);
  return (
    <div className={styles.container}>
      <h2>
        Products <span>{barberProducts.length} Product</span>
      </h2>

      {role === 'barber' && userId === barberIds && isloggedIn && (
        <div className={styles.productButton}>
          <AddProduct name='Product' />
        </div>
      )}

      <div className={styles.allCard}>
        {barberProducts?.map((pro) => (
          <div className={styles.card} key={pro.id}>
            <div className={styles.innerCard}>
              <div className={styles.image}>
                <img src={`${pro.product_image}`} alt={pro.product_name} />
              </div>

              <div className={styles.hidden}>
                <Button onClick={() => deleteProductHandler(pro)} style={{ color: '#a38350' }} size='small'>
                  <DeleteForever className={styles.icon} />
                </Button>

                <Button onClick={() => handleOpen(pro)} style={{ color: '#a38350' }} size='small'>
                  <Edit className={styles.icon} />
                </Button>

                {/* <Button onClick={() => addToCart(pro.id)} style={{ color: '#a38350' }} size="small">
                  <AddShoppingCart className={styles.icon} />
                </Button> */}

                <Button onClick={() => handleModalOpen(pro)} style={{ color: '#a38350' }} size='small'>
                  <VisibilityOffSharp className={styles.icon} />
                </Button>
              </div>
              <ProductModal prod={activeProduct} open={open} handleClose={handleModalClose} />
            </div>
            <div className={styles.text}>
              <p>{pro.price} JD</p>
              <p>{pro.product_name}</p>
              {/* <p> Description: {pro.description} </p> */}
              {/* <p>discount: {pro.discount}</p>
              <p>end date discount: {pro.end_date}</p> */}
              {/* rating */}
            </div>
          </div>
        ))}
        {showUpdateForm && <UpdateProductModal showUpdateForm={showUpdateForm} handleClose={handleClose} onSubmitUpdate={onSubmitUpdate} pro={product} />}
      </div>
    </div>
  );
}
export default Products;
