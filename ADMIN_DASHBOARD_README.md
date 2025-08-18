# Nyerere Marathon 2025 - Admin Dashboard

## 🎯 Overview

A comprehensive admin dashboard for managing the Nyerere Marathon 2025 website. Built with Angular (TypeScript), Node.js/Express, and MongoDB.

## 🚀 Features

### ✅ Authentication & Security
- JWT-based admin authentication
- Role-based access control (admin/organizer)
- Protected routes with automatic redirects
- Secure token verification

### 📊 Dashboard Overview
- Real-time statistics and metrics
- Recent registrations and news
- Revenue tracking
- Content management overview
- Registration trends

### 📝 Content Management
- **News Management**: Create, edit, delete news articles
- **Gallery Management**: Upload and organize images
- **Sponsor Management**: Manage sponsor information and logos
- **Highlights Management**: Special stories and achievements
- **Interview Management**: Manage interview content

### 🏃‍♂️ Race Management
- Participant registration approval/rejection
- Race information management
- Results upload and management
- User role management

## 🛠️ Tech Stack

### Frontend
- **Angular 17** with TypeScript
- **Angular Material** for UI components
- **TailwindCSS** for styling
- **Angular Router** for navigation
- **Angular Reactive Forms** for form handling

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads

## 📁 Project Structure

```
frontend/src/app/
├── admin/                      # Admin dashboard module
│   ├── layout/
│   │   ├── admin-layout.component.ts
│   │   ├── admin-sidebar.component.ts
│   │   └── admin-topbar.component.ts
│   ├── pages/
│   │   ├── dashboard-overview/
│   │   ├── participants-management/
│   │   ├── payment-management/
│   │   ├── race-categories/
│   │   ├── results-management/
│   │   ├── announcements/
│   │   ├── cms/
│   │   ├── volunteers-management/
│   │   ├── settings/
│   │   ├── user-management/
│   │   └── reports-analytics/
│   ├── shared/
│   │   ├── chart.component.ts
│   │   ├── data-table.component.ts
│   │   ├── modal.component.ts
│   │   └── loading-spinner.component.ts
│   └── admin.module.ts
├── components/
│   └── auth/
│       └── admin-login/
│           └── admin-login.component.ts
├── guards/
│   └── admin.guard.ts
└── services/
    └── auth.service.ts

backend/
├── routes/
│   ├── admin.js              # Admin API routes
│   └── auth.js               # Authentication routes
├── controllers/
│   └── adminController.js    # Admin business logic
├── models/
│   ├── News.js              # News model
│   ├── Sponsor.js           # Sponsor model
│   ├── Highlight.js         # Highlight model
│   └── Interview.js         # Interview model
└── middleware/
    └── upload.js            # File upload middleware
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nyerere-marathon-2025
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd src
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example
   cp env.example .env

   # Configure your environment variables
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Start the development servers**
   ```bash
   # Start backend server
   npm run dev

   # In another terminal, start frontend
   cd src
   npm start
   ```

## 🔐 Admin Access

### Default Admin Credentials
- **Email**: `admin@nyerere.com`
- **Password**: `admin123`

### Creating Admin Users

1. **Via Database** (if MongoDB is connected):
   ```javascript
   // Create admin user in MongoDB
   const adminUser = new User({
     firstName: 'Admin',
     lastName: 'User',
     email: 'admin@nyerere.com',
     password: 'secure_password',
     role: 'admin',
     // ... other fields
   });
   await adminUser.save();
   ```

2. **Via Temporary Storage** (if database is not connected):
   - The system includes a temporary admin user for development
   - Use the default credentials above

## 📱 Admin Dashboard Usage

### 1. Login
- Navigate to `/admin/login`
- Enter admin credentials
- You'll be redirected to the dashboard

### 2. Dashboard Overview
- View real-time statistics
- Monitor recent activities
- Access quick actions

### 3. Content Management

#### News Management
- Create news articles with rich content
- Set publish dates and status
- Add tags and categories
- Upload featured images

#### Gallery Management
- Upload images for different sections
- Organize by type (gallery, slider, etc.)
- Add captions and descriptions

#### Sponsor Management
- Add sponsor logos and information
- Set sponsorship categories
- Manage contact information

### 4. Race Management
- Approve/reject participant registrations
- Upload race results
- Manage race information

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/verify-admin` - Verify admin token

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

### News Management
- `GET /api/admin/news` - Get all news
- `POST /api/admin/news` - Create news
- `PUT /api/admin/news/:id` - Update news
- `DELETE /api/admin/news/:id` - Delete news

### Content Management
- `GET /api/admin/sponsors` - Get all sponsors
- `POST /api/admin/sponsors` - Create sponsor
- `GET /api/admin/gallery` - Get gallery items
- `POST /api/admin/gallery` - Upload gallery item
- `GET /api/admin/highlights` - Get highlights
- `POST /api/admin/highlights` - Create highlight
- `GET /api/admin/interviews` - Get interviews
- `POST /api/admin/interviews` - Create interview

### Race Management
- `GET /api/admin/registrations` - Get registrations
- `PUT /api/admin/registrations/:id/status` - Update registration status
- `GET /api/admin/results` - Get race results
- `POST /api/admin/results/upload` - Upload results

## 🎨 Customization

### Styling
- Modify TailwindCSS classes in components
- Update color scheme in `tailwind.config.js`
- Customize icons from Lucide React

### Adding New Features
1. Create new model in `models/`
2. Add controller methods in `controllers/adminController.js`
3. Create API routes in `routes/admin.js`
4. Build frontend components in `src/pages/admin/`
5. Add TypeScript types in `src/types/admin.ts`

## 🔒 Security Considerations

- All admin routes are protected with JWT authentication
- File uploads are validated and restricted
- Admin-only access to sensitive operations
- Input validation on all forms
- CORS configuration for production

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Configure MongoDB connection
3. Set up file upload storage
4. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the build folder to your hosting service
3. Configure environment variables for production API

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify database connection
3. Ensure all environment variables are set
4. Check file permissions for uploads

## 🔄 Updates

To update the admin dashboard:
1. Pull latest changes from repository
2. Run `npm install` to update dependencies
3. Restart the development servers
4. Test all functionality

---

**Note**: This admin dashboard is designed for the Nyerere Marathon 2025 event. Customize content, branding, and features as needed for your specific use case.
