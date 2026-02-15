"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, UserCheck, ArrowLeft, Smartphone, Shield, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { loginUserAction } from "@/features/auth/server/auth.actions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserData, loginUserSchema } from "@/features/auth/auth.schema";
import { areCookiesEnabled } from "@/lib/cookie-utils";

const EnhancedLoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserData>({
    resolver: zodResolver(loginUserSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [deviceInfo, setDeviceInfo] = useState<{
    isMobile: boolean;
    cookiesEnabled: boolean;
    isSecure: boolean;
  }>({ isMobile: false, cookiesEnabled: false, isSecure: false });

  // Check device capabilities and network status on mount
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      const cookiesEnabled = areCookiesEnabled();
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      
      setDeviceInfo({ isMobile, cookiesEnabled, isSecure });

      // Show warnings for mobile-specific issues
      if (isMobile && !cookiesEnabled) {
        toast.warning("Cookies disabled", {
          description: "Please enable cookies for authentication to work properly on mobile devices.",
          duration: 7000,
        });
      }

      if (!isSecure && isMobile) {
        toast.error("Insecure connection", {
          description: "For security, please access this site via HTTPS on mobile devices.",
          duration: 10000,
        });
      }
    };

    const checkNetworkStatus = () => {
      const isOnline = navigator.onLine;
      setNetworkStatus(isOnline ? 'online' : 'offline');
      
      if (!isOnline) {
        toast.error("No internet connection", {
          description: "Please check your network connection to login.",
          duration: 5000,
        });
      }
    };

    checkDeviceCapabilities();
    checkNetworkStatus();

    // Listen for network changes
    const handleOnline = () => {
      setNetworkStatus('online');
      toast.success("Connection restored", {
        description: "You're back online!",
        duration: 2000,
      });
    };

    const handleOffline = () => {
      setNetworkStatus('offline');
      toast.error("Connection lost", {
        description: "Please check your network connection.",
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const onSubmit = async (data: LoginUserData) => {
    if (networkStatus === 'offline') {
      toast.error("No internet connection", {
        description: "Please check your network connection to login.",
        duration: 5000,
      });
      return;
    }

    if (!deviceInfo.cookiesEnabled) {
      toast.error("Cookies required", {
        description: "Please enable cookies and refresh the page to login.",
        duration: 7000,
      });
      return;
    }

    if (!deviceInfo.isSecure && deviceInfo.isMobile) {
      toast.error("Insecure connection", {
        description: "Please access this site via HTTPS for secure authentication.",
        duration: 10000,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await loginUserAction(data);
      
      if (result?.status === "SUCCESS") {
        toast.success("Login successful!", {
          description: deviceInfo.isMobile 
            ? "Welcome back! Your session is secured for mobile use."
            : "Welcome back! You've been securely signed in.",
          duration: 2000,
        });
      } else {
        toast.error("Login failed", {
          description: result?.message || "Please check your credentials and try again.",
          duration: 4000,
        });
      }

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different error types for mobile users
      let errorMessage = "An unexpected error occurred. Please try again.";
      let errorDescription = "If the problem persists, please contact support.";
      
      if (error.message?.includes('rate limit') || error.message?.includes('429')) {
        errorMessage = "Too many attempts";
        errorDescription = "Please wait 15 minutes before trying again.";
      } else if (error.message?.includes('network') || error.name === 'NetworkError') {
        errorMessage = "Network error";
        errorDescription = "Please check your internet connection and try again.";
      } else if (error.message?.includes('timeout')) {
        errorMessage = "Request timeout";
        errorDescription = "The login request took too long. Please try again.";
      } else if (error.message?.includes('502') || error.message?.includes('503')) {
        errorMessage = "Service unavailable";
        errorDescription = "Our servers are temporarily unavailable. Please try again in a few minutes.";
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Mobile network and security status */}
        {deviceInfo.isMobile && (
          <div className="mb-4 space-y-2">
            {/* Network status */}
            <div className="flex items-center justify-center space-x-2 text-sm">
              {networkStatus === 'online' ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">Connected</span>
                </>
              ) : networkStatus === 'offline' ? (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-red-600 dark:text-red-400">No connection</span>
                </>
              ) : (
                <span className="text-gray-500">Checking connection...</span>
              )}
            </div>

            {/* Security warning for non-HTTPS mobile */}
            {!deviceInfo.isSecure && (
              <div className="flex items-center justify-center space-x-2 text-xs bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-700 dark:text-yellow-300">
                  Use HTTPS for secure mobile login
                </span>
              </div>
            )}
          </div>
        )}

        <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center space-x-2">
              {deviceInfo.isMobile && <Smartphone className="h-6 w-6 text-blue-600" />}
              <UserCheck className="h-8 w-8 text-blue-600" />
              {deviceInfo.isSecure && <Shield className="h-5 w-5 text-green-500" />}
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {deviceInfo.isMobile 
                ? "Secure mobile authentication"
                : "Sign in to your account to continue"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  {...register("email")}
                  disabled={isLoading || networkStatus === 'offline'}
                  autoComplete="email"
                  inputMode="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 pr-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    {...register("password")}
                    disabled={isLoading || networkStatus === 'offline'}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || networkStatus === 'offline' || !deviceInfo.cookiesEnabled || (!deviceInfo.isSecure && deviceInfo.isMobile)}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>

              {/* Mobile-specific warnings */}
              {deviceInfo.isMobile && !deviceInfo.cookiesEnabled && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs">Enable cookies in your mobile browser settings to login</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <Link
                  href="/"
                  className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Link>
                <span>•</span>
                <Link
                  href="/register"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security footer for mobile */}
        {deviceInfo.isMobile && deviceInfo.isSecure && (
          <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Your connection is secured with enterprise-grade encryption</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedLoginForm;