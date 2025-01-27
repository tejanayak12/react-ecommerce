import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../Constants';

export const AppContext = createContext({
    products: [],
    loading: true
})

function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cartProducts, setCartProduct] = useState({});
  /*
    {
      5: PRODUCT_5
      6: PRODUCT_6
    }
  */
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ENDPOINTS.PRODUCTS)
      .then(res => res.json())
      .then(res => {
        console.log(":: API_ENDPOINTS.PRODUCTS ::", res);
        setProducts(res.products);
      })
  }, []);

  const addProductToCart = (product) => {
    let cartProduct = cartProducts[product.id];
    if(!cartProduct) {
      cartProduct = product;
      cartProduct.quantity = 1;
    } else {
      cartProduct.quantity++;
    }
    cartProduct.totalPrice = cartProduct.quantity * cartProduct.price;
    setCartProduct({...cartProducts, [product.id]: cartProduct});

  }

  const productsById = {};
  products.forEach((product) => {
    productsById[product.id] = product;
  });

  const allCartProducts = Object.values(cartProducts);
  const cartCount = allCartProducts.length;
  let totalCartAmount = 0;
  allCartProducts.forEach(product => {
    totalCartAmount = totalCartAmount + product.totalPrice
  });

  return (
    <AppContext.Provider value={{
        products,
        productsById,
        loading,
        setLoading,
        cartCount,
        cartProducts, // {1: {id: 1}, 2: {id: 2}}
        addProductToCart,
        allCartProducts,
        totalCartAmount
    }}>
        {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext);
export default AppProvider

/*
const {products, loading, setLoading} = useAppContext();
*/