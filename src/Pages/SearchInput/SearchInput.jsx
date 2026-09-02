import React from 'react'
import './SearchInput.css'
import SearchAvailable from '../../components/SearchAvailable/SearchAvailable'
import { Helmet } from 'react-helmet-async'

const SearchInput = () => {
  return (
    <>
    <Helmet>
      <title>Search - GoOn</title>
    </Helmet>
    <div className='search-input-container'>    
      <SearchAvailable/>
    </div>
    </>
  )
}

export default SearchInput
