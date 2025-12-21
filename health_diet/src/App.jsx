import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "./utills/Themes";
import Authentication from "./pages/Authentication";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Tutorials from "./pages/Tutorials";
import Meals from "./pages/Meals";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import { Routes, Route } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  max-width: 1900px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: ${({ theme }) => theme.bg};
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  transition: background-color 0.3s ease;
`;

function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={lightTheme}>
      <Container>
        {currentUser ? (
          <>
            <Navbar currentUser={currentUser} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/meals" element={<Meals />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </>
        ) : (
          <Authentication />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;