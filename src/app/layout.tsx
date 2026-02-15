import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { getCurrentUser } from "@/features/auth/server/auth.queries";

export const metadata: Metadata = {
  title: "Workiva - Find Your Dream Job",
  description: "Connect with top employers and discover opportunities that match your skills and aspirations",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const userTheme = user?.theme || 'light';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme={userTheme}
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
``;
