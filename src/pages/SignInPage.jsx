import React, { useState } from "react";
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

export const SignInPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [error, setError] = useState(""); // For showing errors

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await login(userEmail, signInPassword);
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Sign in failed: " + err.message); // Show error to user
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignInSubmit}>
          <CardContent className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm">Email</label>
              <Input
                id="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="you@campus.edu"
                aria-label="email"
                required
              />
            </div>
            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm">Password</label>
              <Input
                id="password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                aria-label="password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">Sign In</Button>
            {/* Toggle to Sign Up */}
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary underline">
                Sign up here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};