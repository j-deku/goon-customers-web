import React from "react";
import "./AppDownload.css";
import { Link } from "react-router-dom";
import CookieForm from "../CookieForm/CookieForm"
import LastPartner from "../LastPartner/LastPartner";

const AppDownload = () => {

  return (
    <div>
    <div className="app-download" id="app-download">
      <h1>
        Download Our Mobile Version GoOn App <br /> via
      </h1>
      <div className="app-download-img">
        <Link to="https://play.google.com" target="_blank">
          <img src='/google_play.png' alt="play store" />
        </Link>
        <Link to="https://appstore.com" target="_blank">
          <img src='/app_store.webp' alt="app store" />
        </Link>
      </div>
      <CookieForm/>
    </div>
    <LastPartner/>
    </div>
  );
};

export default AppDownload;
