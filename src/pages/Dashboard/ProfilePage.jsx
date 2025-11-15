import React, { useState, useEffect, useRef } from "react";
import { useDashboard } from "./DashboardContext";
import { doc, setDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react"; // Only lucide-react is kept

// --- DATA (Must match your SignUpPage) ---
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
// --- END DATA ---

// --- START: 100% CUSTOM STYLED COMPONENTS ---

// 1. Helper for conditional classnames
const cn = (...classes) => classes.filter(Boolean).join(" ");

// 2. Custom Label (From your code)
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

// 3. Custom Badge (From your code, with color variants)
const badgeVariants = {
  default: "border-transparent bg-blue-600 text-white",
  teach: "border-transparent bg-blue-100 text-blue-800",
  learn: "border-transparent bg-green-100 text-green-800",
  secondary: "border-transparent bg-gray-100 text-gray-800",
  destructive: "border-transparent bg-red-600 text-white",
  outline: "text-gray-900 border-gray-300",
};

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

// 4. Custom Button
const buttonVariants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-800",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-800",
};

const CustomButton = React.forwardRef(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          buttonVariants[variant] || buttonVariants.default,
          className
        )}
        {...props}
      />
    );
  }
);
CustomButton.displayName = "CustomButton";

// 5. Custom Input
const CustomInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
CustomInput.displayName = "CustomInput";

// 6. Custom Card Components
const CustomCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm",
      className
    )}
    {...props}
  />
));
CustomCard.displayName = "CustomCard";

const CustomCardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CustomCardHeader.displayName = "CustomCardHeader";

const CustomCardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CustomCardTitle.displayName = "CustomCardTitle";

const CustomCardDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600", className)}
      {...props}
    />
  )
);
CustomCardDescription.displayName = "CustomCardDescription";

const CustomCardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CustomCardContent.displayName = "CustomCardContent";

const CustomCardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CustomCardFooter.displayName = "CustomCardFooter";

// 7. Custom Avatar Components
const CustomAvatar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
CustomAvatar.displayName = "CustomAvatar";

const CustomAvatarFallback = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-700",
        className
      )}
      {...props}
    />
  )
);
CustomAvatarFallback.displayName = "CustomAvatarFallback";

// 8. Custom Single-Select (for University)
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

// 9. Custom Multi-Select (for Skills)
const MultiSelectSkills = ({
  options,
  selectedSkills,
  onSkillsChange,
  placeholder,
}) => {
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

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      onSkillsChange([...selectedSkills, skill]);
    }
    setIsOpen(false);
  };

  const removeSkill = (skillToRemove) => {
    onSkillsChange(selectedSkills.filter((skill) => skill !== skillToRemove));
  };

  const availableOptions = options.filter(
    (option) => !selectedSkills.includes(option)
  );

  return (
    <div className="space-y-2" ref={selectRef}>
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

// --- END: 100% CUSTOM STYLED COMPONENTS ---

// --- MAIN PROFILE PAGE COMPONENT ---
const ProfilePage = () => {
  const { myProfile, setMyProfile, auth, db, setToasts } = useDashboard();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- UPDATED STATE to support skills arrays ---
  const [profileEdit, setProfileEdit] = useState({
    name: "",
    university: "",
    skillsToTeach: [],
    skillsToLearn: [],
  });

  // --- UPDATED useEffect to load new skills structure ---
  useEffect(() => {
    if (myProfile) {
      setProfileEdit({
        name: myProfile.name || "",
        university: myProfile.university || "",
        skillsToTeach: myProfile.skillsToTeach || [],
        skillsToLearn: myProfile.skillsToLearn || [],
      });
    }
  }, [myProfile]);

  // --- UPDATED handleSave for skills arrays ---
  const handleSave = async () => {
    if (!auth.currentUser) return;

    // Updated validation
    if (
      !profileEdit.university ||
      profileEdit.skillsToTeach.length === 0 ||
      profileEdit.skillsToLearn.length === 0
    ) {
      setToasts((t) => [
        ...t,
        {
          id: `${Date.now()}`,
          message: "Please fill all fields, including skills.",
        },
      ]);
      return;
    }

    setIsSaving(true);
    try {
      // Updated data structure for Firestore
      const profileData = {
        ...myProfile,
        uid: auth.currentUser.uid,
        name: profileEdit.name,
        email: auth.currentUser.email || "",
        university: profileEdit.university,
        skillsToTeach: profileEdit.skillsToTeach, // New field
        skillsToLearn: profileEdit.skillsToLearn, // New field
        expertise: "", // REMOVE old field (optional, but good for cleanup)
        updatedAt: new Date().toISOString(),
      };

      // Remove old expertise field if it exists
      delete profileData.expertise;

      await setDoc(doc(db, "users", auth.currentUser.uid), profileData, {
        merge: true,
      });

      setMyProfile(profileData);
      setToasts((t) => [
        ...t,
        { id: `${Date.now()}-saved`, message: `Profile updated` },
      ]);
      setIsEditing(false);
    } catch (err) {
      console.error("Save profile failed:", err);
      setToasts((t) => [
        ...t,
        { id: `${Date.now()}`, message: "Error: Failed to save profile." },
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  // --- UPDATED handleCancel for skills arrays ---
  const handleCancel = () => {
    if (myProfile) {
      setProfileEdit({
        name: myProfile.name || "",
        university: myProfile.university || "",
        skillsToTeach: myProfile.skillsToTeach || [],
        skillsToLearn: myProfile.skillsToLearn || [],
      });
    }
    setIsEditing(false);
  };

  // Helper function to render skill badges
  const renderSkillBadges = (skills, variant) => {
    if (!skills || skills.length === 0) {
      return <p className="text-gray-500 italic">No skills listed.</p>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill} variant={variant} className="text-sm py-1 px-3">
            {skill}
          </Badge>
        ))}
      </div>
    );
  };

  if (!myProfile) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <CustomCard>
        <CustomCardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <CustomAvatar className="h-20 w-20">
            <CustomAvatarFallback className="text-3xl">
              {myProfile.name ? myProfile.name.charAt(0).toUpperCase() : "U"}
            </CustomAvatarFallback>
          </CustomAvatar>
          <div className="flex-grow">
            <CustomCardTitle className="text-3xl">
              {myProfile.name}
            </CustomCardTitle>
            <CustomCardDescription className="text-base">
              {myProfile.email}
            </CustomCardDescription>
          </div>
        </CustomCardHeader>

        {!isEditing ? (
          // --- VIEW MODE (Updated for Skills) ---
          <>
            <CustomCardContent className="space-y-6">
              <div className="space-y-1">
                <Label className="text-sm text-gray-500">University</Label>
                <p className="text-lg">{myProfile.university || "Not set"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">Skills to Teach</Label>
                {renderSkillBadges(myProfile.skillsToTeach, "teach")}
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">
                  Skills to Learn
                </Label>
                {renderSkillBadges(myProfile.skillsToLearn, "learn")}
              </div>
            </CustomCardContent>
            <CustomCardFooter>
              <CustomButton onClick={() => setIsEditing(true)}>
                Edit Profile
              </CustomButton>
            </CustomCardFooter>
          </>
        ) : (
          // --- EDIT MODE (Updated for Skills) ---
          <>
            <CustomCardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <CustomInput
                  id="name"
                  value={profileEdit.name}
                  onChange={(e) =>
                    setProfileEdit((p) => ({ ...p, name: e.target.value }))
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <CustomSelect
                  value={profileEdit.university}
                  onValueChange={(value) =>
                    setProfileEdit((p) => ({ ...p, university: value }))
                  }
                  placeholder="Select your university"
                  options={universityOptions}
                />
              </div>

              <div className="space-y-2">
                <Label>Skills you can Teach</Label>
                <MultiSelectSkills
                  options={skillOptions}
                  selectedSkills={profileEdit.skillsToTeach}
                  onSkillsChange={(skills) =>
                    setProfileEdit((p) => ({ ...p, skillsToTeach: skills }))
                  }
                  placeholder="Select skills you're good at..."
                />
              </div>

              <div className="space-y-2">
                <Label>Skills you want to Learn</Label>
                <MultiSelectSkills
                  options={skillOptions}
                  selectedSkills={profileEdit.skillsToLearn}
                  onSkillsChange={(skills) =>
                    setProfileEdit((p) => ({ ...p, skillsToLearn: skills }))
                  }
                  placeholder="Select skills you want to learn..."
                />
              </div>
            </CustomCardContent>
            <CustomCardFooter className="justify-end gap-2">
              <CustomButton
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </CustomButton>
              <CustomButton onClick={handleSave} disabled={isSaving}>
                {isSaving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </CustomButton>
            </CustomCardFooter>
          </>
        )}
      </CustomCard>
    </div>
  );
};

export default ProfilePage;