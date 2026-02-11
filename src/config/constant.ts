import {
  LayoutDashboard,
  Search,
  Briefcase,
  Bookmark,
  Settings,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const SESSION_LIFETIME = 30 * 24 * 60 * 60;
export const SESSION_REFRESH_TIME = SESSION_LIFETIME / 2;

export const SALARY_CURRENCY = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "INR",
  "NPR",
] as const;

export const SALARY_PERIOD = ["hourly", "monthly", "yearly"] as const;

export const JOB_TYPE = ["remote", "hybrid", "on-site"] as const;

export const WORK_TYPE = [
  "full-time",
  "part-time",
  "contract",
  "temporary",
  "freelance",
] as const;

export const JOB_LEVEL = [
  "internship",
  "entry level",
  "junior",
  "mid level",
  "senior level",
  "lead",
  "manager",
  "director",
  "executive",
] as const;

export const MIN_EDUCATION = [
  "none",
  "high school",
  "undergraduate",
  "masters",
  "phd",
] as const;

// =====================================================
// NAVIGATION TYPES
// =====================================================
export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number | "dynamic";
}

// =====================================================
// APPLICANT DASHBOARD NAVIGATION
// =====================================================
/**
 * Applicant Dashboard Navigation Items
 * Based on folder structure: app/(applicants)/dashboard/
 */
export const applicantNavItems: NavItem[] = [
  {
    name: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true, // Exact match only for home
  },
  {
    name: "Find Jobs",
    href: "/dashboard/jobs",
    icon: Search,
  },
  {
    name: "Applied",
    href: "/dashboard/applications",
    icon: Briefcase,
    badge: "dynamic", // Will show count of applied jobs
  },
  {
    name: "Saved Jobs",
    href: "/dashboard/saved-jobs",
    icon: Bookmark,
    badge: "dynamic", // Will show count of saved jobs
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

// =====================================================
// EMPLOYER DASHBOARD NAVIGATION
// =====================================================
/**
 * Employer Dashboard Navigation Items
 * Based on folder structure: app/employer-dashboard/
 */
export const employerNavItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/employer-dashboard",
    icon: LayoutDashboard,
    exact: true, // Exact match for dashboard home
  },
  {
    name: "Create Job",
    href: "/employer-dashboard/jobs/create",
    icon: Plus,
  },
  {
    name: "My Jobs",
    href: "/employer-dashboard/jobs",
    icon: Briefcase,
    // Note: /jobs exact match chahiye but /jobs/[jobId]/edit allow karna hai
  },
  {
    name: "Settings",
    href: "/employer-dashboard/settings",
    icon: Settings,
  },
];
