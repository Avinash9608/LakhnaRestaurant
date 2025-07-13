"use client";

import { useState, useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = [
  { value: "food", label: "Food" },
  { value: "service", label: "Service" },
  { value: "ambiance", label: "Ambiance" },
  { value: "overall", label: "Overall" },
];

function ReviewStars({ rating, setRating }: { rating: number; setRating?: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type={setRating ? "button" : "button"}
          key={n}
          onClick={setRating ? () => setRating(n) : undefined}
          className={
            n <= rating
              ? "text-yellow-400"
              : "text-gray-300"
          }
          aria-label={`Rate ${n}`}
        >
          <Star className="w-5 h-5" fill={n <= rating ? "#facc15" : "none"} />
        </button>
      ))}
    </div>
  );
}

export function CustomerReviewSection() {
  // Form state
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerImage: "",
    rating: 5,
    review: "",
    category: "food",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 16 },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 2, spacing: 16 } },
      "(min-width: 1024px)": { slides: { perView: 3, spacing: 16 } },
    },
    drag: true,
  }, [AutoplayPlugin]);

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  async function fetchApprovedReviews() {
    const res = await fetch("/api/reviews?isActive=true&isVerified=true");
    if (res.ok) {
      setReviews(await res.json());
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "reviews"); // Use your Cloudinary unsigned preset for reviews
    const res = await fetch("https://api.cloudinary.com/v1_1/demo/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      let imageUrl = form.customerImage;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }
      const payload = {
        ...form,
        customerImage: imageUrl,
        rating: Number(form.rating),
        category: form.category,
      };
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccessMsg("Thank you for your review! It will appear after admin approval.");
        setForm({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          customerImage: "",
          rating: 5,
          review: "",
          category: "food",
        });
        setImageFile(null);
        setImagePreview("");
        fetchApprovedReviews();
      } else {
        setErrorMsg("Failed to submit review. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <h2 className="font-headline text-3xl font-bold md:text-4xl text-center mb-8">Customer Reviews</h2>
        {/* Review Form */}
        <form onSubmit={handleSubmit} className="bg-background rounded-xl shadow-lg p-6 mb-12 grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Your Name"
              value={form.customerName}
              onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.customerEmail}
              onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))}
              required
            />
            <Input
              placeholder="Phone"
              type="tel"
              value={form.customerPhone}
              onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))}
              required
            />
            <select
              className="border rounded px-3 py-2 bg-background"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Your Photo</label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-full mt-2" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium">Rating</label>
              <ReviewStars rating={form.rating} setRating={n => setForm(f => ({ ...f, rating: n }))} />
            </div>
          </div>
          <Textarea
            placeholder="Your review..."
            value={form.review}
            onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
            rows={3}
            required
          />
          <Button type="submit" className="btn-gradient w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
          {successMsg && <div className="text-green-600 text-center">{successMsg}</div>}
          {errorMsg && <div className="text-red-600 text-center">{errorMsg}</div>}
        </form>

        {/* Approved Reviews Carousel */}
        {reviews.length > 0 && (
          <div ref={sliderRef} className="keen-slider mt-8">
            {reviews.map((review) => (
              <div key={review._id} className="keen-slider__slide flex justify-center">
                <Card className="max-w-md w-full bg-background/80 shadow-lg rounded-xl p-6 flex flex-col items-center text-center">
                  <img
                    src={review.customerImage}
                    alt={review.customerName}
                    className="h-16 w-16 object-cover rounded-full mb-3 border"
                  />
                  <h3 className="font-semibold text-lg mb-1">{review.customerName}</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <ReviewStars rating={review.rating} />
                    <Badge className="text-xs">{review.category}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">{review.review}</p>
                  <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AutoplayPlugin(slider: any) {
  let timeout: NodeJS.Timeout;
  let mouseOver = false;
  function clearNextTimeout() {
    clearTimeout(timeout);
  }
  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 3500);
  }
  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });
  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
} 