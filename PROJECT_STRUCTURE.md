# 🏗️ Full-Stack Web Application Structure

A comprehensive, scalable file structure for a full-stack web application with clear separation of concerns.

```
marathon-app/
├── 📁 frontend/                          # Angular frontend application
│   ├── 📁 src/                           # Source code
│   │   ├── 📁 app/                       # Main application module
│   │   │   ├── 📁 components/            # Reusable UI components
│   │   │   │   ├── 📁 home/              # Home page components
│   │   │   │   │   ├── home.component.ts
│   │   │   │   │   ├── home.component.html
│   │   │   │   │   └── home.component.scss
│   │   │   │   ├── 📁 auth/              # Authentication components
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   └── admin-login/
│   │   │   │   ├── 📁 races/             # Race-related components
│   │   │   │   │   ├── race-list/
│   │   │   │   │   ├── race-detail/
│   │   │   │   │   └── race-registration/
│   │   │   │   ├── 📁 news/              # News components
│   │   │   │   ├── 📁 shared/            # Shared components
│   │   │   │   │   ├── navbar/
│   │   │   │   │   ├── footer/
│   │   │   │   │   ├── countdown-timer/
│   │   │   │   │   └── image-carousel/
│   │   │   │   └── 📁 admin/             # Admin dashboard components
│   │   │   │       ├── layout/
│   │   │   │       ├── pages/
│   │   │   │       └── shared/
│   │   │   ├── 📁 services/              # Angular services
│   │   │   │   ├── auth.service.ts       # Authentication service
│   │   │   │   ├── race.service.ts       # Race-related API calls
│   │   │   │   ├── participant.service.ts # Participant management
│   │   │   │   └── translation.service.ts # Internationalization
│   │   │   ├── 📁 guards/                # Route guards
│   │   │   │   ├── auth.guard.ts         # Authentication guard
│   │   │   │   └── admin.guard.ts        # Admin access guard
│   │   │   ├── 📁 models/                # TypeScript interfaces
│   │   │   │   ├── race.interface.ts
│   │   │   │   ├── user.interface.ts
│   │   │   │   └── participant.interface.ts
│   │   │   ├── app.component.ts          # Root component
│   │   │   ├── app.module.ts             # Root module
│   │   │   └── app-routing.module.ts     # Main routing
│   │   ├── 📁 assets/                    # Static assets
│   │   │   ├── 📁 images/                # Images and logos
│   │   │   ├── 📁 data/                  # Static data files
│   │   │   └── 📁 slides/                # Image slides
│   │   ├── 📁 environments/              # Environment configurations
│   │   │   ├── environment.ts            # Development environment
│   │   │   └── environment.prod.ts       # Production environment
│   │   ├── index.html                    # Main HTML entry point
│   │   ├── main.ts                       # Application entry point
│   │   └── styles.css                    # Global styles
│   ├── angular.json                      # Angular CLI configuration
│   ├── package.json                      # Frontend dependencies
│   └── tsconfig.json                     # TypeScript configuration
│
├── 📁 controllers/                       # Express.js controllers
│   ├── adminController.js                # Admin operations
│   ├── authController.js                 # Authentication logic
│   ├── galleryController.js              # Gallery management
│   ├── notificationController.js         # Notification handling
│   └── participantController.js          # Participant operations
│
├── 📁 models/                            # MongoDB models
│   ├── AdminNotification.js              # Admin notification model
│   ├── gallery.js                        # Gallery model
│   ├── Highlight.js                      # Highlight model
│   ├── News.js                           # News model
│   ├── Participant.js                    # Participant model
│   ├── Race.js                           # Race model
│   ├── Result.js                         # Result model
│   ├── Sponsor.js                        # Sponsor model
│   ├── User.js                           # User model
│   └── Volunteer.js                      # Volunteer model
│
├── 📁 routes/                            # Express.js routes
│   ├── admin.js                          # Admin API routes
│   ├── auth.js                           # Authentication routes
│   ├── galleryRoutes.js                  # Gallery routes
│   ├── participantRoutes.js              # Participant routes
│   ├── raceRoutes.js                     # Race routes
│   ├── resultRoutes.js                   # Result routes
│   └── userRoutes.js                     # User routes
│
├── 📁 middleware/                        # Express.js middleware
│   └── upload.js                         # File upload middleware
│
├── 📁 config/                            # Configuration files
│   └── database.js                       # Database configuration
│
├── 📁 uploads/                           # File uploads
│   ├── 📁 gallery/                       # Gallery images
│   ├── 📁 highlights/                    # Highlight images
│   ├── 📁 interviews/                    # Interview content
│   ├── 📁 news/                          # News images
│   ├── 📁 sliders/                       # Slider images
│   └── 📁 sponsors/                      # Sponsor logos
│
├── 📁 public/                            # Static files
│   ├── 📁 assets/                        # Public assets
│   ├── 📁 gallery/                       # Public gallery
│   ├── 📁 slides/                        # Public slides
│   └── index.html                        # Public HTML
│
├── server.js                             # Express.js server
├── package.json                          # Backend dependencies
├── tsconfig.json                         # TypeScript configuration
└── README.md                             # Project documentation
```

## 📋 Key Features & Best Practices

### 🎯 **Frontend (React + TypeScript + Vite)**
- **Component Organization**: Grouped by feature and type (common, layout, domain-specific)
- **Custom Hooks**: Reusable logic abstraction
- **Type Safety**: Comprehensive TypeScript coverage
- **Testing**: Jest + React Testing Library
- **Styling**: Tailwind CSS with modular approach
- **State Management**: Context API + Custom hooks
- **Build Tool**: Vite for fast development and building

### ⚙️ **Backend (Node.js + Express + MongoDB)**
- **MVC Architecture**: Clear separation of routes, controllers, and models
- **Middleware Pipeline**: Authentication, validation, error handling
- **Service Layer**: Business logic abstraction
- **Input Validation**: Joi/Yup schema validation
- **Security**: JWT authentication, rate limiting, CORS
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Jest + Supertest for API testing

### 🔗 **Shared Resources**
- **Type Definitions**: Shared TypeScript interfaces
- **Constants**: API endpoints, validation rules, status codes
- **Utilities**: Common validation and formatting functions

### 🚀 **Development & Deployment**
- **Monorepo Setup**: npm workspaces for dependency management
- **Docker Support**: Containerized development and production
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Environment Management**: Separate configs for dev/staging/production
- **Documentation**: Comprehensive API and development docs

### 📊 **Testing Strategy**
- **Frontend**: Unit tests for components, integration tests for user flows
- **Backend**: Unit tests for business logic, integration tests for API endpoints
- **E2E Testing**: Cypress or Playwright for full application testing

### 🔧 **Development Tools**
- **Code Quality**: ESLint + Prettier for consistent formatting
- **Git Hooks**: Husky for pre-commit validation
- **Type Checking**: TypeScript in strict mode
- **Hot Reloading**: Vite HMR for frontend, Nodemon for backend

This structure provides a solid foundation for a scalable, maintainable full-stack application with clear separation of concerns and modern best practices. 