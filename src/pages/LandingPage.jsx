import plantImg from "../assets/plant.png";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import logo from "../assets/PYH-logo.png";
import Plants from "./Plants";
import AboutUs from "./AboutUs";
import { useState, useEffect } from "react";

function LandingPage() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  //Redirect authenticated users
  useEffect(() => {
    if (token) {
      navigate(role === "admin" ? "/dashboard" : "/main/plants", {
        replace: true,
      });
    }
  }, [token, role, navigate]);

  if (token) return null; //Landing page hide

  return (
    <div className="home">
      {/* LANDING NAVBAR (ONLY FOR GUEST USERS) */}
      <div className="landing-nav">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="actions">
          <div className="aboutus">
            <p onClick={() => setIsActive(!isActive)}>
              {isActive ? "Home" : "About Us"}
            </p>
          </div>

          <div className="aboutus">
            <p onClick={() => navigate("/login")}>Login</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {isActive ? (
        <AboutUs />
      ) : (
        <>
          <div className="home-content">
            <div className="plant-image">
              <img src={plantImg} alt="plant" />
            </div>

            <div className="home-title-desc">
              <h1>
                TREES ARE ALWAYS NICE TO <br />
                US. BE NICE TO THEM
              </h1>
              <p>
                Trees give us shade, clean air, and homes for many creatures.
                They help our planet stay healthy. Let’s protect and plant
                more trees.
              </p>
              <button onClick={() => navigate("/login")}>Shop Now</button>
            </div>
          </div>

          <Plants />
        </>
      )}
    </div>
  );
}

export default LandingPage;
