import React from "react";
import { assets, viewApplicationsPageData } from "../assets/assets";

const ViewApplications = () => {
  return (
    <div className="container mx-auto p-4">
      <div>
        <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">User name</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-left">Resume</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {viewApplicationsPageData.map((applicant, index) => (
              <tr key={index} className="text-gray-700">
                <td className="py-2 px-4 border-b border-gray-200 text-center">
                  {index + 1}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-center flex">
                  <img
                    className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                    src={applicant.imgSrc}
                    alt=""
                    srcset=""
                  />
                  <span>{applicant.name}</span>
                </td>
                <td className="py-2 px-4 border-b border-gray-200 max-sm:hidden">
                  {applicant.jobTitle}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 max-sm:hidden ">
                  {applicant.location}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <a
                    href=""
                    target="_blank"
                    className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex items-center gap-2"
                  >
                    Resume{" "}
                    <img src={assets.resume_download_icon} alt="" srcset="" />
                  </a>
                </td>
                <td className="py-2 px-4 border-b border-gray-200 relative">
                  <div className="relative inline-block text-left group">
                    {/* Trigger button */}
                    <button className="text-gray-500 action-button cursor-pointer">
                      ...
                    </button>

                    {/* Dropdown menu */}
                    <div
                      className="absolute right-0 md:left-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow 
                    invisible group-hover:visible opacity-0 group-hover:opacity-100 transition 
                    duration-200 z-10"
                    >
                      <button className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100 cursor-pointer">
                        Accept
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">
                        Reject
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;
