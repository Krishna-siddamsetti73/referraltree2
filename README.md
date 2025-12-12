# YouTube Membership Referral System

A full-stack Next.js application for managing referrals with YouTube membership verification, OTP authentication, and static UPI payment activation.

## 🚀 Features

- **OTP Authentication**: Secure phone-based login with mock OTP (1234)
- **YouTube Membership Verification**: Mock verification system (ready for real OAuth integration)
- **Static QR Payment**: Trust-based ₹1 activation with UPI QR code
- **Referral Chain System**: Track predecessors and successors in a referral network
- **Responsive UI**: Beautiful, mobile-first design with Tailwind CSS and shadcn/ui
- **MongoDB Integration**: Persistent data storage with Mongoose

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Atlas)
- **UI Components**: shadcn/ui (Radix UI)
- **Authentication**: JWT with httpOnly cookies
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and Yarn
- MongoDB Atlas account (or local MongoDB)
- Modern web browser

## ⚙️ Environment Variables

The following environment variables are configured in `.env`:

```env
MONGO_URL=mongodb+srv://hyderabadschoolofrealestate_db_user:Asx0kO8GOEcvehEM@sharedreferral.9hltcpn.mongodb.net/?appName=sharedreferra
DB_NAME=referral_system
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGINS=*
```

## 🚀 Getting Started

### Installation

1. Install dependencies:
```bash
yarn install
```

2. The UPI QR code is already generated at `/public/upi.png`

3. Start the development server:
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Application Flow

### For New Users (Direct Sign-up)

1. **Home Page** (`/`) - Click "Refer Now"
2. **OTP Login** (`/start`) - Enter phone number → Receive OTP (use `1234`) → Verify
3. **User Details** (`/details`) - Optional: Enter name, email, address
4. **YouTube Verification** (`/membership`) - Mock verification (random result)
5. **Payment** (`/payment`) - Scan QR code → Click "I HAVE PAID"
6. **Referral Link** (`/referral-link`) - Get your unique referral link

### For Referred Users (Via Referral Link)

1. **Referral Handler** (`/referral/[id]`) - Captures referrer ID
2. **OTP Login** (`/start?ref=...`) - Same as above
3. **User Details** → **YouTube Verification** → **Payment** (same steps)
4. **Success Page** (`/successor-success`) - Confirms linkage to referrer
5. **Get Own Link** - Create your own referral link

## 🔌 API Endpoints

All endpoints are available at `/api/[endpoint]`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/send-otp` | Send OTP to phone (mock: always "1234") |
| POST | `/api/verify-otp` | Verify OTP and create/login user |
| POST | `/api/save-user-info` | Update user details (name, email, address) |
| POST | `/api/verify-youtube-membership` | Mock YouTube membership check |
| POST | `/api/activate-static-payment` | Activate account after payment |
| POST | `/api/generate-referral-link` | Create unique referral link |
| POST | `/api/assign-referral` | Link user to referrer (predecessor/successor) |
| GET | `/api/me` | Get current user details |

### Example API Call

```bash
# Send OTP
curl -X POST http://localhost:3000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'

# Verify OTP
curl -X POST http://localhost:3000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","otp":"1234"}'
```

## 🗄️ Database Schema

### User Model

```javascript
{
  phone: String (required, unique),
  name: String,
  email: String,
  address: String,
  
  isYTMember: Boolean (default: false),
  hasPaid1Rupee: Boolean (default: false),
  
  upiHash: String (default: ""),
  
  predecessor: ObjectId (ref: 'User', nullable),
  successors: [ObjectId] (ref: 'User'),
  
  referralLink: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 UI Components

Built with shadcn/ui components:
- Button, Input, Textarea
- Card, Alert, AlertDescription
- Toast notifications
- Responsive layouts

## 🔐 Authentication

- JWT tokens stored in httpOnly cookies
- 30-day session expiry
- Automatic session validation on protected routes

## 📝 Mock Features

The following features are mocked for MVP demonstration:

1. **OTP Service**: Always accepts "1234" as valid OTP
2. **YouTube OAuth**: Random 50/50 membership verification
3. **UPI Payment**: Trust-based, no real payment gateway
4. **SMS Service**: OTP logged to console instead of sending SMS

## 🔄 Referral Chain Logic

When User B signs up via User A's referral link:

```javascript
// User A (Referrer)
successors: [User B's ID]

// User B (Referred)
predecessor: User A's ID
```

This creates a tree structure for tracking referral networks.

## 🚀 Production Deployment

### Before Deploying:

1. **Change JWT Secret**: Update `JWT_SECRET` in `.env`
2. **Update Base URL**: Set `NEXT_PUBLIC_BASE_URL` to your domain
3. **Integrate Real Services**:
   - SMS service (Twilio, MSG91) for OTP
   - Google OAuth for YouTube verification
   - Payment gateway for real UPI verification
4. **Security**:
   - Enable HTTPS
   - Configure CORS properly
   - Add rate limiting
   - Implement request validation

### Build and Start

```bash
# Build for production
yarn build

# Start production server
yarn start
```

## 📂 Project Structure

```
/app
├── app/
│   ├── api/[[...path]]/route.js    # Backend API routes
│   ├── page.js                     # Home page
│   ├── start/page.js              # OTP login
│   ├── details/page.js            # User info form
│   ├── membership/page.js         # YouTube verification
│   ├── payment/page.js            # QR payment
│   ├── referral-link/page.js      # Show referral link
│   ├── referral/[id]/page.js      # Referral handler
│   ├── successor-success/page.js  # Success screen
│   └── layout.js                  # Root layout
├── lib/
│   ├── db.js                      # MongoDB connection
│   ├── models/User.js             # User schema
│   ├── jwt.js                     # JWT utilities
│   └── qr-generator.js            # UPI QR code generator
├── components/ui/                 # shadcn/ui components
├── public/
│   └── upi.png                    # Static UPI QR code
└── .env                           # Environment variables
```

## 🧪 Testing

Test the complete flow:

1. Visit `http://localhost:3000`
2. Click "Refer Now"
3. Enter any 10-digit phone number
4. Use OTP: `1234`
5. Fill optional details or skip
6. Verify YouTube membership
7. Click "I HAVE PAID" on payment page
8. Copy your referral link
9. Open referral link in incognito/another browser
10. Complete the flow again to test referral linkage

## 🐛 Troubleshooting

### Server won't start
```bash
# Restart Next.js
sudo supervisorctl restart nextjs
```

### MongoDB connection issues
- Check if `MONGO_URL` is correct in `.env`
- Verify MongoDB Atlas IP whitelist
- Check network connectivity

### UI not updating
- Clear browser cache
- Hard refresh (Ctrl + Shift + R)
- Check browser console for errors

## 📄 License

This project is for demonstration purposes.

## 🤝 Support

For issues or questions, please check the application logs:
```bash
tail -f /var/log/supervisor/nextjs.out.log
```

---

**Note**: This is an MVP with mocked integrations. For production use, implement real OTP service, YouTube OAuth, and payment gateway integration.
