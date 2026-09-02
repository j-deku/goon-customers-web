import { useState } from 'react';
import './BookingDashboard.css';
import BookSideBar from '../../components/BookSide/BookSideBar';
import BookSort from '../../components/BookSort/BookSort';
import SearchRides from '../../components/SearchRides/SearchRides';
import SearchArchive from '../../components/SearchArchive/SearchArchive';
import { Helmet } from 'react-helmet-async';
import RideSearchLandingContent from '../../components/RideSearchLandingContent/RideSearchLandingContent';

const BookingDashboard = () => {
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("all");

  return (
    <>
        <Helmet>
          <title>Search Rides - GoOn</title>
        </Helmet>
    <div className='booking-dashboard'>
    <RideSearchLandingContent/>
      <h1>Pickup Your Rides</h1>
      <BookSideBar onFilterChange={setFilterOption} />
      <div className='booking-grid'>
        <div className='booking-main'>
        <SearchRides sortOption={sortOption} filterOption={filterOption} />
        <SearchArchive />
        </div>
        <div className='booking-sidebar'>
          <BookSort onSortChange={setSortOption} />
        </div>
      </div>
    </div>
     </>
  );
};

export default BookingDashboard;