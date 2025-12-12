'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserCircle } from 'lucide-react';

export default function DetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/save-user-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: 'Success!',
          description: 'Details saved successfully',
        });
        router.push('/membership');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save details',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/membership');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Tell Us About Yourself</h2>
          <p className="text-gray-600">This information is optional but helps us serve you better</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address (Optional)</label>
            <Textarea
              placeholder="Enter your address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
