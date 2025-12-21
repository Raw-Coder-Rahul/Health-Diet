import React, { useState } from 'react';
import styled from 'styled-components';
import { Link as LinkR, NavLink as RouterNavLink } from 'react-router-dom';
import LogoImg from '../../public/images/my_healthy_plate_inarticle_400.jpg';
import { MenuRounded, Close } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { logout } from "../redux/reducers/userSlice";
import Tooltip from '@mui/material/Tooltip'; 

const Nav = styled.nav`
  background-color: ${({ theme }) => theme.nav_bg};
  height: 80px;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: ${({ theme }) => theme.shadow};
  border-bottom: 1px solid ${({ theme }) => theme.border_secondary};
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavLogo = styled(LinkR)`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 24px;
  text-decoration: none;
  color: ${({ theme }) => theme.white};

  @media screen and (max-width: 768px) {
    display: ${({ drawerOpen }) => (drawerOpen ? 'none' : 'flex')};
  }
`;

const SidebarLogo = styled(LinkR)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 700;
  font-size: 24px;
  text-decoration: none;
  color: ${({ theme }) => theme.black};
  margin-top: auto;
  padding-top: 40px;
`;

const Logo = styled.img`
  height: 42px;
`;

const MobileIcon = styled.div`
  display: none;
  cursor: pointer;

  @media screen and (max-width: 1000px) {
    display: ${({ $isOpen }) => ($isOpen ? 'none' : 'flex')};
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.text_primary};
  }
`;

const SideDrawer = styled.div`
  position: fixed;
  top: 80px;
  left: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
  width: 260px;
  height: calc(100vh - 80px);
  background-color: ${({ theme }) => theme.text_secondary};
  opacity: 1;
  box-shadow: ${({ theme }) => theme.shadow + '80'};
  display: flex;
  flex-direction: column;
  padding: 24px;
  transition: left 0.3s ease-in-out;
  z-index: 999;

  @media screen and (min-width: 1000px) {
    display: none;
  }
`;

const CloseIcon = styled.div`
  align-self: flex-end;
  cursor: pointer;
  margin-bottom: 24px;
`;

const DrawerLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const NavItem = styled(RouterNavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  transition: color 0.2s ease-in-out;

  &.active {
    color: ${({ theme }) => theme.primary};
    font-weight: 700;
    border-left: 4px solid ${({ theme }) => theme.primary};
    padding-left: 8px;
  }

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;

  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media screen and (max-width: 1000px) {
    position: absolute;
    top: 20px;
    right: 24px;

    .logout-btn {
      display: none;
    }
  }
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;

const TextButton = styled.div`
  text-align: center;
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 4px;
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.white};
  }

  &.mobile-logout {
    @media screen and (min-width: 1000px) {
      display: none;
    }
  }
`;

function Navbar({ currentUser }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const profileLabel = currentUser
    ? currentUser.fullName?.split(" ")[0] || currentUser.email || "Profile"
    : "Profile";

  return (
  <>
    <Nav>
      <LeftGroup>
        <MobileIcon $isOpen={isOpen} onClick={() => setIsOpen(true)}>
          <MenuRounded fontSize="large" />
        </MobileIcon>

        <NavLogo to="/">
          <Logo src={LogoImg} alt="Logo" />
          Health&Diet
        </NavLogo>
      </LeftGroup>

      <NavMenu>
        <Tooltip title="View your dashboard overview">
          <NavItem to="/" end>Dashboard</NavItem>
        </Tooltip>
        <Tooltip title="Track and manage your workouts">
          <NavItem to="/workouts">Workouts</NavItem>
        </Tooltip>
        <Tooltip title="Watch fitness tutorials and guides">
          <NavItem to="/tutorials">Tutorials</NavItem>
        </Tooltip>
        <Tooltip title="Log and analyze your meals">
          <NavItem to="/meals">Meals</NavItem>
        </Tooltip>
        <Tooltip title="Read health and fitness blogs">
          <NavItem to="/blogs">Blogs</NavItem>
        </Tooltip>
        <Tooltip title="Get in touch with us">
          <NavItem to="/contact">Contact Us</NavItem>
        </Tooltip>
        <Tooltip title="View and edit your profile">
          <NavItem to="/profile">{profileLabel}</NavItem>
        </Tooltip>
      </NavMenu>

      <UserContainer>
        {currentUser ? (
          <>
            {currentUser.profileImageUrl ? (
              <LinkR to="/profile">
                <Tooltip title="Go to Profile">
                  <Avatar src={currentUser.profileImageUrl} alt="User avatar" />
                </Tooltip>
              </LinkR>
            ) : (
              <LinkR to="/profile">
                <Tooltip title="Go to Profile">
                  <Avatar
                    as="div"
                    style={{
                      backgroundColor: "#6366f1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    {currentUser.fullName?.[0]?.toUpperCase() || "?"}
                  </Avatar>
                </Tooltip>
              </LinkR>
            )}
            <Tooltip title="Sign out of your account">
              <TextButton
                className="logout-btn"
                onClick={() => dispatch(logout())}
              >
                Logout
              </TextButton>
            </Tooltip>
          </>
        ) : (
          <LinkR to="/profile">
            <Tooltip title="Go to Profile">
              <Avatar src={LogoImg} alt="Default avatar" />
            </Tooltip>
          </LinkR>
        )}
      </UserContainer>
    </Nav>

    <SideDrawer $isOpen={isOpen}>
      <CloseIcon onClick={() => setIsOpen(false)}>
        <Close />
      </CloseIcon>
      <DrawerLinks>
        <Tooltip title="View your dashboard overview">
          <NavItem to="/" onClick={() => setIsOpen(false)}>Dashboard</NavItem>
        </Tooltip>
        <Tooltip title="Track and manage your workouts">
          <NavItem to="/workouts" onClick={() => setIsOpen(false)}>Workouts</NavItem>
        </Tooltip>
        <Tooltip title="Watch fitness tutorials and guides">
          <NavItem to="/tutorials" onClick={() => setIsOpen(false)}>Tutorials</NavItem>
        </Tooltip>
        <Tooltip title="Log and analyze your meals">
          <NavItem to="/meals" onClick={() => setIsOpen(false)}>Meals</NavItem>
        </Tooltip>
        <Tooltip title="Read health and fitness blogs">
          <NavItem to="/blogs" onClick={() => setIsOpen(false)}>Blogs</NavItem>
        </Tooltip>
        <Tooltip title="Get in touch with us">
          <NavItem to="/contact" onClick={() => setIsOpen(false)}>Contact Us</NavItem>
        </Tooltip>
        <Tooltip title="View and edit your profile">
          <NavItem to="/profile" onClick={() => setIsOpen(false)}>{profileLabel}</NavItem>
        </Tooltip>
        <Tooltip title="Sign out of your account">
          <TextButton
            className="mobile-logout"
            onClick={() => {
              dispatch(logout());
              setIsOpen(false);
            }}
          >
            Logout
          </TextButton>
        </Tooltip>
      </DrawerLinks>
      <SidebarLogo to="/">
        <Logo src={LogoImg} alt="Health&Diet Logo" />
        Health&Diet
      </SidebarLogo>
    </SideDrawer>
  </>
  );
}
export default Navbar;