import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/user/userSlice';

function UserProfile() {
  const userData = useSelector(selectUser);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{userData.name}</h1>
      <p>{userData.email}</p>
      <img src={userData.picture || userData.avatar} alt="User Profile" />
    </div>
  );
}

export default UserProfile;