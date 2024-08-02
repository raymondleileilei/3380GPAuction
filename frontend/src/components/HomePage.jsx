import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from './Header'
import '../css/HomePage.css'

function HomePage() {

  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const addItem = (e) => {
    e.preventDefault();
    navigate('/addItem');
  }

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
        <div className='header-items'>
          <h1 className='items-title'>Items</h1>
          <button className='button' onClick={addItem}>Add item</button>
        </div>
        <div className="card-container">
          {items.map(item => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </>

  )
}

const ItemCard = ({ item }) => {
  return (
    <div className="card">
      <img src={`/api/image/${item._id}`} alt={item.itemName} />
      <h2>{item.itemName}</h2>
      <p>{item.itemDescription}</p>
      <p>Starting Price: ${item.itemStartingPrice}</p>
      <p>Current Bid: ${item.itemBidPrice || 'None'}</p>
      <p>Seller: {item.sellerName}</p>
    </div>
  );
};

const UpdateBid = (props) => {
  const [bid, setBid] = useState('');
  const onBidChange = (e) => {
    setBid(e.target.value)
  };

  const updateBid = (e) => {
    e.preventDefault();

    axios.post(`http://localhost:5001/api/updatebid/${props.id}`, bid)
      .then(response => {
        console.log('Item posted:', response.data);
      })
      .catch(error => {
        console.error('There was an error updating the bid!', error);
      });
  };

  return (
    <form onSubmit={updateBid}>
      <input type="text"
        onChange={onBidChange}
        name="addbid"
        placeholder="Type your bid here..."
      />
      <button type="submit" id="submit">Add Bid</button>
    </form>
  );
};

export default HomePage
