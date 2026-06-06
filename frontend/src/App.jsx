import { useState, useEffect } from "react";
import Catalogue from "./components/Catalogue";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import FicheJeu from "./components/FicheJeu";
import AdminLayout from "./components/admin/AdminLayout";

export default function App() {
  const [view, setView] = useState(() => {
    return localStorage.getItem("currentView") || "home";
  });
  const [user, setUser] = useState(null);
  const [selectedJeuId, setSelectedJeuId] = useState(() => {
    const saved = localStorage.getItem("selectedJeuId");
    return saved ? Number(saved) : null;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Si admin et pas déjà sur une page admin → rediriger
      if (parsedUser.role === "admin" && !localStorage.getItem("currentView")?.startsWith("admin")) {
        navigateTo("admin");
      }
    }

    window.history.replaceState({ view: localStorage.getItem("currentView") || "home" }, "GameVibe", window.location.href);
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
        localStorage.setItem("currentView", event.state.view);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (newView) => {
    setView(newView);
    localStorage.setItem("currentView", newView);
    window.history.pushState({ view: newView }, "GameVibe", window.location.href);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === "admin") {
      navigateTo("admin");
    } else {
      navigateTo("home");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentView");
    localStorage.removeItem("selectedJeuId");
    setUser(null);
    setView("home");
    window.history.pushState({ view: "home" }, "GameVibe", window.location.href);
  };

  return (
    <>
      {view === "home" && (
        <Home
          user={user}
          onGoToLogin={() => navigateTo("login")}
          onGoToRegister={() => navigateTo("register")}
          onLogout={handleLogout}
          onNavigate={navigateTo}
        />
      )}
      {view === "catalogue" && (
        <Catalogue
          user={user}
          onGoToLogin={() => navigateTo("login")}
          onGoToRegister={() => navigateTo("register")}
          onLogout={handleLogout}
          onNavigate={navigateTo}
          onSelectJeu={(id) => {
            setSelectedJeuId(id);
            localStorage.setItem("selectedJeuId", id);
            navigateTo("fiche-jeu");
          }}
        />
      )}
      {view === "fiche-jeu" && (
        <FicheJeu
          jeuId={selectedJeuId}
          user={user}
          onGoToLogin={() => navigateTo("login")}
          onGoToRegister={() => navigateTo("register")}
          onLogout={handleLogout}
          onNavigate={navigateTo}
        />
      )}
      {view === "login" && (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d1a" }}>
          <Login
            onSwitchToRegister={() => navigateTo("register")}
            onGoHome={() => navigateTo("home")}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}
      {view === "register" && (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d1a" }}>
          <Register
            onSwitchToLogin={() => navigateTo("login")}
            onGoHome={() => navigateTo("home")}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}
      {view === "admin" && (
        <AdminLayout
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}