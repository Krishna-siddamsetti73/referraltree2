'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function ReferralPage() {
  const router = useRouter();
  const params = useParams();
  const referrerId = params.id;

  useEffect(() => {
    // Store referrer ID and redirect to start page
    if (referrerId) {
      sessionStorage.setItem('referrerId', referrerId);
      // Redirect to start page with referrer parameter
      setTimeout(() => {
        router.push(`/start?ref=${referrerId}`);
      }, 2000);
    }
  }, [referrerId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
        <p className="text-gray-600 mb-4">
          You&apos;ve been invited to join the YouTube Membership Referral System.
        </p>
        <div className="animate-pulse">
          <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full animate-[progress_2s_ease-in-out]" style={{ width: '100%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Redirecting you to registration...</p>
        </div>
      </Card>
    </div>
  );
}
