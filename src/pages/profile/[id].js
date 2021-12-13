import React from 'react';
import { useRouter } from 'next/router';
import Profile from '../../components/profile/Profile';

const ProfileRenderer = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log('id in renderer: ', id);
  if (id) {
    return (
      <Profile id={id}/>
    );
  }
  return (
    <div></div>
  );
};

export default ProfileRenderer;
