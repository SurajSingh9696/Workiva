import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { ArrowRight, Briefcase, Building2, Search, TrendingUp, Users, CheckCircle2, Star } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  
  // Redirect authenticated users to their dashboard
  if (user) {
    if (user.role === "employer") {
      redirect("/employer-dashboard");
    } else if (user.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Workiva Logo" className="h-8 w-auto sm:h-10 object-contain" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Workiva
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="text-xs sm:text-sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="container mx-auto text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-50 text-blue-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-blue-700" />
            <span>Trusted by 10,000+ professionals</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
            Find Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dream Job
            </span>
            <br />
            Today
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-10 max-w-2xl mx-auto px-4">
            Connect with top employers and discover opportunities that match your skills and aspirations. Your next career move starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto">
                Start Your Journey <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/jobs" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Briefcase, value: "10,000+", label: "Active Jobs" },
              { icon: Building2, value: "5,000+", label: "Companies" },
              { icon: Users, value: "50,000+", label: "Candidates" },
              { icon: TrendingUp, value: "95%", label: "Success Rate" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 sm:mb-4 text-blue-600" />
                <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Why Choose WorkivaX?</h2>
            <p className="text-base sm:text-xl text-gray-600">Everything you need to find your perfect job</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Search,
                title: "Smart Job Search",
                description: "Advanced filters to find exactly what you're looking for",
              },
              {
                icon: Briefcase,
                title: "Quality Opportunities",
                description: "Curated listings from verified employers worldwide",
              },
              {
                icon: CheckCircle2,
                title: "Easy Application",
                description: "Apply to multiple jobs with one click",
              },
            ].map((feature, index) => (
              <div key={index} className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-10 opacity-90 px-4">
            Join thousands of professionals who found their dream job through WorkivaX
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            <span className="text-lg sm:text-xl font-bold text-white">WorkivaX</span>
          </div>
          <p className="text-sm sm:text-base">© 2026 WorkivaX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
