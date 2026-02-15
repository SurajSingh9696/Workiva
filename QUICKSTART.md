# 🚀 Quick Start Guide - WorkivaX

## Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account (free)
- VS Code (recommended)

## Step 1: MongoDB Setup

### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# Windows: Download from mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt install mongodb

# Start MongoDB
mongod
```

### Option B: MongoDB Atlas (Cloud - Free)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free tier available)
3. Create a cluster (takes 1-3 minutes)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `workivax`

## Step 2: Environment Variables

Create `.env` file in project root:

```bash
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/workivax

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workivax

# UploadThing (for file uploads)
UPLOADTHING_TOKEN=your_token_here
```

## Step 3: Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Server starts at: `http://localhost:3000`

## Step 4: Test the Application

### Register as Employer:
1. Go to `http://localhost:3000/register`
2. Fill in details
3. Select "Employer" role
4. Click "Register"

### Register as Applicant:
1. Go to `http://localhost:3000/register`
2. Fill in details
3. Select "Applicant" role
4. Click "Register"

### Post a Job (Employer):
1. Login as employer
2. Go to "Jobs" → "Create Job"
3. Fill in job details
4. Click "Post Job"

### Apply to Job (Applicant):
1. Login as applicant
2. Browse jobs on dashboard
3. Click on a job
4. Click "Apply Now"
5. Write cover letter
6. Submit application

## Common Issues & Fixes

### ❌ "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod
```

### ❌ "MONGODB_URI is not defined"
- Make sure `.env` file exists in project root
- Check that MONGODB_URI is spelled correctly
- Restart dev server: `npm run dev`

### ❌ "Network error" (MongoDB Atlas)
- Add your IP to Atlas whitelist
- Go to Atlas → Network Access → Add IP Address
- Or whitelist all IPs: `0.0.0.0/0` (development only!)

### ❌ Port 3000 already in use
```bash
# Dev server will use next available port (3001, 3002, etc.)
# Or kill process on port 3000:
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill
```

### ❌ "Module not found"
```bash
# Clear cache and reinstall
npm run clean  # If available
# OR
Remove-Item node_modules -Recurse -Force
Remove-Item .next -Recurse -Force
npm install
```

## Features to Test

### ✅ Authentication
- [ ] Register as employer
- [ ] Register as applicant
- [ ] Login
- [ ] Logout
- [ ] Session persistence

### ✅ Employer Features
- [ ] Complete profile
- [ ] Post job
- [ ] Edit job
- [ ] Delete job
- [ ] View applicants
- [ ] Change application status

### ✅ Applicant Features
- [ ] Complete profile
- [ ] Browse jobs
- [ ] Search jobs
- [ ] Filter jobs (type, level, work mode)
- [ ] Apply to job
- [ ] Save job
- [ ] View applications
- [ ] Check application status

## Database Collections

After registration, check your MongoDB database:

```bash
# Connect to MongoDB
mongosh workivax

# View collections
show collections

# View users
db.users.find()

# View sessions
db.sessions.find()
```

## Production Deployment

For production (Vercel, etc.):

1. **Environment Variables**:
   - Add MONGODB_URI to deployment platform
   - Use MongoDB Atlas (not local)
   - Add other secrets (UPLOADTHING_TOKEN)

2. **Build**:
```bash
npm run build
npm start
```

3. **Security**:
   - Use strong passwords
   - Whitelist specific IPs
   - Enable MongoDB authentication
   - Use HTTPS

## Need Help?

1. Check [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md) for detailed info
2. Check [MONGODB_MIGRATION.md](MONGODB_MIGRATION.md) for migration details
3. Check browser console for errors (F12)
4. Check terminal for server errors
5. Verify MongoDB is running and MONGODB_URI is correct

## Success Indicators

✅ Dev server running without errors
✅ Homepage loads at http://localhost:3000
✅ Can access /register page
✅ Can create account
✅ Dashboard loads after login
✅ No TypeScript errors

---

**You're all set!** 🎉

Start building amazing job portal features!
