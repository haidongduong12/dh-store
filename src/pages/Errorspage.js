import React from "react";
import "./css/Errorpage.css";
// import { useEffect } from "react";

const Errorspage = () => {
  return (
    <div>
      <p className="zoom-area">
        {/* <b>CSS</b>  */}
        Page not found !
      </p>
      <section className="error-container">
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
      </section>
      <div className="link-container">
        <a href="/" className="more-link">
          Go home
        </a>
      </div>
    </div>
  );
};

export default Errorspage;
