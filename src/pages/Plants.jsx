import { useEffect, useState } from 'react'
import PlantCard from '../components/PlantCard'
import Navbar from '../components/Navbar';
import { handleError } from '../util';
import { useNavigate } from 'react-router-dom';
import PlantDetails from './PlantDetails';
function Plants() {

    const navigator = useNavigate();
    const [plants, setPlants] = useState([]);
    const [search, setSearch] = useState('');

    const handleOnChange = (event) => {
        setSearch(event.target.value);
    }

    const fetchPlants = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log(import.meta.env.VITE_API_URL);

            const headers = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/plants`, {
                method: "GET",
                headers
            });

            const result = await response.json();

            if (result.success) {
                setPlants(result.plants);
            } else {
                handleError(result.message);
            }
        }
        catch (err) {
            console.error(err);
            handleError("Something went wrong");
        }
    };


    // useEffect(() => {
    //     fetchPlants();

    //     const interval = setInterval(() => {
    //         fetchPlants();
    //     }, 5000);

    //     return () => clearInterval(interval);
    // }, []);
    useEffect(() => {
        fetchPlants();
    }, []);



    let handleOnClick = (id) => {
        const role = localStorage.getItem('role');
        role === "user" ? navigator(`/main/plant/${id}`) : navigator(`/admin/addstock/${id}`)
    }

    return (
        <>
            <div className='plants'>
                <div className='search-bar'><input type="text" placeholder='Search plants...' onChange={handleOnChange} /></div>
                <div className='plant-list'>
                    {plants.filter(plant => plant.name.toLowerCase().includes(search.toLowerCase())).length > 0 ?
                        plants.filter(plant => plant.name.toLowerCase().includes(search.toLowerCase())).
                            map((plant) => (
                                <div className='plant' key={plant._id} onClick={() => {handleOnClick(plant._id) }}><PlantCard img={plant.image} name={plant.name} price={plant.price} stock={plant.stock} /></div>
                            )) : <div className='no-plant-found'><p>No plants found</p></div>}
                </div>
            </div>
        </>
    )
}

export default Plants