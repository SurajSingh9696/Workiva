# WorkivaX - Modern Job Portal Platform

A full-featured job portal built with Next.js 15, React 19, and modern web technologies. Connect job seekers with employers through an intuitive and beautiful interface.

## ✨ Features

### For Job Seekers (Applicants)
- 🔍 **Smart Job Search** - Advanced filtering by job type, work type, level, and keywords
- 📝 **Easy Applications** - One-click apply with optional cover letter
- 💾 **Save Jobs** - Bookmark interesting opportunities for later
- 📊 **Application Tracking** - Monitor all your applications in one place
- 👤 **Profile Management** - Maintain detailed professional profile
- 🎯 **Personalized Dashboard** - View stats, recommendations, and quick actions

### For Employers
- 📢 **Job Posting** - Create detailed job listings with rich text descriptions
- 👥 **Applicant Management** - Review applications and update their status
- 📈 **Analytics Dashboard** - Track job performance and application metrics
- ✏️ **Edit & Delete Jobs** - Full control over your job postings
- 🏢 **Company Profile** - Showcase your organization
- 🔔 **Application Tracking** - View and manage all incoming applications

### General Features
- 🔐 **Secure Authentication** - Session-based auth with Argon2 password hashing
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🌓 **Dark Mode Ready** - Theme support built-in
- ⚡ **Fast & Optimized** - Built with Next.js 15 and Turbopack
- 📱 **Fully Responsive** - Works seamlessly on all devices
- 🔒 **Type-Safe** - Full TypeScript coverage

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** MySQL with Drizzle ORM
- **Authentication:** Custom session-based auth with Argon2
- **Forms:** React Hook Form + Zod validation
- **Rich Text:** Tiptap Editor
- **File Upload:** UploadThing
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React
- **Date Handling:** date-fns

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (applicants)/            # Applicant routes (route group)
│   │   └── dashboard/           # Applicant dashboard pages
│   ├── employer-dashboard/      # Employer routes
│   ├── api/                     # API routes
│   ├── login/                   # Auth pages
│   └── page.tsx                 # Landing page
├── components/                   # Reusable UI components
│   ├── text-editor.tsx          # Tiptap rich text editor
│   └── ui/                      # shadcn/ui components
├── config/                      # Configuration
│   ├── constant.ts              # App constants & enums
│   └── db.ts                    # Database connection
├── drizzle/                     # Database schema & migrations
│   ├── schema.ts                # Complete database schema
│   └── migration/               # SQL migrations
├── features/                    # Feature-based modules
│   ├── applicants/              # Applicant features
│   │   ├── components/          # UI components
│   │   └── server/              # Server actions & queries
│   ├── employers/               # Employer features
│   │   ├── components/
│   │   ├── jobs/
│   │   └── server/
│   └── auth/                    # Authentication
│       ├── components/
│       └── server/
└── lib/                         # Utilities
    └── utils.ts
```

## 🎯 Core Features Explained

### Job Application System
- Applicants can apply to jobs with optional cover letters
- Real-time application status updates (pending, reviewing, accepted, rejected)
- Employers can review all applications for their posted jobs

### Saved Jobs
- Bookmark interesting job postings
- One-click save/unsave toggle
- View all saved jobs in a dedicated page

### Advanced Job Filtering
- Search by title, company name, or technology tags
- Filter by job type (remote, hybrid, on-site)
- Filter by work type (full-time, part-time, contract, etc.)
- Filter by job level (internship to executive)
- Debounced search for better performance

### Rich Text Job Descriptions
- Full Tiptap editor integration
- Support for bold, italic, lists, headings, and more
- HTML output for proper rendering

## 🗄️ Database Schema

Key tables:
- `users` - User accounts (shared by applicants and employers)
- `applicants` - Applicant profile details
- `employers` - Employer/company profiles
- `jobs` - Job postings
- `applications` - Job applications
- `saved_jobs` - Bookmarked jobs
- `sessions` - User sessions

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd WorkivaX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/workivax"
   UPLOADTHING_SECRET="your-uploadthing-secret"
   UPLOADTHING_APP_ID="your-uploadthing-app-id"
   ```

4. **Run database migrations**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## 🔑 Default Routes

- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/dashboard` - Applicant dashboard
- `/dashboard/jobs` - Browse jobs
- `/dashboard/applications` - View applications
- `/dashboard/saved-jobs` - Saved jobs
- `/dashboard/settings` - Profile settings
- `/employer-dashboard` - Employer dashboard
- `/employer-dashboard/jobs` - Manage jobs
- `/employer-dashboard/jobs/create` - Create new job
- `/employer-dashboard/settings` - Company settings

## 🎨 UI Components

Built with shadcn/ui and includes:
- Button, Card, Input, Textarea
- Select, Badge, Avatar
- Alert Dialog, Popover
- And many more...

## 🔒 Security Features

- Password hashing with Argon2
- Session-based authentication
- CSRF protection
- SQL injection protection (via Drizzle ORM)
- Type-safe database queries

## 📦 Key Dependencies

- `next` - v15.5.7
- `react` - v19.1.0
- `drizzle-orm` - v0.44.6
- `@tiptap/react` - v3.11.1
- `@radix-ui/*` - Latest versions
- `zod` - v4.1.12
- `argon2` - v0.44.0

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- All the open-source contributors

---

Built with ❤️ using Next.js and modern web technologies
# WorkivaX
