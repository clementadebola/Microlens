import React from 'react';
import styled from 'styled-components';
import { useAuth } from './context/authContext';

const AvatarItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  width: fit-content;
  margin-bottom: 10px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #14486a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.p`
  margin: 0;
  font-weight: bold;
`;

const Email = styled.p`
  margin: 0;
  font-size: 0.8em;
  color: #666;
`;


const CustomAvatar = ({ user }) => {
  if (user.photoURL) {
    return (
      <Avatar>
        <AvatarImage src={user.photoURL} alt={user.displayName || user.email} />
      </Avatar>
    );
  } else {
    const initials = user.email.split('@')[0].substring(0, 2).toUpperCase();
    return <Avatar>{initials}</Avatar>;
  }
};

const UserAvatar = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null; 
  }

  const username = currentUser.displayName || currentUser.email.split('@')[0];

  return (
    <AvatarItem>
      <CustomAvatar user={currentUser} />
      <UserInfo>
        <Username>{username}</Username>
        <Email>{currentUser.email}</Email>
      </UserInfo>
    </AvatarItem>
  );
};

export default UserAvatar;