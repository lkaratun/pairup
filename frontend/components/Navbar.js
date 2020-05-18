import React, { useContext } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { darken } from "polished";
import { UserContext } from "./UserProvider";
import device from "../styles/device";

function Navbar() {
  const userContext = useContext(UserContext) || {};
  console.log("UserContext = ", userContext);

  const { firstName, logOut } = userContext;
  const router = useRouter();

  return (
    <StyledNav>
      <ul>
        <li>
          <Link href="/">
            <Logo src=".././static/logo.svg" alt="logo" />
          </Link>
        </li>
        <li>
          <Link href="/events">
            <NavLink>Events</NavLink>
          </Link>
        </li>
        {firstName ? (
          <NavAuthButtons>
            <AuthSection>
              <Link href="/profile">
                <NavLink>{`Logged in as: ${firstName}`}</NavLink>
              </Link>
              <Link href="/profile">
                <NavLink>Profile</NavLink>
              </Link>
              <NavLink onClick={() => logOut().then(router.push("/"))}>
                Log out
              </NavLink>
            </AuthSection>
          </NavAuthButtons>
        ) : (
          <NavAuthButtonsLoggedIn>
            <UnAuthSection>
              <Link href="/login">
                <NavLink>Log in</NavLink>
              </Link>
              <Link href="/register">
                <NavLink>Register</NavLink>
              </Link>
            </UnAuthSection>
          </NavAuthButtonsLoggedIn>
        )}
      </ul>
    </StyledNav>
  );
}

export default Navbar;

const StyledNav = styled.nav`
  box-sizing: border-box;
  height: 3rem;
  background: linear-gradient(
    90deg,
    ${darken("0.05", "rgba(22, 67, 75, 1)")} 0%,
    ${darken("0.05", "rgba(28, 12, 91, 1)")} 100%
  );

  color: white;
  padding: 8px;

  ${device.mobileL`
    padding: 4px;
  `}

  ul {
    list-style-type: none;
    padding: 3px;
    margin: 0;
    display: flex;
    align-items: center;
    font-size: 1.1rem;

    ${device.mobileL`
      font-size: 1rem;
    `}
  }

  a {
    transition: all 300ms ease-out;
    text-decoration: none;
  }
`;

const Logo = styled.img`
  width: 100px;
  margin-right: 10px;
  margin-left: 15px;
  cursor: pointer;

  ${device.mobileL`
    margin-right: 10px;
    margin-left: 3px;
  `}
`;

const NavAuthButtons = styled.li`
  margin-left: auto;

  ${device.mobileL`
    font-size: 0.8rem;
  `}
`;

const NavAuthButtonsLoggedIn = styled.li`
  margin-left: auto;

  ${device.mobileL`
    font-size: 0.8rem;
  `}
`;

const NavLink = styled.a`
  cursor: pointer;
  color: inherit;
  margin-left: 20px;
  &:hover {
    color: gold;
  }

  ${device.mobileL`
    margin-left: 10px;
    margin-right: 10px;
  `}
`;

const UnAuthSection = styled.div`
  margin-right: 10px;
  font-size: 0.9rem;

  ${device.mobileL`
    margin-left: 5px;
    margin-right: 3px;
  `}
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  padding: 1px;
  margin-left: 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  margin-right: 10px;

  span {
    font-size: 1.7rem;
  }

  button {
    margin-left: 10px;
    color: white;
    border: 1px solid white;
    border-radius: 0;
    background: inherit;
    cursor: pointer;
  }
`;
