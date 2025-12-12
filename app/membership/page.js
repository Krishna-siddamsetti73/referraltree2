'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Youtube, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function MembershipPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(null);

  const handleVerify = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/verify-youtube-membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeChannelId: 'mock-channel-id' }),
      });
      const data = await res.json();

      if (data.success) {
        setVerified(data.isYTMember);
        toast({
          title: data.isYTMember ? 'Verified!' : 'Not a Member',
          description: data.message,
          variant: data.isYTMember ? 'default' : 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Verification failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify membership',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Youtube className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">YouTube Membership Verification</h2>
          <p className="text-gray-600">
            Verify your YouTube membership to become a valid referrer
          </p>
        </div>

        {verified === null && (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Click below to verify your YouTube membership. This is a mock verification for demo purposes.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleVerify}
              disabled={loading}
              className="w-full h-12"
              size="lg"
            >
              {loading ? 'Verifying...' : 'Verify YouTube Membership'}
            </Button>
          </div>
        )}

        {verified === true && (
          <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                ✅ You are a verified YouTube member! You can earn referrals.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleContinue}
              className="w-full h-12"
              size="lg"
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {verified === false && (
          <div className="space-y-6">
            <Alert className="border-yellow-200 bg-yellow-50">
              <XCircle className="h-5 w-5 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                ⚠️ You are not a YouTube member. You can continue, but your referrals will NOT be attributed to you unless you have a membership.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleContinue}
              variant="outline"
              className="w-full h-12"
              size="lg"
            >
              Continue Anyway
            </Button>

            <Button
              onClick={handleVerify}
              className="w-full"
              variant="ghost"
            >
              Try Again
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
