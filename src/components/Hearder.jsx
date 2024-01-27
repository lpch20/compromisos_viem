import React from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";

function Hearder() {
  const navigate = useNavigate();

  const exit = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container_header">
      <div className="logo">
        <img src="/images/logo_viem.png" alt="" />
      </div>

      <div>
        <button onClick={exit}>SALIR</button>
      </div>
    </div>
  );
}

export default Hearder;
