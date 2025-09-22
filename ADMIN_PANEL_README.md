# Apluslocators Real Estate Admin Panel

## Overview

This is a comprehensive real estate admin panel built with Next.js, TypeScript, and Tailwind CSS. It provides end-to-end management capabilities for real estate businesses including property management, payroll processing, calendar integration, and client management.

## Features

### 🏠 Property Management
- **Property Listings**: Complete CRUD operations for property management
- **Property Details**: Comprehensive property information including photos, specifications, and pricing
- **Property Analytics**: Performance tracking and market analysis
- **Search & Filters**: Advanced filtering by type, status, price range, and location

### 📅 Calendar & Appointments
- **Google Calendar Integration**: Seamless synchronization with Google Calendar
- **Appointment Booking**: Schedule property showings, consultations, and inspections
- **Task Management**: Integrated task system within the calendar
- **Automated Reminders**: Email and SMS reminders for upcoming appointments

### 💰 USA Payroll System
- **Employee Management**: Complete employee database with tax information
- **Payroll Processing**: Automated payroll calculations with USA tax compliance
- **Tax Management**: Federal, state, social security, and Medicare tax calculations
- **Benefits Administration**: Health insurance, 401k, and other benefit deductions
- **Tax Forms**: Generate W-2, 1099, and quarterly tax reports

### 👥 Client Management
- **Client Database**: Comprehensive client information and preferences
- **Lead Tracking**: Prospect management and conversion tracking
- **Communication History**: Track all client interactions and communications
- **Property Matching**: Match clients with suitable properties based on preferences

### 📊 Dashboard & Analytics
- **Real-time Metrics**: Key performance indicators and business metrics
- **Revenue Tracking**: Financial performance and commission tracking
- **Property Performance**: Listing views, inquiries, and conversion rates
- **Agent Performance**: Individual agent statistics and rankings

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Chart.js, React Chart.js 2
- **Icons**: React Icons (Feather Icons)
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Date/Time**: Native JavaScript Date API

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aplusAI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Admin Panel Access

Navigate to `/admin/login` to access the admin panel.

**Demo Credentials:**
- Email: `admin@apluslocators.com`
- Password: `admin123`

## Admin Panel Structure

```
/admin
├── /dashboard          # Main dashboard with analytics
├── /properties         # Property management
│   ├── /add           # Add new property form
│   └── /analytics     # Property performance analytics
├── /calendar          # Calendar and appointments
├── /appointments      
│   └── /book          # Book new appointment
├── /payroll           # Payroll management system
│   └── /taxes         # Tax management
├── /clients           # Client management
├── /agents            # Agent management
├── /communications    # Email/SMS communications
├── /notifications     # Push notifications
├── /documents         # Document management
├── /gallery           # Photo gallery management
├── /settings          # System settings
└── /login             # Admin login page
```

## Key Features Explained

### Property Management System
- **Add Properties**: Comprehensive form with property details, photos, and features
- **Property Grid**: Visual grid layout with filtering and sorting
- **Property Analytics**: Track views, inquiries, and performance metrics
- **Status Management**: Active, pending, sold, and draft statuses

### Calendar Integration
- **Google Calendar Sync**: Two-way synchronization with Google Calendar
- **Appointment Types**: Property showings, consultations, inspections, meetings
- **Task Management**: Create and track tasks within the calendar system
- **Availability Management**: Agent availability and scheduling conflicts

### Payroll System
- **Tax Compliance**: Full USA tax calculation including federal, state, and local taxes
- **Employee Types**: Salary, hourly, and commission-based employees
- **Benefits Management**: Health insurance, 401k, and other deductions
- **Reporting**: Generate pay stubs, tax forms, and compliance reports

### Client Management
- **Client Types**: Buyers, sellers, renters, landlords, and investors
- **Preferences Tracking**: Property type, price range, and location preferences
- **Communication History**: Track all interactions and follow-ups
- **Rating System**: Client satisfaction and priority ratings

## Customization

### Adding New Features
1. Create new page components in the appropriate `/admin` subdirectory
2. Add navigation items to `/admin/layout.tsx`
3. Implement the feature using existing UI components from `@/components/ui`

### Styling Customization
- Modify `tailwind.config.ts` for theme customization
- Update CSS variables in `globals.css` for color schemes
- Use shadcn/ui component variants for consistent styling

### API Integration
The current implementation uses mock data. To integrate with a real backend:
1. Replace mock data with API calls
2. Add authentication middleware
3. Implement real-time updates with WebSocket or polling

## Security Considerations

- Implement proper authentication and authorization
- Add CSRF protection for forms
- Validate all user inputs
- Use HTTPS in production
- Implement role-based access control
- Add audit logging for sensitive operations

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_API_URL=your_api_url
GOOGLE_CALENDAR_API_KEY=your_google_api_key
DATABASE_URL=your_database_url
```

## Support

For support and customization requests, please contact the development team.

## License

This project is proprietary software developed for Apluslocators.
