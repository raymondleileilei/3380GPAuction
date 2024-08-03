import '../css/HomePage.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddItem() {

    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemStartingPrice, setItemStartingPrice] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const postItem = (e) => {
        e.preventDefault();
        const newItem = {
            itemName,
            itemDescription,
            itemStartingPrice,
            sellerName,
            itemImg: "noimg.jpg",
        };
        axios.post('http://localhost:5001/api/additem', newItem)
            .then(response => {
                console.log('Item posted:', response.data);
                navigate('/'); // Redirect after successful post
            })
            .catch(error => {
                console.error('There was an error posting the item!', error);
                setErrorMessage('Please fill in all the fields.')
            });
    };


    return (
        <>
            <h1 className="title">Add an item</h1>
            <div className="itemForm">
                <div className="itemField">Item Name: <input id="itemName" name="itemName" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)}></input></div>
                <div className="itemField">Item Description: <input id="itemDescription" name="itemDescription" type="text" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)}></input></div>
                <div className="itemField">Item Starting Price: <input id="itemStartingPrice" name="itemStartingPrice" type="number" value={itemStartingPrice} onChange={(e) => setItemStartingPrice(e.target.value)}></input></div>
                <div className="itemField">Your Name: <input id="sellerName" name="sellerName" type="text" value={sellerName} onChange={(e) => setSellerName(e.target.value)}></input></div>
            </div>
            {errorMessage && <div className="errorMessage show">{errorMessage}</div>}
            <div>
                <button onClick={postItem}>Post Item!</button>
            </div>
        </>
    )
}

export default AddItem