import React from "react";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };
                 
  const handleLocationChange = (location) => {
    setSelectedLocations((prev) => {
      if (prev.includes(location)) {
        return prev.filter((loc) => loc !== location);
      } else {
        return [...prev, location];
      }
    });
  };

  useEffect(() => {
    // Set loading to true when jobs are being processed
    if (!jobs || jobs.length === 0) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    const matchesCategory = (job) =>
      selectedCategories.length === 0 || selectedCategories.includes(job.category);

    const matchesLocation = (job) =>
      selectedLocations.length === 0 || selectedLocations.includes(job.location);

    const matchesTitle = (job) =>
      !searchFilter.title.trim() || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

    const matchesSearchLocation = (job) =>
      !searchFilter.location.trim() || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter(
        (job) =>
          matchesCategory(job) &&
          matchesLocation(job) &&
          matchesTitle(job) &&
          matchesSearchLocation(job)
      );

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, searchFilter, selectedCategories, selectedLocations]);

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">Loading job postings...</p>
    </div>
  );

  // Skeleton Card Component for better UX
  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="space-y-2">
        <div className="h-2 bg-gray-300 rounded"></div>
        <div className="h-2 bg-gray-300 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        <div className="h-8 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  );

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* sidebar */}
      <div className="w-full lg:w-1/4 bg-white px-4">
        {/* search filter from hero component */}
        {isSearched && (searchFilter.title.trim() || searchFilter.location.trim()) && (
          <>
            <h3 className="font-medium text-lg mb-4">Current Search</h3>
            <div className="mb-4 text-gray-600">
              {searchFilter.title && (
                <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                  {searchFilter.title}
                  <img
                    onClick={() =>
                      setSearchFilter((prev) => ({ ...prev, title: "" }))
                    }
                    className="cursor-pointer"
                    src={assets.cross_icon}
                    alt=""
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                  {searchFilter.location}
                  <img
                    onClick={() =>
                      setSearchFilter((prev) => ({ ...prev, location: "" }))
                    }
                    className="cursor-pointer"
                    src={assets.cross_icon}
                    alt=""
                  />
                </span>
              )}
            </div>
          </>
        )}

        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="px-6 py-1.5 rounded border border-gray-400 lg:hidden"
        >
          {showFilter ? "Close" : "Filters"}
        </button>

        {/* Category filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search by Categories</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input
                  className="scale-125 cursor-pointer"
                  type="checkbox"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Location filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="pt-14 font-medium text-lg py-4">Search by Location</h4>
          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((location, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input
                  className="scale-125 cursor-pointer"
                  type="checkbox"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocations.includes(location)}
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* job listing */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          Latest Jobs
        </h3>
        <p className="mb-8">Get your desired job from top companies</p>
        
        {/* Show loading state */}
        {isLoading ? (
          <>
            {/* Option 1: Simple spinner (uncomment to use) */}
            {/* <LoadingSpinner /> */}
            
            {/* Option 2: Skeleton cards (better UX) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredJobs
                .slice((currentPage - 1) * 6, currentPage * 6)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
            </div>

            {/* pagination */}
            {filteredJobs.length > 0 && (
              <div className="flex justify-center items-center space-x-2 mt-10">
                <a href="#job-list">
                  <img
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    src={assets.left_arrow_icon}
                    alt=""
                  />
                </a>
                {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
                  <a href="#job-list" key={index}>
                    <button
                      onClick={() => setCurrentPage(index + 1)}
                      className={`cursor-pointer w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
                        currentPage === index + 1
                          ? "bg-blue-100 text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </button>
                  </a>
                ))}
                <a href="#job-list">
                  <img
                    onClick={() =>
                      setCurrentPage(
                        Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6))
                      )
                    }
                    src={assets.right_arrow_icon}
                    alt=""
                  />
                </a>
              </div>
            )}

            {/* No jobs found message */}
            {filteredJobs.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No job postings found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default JobListing;