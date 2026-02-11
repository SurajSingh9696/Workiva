# WorkivaX Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- MySQL 8.x or higher
- npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE workivax;
   ```

2. **Configure Environment Variables:**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your credentials:
   ```env
   DATABASE_URL="mysql://root:yourpassword@localhost:3306/workivax"
   ```

### 3. Run Database Migrations

Generate and run migrations:
```bash
npm run db:generate
npm run db:migrate
```

### 4. (Optional) UploadThing Setup

If you want file upload functionality:

1. Go to [uploadthing.com](https://uploadthing.com)
2. Create an account and get your API keys
3. Add them to your `.env`:
   ```env
   UPLOADTHING_SECRET="your-secret"
   UPLOADTHING_APP_ID="your-app-id"
   ```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Creating Test Users

### For Job Seekers (Applicants):
1. Go to `/register`
2. Fill in the form
3. Make sure the role is set to "applicant" (default)
4. Submit and login

### For Employers:
1. Go to `/register`
2. Fill in the form
3. Change role to "employer"
4. Submit and login

## Database Management

### View Database with Drizzle Studio:
```bash
npm run db:studio
```

This opens a visual database browser at `https://local.drizzle.studio`

### Reset Database:
If you need to start fresh:

```sql
DROP DATABASE workivax;
CREATE DATABASE workivax;
```

Then run migrations again:
```bash
npm run db:migrate
```

## Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
PORT=3001 npm run dev
```

### Database Connection Issues
- Verify MySQL is running: `mysql --version`
- Check your credentials in `.env`
- Ensure the database exists

### Type Errors in IDE
- Restart TypeScript server in your IDE
- Delete `.next` folder and restart: `rm -rf .next && npm run dev`

## Project Structure Overview

```
┌─ app/                    # Next.js routes
│  ┌─ (applicants)/       # Applicant-specific routes
│  ├─ employer-dashboard/  # Employer routes
│  └─ api/                 # API endpoints
├─ components/             # Reusable UI components
├─ features/              # Feature modules
│  ┌─ applicants/         # Applicant features
│  ├─ employers/          # Employer features
│  └─ auth/               # Authentication
└─ drizzle/               # Database schema & migrations
```

## Key Features to Test

### As an Applicant:
1. ✅ Browse jobs with filters
2. ✅ Apply to jobs with cover letter
3. ✅ Save/bookmark jobs
4. ✅ Track applications
5. ✅ Update profile

### As an Employer:
1. ✅ Create job postings
2. ✅ Edit/delete jobs
3. ✅ View applicants
4. ✅ Update application status
5. ✅ Manage company profile

## Development Tips

- **Hot Reload:** Changes auto-refresh in development
- **Turbopack:** Faster builds with Next.js 15
- **Type Safety:** Full TypeScript support
- **Database Changes:** Run `npm run db:generate` after schema changes

## Production Deployment

### Build for Production:
```bash
npm run build
npm start
```

### Environment Variables for Production:
Ensure all environment variables are set in your hosting platform.

### Recommended Hosting:
- **Frontend:** Vercel, Netlify
- **Database:** PlanetScale, Railway, DigitalOcean

## Support

For issues or questions:
1. Check the main README.md
2. Review the code documentation
3. Check console for error messages

Happy coding! 🚀
