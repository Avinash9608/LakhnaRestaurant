"use client";

import { MenuCard } from '@/components/menu-card';
import type { MenuItem } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch('/api/menu-items');
        if (res.ok) {
          const data = await res.json();
          setMenuItems(data);
        }
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  // Get unique categories from menu items
  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  if (loading) {
    return (
      <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-8">Our Menu</h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">A symphony of flavors, crafted with passion.</p>
        <div className="text-lg sm:text-xl">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold">
          Our Menu
        </h1>
        <p className="mt-2 text-base sm:text-lg text-muted-foreground">
          A symphony of flavors, crafted with passion.
        </p>
      </div>

      {categories.length === 0 && (
        <div className="text-center text-muted-foreground">No menu items found.</div>
      )}

      {categories.map(category => (
        <div key={category} className="mb-8 sm:mb-12">
          <h2 className="mb-6 sm:mb-8 border-b-2 border-primary pb-2 font-headline text-2xl sm:text-3xl font-bold">
            {category}
          </h2>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems
              .filter(item => item.category === category)
              .map(item => (
                <MenuCard key={item._id || item.id || item.name} item={item} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
