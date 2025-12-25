// const fetchPlant = async (id) => {
//     try {
//         const url = `http://localhost:5000/plants/${id}`;
//         const headers = {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//         };

//         const response = await fetch(url, { method: 'GET', headers: headers });
//         const result = await response.json();
//         if (result.success) {
//             setPlant(result.plant)
//         }
//         else {
//             handleError(result.message);
//         }
//         console.log(result)
//     }
//     catch (err) {
//         console.error(err);
//         handleError(err);
//     }
// }

// module.exports = fetchPlant(id)