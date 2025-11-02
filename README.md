# NextGig - Job Board Platform

A modern, full-featured job board platform built with React, TypeScript, Tailwind CSS, and Supabase. Connect talented professionals with their dream opportunities.

## Features

### For Candidates
- Browse and search thousands of job opportunities
- Advanced filtering by category, location, type, experience level
- One-click application process
- Application tracking dashboard with status updates
- Profile management

### For Employers
- Post and manage job listings
- Track applications and view candidate profiles
- Real-time analytics on views and applications
- Manage multiple job postings from one dashboard

### Key Highlights
- Secure authentication with role-based access (Candidate/Employer)
- Real-time data with Supabase
- Responsive design for all devices
- Modern UI with smooth animations
- Advanced search and filtering capabilities

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS with custom design system
- **Routing:** React Router v6
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Icons:** Lucide React
- **Build Tool:** Vite

## Design System

### Color Palette
- Primary: Teal (#0F766E) - Trust and professionalism
- Accent: Amber (#F59E0B) - Energy and opportunity
- Dark: (#111827) - Text and contrast
- Gray Scale: Purposeful grays for hierarchy

### Typography
- Headings: Montserrat (500, 600, 700)
- Body: Inter (400, 500, 600)

### Custom Spacing
Hybrid spacing scale combining Tailwind defaults with custom values (6px, 10px, 14px, 20px)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd opportunity-hub
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables

Create a \`.env\` file in the root directory:

\`\`\`env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

4. Database Setup

The database schema has already been migrated. Your Supabase database includes:
- profiles table (user information)
- jobs table (job listings)
- applications table (job applications)

All tables have Row Level Security (RLS) enabled with appropriate policies.

5. Start the development server
\`\`\`bash
npm run dev
\`\`\`

6. Build for production
\`\`\`bash
npm run build
\`\`\`

## Project Structure

\`\`\`
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── jobs/            # Job-specific components
│   └── layout/          # Layout components (Header, Footer)
├── pages/
│   ├── home/            # Home page
│   ├── jobs/            # Job browsing and details
│   ├── auth/            # Authentication pages
│   ├── employer/        # Employer dashboard
│   └── candidate/       # Candidate dashboard
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── utils/               # Utility functions
├── constants/           # Constants and types
├── types/               # TypeScript type definitions
└── lib/                 # Third-party library configs
\`\`\`

## Key Components

### Authentication
- Secure email/password authentication
- Role-based access control (Candidate vs Employer)
- Protected routes for dashboard access

### Job Management
- Create, update, and delete job postings (Employers)
- Rich job details with descriptions
- Salary ranges and location information
- Featured job listings

### Application Flow
- Streamlined application process
- Cover letter support
- Application status tracking
- Real-time application counts

## Database Schema

### Profiles Table
Stores user profile information extending Supabase auth.

### Jobs Table
Contains all job listings with details like title, description, salary, location, etc.

### Applications Table
Tracks job applications with status (pending, reviewing, shortlisted, rejected, accepted).

All tables include:
- Row Level Security (RLS) for data protection
- Automatic timestamp management
- Proper foreign key relationships

## Development

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint
- \`npm run typecheck\` - Run TypeScript type checking

### Code Style

- Single Responsibility Principle for components
- Descriptive naming conventions
- TypeScript for type safety
- No boilerplate comments
- Real placeholder content

## Security

- Row Level Security (RLS) on all database tables
- Authentication required for sensitive operations
- Input validation on forms
- Secure password requirements
- Protected API routes

## Contributing

This is a production-ready platform. For contributions:
1. Follow the existing code style
2. Maintain component organization
3. Add TypeScript types for new features
4. Test thoroughly before submitting

## License

MIT

## Support

For issues or questions, please open an issue in the repository.

---

Built with care for connecting talent with opportunity.
