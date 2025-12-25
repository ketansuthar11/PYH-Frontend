import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { handleError, handleSuccess } from "../../util";
import {ToastContainer} from 'react-toastify'

    function OrderDetails() {
        const { id } = useParams();
        const [order, setOrder] = useState(null);
        let [newStatus,setNewStatus] = useState(0);

        const updateStatus = (status) => {
        let value;
        if (status === 'confirmed') value = 0;
        else if (status === 'shipped') value = 1;
        else if (status === 'delivered') value = 2;

        if (value <= newStatus) return;

        setNewStatus(value);
        updateOrderStatus(value);
    };




    const updateOrderStatus = async (statusValue) => {
        try {
            const url = `${import.meta.env.VITE_API_URL}/admin/updateorderstatus/${id}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: statusValue })
            });
            const result = await response.json();

            if (result.success) {
                handleSuccess(result.message);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err.message || err);
        }
    };

    
    const fetchOrder = async () => {
        try {
            const url = `${import.meta.env.VITE_API_URL}/orders/${id}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            const result = await response.json();
            if (result.success) {
                setOrder(result.order);
                if (result.order.status === "confirmed") setNewStatus(0);
                else if (result.order.status === "shipped") setNewStatus(1);
                else if (result.order.status === "delivered") setNewStatus(2);
            }
            else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err.message || err);
        }
    };


    useEffect(() => {
        fetchOrder();
    }, [id]);

    if (!order) {
        return (<div className="loading-order-details"><p>Loading order details...</p></div>);
    }

    const totalAmount = order.plants.reduce((acc, plant) => {
        console.log(plant)
        return acc + plant.plantId.price * plant.quantity;
    }, 0);

    

    

    return (
        <div className="order-details" style={{ padding: "20px" }}>
            <h2>Order Details</h2>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                    <tr>
                        <th>Order ID</th>
                        <td>{order._id}</td>
                    </tr>
                    <tr>
                        <th>Order Date</th>
                        <td>{new Date(order.orderDate).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                        })}</td>
                    </tr>
                    <tr>
                        <th>User ID</th>
                        <td>{order.userId}</td>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <td>{order.address}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>{order.status}</td>
                    </tr>
                    <tr>
                        <th>Payment Status</th>
                        <td>{order.paymentStatus}</td>
                    </tr>
                    <tr>
                        <th>Payment Method</th>
                        <td>{order.paymentMethod}</td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td>₹{order.totalAmount}</td>
                    </tr>
                </tbody>
            </table>

            <h3 style={{ marginTop: "20px" }}>Ordered Plants</h3>
            {order.plants && order.plants.length > 0 ? (
                <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Plant Name</th>
                            <th>Plant image</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody className="ordered-plant-details" >
                        {order.plants.map((plant, index) => (
                            <tr key={index}>
                                <td>{plant.plantId.name}</td>
                                <td>{plant.plantId?.image ? (
                                    <img
                                        src={plant.plantId.image}
                                        alt={plant.plantId.name}
                                        width="60"
                                        height="60"
                                        style={{ objectFit: "cover", }}
                                    />
                                ) : (
                                    <Link to={`/plants/${plant.plantId?._id}`}>View Plant</Link>
                                )}</td>
                                <td>{plant.quantity}</td>
                                <td>₹{plant.plantId.price}</td>
                                <td>₹{plant.plantId.price * plant.quantity}</td>
                            </tr>
                        ))}
                        <tr><td>Total Amount</td><td></td><td></td><td></td>
                            <td>₹{totalAmount}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>No plants found in this order.</p>
            )}
            <div className="order-status">
                <p className={newStatus>=0?'selected-order-status':'unselected-order-status'} onClick={()=>(updateStatus('confirmed'))}>confirmed</p>
                <hr className={newStatus>0?'done-status-line':'pending-status-line'}/>
                <p className={newStatus>=1?'selected-order-status':'unselected-order-status'} onClick={()=>(updateStatus('shipped'))}>shipped</p>
                <hr className={newStatus>1?'done-status-line':'pending-status-line'}/>
                <p className={newStatus>=2?'selected-order-status':'unselected-order-status'} onClick={()=>
                    {
                        if (order.paymentStatus !== 'pending') {
                            updateStatus('delivered');
                        }
                        else{
                            handleError("Payment is pending")
                        }
                    }}>delivered</p>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default OrderDetails;
