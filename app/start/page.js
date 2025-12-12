'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Lock } from 'lucide-react';

export default function StartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const referrerId = searchParams.get('ref');

  useEffect(() => {
    if (referrerId) {
      sessionStorage.setItem('referrerId', referrerId);
    }
  }, [referrerId]);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: 'Invalid Phone',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        toast({
          title: 'OTP Sent!',
          description: `OTP sent to ${phone}. For demo, use: 1234`,
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to send OTP',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send OTP',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the 4-digit OTP',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: 'Success!',
          description: 'OTP verified successfully',
        });
        router.push('/details');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Invalid OTP',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify OTP',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {otpSent ? <Lock className="w-8 h-8 text-blue-600" /> : <Smartphone className="w-8 h-8 text-blue-600" />}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {otpSent ? 'Verify OTP' : 'Enter Phone Number'}
          </h2>
          <p className="text-gray-600">
            {otpSent ? 'Enter the OTP sent to your phone' : 'We\'ll send you a verification code'}
          </p>
        </div>

        {!otpSent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                className="text-lg"
              />
            </div>
            <Button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full h-12"
              size="lg"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">OTP</label>
              <Input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                className="text-lg text-center tracking-widest"
              />
              <p className="text-xs text-gray-500 mt-2">Demo OTP: 1234</p>
            </div>
            <Button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full h-12"
              size="lg"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setOtpSent(false)}
              className="w-full"
            >
              Change Phone Number
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
