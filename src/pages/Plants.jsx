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
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const filteredPlants = plants.filter(plant =>
        plant.name.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPlants = filteredPlants.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);


    const handleOnChange = (event) => {
        setSearch(event.target.value);
    }

    const fetchPlants = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            console.log(import.meta.env.VITE_API_URL);

            const headers = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(`https://prithvi-yadavb.vercel.app/plants`, {
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
        finally {
            setLoading(false);
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
                    {loading ?
                        (<div className="loading">
                            <p>Loading plants...</p>
                        </div>) :
                        currentPlants.length > 0 ? (
                            currentPlants.map((plant) => (
                                <div
                                    className='plant'
                                    key={plant._id}
                                    onClick={() => handleOnClick(plant._id)}
                                >
                                    <PlantCard
                                        img={plant.image}
                                        name={plant.name}
                                        price={plant.price}
                                        stock={plant.stock}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className='no-plant-found'>
                                <p>No plants found</p>
                            </div>
                        )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="pagination">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Prev
                        </button>

                        <span>{currentPage} / {totalPages}</span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}

            </div>
        </>
    )
}

export default Plants