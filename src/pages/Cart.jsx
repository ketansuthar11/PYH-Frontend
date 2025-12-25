import React, { useEffect, useState } from 'react';
import { handleError, handleSuccess } from '../util';
import { ImCancelCircle } from "react-icons/im";
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function Cart(props) {
  const [cartData, setCartData] = useState([]);
  const [localQty, setLocalQty] = useState({});

  const navigate = useNavigate();

  // Fetch cart data
  const getCartData = async () => {
    try {
      const url = "http://localhost:5000/cart";
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      const { cart, message, success } = result;

      if (success && cart) {
        const filteredCart = cart.filter(item => item.plantId);
        setCartData(filteredCart);

        const qtyMap = {};
        cart.forEach(item => {
          qtyMap[item.plantId?._id] = item.quantity;
        });
        setLocalQty(qtyMap);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  // Update quantity in backend
  const updateItemStock = async (plantId, quantity) => {
    try {
      const url = `http://localhost:5000/cart`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plantId, quantity })
      });

      const result = await response.json();
      const { message, success } = result;

      if (success) {
        handleSuccess(message);
        // Update local cart data quantity
        setCartData(prev =>
          prev.map(item =>
            item.plantId?._id === plantId ? { ...item, quantity } : item
          )
        );
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  // Remove item from cart
  const removeCartItem = async (plantId) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/cart`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plantId })
      });
      const result = await response.json();
      const { message, success } = result;

      if (success) {
        handleSuccess(message);
        getCartData();
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    getCartData();
  }, []);

  const handleQuantity = (id,stock,type) => {
    setLocalQty(prev => {
      const newQty = { ...prev };
      if (type === 'add' && stock>newQty[id]) newQty[id] = (newQty[id] || 1) + 1;
      if (type === 'minus' && newQty[id] > 1) newQty[id] = newQty[id] - 1;
      updateItemStock(id, newQty[id]);
      return newQty;
    });
  };

  return (
    <>
      <Navbar />
      <div className='cart'>
        {cartData.length > 0 ? (
          <>
            <h1>Your Cart ({cartData.length}) items</h1>
            <div className='cart-info-heading'>
              <div className='item'><h1>Plant</h1></div>
              <div className='prc-qty-ttl'>
                <h1>Price</h1>
                <h1>Quantity</h1>
                <h1>Total</h1>
              </div>
            </div>

            <div className='list'>
              {cartData.map((item) =>
                item.plantId ? (
                  <div
                    onClick={() => navigate(`/main/plant/${item.plantId._id}`)}
                    className='list-item'
                    key={item._id}
                  >
                    <div className='item-img'>
                      <img src={item.plantId.image} alt="cart item" />
                      <div className='item-info'>
                        <h1>{item.plantId.name}</h1>
                        {item.plantId.stock === 0
                          ? <p className='out-of-stock-cart'>Out of Stock</p>
                          : item.plantId.stock <= 10
                            ? <p className='only-few-cart'>Only {item.plantId.stock} plants left.</p>
                            : <p className='available-cart'>Available</p>
                        }
                        <p className='ctgry'>{item.plantId.category}</p>
                      </div>
                    </div>

                    <div className='prc-qty-ttl'>
                      <div>
                        <p>₹{item.plantId.price}</p>
                      </div>
                      <div className='multi-btn'>
                        <button onClick={(e) => { e.stopPropagation(); handleQuantity(item.plantId._id, item.plantId.stock,'add'); }}>+</button>
                        <button>{localQty[item.plantId._id]}</button>
                        <button onClick={(e) => { e.stopPropagation(); handleQuantity(item.plantId._id,item.plantId.stock, 'minus'); }}>-</button>
                      </div>
                      <div className='remove-item'>
                        <p>₹{item.plantId.price * (localQty[item.plantId._id] || item.quantity)}</p>
                        <ImCancelCircle
                          onClick={(e) => { e.stopPropagation(); removeCartItem(item.plantId._id); }}
                          className='remove-btn'
                          size={20}
                          color={'#3E5F44'}
                        />
                      </div>
                    </div>
                  </div>
                ) : null
              )}
              <div className="continue-btn-container">
                    <button className="continue-btn" onClick={()=>(navigate('/placeorder'))}>Continue to buy</button>
                </div>
            </div>
          </>
        ) : (
          <div className='no-item-added'>
            <h1>No item added</h1>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
