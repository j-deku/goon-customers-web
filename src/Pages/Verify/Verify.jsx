import React, { useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axiosInstance from '../../../axiosInstance'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get("success")
  const bookingId = searchParams.get("bookingId")
  const navigate = useNavigate()

  const verifyPayment = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/user/booking/verify",
        { success, bookingId },
        { withCredentials: true }
      )
      if (response.data.success) {
        navigate("/myBookings")
      } else {
        navigate("/")
      }
    } catch (error) {
      navigate("/")
        console.error("Payment verification failed:", error)
    }
  }

  useEffect(() => {
    verifyPayment()
    // eslint-disable-next-line
  }, []) // Only run once on mount

  return (
    <>
    <Helmet>
      <title>Verifying ...</title>
    </Helmet>
    <div className='verify'>
      <div className="spinner"></div>
    </div>
    </>
  )
}

export default Verify