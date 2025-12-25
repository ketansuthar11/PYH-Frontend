import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../util';
import logo from '../assets/PYH-logo.png'
function Signup() {


    const navigate = useNavigate();
    const [signupInfo,setSignupInfo] = useState({
        name:'',
        email:'',
        password:'',
        role:'user',
    });;

    let handleInput = (event)=>{
        let {name,value} = event.target;
        setSignupInfo((prev) => ({ ...prev, [name]: value }));
    }

    let handleSubmit = async(e)=>{
        e.preventDefault();
        console.log(signupInfo);
        try{
            const url = `https://prithvi-yadavb.vercel.app/auth/signup`;
            const response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify(signupInfo)
            })
            const result = await response.json();
            const {success,message,error} = result
            if(success){
                handleSuccess(message);
                setTimeout(()=>{
                    navigate('/main/plants');
                },1000);
            }else if(error){
                const details = error?.details[0].message;
                handleError(details)
            }
            console.log(result);
        }
        catch(e){
            handleError(e);
        }
    }

  return (
    <div className='signup'>
        <div className='container'>
            <img src={logo} alt="" />
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" name='name' placeholder='Enter Name' onChange={handleInput} value={signupInfo.name}/>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' placeholder='Enter email'  onChange={handleInput} value={signupInfo.email} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' placeholder='Enter password' onChange={handleInput} value={signupInfo.password} />
                </div>
                <button type='submit'>signup</button>
                <span>Already have an account?
                    <Link className='goto' to={'/login'}>Login</Link>
                </span>
            </form>
            <ToastContainer/>
        </div>
    </div>
  )
}

export default Signup