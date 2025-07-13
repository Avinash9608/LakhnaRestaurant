'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestReviewPage() {
  const [result, setResult] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    // Get Cloudinary configuration from environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
                     process.env.CLOUDINARY_CLOUD_NAME || 
                     'demo';
    
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 
                        process.env.CLOUDINARY_UPLOAD_PRESET || 
                        'lakhna_restaurant';

    console.log('Test upload config:', { cloudName, uploadPreset });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'reviews');
    formData.append('public_id', `test_${Date.now()}`);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const result = await response.json();
    return result.secure_url;
  };

  const testImageUpload = async () => {
    if (!selectedFile) {
      setResult('Please select a file first');
      return;
    }

    try {
      setResult('Uploading image...');
      const imageUrl = await uploadImageToCloudinary(selectedFile);
      setResult(`Image uploaded successfully! URL: ${imageUrl}`);
    } catch (error) {
      setResult(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testReviewSubmission = async () => {
    try {
      const testData = {
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerImage: 'https://via.placeholder.com/150/cccccc/666666?text=User',
        rating: 5,
        review: 'This is a test review to verify the system is working.',
        category: 'food',
        isActive: false,
        isVerified: false,
        orderId: 'TEST-001',
      };

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`Success! Review created with ID: ${data._id}`);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testFetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      
      if (response.ok) {
        setResult(`Success! Found ${data.length} reviews`);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Review System Test</h1>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Test Image Upload</Label>
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <Button onClick={testImageUpload} disabled={!selectedFile}>
              Test Upload
            </Button>
          </div>
        </div>

        <Button onClick={testReviewSubmission}>
          Test Review Submission
        </Button>
        
        <Button onClick={testFetchReviews} variant="outline">
          Test Fetch Reviews
        </Button>
        
        {result && (
          <div className="p-4 bg-muted rounded">
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 