import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Header from './Header'
import '../css/HomePage.css'

function HomePage() {

    const [items, setItems] = useState([]);

    useEffect(() => {
        // Fetch items from backend API using axios
        axios.get('/api/getitems')
          .then(response => {
            console.log('Fetched items:', response.data);
            setItems(response.data);
          })
          .catch(error => {
            console.error('Error fetching items:', error);
          });
      }, []);

    return (
        <>
            <Header />
            <div className="home-page">
                <h1 className='items-title'>Items</h1>
                <div className="card-container">
                    {items.map(item => (
                    <ItemCard key={item.itemid} item={item} />
                ))}
                </div>
            </div>
        </>
        
    )
}

const ItemCard = ({ item }) => {
    return (
      <div className="card">
        <img src={`/api/image/${item.itemid}`} alt={item.itemName} />
        <h2>{item.itemName}</h2>
        <p>{item.itemDescription}</p>
        <p>Starting Price: ${item.itemStartingPrice}</p>
        <p>Current Bid: ${item.itemBidPrice || 'None'}</p>
        <p>Seller: {item.SellerName}</p>
      </div>
    );
  };

export default HomePage