import React, { useEffect, useState } from 'react';
import './App.css';
import Habit from './Habit';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

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
        const decoded = jwtDecode(token);

        try {
            const response = await axios.get(`${backendUrl}/api/habits`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: { userId: decoded.userId },
            });

            const data = response.data;

            setHabits(data);
        } catch (error) {
            console.error('Error fetching habits:', error);

            alert('There was an error fetching your habits. Please try again.');
        }
    };


    const addHabit = async () => {
        try {
            const decoded = jwtDecode(token);
            const userId = decoded.userId
            if (newHabit.trim()) {
                const newHabitData = { name: newHabit, userId: userId };

                const response = await axios.post(`${backendUrl}/api/habits`, newHabitData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    }
                );
                const data = response.data;

                setHabits((prevHabits) => [...prevHabits, data]);
                setNewHabit('');
            }
        } catch (error) {
            console.error('Error adding habit:', error);

            if (error.response) {
                alert(error.response.data.message || 'There was an error adding your habit. Please try again later.');
            } else {
                alert('There was an error adding your habit. Please try again later.');
            }
        }
    };


    const removeHabit = async (id, theid) => {
        const decoded = jwtDecode(token);
        const userId = decoded.userId
        try {
            await axios.delete(`${backendUrl}/api/habits/${theid}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: { userId: userId }
            });

            setHabits(habits.filter((habit) => habit._id !== theid));
        } catch (error) {
            console.error('Error removing habit:', error);

            alert('There was an error removing your habit. Please try again later.');
        }
    };

    const toggleCompletion = async (id, theid) => {
        const decoded = jwtDecode(token);
        const userId = decoded.userId
        try {
            const habit = habits.find((habit) => habit._id === theid);

            const updatedHabit = { ...habit, completed: !habit.completed };

            const response = await axios.put(
                `${backendUrl}/api/habits/${theid}`,
                updatedHabit,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    params: { userId: userId }
                }
            );

            const data = response.data;

            setHabits(habits.map((habit) =>
                habit._id === theid ? { ...habit, completed: data.completed } : habit
            ));

        } catch (error) {
            console.error('Error toggling completion:', error);
            alert('There was an error updating the habit. Please try again later.');
        }
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button className='lbtn3' style={{ marginRight: "8px" }} onClick={handleLogout}>Logout</button>
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
