import React from 'react'
import './FirstQuestion.css'
import { useNavigate } from 'react-router-dom'
const FirstQuestion = () => {
  const navigate = useNavigate();
        const submitAnswer1 = (event) =>{
            event.preventDefault();
            localStorage.setItem("dr", "Driver");
             navigate('/driver');
        }
        const submitAnswer2 = (event) =>{
            event.preventDefault();
            localStorage.setItem("Tr", "traveller");
            navigate('/');
        }
  return (
    <div className='overlay'>
    <form>
      <div className='form-question'>
        <h3>Answer the following questions to proceed</h3>
        <h1>Are you a driver or a traveller</h1> 
        <button type='submit' onClick={submitAnswer1}>I'm  a Driver</button>
        <button type='submit' onClick={submitAnswer2}>I'm a traveller</button>
      </div>
    </form>
    </div>
  )
}

export default FirstQuestion