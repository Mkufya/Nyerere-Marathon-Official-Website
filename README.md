# Nyerere International Marathon 2025

A modern, responsive website for the Nyerere International Marathon 2025 event, built with Angular, TypeScript, and TailwindCSS.

## 🏃‍♂️ About the Event

The Nyerere International Marathon 2025 is Tanzania's premier marathon event celebrating unity, endurance, and community spirit. The event will take place on October 11, 2025, in Mbeya, Tanzania, featuring four race categories:

- **Full Marathon (42.2 km)** - The ultimate challenge
- **Half Marathon (21.1 km)** - Perfect for intermediate runners
- **10K Run (10 km)** - Great for beginners
- **5K Fun Run (5 km)** - Family-friendly event

## 🚀 Features

- **Modern Design**: Clean, responsive design with TailwindCSS
- **Registration System**: Complete online registration with payment integration
- **Race Information**: Detailed race categories, routes, and information
- **Results System**: Real-time race results and leaderboards
- **Gallery**: Photo gallery from previous events
- **News & Media**: Latest updates and press releases
- **Admin Dashboard**: Comprehensive admin panel for event management
- **Multi-language Support**: English and Swahili support
- **Payment Integration**: GePG, M-Pesa, Airtel Money, and card payments

## 🛠️ Tech Stack

- **Frontend**: Angular 17, TypeScript, TailwindCSS
- **State Management**: Angular Services, RxJS
- **Routing**: Angular Router
- **Forms**: Angular Reactive Forms
- **UI Components**: Angular Material + Custom components
- **HTTP Client**: Angular HttpClient with interceptors
- **Build Tool**: Angular CLI

## 📁 Project Structure

```
nyerere-marathon-2025/
├── frontend/                    # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # Reusable UI components
│   │   │   │   ├── home/        # Home page components
│   │   │   │   ├── auth/        # Authentication components
│   │   │   │   ├── races/       # Race-related components
│   │   │   │   ├── news/        # News components
│   │   │   │   ├── shared/      # Shared components
│   │   │   │   └── admin/       # Admin dashboard components
│   │   │   ├── services/        # Angular services
│   │   │   ├── guards/          # Route guards
│   │   │   └── models/          # TypeScript interfaces
│   │   ├── assets/              # Static assets
│   │   └── environments/        # Environment configurations
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
├── controllers/                 # Express.js controllers
├── models/                      # MongoDB models
├── routes/                      # Express.js routes
├── middleware/                  # Express.js middleware
├── config/                      # Configuration files
├── uploads/                     # File uploads
├── public/                      # Static files
├── server.js                    # Express.js server
└── package.json                 # Backend dependencies
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#1e40af` (Marathon Blue)
- **Secondary Yellow**: `#fbbf24` (Marathon Yellow)
- **Success Green**: `#059669` (Marathon Green)
- **Error Red**: `#dc2626` (Marathon Red)

### Typography
- **Display Font**: Poppins (Headings)
- **Body Font**: Inter (Body text)

### Components
- **Buttons**: Primary, Secondary, Outline, Ghost variants
- **Inputs**: Text, Email, Phone, Date, Select, Textarea
- **Cards**: Information cards, feature cards
- **Modals**: Confirmation, forms, information
- **Tables**: Data tables, results tables

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nyerere-marathon-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   REACT_APP_API_URL=http://localhost:3002/api
   REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_key
   REACT_APP_MPESA_CONSUMER_KEY=your_mpesa_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🔧 Configuration

### TailwindCSS
The project uses TailwindCSS with custom configuration for the marathon theme. See `tailwind.config.js` for details.

### TypeScript
TypeScript is configured with strict mode and path aliases. See `tsconfig.json` for configuration.

### API Integration
The project includes API services for:
- Registration management
- Race results
- Gallery management
- Payment processing


## 🎯 Key Features Implementation

### Registration System
- Multi-step registration form
- Real-time validation
- Payment integration
- Email confirmation
- Registration status tracking

### Payment Integration
- **GePG**: Government Electronic Payment Gateway
- **M-Pesa**: Mobile money payments
- **Airtel Money**: Mobile money payments
- **Tigo Pesa**: Mobile money payments
- **Bank Transfer**: Direct bank transfers
- **Card Payments**: Credit/debit card processing



## 🌐 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
REACT_APP_API_URL=https://api.nyeremarathon.com
REACT_APP_ENVIRONMENT=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: info@nyeremarathon.com
- **Phone**: +255 123 456 789
- **Website**: https://nyeremarathon.com

## 🙏 Acknowledgments

- Mwalimu Julius K. Nyerere Foundation
- Tanzania Athletics Federation
- All sponsors and partners
- Volunteers and organizers

---

**Nyerere International Marathon 2025** - Celebrating Unity, Endurance, and Community Spirit 🏃‍♂️🇹🇿 