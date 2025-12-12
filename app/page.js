'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Share2, Youtube, IndianRupee } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            YouTube Membership Referral System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community, verify your YouTube membership, and start earning through referrals
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy OTP Login</h3>
            <p className="text-gray-600">Quick and secure authentication with your phone number</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Youtube className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">YouTube Verification</h3>
            <p className="text-gray-600">Verify your YouTube membership to become a valid referrer</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Referral Chain</h3>
            <p className="text-gray-600">Build your referral network and track your successors</p>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-md mx-auto p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <IndianRupee className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Get Started for Just ₹1</h2>
            <p className="text-gray-600 mb-6">
              Activate your referral identity with a one-time payment of ₹1 and start building your network
            </p>
            <Button 
              size="lg" 
              className="w-full text-lg h-14"
              onClick={() => router.push('/start')}
            >
              Refer Now →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
