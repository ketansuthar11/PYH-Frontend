import React, { useEffect, useState } from "react";
import { handleSuccess, handleError } from "../util";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function PlaceOrder() {

    // const addresses = [
    //     { id: 1, address: "456 Blossom Avenue, Nature Park, GreenTown, 110045, India", default: true },
    //     { id: 2, address: "789 Orchid Lane, Floral District, Cityville, 400001, India", default: false },
    //     { id: 3, address: "321 Fern Road, Botanical Gardens, Plant City, 500072, India", default: false },
    // ];
    
    let [address, setAddress] = useState("");
    let [showInputForNewAddess, setShowInputForNewAddess] = useState(false);
    let [addresses, setAddresses] = useState([]);

    const paymentOptions = [
        { id: 1, method: "cash" },
        { id: 2, method: "razorpay" },
        { id: 3, method: "paypal" }
    ];
    const [totalAmount, setTotalAmount] = useState(0);
    const [plants, setPlants] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0]);

    const navigate = useNavigate();

    const handleSelectAddress = (addr) => {
        setSelectedAddress(addr);
        setShowAll(false);
    };

    const handleSelectPayment = (pm) => {
        setSelectedPayment(pm);
    };

    const handleOnchange = (e) => {
        let value = e.target.value;
        setAddress(value)
    }


    const getAddress = async ()=>{
        try{
            const url = `https://prithvi-yadavb.vercel.app/getaddress`;
            const response = await fetch(url,{
                method: 'GET',
                headers:{
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const result = await response.json();
            if(result.success){
                console.log(result.data)
                setAddresses(result.data);
                if (result.data.length > 0) {
                    setSelectedAddress(result.data[0]);
                }
            }
            else{
                handleError(result.message);
            }
        }
        catch(err){
            handleError(err);
        }
    }

    const getCartData = async () => {
        try {
            const url = `https://prithvi-yadavb.vercel.app/cart`;
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
                let total = 0;
                for (let item of cart) {
                    total += item.plantId.price * item.quantity;
                }
                setTotalAmount(total);
                setPlants(cart);
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError(err);
        }
    };


    const placeOrder = async () => {
        try {
            const formattedPlants = plants.map(item => ({
                plantId: item.plantId._id,
                quantity: item.quantity
            }));

            const payload = {
                plants: formattedPlants,
                address: selectedAddress.address,
                paymentMethod: selectedPayment.method,
            };

            const url = "https://prithvi-yadavb.vercel.app/placeorder";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            const { message, success } = result;

            if (success) {
                navigate('/orderplaced')
                handleSuccess(message);
            } else {
                handleError(message || "Order failed");
            }
        } catch (err) {
            handleError(err.message || "Something went wrong");
        }
    };

    const saveAddress = async() => {
        if (!address.trim()) {
            setShowInputForNewAddess(!showInputForNewAddess);
            return;
        }

        try{
            const url = 'https://prithvi-yadavb.vercel.app/addaddress';
            const response  = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body:JSON.stringify({address})
            });
            const res = await response.json();
            console.log(res.message)
        }
        catch(err){
            handleError("Failed to save address");
            return;
        }

        const newAddr = {
            id: Date.now(),
            address,
            default: addresses.length === 0
        };

        setAddresses(prev => [...prev, newAddr]);
        setSelectedAddress(newAddr);
        setAddress("");
        setShowInputForNewAddess(false);
    };



    useEffect(() => {
        getAddress();
        getCartData();
    }, []);

    return (
        <div className="place-order">
            <h1>Place Order</h1>
            {/* Address Section */}
            <div className="address-section">
                <h3>Delivery Address</h3>

                {
                    showInputForNewAddess ? (
                        <input type="text" onChange={handleOnchange} value={address} />
                    ) : selectedAddress ? (
                        <div className="selected-address-card">
                            {selectedAddress.address}
                        </div>
                    ) : (
                        <div className="selected-address-card">
                            <input type="text" onChange={handleOnchange} value={address} />
                        </div>
                    )
                }


                <div className="address-actions">
                    <button className="change-btn" onClick={() => setShowAll(!showAll)}>
                        {showAll ? "Hide Addresses" : "Change Address"}
                    </button>
                    <button className="change-btn" onClick={saveAddress}>
                        Add New Address
                    </button>
                </div>

                {showAll && (
                    <div className="address-cards-container">
                        {addresses.map((addr) => (
                            <div
                                key={addr._id}
                                className={`address-card ${selectedAddress && addr._id === selectedAddress._id ? "selected" : ""}`}
                                onClick={() => handleSelectAddress(addr)}
                            >
                                {addr.address}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Payment Section */}
            <div className="payment-method">
                <h3>Total: ₹{totalAmount}</h3>
                <h3>Select Payment Method</h3>
                <div className="payment-cards-container">
                    {paymentOptions.map((method) => (
                        <label
                            key={method.id}
                            className={`payment-card ${selectedPayment.id === method.id ? "selected" : ""}`}
                        >
                            <input
                                type="radio"
                                name="payment"
                                value={method.id}
                                checked={selectedPayment.id === method.id}
                                onChange={() => handleSelectPayment(method)}
                            />
                            <span className="payment-label">{method.method}</span>
                        </label>
                    ))}
                </div>
            </div>
            <button className="place-order-btn" onClick={placeOrder}>Place Order</button>
            <ToastContainer />
        </div>
    );
}

export default PlaceOrder;
