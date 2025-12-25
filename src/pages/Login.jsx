import React from 'react'
import { useState,useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { handleError, handleSuccess } from '../util';
import {ToastContainer} from 'react-toastify'
import logo from '../assets/PYH-logo.png'
function Login() {
    const navigate = useNavigate();
    const [loginInfo,setLoginInfo] = useState({
        email:'',
        password:''
    });

    let handleInput = (event)=>{
        const {name,value} = event.target;
        setLoginInfo((prev)=>({...prev,[name]:value}));
    }

    let handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            const url = `${import.meta.env.VITE_API_URL}/auth/login`;
            const response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const {success,id,name,message,jwtToken,error,role} = result
            if(success){
                handleSuccess(message);
                localStorage.setItem('token', jwtToken)
                localStorage.setItem('username', name)
                localStorage.setItem('role', role)
                localStorage.setItem('userId', id)
                setTimeout(()=>{
                    if(role=="user"){
                        navigate('/main/plants');
                    }
                    else{
                        navigate('/dashboard');
                    }
                },1000);
            }else{
                const message =
                    error?.message ||
                    error?.error ||
                    error?.details?.[0]?.message ||
                    "Email or password incorrect";
                    handleError(message);
            }
            
        }
        catch(er){
            handleError(er);
        }
    }


    return (
        <div className='login'>
            <div className='container'>
                <img src={logo} alt="" />
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" name='email' placeholder='Enter email'  onChange={handleInput} value={loginInfo.email} />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" name='password' placeholder='Enter password' onChange={handleInput} value={loginInfo.password} />
                    </div>
                    <button type='submit'>Login</button>
                    <span>Don't have any account?
                        <Link className='goto' to={'/signup'}>Signup</Link>
                    </span>
                </form>
                <ToastContainer/>
            </div>
        </div>
    )
}

export default Login