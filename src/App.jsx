import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AddAndUpdate from './pages/AdminPanel/AddNewPlant'
import AdminDashboard from './pages/AdminPanel/AdminDashboard'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlantDetails from './pages/PlantDetails'
import Plants from './pages/Plants'
import Signup from './pages/Signup'
import ProtectedRoute from './ProtectedRoute'
import AboutUs from './pages/AboutUs'
import PlaceOrder from './pages/PlaceOrder'
import ManageOrders from './pages/AdminPanel/ManageOrders'
import OrderDetails from './pages/AdminPanel/OrderDetails'
import Order from './pages/Order'
import LandingPage from './pages/LandingPage'
import MainPage from './pages/MainPage'
import OrderSuccessfull from './pages/OrderSuccessfull'

function App() {
  const [quantity, setQuantity] = useState(1)

  const handleQuantity = (event) => {
    const name = event.target.name
    if (name === 'add') {
      setQuantity(prev => prev + 1)
    } else if (name === 'minus' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  return (
    <div className='App'>
      <Routes>
        {/* Redirect to landing */}
        <Route path='/' element={<Navigate to='/landing' />} />

        {/* Public Routes */}
        <Route path='/landing' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        {/* Main Page Layout with Nested Routes */}
        <Route path='/main' element={<MainPage />}>
          <Route path='plants' element={<Plants />} />
          <Route path='orders' element={<Order />} />
          <Route
            path='cart'
            element={<Cart quantity={quantity} handleQuantity={handleQuantity} />}
          />
          <Route
            path='aboutus'
            element={<ProtectedRoute><AboutUs /></ProtectedRoute>}
          />
          {/* ✅ Plant details now nested under /main */}
          <Route
            path='plant/:id'
            element={
              <ProtectedRoute>
                <PlantDetails quantity={quantity} handleQuantity={handleQuantity} />
              </ProtectedRoute>
            }
          />
        </Route>
        


        <Route path='/orderplaced' element={<ProtectedRoute><OrderSuccessfull/></ProtectedRoute>}/>
        <Route path='/admin/addstock' element={<ProtectedRoute><AddAndUpdate /></ProtectedRoute>} />
        <Route path='/admin/addstock/:id' element={<ProtectedRoute><AddAndUpdate /></ProtectedRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='/manageorders' element={<ManageOrders />} />
        <Route path='/orderdetails/:id' element={<OrderDetails />} />
      </Routes>
    </div>
  )
}

export default App
