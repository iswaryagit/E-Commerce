import Head from "next/head";
import React,{ useState, useEffect } from "react";
import ProductItem from "../components/product/ProductItem";

const searchresults = () =>{
  const [products,setProducts] = useState([]);
  
  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("scanfiltered")));
  }, []);

  return (
    <>
        <div id="searchdiv" className="products">
          {products.map((productitem) => {
            return productitem[0] ? (<ProductItem key={productitem[0]._id} product={productitem[0]} />) : null;
          })}
        </div>
    </>
  );
};

export default searchresults;