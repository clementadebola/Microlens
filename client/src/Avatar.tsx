import React from "react";
import styled from "styled-components";
import { useAuth } from "./context/authContext";
import { gradientAnimation } from "./styles";
const AvatarItem = styled.div`
  position: relative;
  min-height: 110px;
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  animation: ${gradientAnimation} 5s infinite;
  background: linear-gradient(90deg, #045A69, #3E3F12, #0F7536);
  background-size: 200% 200%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  margin-bottom: 2.8rem;
`;

const Avatar = styled.div`
  position: absolute;
  width: 5rem;
  height: 5rem;
  border: 4px solid #ccc;
  border-radius: 50%;
  background-color: #14486a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  overflow: hidden;
  margin-top:50px;
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
    const initials = user.email.split("@")[0].substring(0, 2).toUpperCase();
    return <Avatar>{initials}</Avatar>;
  }
};

const UserAvatar = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  const username = currentUser.displayName || currentUser.email.split("@")[0];

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
