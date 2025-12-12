import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { signToken, verifyToken } from '@/lib/jwt';

// Mock OTP storage (in production, use Redis or database)
const otpStore = new Map();

// Helper to get user from JWT cookie
async function getUserFromRequest(request) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return null;
  
  const payload = verifyToken(token);
  if (!payload) return null;
  
  await dbConnect();
  const user = await User.findById(payload.userId);
  return user;
}

// POST /api/send-otp
async function handleSendOTP(request) {
  try {
    const { phone } = await request.json();
    
    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { error: 'Valid phone number required' },
        { status: 400 }
      );
    }
    
    // Mock OTP - always "1234"
    const otp = '1234';
    otpStore.set(phone, { otp, timestamp: Date.now() });
    
    // In production, send real SMS here
    console.log(`OTP for ${phone}: ${otp}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully (mock)',
      debug: { otp } // Remove in production
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}

// POST /api/verify-otp
async function handleVerifyOTP(request) {
  try {
    const { phone, otp } = await request.json();
    
    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone and OTP required' },
        { status: 400 }
      );
    }
    
    // Verify OTP
    const stored = otpStore.get(phone);
    if (!stored || stored.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 401 }
      );
    }
    
    // OTP valid, clear it
    otpStore.delete(phone);
    
    // Connect to DB and find or create user
    await dbConnect();
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = await User.create({ phone });
    }
    
    // Generate JWT
    const token = signToken({ userId: user._id.toString(), phone: user.phone });
    
    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        email: user.email,
        isYTMember: user.isYTMember,
        hasPaid1Rupee: user.hasPaid1Rupee,
        referralLink: user.referralLink,
      },
    });
    
    // Set httpOnly cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}

// POST /api/save-user-info
async function handleSaveUserInfo(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { name, email, address } = await request.json();
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address || user.address;
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        email: user.email,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Save user info error:', error);
    return NextResponse.json(
      { error: 'Failed to save user info' },
      { status: 500 }
    );
  }
}

// POST /api/verify-youtube-membership
async function handleVerifyYoutubeMembership(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Mock YouTube verification
    // In production, implement real OAuth flow and API call
    const { youtubeChannelId } = await request.json();
    
    // Mock: randomly set to true for demo (or always false)
    const isMember = Math.random() > 0.5; // 50% chance for demo
    
    user.isYTMember = isMember;
    await user.save();
    
    return NextResponse.json({
      success: true,
      isYTMember: isMember,
      message: isMember 
        ? 'YouTube membership verified!' 
        : 'Not a YouTube member. You can continue, but referrals will not be attributed.',
    });
  } catch (error) {
    console.error('Verify YouTube membership error:', error);
    return NextResponse.json(
      { error: 'Failed to verify membership' },
      { status: 500 }
    );
  }
}

// POST /api/activate-static-payment
async function handleActivateStaticPayment(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    user.hasPaid1Rupee = true;
    user.upiHash = 'staticQRverified';
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Payment activated successfully',
    });
  } catch (error) {
    console.error('Activate payment error:', error);
    return NextResponse.json(
      { error: 'Failed to activate payment' },
      { status: 500 }
    );
  }
}

// POST /api/generate-referral-link
async function handleGenerateReferralLink(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const referralLink = `${baseUrl}/referral/${user._id.toString()}`;
    
    user.referralLink = referralLink;
    await user.save();
    
    return NextResponse.json({
      success: true,
      referralLink,
    });
  } catch (error) {
    console.error('Generate referral link error:', error);
    return NextResponse.json(
      { error: 'Failed to generate referral link' },
      { status: 500 }
    );
  }
}

// POST /api/assign-referral
async function handleAssignReferral(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { referrerId } = await request.json();
    
    if (!referrerId) {
      return NextResponse.json(
        { error: 'Referrer ID required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    const referrer = await User.findById(referrerId);
    
    if (!referrer) {
      return NextResponse.json(
        { error: 'Referrer not found' },
        { status: 404 }
      );
    }
    
    // Set predecessor and add to referrer's successors
    user.predecessor = referrer._id;
    await user.save();
    
    if (!referrer.successors.includes(user._id)) {
      referrer.successors.push(user._id);
      await referrer.save();
    }
    
    return NextResponse.json({
      success: true,
      message: 'Referral link assigned successfully',
    });
  } catch (error) {
    console.error('Assign referral error:', error);
    return NextResponse.json(
      { error: 'Failed to assign referral' },
      { status: 500 }
    );
  }
}

// GET /api/me
async function handleGetMe(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        email: user.email,
        address: user.address,
        isYTMember: user.isYTMember,
        hasPaid1Rupee: user.hasPaid1Rupee,
        referralLink: user.referralLink,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// Main handler
export async function POST(request, { params }) {
  const path = params.path?.join('/') || '';
  
  switch (path) {
    case 'send-otp':
      return handleSendOTP(request);
    case 'verify-otp':
      return handleVerifyOTP(request);
    case 'save-user-info':
      return handleSaveUserInfo(request);
    case 'verify-youtube-membership':
      return handleVerifyYoutubeMembership(request);
    case 'activate-static-payment':
      return handleActivateStaticPayment(request);
    case 'generate-referral-link':
      return handleGenerateReferralLink(request);
    case 'assign-referral':
      return handleAssignReferral(request);
    default:
      return NextResponse.json(
        { error: 'API route not found' },
        { status: 404 }
      );
  }
}

export async function GET(request, { params }) {
  const path = params.path?.join('/') || '';
  
  switch (path) {
    case 'me':
      return handleGetMe(request);
    default:
      return NextResponse.json(
        { error: 'API route not found' },
        { status: 404 }
      );
  }
}
