import React, { useEffect, useState } from 'react';
import './App.css';
import Habit from './Habit';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {

    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate()

    const backendUrl = process.env.REACT_APP_THE_LINK;

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
            fetchHabits();
        }
        else {
            navigate("/login")
        }
        // eslint-disable-next-line
    }, [token]);

    const fetchHabits = async () => {
        try {
          const response = await fetch(`${backendUrl}/api/habits`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            // If the response is not OK, throw an error
            throw new Error('Failed to fetch habits');
          }
      
          const data = await response.json();
          setHabits(data);
      
        } catch (error) {
          console.error('Error fetching habits:', error);
          alert('There was an error fetching your habits. Please try again.');
        }
      };
      

      const addHabit = async () => {
        try {
            if (newHabit.trim()) {
                const newHabitData = { name: newHabit };
    
                const response = await fetch(`${backendUrl}/api/habits`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(newHabitData),
                });
    
                if (!response.ok) {
                    throw new Error(`Failed to add habit. Status: ${response.status}`);
                }
    
                const data = await response.json();
    
                setHabits((prevHabits) => [...prevHabits, data]);
                setNewHabit('');
            }
        } catch (error) {
            console.error('Error adding habit:', error);
            alert('There was an error adding your habit. Please try again later.');
        }
    };
    

    const removeHabit = async (id, theid) => {
        await fetch(`${backendUrl}/api/habits/${theid}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        setHabits(habits.filter((habit) => habit._id !== theid));
    };

    const toggleCompletion = async (id, theid) => {
        const habit = habits.find((habit) => habit._id === theid);
        const updatedHabit = { ...habit, completed: !habit.completed };

        const response = await fetch(`${backendUrl}/api/habits/${theid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updatedHabit),
        });

        const data = await response.json();
        setHabits(habits.map((habit) => (habit._id === theid ? { ...habit, completed: data.completed } : habit)));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setToken(null);
        setHabits([]);
    };

    return (
        <div className='page'>
            <div className='navbar'>
                <h1 className='heading'>Habit Tracker</h1>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <button className='lbtn3' style={{marginRight: "8px"}} onClick={handleLogout}>Logout</button>
                    <img src={require('./assets/profile.png')} className='profileimg' alt='profileimg' />
                </div>
            </div>
            <div className='bottom-section'>
                <h1 className='addHabit'>Add a habit</h1>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        placeholder="Enter a new habit..."
                        className='hinput'
                    />
                    <button onClick={addHabit} className='hbtn'>Add Habit</button>
                </div>
                <div style={{
                    marginTop: '20px',
                    maxHeight: '600px',
                    overflowY: 'scroll',
                    padding: '10px',
                }}>
                    {habits.length > 0 ? (
                        <div style={{ overflowY: 'scroll' }}>
                            {habits.map((habit, index) => (
                                <Habit
                                    key={index}
                                    habit={habit}
                                    onToggle={() => toggleCompletion(index, habit._id)}
                                    onRemove={() => removeHabit(index, habit._id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className='nohabitname'>No habits yet. Add one above!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomeScreen;
