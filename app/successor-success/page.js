'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SuccessorSuccessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assign referral when component mounts
    const assignReferral = async () => {
      const referrerId = sessionStorage.getItem('referrerId');
      
      if (referrerId) {
        try {
          const res = await fetch('/api/assign-referral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ referrerId }),
          });
          const data = await res.json();

          if (data.success) {
            sessionStorage.removeItem('referrerId');
            toast({
              title: 'Success!',
              description: 'You are now linked to your referrer',
            });
          }
        } catch (error) {
          console.error('Failed to assign referral:', error);
        }
      }
      setLoading(false);
    };

    assignReferral();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Account Activated! ✅</h2>
          <p className="text-gray-600 mb-6">
            You are successfully linked to your referrer and part of the referral chain.
          </p>

          <Card className="bg-blue-50 border-blue-200 p-6 mb-6">
            <div className="flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">What&apos;s Next?</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800 text-left">
              <li>• Your account is now active</li>
              <li>• You&apos;re part of the referral network</li>
              <li>• You can now create your own referral link</li>
              <li>• Start inviting others to grow your network</li>
            </ul>
          </Card>

          <Button
            onClick={() => router.push('/referral-link')}
            disabled={loading}
            className="w-full h-12"
            size="lg"
          >
            {loading ? 'Processing...' : 'Get My Referral Link'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
