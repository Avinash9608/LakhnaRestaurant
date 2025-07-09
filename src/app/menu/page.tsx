import { MenuCard } from '@/components/menu-card';
import type { MenuItem } from '@/lib/types';

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Emerald Risotto',
    description: 'Creamy Arborio rice with asparagus, peas, and a hint of mint.',
    price: 18.0,
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'risotto food',
    ingredients: ['Arborio Rice', 'Asparagus', 'Peas', 'Parmesan', 'Mint'],
    category: 'Appetizers',
  },
  {
    id: '2',
    name: 'Terracotta Bruschetta',
    description:
      'Toasted artisan bread with a medley of sun-dried tomatoes, olives, and capers.',
    price: 14.0,
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'bruschetta food',
    ingredients: [
      'Artisan Bread',
      'Sun-dried Tomatoes',
      'Kalamata Olives',
      'Capers',
      'Basil',
    ],
    category: 'Appetizers',
  },
  {
    id: '3',
    name: 'Gateway Salmon',
    description:
      'Pan-seared salmon with a lemon-dill sauce, served with roasted root vegetables.',
    price: 32.0,
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'salmon dish',
    ingredients: ['Salmon Fillet', 'Lemon', 'Dill', 'Carrots', 'Parsnips'],
    category: 'Main Courses',
  },
  {
    id: '4',
    name: 'Forest Floor Steak',
    description:
      '8oz filet mignon with a wild mushroom reduction, paired with truffle mashed potatoes.',
    price: 45.0,
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'steak dish',
    ingredients: [
      'Filet Mignon',
      'Wild Mushrooms',
      'Truffle Oil',
      'Potatoes',
      'Red Wine',
    ],
    category: 'Main Courses',
  },
  {
    id: '5',
    name: 'Beige Panna Cotta',
    description:
      'A delicate vanilla bean panna cotta with a seasonal fruit coulis.',
    price: 12.0,
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'panna cotta',
    ingredients: ['Heavy Cream', 'Vanilla Bean', 'Sugar', 'Berries'],
    category: 'Desserts',
  },
  {
    id: '6',
    name: 'Molten Lava Cake',
    description:
      'Rich chocolate cake with a gooey center, served with raspberry sorbet.',
    price: 15.0,
    image: 'https://placehold.co/400x400.png',
    dataAiHint: 'chocolate cake',
    ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Flour', 'Raspberries'],
    category: 'Desserts',
  },
];

const categories = ['Appetizers', 'Main Courses', 'Desserts'];

export default function MenuPage() {
  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">
          Our Menu
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A symphony of flavors, crafted with passion.
        </p>
      </div>

      {categories.map(category => (
        <div key={category} className="mb-12">
          <h2 className="mb-8 border-b-2 border-primary pb-2 font-headline text-3xl font-bold">
            {category}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {menuItems
              .filter(item => item.category === category)
              .map(item => (
                <MenuCard key={item.id} item={item} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
