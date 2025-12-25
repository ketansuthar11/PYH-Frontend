import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {ToastContainer} from 'react-toastify';
import { handleError, handleSuccess } from '../util';
function PlantDetails(props) {
    const { id } = useParams();

    const [plant, setPlant] = useState({});

    const fetchPlant = async () => {
        try {
            const url = `https://prithvi-yadavb.vercel.app/plants/${id}`;
            const headers = {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(url, {method:'GET',headers:headers});
            const result = await response.json();
            if (result.success) {
                setPlant(result.plant)
            }
            else {
                handleError(result.message);
            }
            console.log(result)
        }
        catch (err) {
            console.error(err);
            handleError(err);
        }
    }

    useEffect(() => {
        fetchPlant();
    }, []);

    const addToCart = async() => {
    try {
        const url = `https://prithvi-yadavb.vercel.app/cart`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                userId: localStorage.getItem('userId'),
                plantId: plant._id,
                quantity: props.quantity
            })
        });
        const result = await response.json();
        const { message, success } = result;
        if (success) {
            handleSuccess(message);
        } else {
            handleError(message);
        }
    } catch(err) {
        handleError(err);
    }
}



    return (
        <div>
            <div className='plant-details'>
                <div className='plant-img'>
                    <img src={plant.image} alt="Rose" />
                </div>
                <div className='plant-info'>
                    <p className='category'>{plant.category}</p>
                    <h1 className='name'>{plant.name}</h1>
                    <h3 className='price'>₹{plant.price}</h3>
                    <p className='desc'>{plant.desc}</p>
                    {plant.stock==0?<p className='out-of-stock'>Out of Stock</p>:plant.stock <= 10 ? <p className='only-few'>Only {plant.stock} plants left.</p> : <p className='available'>Available</p>}
                    <p className='tips'>Care Tip: {plant.careTips}</p>
                    <div className='multi-btn'>
                        <button onClick={plant.stock>props.quantity?props.handleQuantity:()=>{}} name='add'>+</button>
                        <button>{props.quantity}</button>
                        <button onClick={props.handleQuantity} name='minus'>-</button>
                    </div>
                    <div className='btn-actions'>
                        <button>Buy Now</button>
                        <button onClick={addToCart} >Add to Cart</button>
                    </div>
                </div>
                <ToastContainer/>
            </div>
        </div>
    )
}

export default PlantDetails