import React from 'react';
import { useNavigate } from 'react-router-dom';
function OrderSuccessfull() {
    const navigate = useNavigate();
    return (
        <div className='order-placed'>
            <div className="order-successfull-container">
                <div className="icon">&#10003;</div> {/* Checkmark icon */}
                <div className="message">Your order was successful!</div>
                <button className="done-button" onClick={()=>(navigate('/main/plants'))}>Done</button>
            </div>
        </div>
    );
}

export default OrderSuccessfull;
