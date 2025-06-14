"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

const BacklinkFinder = () => {
  const [url, setUrl] = useState(""); // To store user input
  const [result, setResult] = useState(null); // To store API response
  const [loading, setLoading] = useState(false); // Loading indicator
  const [backlinks, setBacklinks] = useState(null);
  const [overview, setOverview] = useState(null);

  console.log("result", result);

  console.log("backlinks", backlinks);

  const handleSearch = async () => {
    if (!url.trim()) {
      alert("Please enter a URL.");
      return;
    }

    setLoading(true);
    setResult(null);
    setBacklinks(null);
    setOverview(null);

    const options = {
      method: "GET",
      url: "https://seo-api-get-backlinks.p.rapidapi.com/backlinks.php",
      params: {
        domain: url, // 👈 use user's input instead of hardcoded domain
      },
      headers: {
        "x-rapidapi-key": "085bd28979msh47d9c822c9b44f3p1c0e13jsncf61a6426940",
        "x-rapidapi-host": "seo-api-get-backlinks.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log("API Response:", response.data);
      setResult(response.data);
      setBacklinks(response.data.result?.backlinks || []);
      setOverview(response.data.result?.overview || {});
    } catch (error) {
      console.error("Error fetching backlinks:", error);
      if (error.response?.status === 429) {
        setResult(
          "You're sending requests too fast! Please wait a minute and try again."
        );
      } else {
        setResult("Failed to fetch backlinks. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Backlink Finder
          </span>
        </Link>
        <div
          style={{ width: "30%" }}
          className="flex justify-between space-x-6 rtl:space-x-reverse"
        >
          <input
            style={{ width: "70%" }}
            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a URL"
          />
          <button
            style={{ width: "25%" }}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          {/* Conditionally render results */}
          {!loading && result && (
            <div className="mt-4 w-full text-center">
              <h2 className="text-xl font-semibold">Results:</h2>
              {result.error ? (
                <p className="text-red-500">{result.error}</p>
              ) : (
                <div className="p-4 rounded-md text-left">
                  <div className="relative overflow-x-auto">
                    <h3 className="text-lg font-bold">Overview:</h3>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Backlink
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Domain Rating
                          </th>
                          <th scope="col" className="px-6 py-3">
                            URL Rating
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Referring Domains
                          </th>
                          <th>Dofollow Backlinks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {overview?.backlinks || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {overview?.domainRating || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {overview?.urlRating || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {overview?.refdomains || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {" "}
                            {overview?.dofollowBacklinks || "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="relative overflow-x-auto">
                    <h3 className="text-lg font-bold">Backlinks:</h3>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          {/* <th scope="col" className="px-6 py-3">
                            Anchor
                          </th> */}
                          <th scope="col" className="px-6 py-3">
                            Domain Rating
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Target URL
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Source URL
                          </th>
                        </tr>
                      </thead>
                      {backlinks?.length > 0 ? (
                        <tbody>
                          {backlinks.map((backlink, index) => (
                            <tr
                              key={index}
                              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                              {/* <td
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                {backlink.anchor || "N/A"}
                              </td> */}
                              <td className="px-6 py-4">
                                {backlink.domainRating || "N/A"}
                              </td>
                              <td className="px-6 py-4">
                                {backlink.urlTo || "N/A"}
                              </td>
                              <td className="px-6 py-4">
                                <a
                                  href={backlink.urlFrom}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  {backlink.urlFrom}
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <p>No backlinks found.</p>
                      )}
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default BacklinkFinder;
