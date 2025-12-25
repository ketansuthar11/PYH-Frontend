import React, { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../util";
import Navbar from "../components/Navbar";
export default function Order() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const url = `https://prithvi-yadavb.vercel.app/getorders`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const result = await response.json();
            if (result.success) {
                const sortedOrders = result.orders.sort(
                    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
                );
                setOrders(sortedOrders);
                handleSuccess(result.message);
            }
        } catch (err) {
            handleError(err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
            <div className="orders-container">

                <div className="order-wrapper">
                    {orders.length > 0 ? (
                        <>
                            <h2>Your Orders ({orders.length})</h2>
                            <div className="order-header">
                                <div>Item</div>
                                <div>Amount</div>
                                <div>Status</div>
                                <div>Date</div>
                            </div>

                            <div className="order-list">
                                {orders.map((ord) =>
                                    ord._id ? (
                                        <div className="order-item" key={ord._id}>
                                            <div>{ord._id}</div>
                                            <div  className="amount">₹{ord.totalAmount}</div>
                                            <div className={`status ${ord.status.toLowerCase()}`}>
                                                {ord.status}
                                            </div>
                                            <div>
                                                {new Date(ord.orderDate).toLocaleString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                    hour12: false,
                                                    timeZone: "Asia/Kolkata"
                                                })}
                                            </div>
                                        </div>

                                    ) : null
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="no-orders">
                            <p>No orders found.</p>
                        </div>
                    )}
                </div>
            </div>
    );
}
