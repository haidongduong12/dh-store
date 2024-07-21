import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      axios
        .get(`http://localhost:8081/react/search?query=${query}`)
        .then((response) => {
          setResults(response.data);
          console.log(response.data);
        });
    }
  }, [location.search]);
  const detailsPage = (productId) => {
    navigate(`/ProductDetails/${productId}`);
  };

  return (
    <>
      <Header />
      <div className="container-fluid pt-5">
        <div className="text-center mb-4">
          <h2 className="section-title px-5">
            <span className="px-2">Search Results</span>
          </h2>
        </div>
        <div className="row px-xl-5 pb-3">
          {results && results.length > 0 ? (
            results.map((product) => (
              <div key={product.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img
                    src={`uploads/${product.product_image}`}
                    className="card-img-top"
                    alt={product.product_name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.product_name}</h5>
                    <p className="card-text">${product.product_price}</p>
                    <button
                      onClick={() => detailsPage(product.id)}
                      className="btn btn-primary"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="text-center">No results found.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
