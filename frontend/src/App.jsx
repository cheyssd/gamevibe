import { useState, useEffect } from "react";
import Catalogue from "./components/Catalogue";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import FicheJeu from "./components/FicheJeu";
import Profil from "./components/Profil";
import AdminLayout from "./components/admin/AdminLayout";

export default function App() {
  const [view, setView] = useState(() => localStorage.getItem("currentView") || "home");
  const [user, setUser] = useState(null);
  const [selectedJeuId, setSelectedJeuId] = useState(() => {
    return localStorage.getItem("selectedJeuId") || null;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
    window.history.replaceState({ view: localStorage.getItem("currentView") || "home" }, "GameVibe", window.location.href);
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.view) {
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
    navigateTo(userData.role === "admin" ? "admin" : "home");
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

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const commonProps = {
    user,
    onGoToLogin:    () => navigateTo("login"),
    onGoToRegister: () => navigateTo("register"),
    onLogout:       handleLogout,
    onNavigate:     navigateTo,
  };

  return (
    <>
      {view === "home"      && <Home      {...commonProps} />}
      {view === "catalogue" && <Catalogue {...commonProps} onSelectJeu={(id) => { setSelectedJeuId(id); localStorage.setItem("selectedJeuId", id); navigateTo("fiche-jeu"); }} />}
      {view === "fiche-jeu" && <FicheJeu  {...commonProps} jeuId={selectedJeuId} />}
      {view === "profil"    && <Profil    {...commonProps} onUpdateUser={handleUpdateUser} />}
      {view === "login"     && (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d1a" }}>
          <Login onSwitchToRegister={() => navigateTo("register")} onGoHome={() => navigateTo("home")} onLoginSuccess={handleLoginSuccess} />
        </div>
      )}
      {view === "register"  && (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d1a" }}>
          <Register onSwitchToLogin={() => navigateTo("login")} onGoHome={() => navigateTo("home")} onLoginSuccess={handleLoginSuccess} />
        </div>
      )}
      {view === "admin"     && <AdminLayout user={user} onLogout={handleLogout} onNavigate={navigateTo} />}
    </>
  );
}