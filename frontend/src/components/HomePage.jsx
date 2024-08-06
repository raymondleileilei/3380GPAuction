import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import debounce from 'lodash/debounce';

import Header from './Header'
import '../css/HomePage.css'

function HomePage() {

  const [items, setItems] = useState([]);
  const [timers, setTimers] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');
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
    axios.get('https://three380g5project.onrender.com/api/getitems')
      .then(response => {
        console.log('Fetched items:', response.data);
        setItems(response.data);
        
        // Initialize timers
        const initialTimers = response.data.reduce((acc, item) => {
          acc[item._id] = new Date(item.endTime) - new Date();
          return acc;
        }, {});
        setTimers(initialTimers);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });

    // Update countdown every second
    const timer = setInterval(() => {
      setTimers(prevTimers => {
        const updatedTimers = { ...prevTimers };
        Object.keys(updatedTimers).forEach(id => {
          if (updatedTimers[id] > 0) {
            updatedTimers[id] -= 1000; // Decrement by 1 second
          }
        });
        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  // const handleSearch = () => {
  //   if (searchKeyword.trim() === '') {
  //     // If the search keyword is empty, fetch all items
  //     axios.get('/api/getitems')
  //       .then(response => {
  //         setItems(response.data); // Update the state with all items
  //       })
  //       .catch(error => {
  //         console.error('Error fetching items:', error);
  //       });
  //   } else {
  //     // Otherwise, perform the search
  //     axios.get(`/api/searchitems?keyword=${searchKeyword}`)
  //       .then(response => {
  //         setItems(response.data); // Update the state with the search results
  //       })
  //       .catch(error => {
  //         console.error('Error searching items:', error);
  //       });
  //   }
  // };

  
  const searchItems = useCallback(
    debounce((keyword) => {
      if (keyword.trim() === '') {
        axios.get('/api/getitems')
          .then(response => {
            setItems(response.data);
          })
          .catch(error => {
            console.error('Error fetching items:', error);
          });
      } else {
        axios.get(`/api/searchitems?keyword=${keyword}`)
          .then(response => {
            setItems(response.data);
          })
          .catch(error => {
            console.error('Error searching items:', error);
          });
      }
    }, 300), // Adjust the debounce delay as needed
    []
  );

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    searchItems(value);
  };

  return (
    <>
      <Header />
      <div className="home-page">
        <div className='header-items'> 
          <h1 className='items-title'>Items</h1>
          <input type='text' placeholder='Search for an item...' value={searchKeyword} onChange={handleSearchInputChange} className='search-bar'/>
          <button className='button' onClick={addItem}>Add item</button>
        </div>
        <div className="card-container">
          {items.map(item => (
            <ItemCard key={item._id} item={item} updateItemBid={updateItemBid} remainingTime={timers[item._id] || 0}/>
          ))}
        </div>
      </div>
    </>

  )
}

const ItemCard = ({ item, updateItemBid, remainingTime }) => {
  return (
    <div className="card">
      <img src={`/api/image/${item._id}`} alt={item.itemName} />
      <h2>{item.itemName}</h2>
      <p>{item.itemDescription}</p>
      <p>Starting Price: ${item.itemStartingPrice}</p>
      <p>Current Bid: ${item.itemBidPrice}</p>
      <p>Seller: {item.sellerName}</p>
      <p>Current Buyer: {item.buyerName}</p>
      <p>Time Remaining: {formatTime(remainingTime)}</p>
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

const formatTime = (milliseconds) => {
  if (milliseconds <= 0) return '00h 00m 00s';

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
};

export default HomePage
