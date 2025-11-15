// src/components/DashboardNavbar.js
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { auth } from "./firebase"; // Assuming firebase.js is in src/
import { signOut } from "firebase/auth";

// NEW: Import shadcn/ui components
import { Button, buttonVariants } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose, // NEW: To close sheet on link click
} from "./sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// NEW: Import icons
import {
  Menu,
  LayoutGrid,
  Users,
  User,
  MessageSquare,
  LogOut,
  ChevronRight,
} from "lucide-react";

export const DashboardNavbar = () => {
  // Get current user data
  const currentUser = auth.currentUser;

  // Helper function for NavLink styles
  const getNavLinkClass = ({ isActive }) => {
    const baseStyle =
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium";
    const activeStyle = "bg-accent text-accent-foreground"; // A more modern active style
    const inactiveStyle =
      "text-muted-foreground hover:bg-accent hover:text-accent-foreground";

    return `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`;
  };

  // Helper for mobile-specific NavLink styles
  const getMobileNavLinkClass = ({ isActive }) => {
    const baseStyle =
      "flex items-center justify-between rounded-md px-3 py-3 text-base font-medium";
    const activeStyle = "bg-primary text-primary-foreground";
    const inactiveStyle =
      "text-muted-foreground hover:bg-accent hover:text-accent-foreground";

    return `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`;
  };

  // DRY: Define nav links in an array
  const navItems = [
    { to: "/dashboard/explore", icon: <LayoutGrid size={18} />, label: "Explore" },
    { to: "/dashboard/connections", icon: <Users size={18} />, label: "Connections" },
    { to: "/dashboard/profile", icon: <User size={18} />, label: "Profile" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* --- NEW: Mobile Hamburger Menu --- */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs p-4">
                <Link
                  to="/"
                  className="mb-4 flex items-center gap-2 text-xl font-bold"
                >
                  SkillShare
                </Link>

                <nav className="flex flex-col space-y-2">
                  {/* Mobile Nav Links */}
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.to}>
                      <NavLink
                        to={item.to}
                        className={getMobileNavLinkClass}
                      >
                        <span className="flex items-center gap-3">
                          {item.icon}
                          {item.label}
                        </span>
                        <ChevronRight size={16} />
                      </NavLink>
                    </SheetClose>
                  ))}
                  {/* Mobile Inbox Link */}
                  <SheetClose asChild>
                    <NavLink
                      to="/dashboard/messages"
                      className={getMobileNavLinkClass}
                    >
                      <span className="flex items-center gap-3">
                        <MessageSquare size={18} />
                        Inbox
                      </span>
                      <ChevronRight size={16} />
                    </NavLink>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Logo */}
          <Link
            to="/"
            className="hidden text-xl font-bold md:flex items-center gap-2"
          >
            SkillShare
          </Link>

          {/* --- UPDATED: Desktop Navigation --- */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={getNavLinkClass}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop-only Inbox Button */}
          <NavLink
            to="/dashboard/messages"
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden md:flex items-center gap-2",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )
            }
          >
            <MessageSquare size={18} />
            Inbox
          </NavLink>

          {/* --- NEW: User Dropdown Menu --- */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  {/* You can add AvatarImage here if you store user photo URLs */}
                  {/* <AvatarImage src={currentUser?.photoURL} alt={currentUser?.displayName} /> */}
                  <AvatarFallback>
                    {currentUser?.displayName
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="text-sm font-medium">
                  {currentUser?.displayName || "User"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentUser?.email}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut(auth)}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

// Helper for conditional classnames (if you don't have it in utils)
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export default DashboardNavbar;