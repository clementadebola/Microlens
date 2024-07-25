import React, { useEffect } from "react";
import styled from "styled-components";
import { bouncy } from "ldrs";
import logo from "./assets/logo.jpg";

const LoaderRenderer = styled.div`
  width: 100%;
  height: 100vh;
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.background};
`;
const Logo = styled.img`
  width: 80px;
  margin-bottom: 20px;
  border-radius: 30px;
`;

const MainLoader = () => {
  useEffect(() => {
    bouncy.register();
  }, []);
  return (

    <LoaderRenderer>
        <Logo src={logo} alt="Microlens" /> 
      <l-bouncy size="35" speed="2" color="grey"></l-bouncy>
    </LoaderRenderer>
  );
};

export default MainLoader;
