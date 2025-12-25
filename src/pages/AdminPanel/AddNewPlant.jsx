import React, { useState, useEffect } from "react";
import { handleError, handleSuccess } from "../../util";
import { ToastContainer } from 'react-toastify'
import Navbar from "../../components/Navbar";
import { useParams } from "react-router-dom";

function AddAndUpdate() {

    const { id } = useParams();

    let [plantInfo, setPlantInfo] = useState({
        name: "",
        desc: "",
        image: "",
        category: "",
        price: 0,
        stock: 0,
        careTips: "",
    });

    const fetchPlant = async () => {
        try {   `/plants`

            const url = `${import.meta.env.VITE_API_URL}/plants/${id}`;
            const headers = {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(url, { method: 'GET', headers: headers });
            const result = await response.json();
            if (result.success) {
                setPlantInfo(
                    {
                        name: result.plant.name,
                        desc: result.plant.desc,
                        image: result.plant.image,
                        category: result.plant.category,
                        price: result.plant.price,
                        stock: result.plant.stock,
                        careTips: result.plant.careTips
                    }
                )
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
        if (id) {
            fetchPlant();
        }
    }, [id]);



    let handleInput = async (event) => {
        const { name, value } = event.target;
        setPlantInfo(prev => ({
            ...prev,
            [name]: name === "price" || name === "stock" ? Number(value) : value
        }));

    };

    let handleOnSubmit = async (event) => {
        event.preventDefault();

        const { name, desc, image, category, price, stock, careTips } = plantInfo;

        if (
            !name ||
            !desc ||
            !image ||
            !category ||
            careTips === "" ||
            price === "" ||
            stock === ""
        ) {
            handleError("Field cannot be empty");
            return;
        }

        try {
            let url = id
                ? `${import.meta.env.VITE_API_URL}/admin/updatestock/${id}`
                : `${import.meta.env.VITE_API_URL}/admin/addstock`;

            let method = id ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(plantInfo)
            });

            const result = await response.json();

            if (result.success) {
                handleSuccess(result.message);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError("Something went wrong");
        }
    };


    return (
        <div className="stock-page">
            <Navbar />
            <div className="add-stock">
                <h1>{id ? "Update Plant" : "Add New Plant"}</h1>
                <form onSubmit={handleOnSubmit}>
                    <div>
                        <label htmlFor="name">Plant Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter plant name"
                            value={plantInfo.name}
                            onChange={handleInput}
                        />
                    </div>

                    <div>
                        <label htmlFor="desc">Description</label>
                        <textarea
                            name="desc"
                            placeholder="Write description"
                            value={plantInfo.desc}
                            onChange={handleInput}
                        />
                    </div>

                    <div>
                        <label htmlFor="image">Image</label>
                        <input
                            type="text"
                            name="image"
                            placeholder="Enter image url"
                            value={plantInfo.image}
                            onChange={handleInput}
                        />
                    </div>

                    <div>
                        <label htmlFor="category">Category</label>
                        <input
                            type="text"
                            name="category"
                            placeholder="Enter plant category"
                            value={plantInfo.category}
                            onChange={handleInput}
                        />
                    </div>

                    <div>
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            name="price"
                            placeholder="Enter plant price"
                            value={plantInfo.price}
                            onChange={handleInput}
                        />
                    </div>

                    <div>
                        <label htmlFor="stock">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            placeholder="Enter plant stock"
                            value={plantInfo.stock}
                            onChange={handleInput}
                        />
                    </div>

                    <div>
                        <label htmlFor="careTips">Care Tips</label>
                        <input
                            type="text"
                            name="careTips"
                            placeholder="Enter plant tips"
                            value={plantInfo.careTips}
                            onChange={handleInput}
                        />
                    </div>

                    <button type="submit">{id ? "Update plant" : "Add plant"}</button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default AddAndUpdate;
