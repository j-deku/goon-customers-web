import React, { useState } from 'react'
import './Auth.css'
import { toast } from 'react-toastify'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../axiosInstance'
import { Helmet } from 'react-helmet-async'

const Auth = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const verifyEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/api/user/verified-otp', { otp }, { withCredentials: true });
      if (response.data.success) {
        navigate("/")
      } else {
        navigate("/auth")
        toast.error(response.data.error || response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Verification failed.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    try {
      const response = await axiosInstance.post('/api/user/resend-otp', {}, { withCredentials: true });
      if (response.data.success) {
        toast.success("OTP resent successfully");
      } else {
        toast.error(response.data.message || "Could not resend OTP.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    }
  }

  return (
    <>
    <Helmet>
      <title>Verify Email - GoOn</title>
    </Helmet>
    <div className='auth'>
      <div className="overlay">
        <FaArrowLeft onClick={()=>navigate("/cart")} className='back' color='white'/>
      </div>
      <form action="" method="post" onSubmit={verifyEmail}>
        <h2>Email Verification</h2>
        <h3>Enter Your One-Time Password</h3>
        <input
          type='tel'
          name="otp"
          id="otp"
          placeholder='Enter your otp...'
          required
          autoFocus
          value={otp}
          onChange={e => setOtp(e.target.value)}
        />
        <button
          type="submit"
          value={"Submit"}
          className='subButton'
          formTarget='_self'
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Submit"}
        </button>
        <br/><br />
        <button type='button' onClick={handleResend} disabled={isSubmitting}>Resend</button>
      </form>
    </div>
    </>
  )
}

export default Auth