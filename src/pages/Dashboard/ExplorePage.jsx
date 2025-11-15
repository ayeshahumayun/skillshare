import React, { useState, useEffect, useRef } from "react";
import { useDashboard } from "./DashboardContext";

// --- DATA ARRAYS (Unchanged) ---
const universityOptions = [
  "National University of Sciences & Technology (NUST)",
  "FAST National University of Computer and Emerging Sciences",
  "Lahore University of Management Sciences (LUMS)",
  "COMSATS University Islamabad",
  "Information Technology University (ITU)",
  "University of Engineering and Technology (UET) Lahore",
  "Quaid-i-Azam University",
  "Institute of Business Administration (IBA) Karachi",
  "Ghulam Ishaq Khan Institute (GIKI)",
  "Riphah International University",
];

const skillOptions = [
  "Web Development (React/Node)",
  "Mobile App Development (Flutter/React Native)",
  "Data Science",
  "Machine Learning / AI",
  "Cybersecurity",
  "Cloud Computing (AWS/Azure)",
  "UI/UX Design",
  "DevOps",
  "Project Management",
  "Database Administration (SQL/NoSQL)",
];
// --- END DATA ARRAYS ---

// --- CUSTOM SELECT COMPONENT (Unchanged) ---
const CustomSelect = ({ value, onValueChange, allOptionLabel, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedValue) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  const displayValue = value === "all" ? allOptionLabel : value;

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-sm text-left bg-white border border-gray-300 rounded-md flex justify-between items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="truncate">{displayValue}</span>
        <svg
          className={`w-5 h-5 ml-2 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 overflow-y-auto max-h-60 rounded-md border border-gray-200 shadow-lg bg-white">
          <div
            onClick={() => handleSelect("all")}
            className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
          >
            {allOptionLabel}
          </div>
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                value === option
                  ? "font-semibold bg-gray-50 text-blue-600"
                  : "text-gray-700"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// --- END CUSTOM SELECT COMPONENT ---

// --- PROFILE CARD COMPONENT ---
// This component correctly displays 'skillsToTeach' and 'skillsToLearn'
const ProfileCard = ({ profile, onConnect, onMessage, connectionStatus }) => {
  // Helper to render skill pills
  const renderSkills = (skills, skillType = "teach") => {
    if (!skills || skills.length === 0) {
      return (
        <p className="text-sm text-gray-500 italic">
          No {skillType === "teach" ? "teaching" : "learning"} skills listed.
        </p>
      );
    }
    const bgColor = skillType === "teach" ? "bg-blue-100" : "bg-green-100";
    const textColor =
      skillType === "teach" ? "text-blue-800" : "text-green-800";
    return (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className={`px-3 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      {/* Card Header: User Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
        <p className="text-sm text-gray-600">{profile.university}</p>
      </div>

      {/* Card Body: Skills (This section handles the display you wanted) */}
      <div className="px-5 py-4 space-y-4 bg-gray-50 border-t border-b border-gray-200">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Can Teach
          </h4>
          {renderSkills(profile.skillsToTeach, "teach")}
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Wants to Learn
          </h4>
          {renderSkills(profile.skillsToLearn, "learn")}
        </div>
      </div>

      {/* Card Footer: Actions */}
      <div className="p-4 flex gap-3">
        {/* This button now changes based on connectionStatus */}
        {connectionStatus === "none" && (
          <button
            onClick={() => onConnect(profile)}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Connect
          </button>
        )}
        {connectionStatus === "pending" && (
          <button
            disabled
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-sm cursor-not-allowed"
          >
            Request Sent
          </button>
        )}
        {connectionStatus === "connected" && (
          <button
            disabled
            className="flex-1 px-4 py-2 text-sm font-medium text-green-800 bg-green-200 rounded-md shadow-sm cursor-not-allowed"
          >
            Connected
          </button>
        )}

        {/* Message Button */}
        <button
          onClick={() => onMessage(profile)}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Message
        </button>
      </div>
    </div>
  );
};
// --- END PROFILE CARD COMPONENT ---

const ExplorePage = () => {
  const {
    isLoadingProfiles,
    profiles,
    handleConnect,
    setChatUser,
    myProfile, // Get the current user's profile
  } = useDashboard();

  const [universityFilter, setUniversityFilter] = useState("all");
  const [skillToTeachFilter, setSkillToTeachFilter] = useState("all");
  const [skillToLearnFilter, setSkillToLearnFilter] = useState("all");

  // Filter logic
  const filteredProfiles = profiles.filter((profile) => {
    const universityMatch =
      universityFilter === "all" || profile.university === universityFilter;
    const skillToTeachMatch =
      skillToTeachFilter === "all" ||
      (profile.skillsToTeach &&
        profile.skillsToTeach.includes(skillToTeachFilter));
    const skillToLearnMatch =
      skillToLearnFilter === "all" ||
      (profile.skillsToLearn &&
        profile.skillsToLearn.includes(skillToLearnFilter));
    return universityMatch && skillToTeachMatch && skillToLearnMatch;
  });

  const renderContent = () => {
    if (isLoadingProfiles) {
      return <p className="text-gray-600">Loading profiles...</p>;
    }
    
    if (filteredProfiles.length === 0) {
      return (
        <p className="text-gray-600">
          No profiles match your selected filters.
        </p>
      );
    }

    // Render logic
    return filteredProfiles.map((p) => {
      // Determine connection status for each profile
      let status = "none";
      if (myProfile?.connections?.includes(p.uid)) {
        status = "connected";
      } else if (myProfile?.sentRequests?.includes(p.uid)) {
        status = "pending";
      }

      return (
        <ProfileCard
          key={p.uid}
          profile={p}
          onConnect={handleConnect}
          onMessage={setChatUser}
          connectionStatus={status} // Pass the status as a prop
        />
      );
    });
  };

  // --- RETURN JSX ---
  return (
    <div>
      {/* Filter UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
        {/* 1. University Filter Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Filter by University
          </label>
          <CustomSelect
            value={universityFilter}
            onValueChange={setUniversityFilter}
            allOptionLabel="All Universities"
            options={universityOptions}
          />
        </div>

        {/* 2. Skill to Teach Filter Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Find people who can teach...
          </label>
          <CustomSelect
            value={skillToTeachFilter}
            onValueChange={setSkillToTeachFilter}
            allOptionLabel="All Skills"
            options={skillOptions}
          />
        </div>

        {/* 3. Skill to Learn Filter Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Find people who want to learn...
          </label>
          <CustomSelect
            value={skillToLearnFilter}
            onValueMessage={setSkillToLearnFilter}
            allOptionLabel="All Skills"
            options={skillOptions}
          />
        </div>
      </div>
      {/* --- END FILTER UI --- */}

      {/* Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ExplorePage;