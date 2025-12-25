// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// export const AuthContext = createContext();
// export const AuthProvider = ({ children }) => {
//     let [isLoggedIn, setIsLoggedIn] = useState(false);
//     let [username, setUsername] = useState('');
//     const navigate = useNavigate();
    
//     useEffect(() => {
//         let token = localStorage.getItem('token');
//         let name = localStorage.getItem('username');
//         setIsLoggedIn(!!token);
//         if (name) setUsername(name);
//     }, []);


//     const login = (token, name, role, userId) => {
//         localStorage.setItem('token', token)
//         localStorage.setItem('username', name)
//         localStorage.setItem('role', role)
//         localStorage.setItem('userId', userId)
//         setIsLoggedIn(true);
//         setUsername(name);
//     }

//     const logout = () => {
//         setTimeout(() => {
//             localStorage.removeItem('token')
//             localStorage.removeItem('username')
//             localStorage.removeItem('role')
//             localStorage.removeItem('userId')
//             setIsLoggedIn(false);
//             setUsername('');
//             navigate('/login');
//         }, 1000);
//     }
//     return (
//         <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

