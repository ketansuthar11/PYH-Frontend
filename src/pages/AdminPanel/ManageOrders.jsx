import { useEffect, useState } from 'react';
import { handleError, handleSuccess } from '../../util';
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/Navbar';

function ManageOrders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [localOrders, setLocalOrders] = useState([]);

  const getOrders = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/getorders`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const result = await response.json();
      const { message, orders, success } = result;
      if (success) {
        setLocalOrders(orders);
        handleSuccess(message);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message || err);
    }
  };

  useEffect(() => {
    getOrders();
    const interval = setInterval(()=>{
      getOrders();
    },2000)
    return () => clearInterval(interval);
  }, []);

  const onItemClick = (order) => {
    navigate(`/orderdetails/${order._id}`);
  };

  const handleOnChange = (event) => {
    setSearch(event.target.value);
  };

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = localOrders.filter(order => {
    const matchesSearch =
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.plantname?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const setFilterOrders = (status) => {
    setStatusFilter(status);
  };

  return (
    <div className='manage-order'>
      <Navbar />
      <ul className='order-list'>
        <div className='search-bar'><input type="text" placeholder='Search plants...' onChange={handleOnChange} /></div>
        <div className='filters'>
          <p className={statusFilter === 'all' ? 'selected-filter' : 'unselected-default'} onClick={() => (setFilterOrders('all'))}>All</p>
          <p className={statusFilter === 'pending' ? 'selected-filter' : 'unselected-default'} onClick={() => (setFilterOrders('pending'))}>pending</p>
          <p className={statusFilter === 'confirmed' ? 'selected-filter' : 'unselected-default'} onClick={() => (setFilterOrders('confirmed'))}>Confirmed</p>
          <p className={statusFilter === 'delivered' ? 'selected-filter' : 'unselected-default'} onClick={() => (setFilterOrders('delivered'))}>Delivered</p>
        </div>
        <hr />
        {
          filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <li
                className="order-list-item"
                key={order._id}
                onClick={() => onItemClick(order)}
              >
                <div>
                  <div className='order-list-item-info'>
                    <p>Order Id: {order._id}</p>
                    <p>{new Date(order.orderDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                    </p>
                  </div>

                  <p>User Id: {order.userId}</p>
                  <p>Payment Method: {order.paymentMethod}</p>
                  <p className={order.status === 'pending' ? 'pending' : 'paid'}>Order Status: {order.status}</p>
                  <div className='order-list-item-info'>
                    <p className={order.paymentStatus === 'pending' ? 'pending' : 'paid'} >Payment Status: {order.paymentStatus}</p>
                    <p>Total Payment: ₹{order.totalAmount}</p>
                  </div>
                </div>
                <br />
                <hr />
              </li>
            ))
          ) : (
            <p className='no-orders'>No orders found</p>
          )
        }
      </ul>
    </div>
  );
}

export default ManageOrders;
