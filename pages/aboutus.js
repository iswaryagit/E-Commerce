import Head from "next/head";
import React from "react";

const Aboutus = () => {
  return (
    <div className="mt-2 containerabout">
      <h1 className="heading">About Us</h1>
      <div className="aboutcontainer">
        <img src="/E Mart.png" alt="E-Mart Logo" className="logo" />
        <p className="spacing aboutdetail">
          E-Mart is a constantly evolving technological infrastructure which
          connects this vast and diverse region and offers a shopping
          experience that is safe, seamless, and enjoyable.{" "}
        </p>
        <p className="spacing2 aboutdetail">
          E-Mart lifestyle redefines the boundaries of retail, delivering
          engaging and entertaining experiences customized to each of our
          markets. Discover the world at your fingertips on E-Mart.{" "}
        </p>
      </div>
    </div>
  );
};

export default Aboutus;
