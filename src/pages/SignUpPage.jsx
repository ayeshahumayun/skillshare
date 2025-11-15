import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

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

// --- CUSTOM SINGLE-SELECT COMPONENT (For University) ---
// (This is the same component you provided, unchanged)
const CustomSelect = ({ value, onValueChange, placeholder, options }) => {
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

  const displayValue = value || placeholder;

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 text-sm text-left bg-white border border-gray-300 rounded-md flex justify-between items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          !value ? "text-gray-500" : "text-gray-900"
        }`}
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
// --- END CUSTOM SINGLE-SELECT COMPONENT ---

// --- NEW MULTI-SELECT SKILLS COMPONENT ---
const MultiSelectSkills = ({
  options,
  selectedSkills,
  onSkillsChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown on outside click
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

  // Add a skill to the list
  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      onSkillsChange([...selectedSkills, skill]);
    }
    setIsOpen(false);
  };

  // Remove a skill from the list
  const removeSkill = (skillToRemove) => {
    onSkillsChange(selectedSkills.filter((skill) => skill !== skillToRemove));
  };

  // Filter out options that are already selected
  const availableOptions = options.filter(
    (option) => !selectedSkills.includes(option)
  );

  return (
    <div className="space-y-2" ref={selectRef}>
      {/* 1. The Pills/Tags for selected skills */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-gray-300 rounded-md bg-white">
        {selectedSkills.length === 0 && (
          <span className="text-gray-500 text-sm px-2 py-1">{placeholder}</span>
        )}
        {selectedSkills.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-1.5 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* 2. The Trigger Button (to add more) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md flex justify-between items-center"
        >
          <span className="text-gray-600">
            {isOpen ? "Close" : "Add a skill..."}
          </span>
          <svg
            className={`w-5 h-5 ml-2 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* 3. The Dropdown Content */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 overflow-y-auto max-h-60 rounded-md border border-gray-200 shadow-lg bg-white">
            {availableOptions.length > 0 ? (
              availableOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => addSkill(option)}
                  className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                All skills selected.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
// --- END MULTI-SELECT SKILLS COMPONENT ---

export const SignUpPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpUniversity, setSignUpUniversity] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [error, setError] = useState("");

  // --- NEW STATES for skills ---
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  // --- END NEW STATES ---

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- UPDATED VALIDATION ---
    if (!signUpUniversity) {
      setError("Please select a university.");
      return;
    }
    if (skillsToTeach.length === 0) {
      setError("Please add at least one skill you can teach.");
      return;
    }
    if (skillsToLearn.length === 0) {
      setError("Please add at least one skill you want to learn.");
      return;
    }
    // --- END UPDATED VALIDATION ---

    try {
      // --- UPDATED REGISTER CALL ---
      // IMPORTANT: You must update your 'register' function in AuthContext
      // to accept (email, password, name, university, skillsToTeach, skillsToLearn)
      await register(
        signUpEmail,
        signUpPassword,
        signUpName,
        signUpUniversity,
        skillsToTeach,
        skillsToLearn
      );
      // --- END UPDATED REGISTER CALL ---

      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      console.error("Sign up error:", err);
      setError("Sign up failed: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Join SkillShare to connect and learn.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUpSubmit}>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm">Name</label>
              <Input
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                placeholder="Your full name"
                aria-label="name"
                required
              />
            </div>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm">Email</label>
              <Input
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="you@campus.edu"
                aria-label="email"
                type="email"
                required
              />
            </div>

            {/* University (Uses single-select) */}
            <div className="space-y-2">
              <label className="text-sm">University</label>
              <CustomSelect
                value={signUpUniversity}
                onValueChange={setSignUpUniversity}
                placeholder="Select your university"
                options={universityOptions}
              />
            </div>

            {/* --- NEW: Skills to Teach (Uses multi-select) --- */}
            <div className="space-y-2">
              <label className="text-sm">Skills you can Teach</label>
              <MultiSelectSkills
                options={skillOptions}
                selectedSkills={skillsToTeach}
                onSkillsChange={setSkillsToTeach}
                placeholder="Select skills you're good at..."
              />
            </div>
            {/* --- END NEW FIELD --- */}

            {/* --- NEW: Skills to Learn (Uses multi-select) --- */}
            <div className="space-y-2">
              <label className="text-sm">Skills you want to Learn</label>
              <MultiSelectSkills
                options={skillOptions}
                selectedSkills={skillsToLearn}
                onSkillsChange={setSkillsToLearn}
                placeholder="Select skills you want to learn..."
              />
            </div>
            {/* --- END NEW FIELD --- */}

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm">Password</label>
              <Input
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="Choose a strong password"
                type="password"
                aria-label="password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Create account
            </Button>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-primary underline">
                Back to sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};