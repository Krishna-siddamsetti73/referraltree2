'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { IndianRupee, QrCode } from 'lucide-react';
import Image from 'next/image';

export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePaymentConfirm = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/activate-static-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: 'Payment Confirmed!',
          description: 'Your account has been activated',
        });
        
        // Check if user came from referral link
        const referrerId = sessionStorage.getItem('referrerId');
        if (referrerId) {
          router.push('/successor-success');
        } else {
          router.push('/referral-link');
        }
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to activate payment',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to confirm payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IndianRupee className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Activate Your Account</h2>
          <p className="text-gray-600">
            Scan the QR code and pay ₹1 to activate your referral identity
          </p>
        </div>

        <div className="space-y-6">
          {/* QR Code */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
            <QrCode className="w-8 h-8 text-gray-400 mb-4" />
            <div className="relative w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <Image
                src="/upi.png"
                alt="UPI QR Code"
                width={240}
                height={240}
                className="rounded"
              />
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Scan with any UPI app (GPay, PhonePe, Paytm)
            </p>
            <p className="text-2xl font-bold text-green-600 mt-2">₹1</p>
          </div>

          <Alert>
            <AlertDescription className="text-center">
              This is a trust-based activation. Click &ldquo;I HAVE PAID&rdquo; after completing the payment.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handlePaymentConfirm}
            disabled={loading}
            className="w-full h-12 bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {loading ? 'Activating...' : 'I HAVE PAID'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
