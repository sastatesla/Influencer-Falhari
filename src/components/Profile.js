import React from 'react';
import { FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Profile = () => {
  return (
    <div className="max-w-lg mx-auto bg-red-100 p-3 rounded-b-lg shadow-md ">
      {/* Profile Section */}
      <div className="flex items-center mb-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mr-4 border">
          <img src="path-to-user-photo.jpg" alt="User Photo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Dr Priyanka Sharma</h2>
          <p className="text-gray-600">Nutritionist</p>
          {/* <p className="text-gray-500">One liner Designation</p> */}

          <div className="flex mt-2 space-x-4">
            <a href="https://www.instagram.com/your-profile" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-gray-500 hover:text-gray-800 border"/>
            </a>
            <a href="https://twitter.com/your-profile" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-gray-500 hover:text-gray-800" />
            </a>
            <a href="https://www.linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-gray-500 hover:text-gray-800" />
            </a>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p className="text-gray-700">
          Brief about the nutritionist goes here. This section contains a brief description or bio of the nutritionist.
        </p>
      </div>

      {/* Highlights Section */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm bg-gray-100 text-gray-600 py-1 px-2 border rounded">5+ Years of Experience</span>
        <span className="text-sm bg-gray-100 text-gray-600 py-1 px-2 rounded">Diet Specialist</span>
        {/* Add more highlights as needed */}
      </div>
    </div>
  );
};

export default Profile;
