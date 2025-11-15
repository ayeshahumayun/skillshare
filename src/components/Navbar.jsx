import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Import the useAuth hook
import { Link, useNavigate } from "react-router-dom"; // Import Link!
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { LogoIcon } from "./Icons";

const routeList = [
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact Us" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Only need isAuthenticated and logout from context now
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/"); // Redirect to home
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              <LogoIcon />
              SkillShare
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              {/* --- UPDATED: Added solid background color --- */}
              <SheetContent
                side={"left"}
                className="bg-white dark:bg-background"
              >
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    SkillShare
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}

                  {/* --- UPDATED MOBILE AUTH SECTION --- */}
                  {isAuthenticated ? (
                    <>
                      {/* Dashboard Link (Unchanged) */}
                      <a
                        rel="noreferrer noopener"
                        href="/dashboard"
                        className={`w-[110px] border ${buttonVariants({
                          variant: "secondary",
                        })}`}
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </a>

                      {/* NEW: Mobile Sign Out Button */}
                      <button
                        onClick={() => {
                          handleSignOut(); // Call sign out logic
                          setIsOpen(false); // Close the sheet
                        }}
                        className={`w-[110px] border ${buttonVariants({
                          variant: "ghost", // Matches desktop style
                        })}`}
                      >
                        Sign Out
                      </button>
                      {/* --- END NEW BUTTON --- */}
                    </>
                  ) : (
                    // CHANGED: This is now a Link to /login
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className={`w-[110px] border ${buttonVariants({
                        variant: "secondary",
                      })}`}
                    >
                      Sign In
                    </Link>
                  )}
                  {/* --- END UPDATED SECTION --- */}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2 items-center">
            {isAuthenticated ? (
              <>
                <a
                  rel="noreferrer noopener"
                  href="/dashboard"
                  className={`border ${buttonVariants({
                    variant: "secondary",
                  })}`}
                >
                  Dashboard
                </a>
                <button
                  onClick={handleSignOut}
                  className={`border ${buttonVariants({ variant: "ghost" })}`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              // CHANGED: This is now a Link to /login
              <Link
                to="/login"
                className={`border ${buttonVariants({
                  variant: "secondary",
                })}`}
              >
                Sign In
              </Link>
            )}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};