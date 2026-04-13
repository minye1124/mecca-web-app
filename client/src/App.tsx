import { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnoucementBar'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

type AuthUser = {
  firstName: string;
  lastName: string;
  email: string;
};

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  //const [authToken, setAuthToken] = useState<string | null>(null);

  const handleLoginSuccess = ({ user, token }: { user: AuthUser; token: string }) => {
    setAuthUser(user);
    //setAuthToken(token);
    localStorage.setItem("authUser", JSON.stringify(user));
    localStorage.setItem("authToken", token);
  }

  const handleSignOut = () => {
    setAuthUser(null);
    //setAuthToken(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  }

  // Recover auth state from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      try {
        setAuthUser(JSON.parse(storedUser));
        //setAuthToken(storedToken);
      } catch {
        console.error("Failed to parse stored user");
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fisrtName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!token || !email) return;

    handleLoginSuccess({
      user: {
        firstName: fisrtName ?? "",
        lastName: lastName ?? "",
        email,
      },
      token
    });

    // Clean URL after processing
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  return (
    <div>
      <AnnouncementBar />
      <Navbar
        authUser={authUser}
        //authToken={authToken}
        onLoginSuccess={handleLoginSuccess}
        onSignOut={handleSignOut}
      />
      <HomePage />
      <Footer />
    </div>
  )
}

export default App
