'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy, CheckCircle } from 'lucide-react';

export default function ReferralLinkPage() {
  const { toast } = useToast();
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateReferralLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateReferralLink = async () => {
    try {
      const res = await fetch('/api/generate-referral-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (data.success) {
        setReferralLink(data.referralLink);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to generate link',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate referral link',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Referral link copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `Join me on the YouTube Membership Referral System! Use my link: ${referralLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Congratulations! 🎉</h2>
          <p className="text-gray-600">
            Your account is activated. Share your referral link and start building your network.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating your referral link...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Your Referral Link</label>
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button onClick={handleCopy} variant="outline">
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleCopy} variant="outline" className="h-12">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button onClick={handleWhatsAppShare} className="h-12 bg-green-600 hover:bg-green-700">
                <Share2 className="w-4 h-4 mr-2" />
                Share on WhatsApp
              </Button>
            </div>

            <Card className="bg-blue-50 border-blue-200 p-6">
              <h3 className="font-semibold mb-2 text-blue-900">How it works:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Share your referral link with friends and family</li>
                <li>• When someone signs up using your link, they become your successor</li>
                <li>• Build your referral chain and grow your network</li>
                <li>• Track your successors and their activity</li>
              </ul>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}
