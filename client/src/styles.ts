import styled from "styled-components";
import { Link } from "react-router-dom";
import { animated } from "react-spring";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background};
  padding: 20px;
  max-width: 600px;
  height: 100%;
  margin: 0 auto;
  overflow-y:hidden;
`;

export const AnimatedPage = animated(styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.background};
  padding:${(props) => props.theme.spacing.small} ;
  color: #ffffff;
  overflow-y: auto;
`);

export const Logo = styled.img`
  width: 110px;
  border-radius: 30px;
  margin-bottom: 20px;
`;

export const Button = styled.button`
  background-color: #163452;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
  align-self: center;
  max-width: 300px;
  &:hover {
    background-color: #0c1f31;
  }
`;

export const BackButton = styled.div`
  position: absolute;
  border-radius: 10px;
  height: 40px;
  width: 40px;
  top: 20px;
  left: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ededed;

  svg {
    color: #000;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

export const Form = styled.form`
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;

`;

export const ErrorMessage = styled.p`
  color: crimson;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const StyledLink = styled(Link)`
  margin-top: 18px;
  color: #1e4a87;
  font-size: 13px;
  text-decoration: none;
`;

export const FederatedButton = styled(Button)`
  max-width: 300px;
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const SignUpLink = styled(Link)`
  margin-top: 18px;
  color: #1e4a87;
  font-size: 13px;
  text-decoration: none;
`;

export const CloseButton = styled.div`
  position: absolute;
  border-radius: 10px;
  height: 40px;
  width: 40px;
  top: 20px;
  right: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ededed;

  svg {
    color: #000;
  }
`;

export const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const PasswordToggle = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
`;

export const SettingItem = styled.div`
  margin-bottom: 20px;
  width: 100%;

  .st-i {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
  .st-i:hover {
    background: rgba(15, 85, 155, 0.6);
    padding: 5px 10px;
    border-radius: 6px;
    transition: all 0.3s ease-in-out;
  }
`;

export const SettingLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

export const SettingInput = styled.input`
  width: 95%;
  padding: 10px 20px;
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 5px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: #2c3e50;
  color: #fff;
  border: 1px solid ${(props) => props.theme.colors.border};
  resize: vertical;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.colors.primary};
  color: #fff;
  border: none;
  align-self: center;
  border-radius: 18px;
  cursor: pointer;
`;

export const LogEntry = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 5px;

  h3 {
    margin-bottom: 10px;
  }

  ul {
    padding-left: 20px;
  }
  li {
    font-size: 13px;
  }
`;
