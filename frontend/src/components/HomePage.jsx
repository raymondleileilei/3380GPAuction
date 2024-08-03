import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Header from './Header'
import '../css/HomePage.css'

function HomePage() {

  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const addItem = (e) => {
    e.preventDefault();
    navigate('/addItem');
  }

  const updateItemBid = (id, newBidPrice, buyerName) => {
    setItems(items.map(item =>
      item._id === id
        ? { ...item, itemBidPrice: newBidPrice, buyerName: buyerName }
        : item
    ));
  };

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
            <ItemCard key={item._id} item={item} updateItemBid={updateItemBid}/>
          ))}
        </div>
      </div>
    </>

  )
}

const ItemCard = ({ item,updateItemBid }) => {
  return (
    <div className="card">
      <img src={`/api/image/${item._id}`} alt={item.itemName} />
      <h2>{item.itemName}</h2>
      <p>{item.itemDescription}</p>
      <p>Starting Price: ${item.itemStartingPrice}</p>
      <p>Current Bid: ${item.itemBidPrice}</p>
      <p>Seller: {item.sellerName}</p>
      <p>Current Buyer: {item.buyerName}</p>
      <UpdateBid item={item} updateItemBid={updateItemBid}/>
    </div>
  );
};

const UpdateBid = ({item, updateItemBid}) => {
  const [bid, setBid] = useState('');
  const [buyerName, setBuyerName] = useState('');
  
  const onBidChange = (e) => {
    setBid(e.target.value)
  };

  const onNameChange = (e) => {
    setBuyerName(e.target.value)
  };

  const updateBid = (e) => {
    e.preventDefault();
    if((item.itemBidPrice==0&&bid>=item.itemStartingPrice && buyerName)||(item.itemBidPrice!=0&&bid>0 && buyerName)){
    const newBid = {
      itemBidPrice: Number(item.itemBidPrice)+Number(bid),
      buyerName: buyerName
  };
    axios.put(`http://localhost:5001/api/updatebid/${item._id}`, newBid)
      .then(response => {
        console.log('Bid updated:', response.data);
        Swal.fire({
          title: 'Success!',
          text: 'Bid success',
          icon: 'success',
          confirmButtonText: 'OK',
          background: 'rgba(33,53,71,0)',
          confirmButtonColor: '#1a1a1a',
          cancelButtonColor: '#1a1a1a',
        });
        updateItemBid(item._id, newBid.itemBidPrice, newBid.buyerName);
      })
      .catch(error => {
        console.error('There was an error updating the bid!', error);
      });}
      else{
        if(item.itemBidPrice!=0||!bid||!buyerName){
        Swal.fire({
          title: 'Bid Unsuccess!',
          text: 'Please fill in your name and bid amount',
          icon: 'warning',
          confirmButtonText: 'Retry',
          background: 'rgba(33,53,71,0)',
          confirmButtonColor: '#1a1a1a',
          cancelButtonColor: '#1a1a1a',
        })}else{
          Swal.fire({
            title: 'Bid Unsuccess!',
            text: 'Please enter amount more than / same as starting price',
            icon: 'warning',
            confirmButtonText: 'Retry',
            background: 'rgba(33,53,71,0)',
            confirmButtonColor: '#1a1a1a',
            cancelButtonColor: '#1a1a1a',
          })
        }
        ;
      }
  };

  return (
    <div>
    <form onSubmit={updateBid}>
      <input type="text"
      onChange={onNameChange}
        name="buyerName"
        placeholder="Type your name"
      />
      <input type="number"
        onChange={onBidChange}
        name="addbid"
        placeholder="Type your bid"
      />
      <button className="biddingBtn" type="submit" id="submit">Add Bid</button>
    </form>
    </div>
  );
};

export default HomePage
