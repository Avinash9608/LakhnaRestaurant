import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Package, Users, BookMarked } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold sm:text-2xl lg:text-3xl">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium sm:text-base">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl lg:text-3xl">₹45,231.89</div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium sm:text-base">Reservations</CardTitle>
            <BookMarked className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl lg:text-3xl">+2350</div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium sm:text-base">Menu Items</CardTitle>
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl lg:text-3xl">+12</div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium sm:text-base">New Customers</CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl lg:text-3xl">+573</div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 sm:p-12">
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            You have no products
          </h3>
          <p className="text-sm text-muted-foreground sm:text-base max-w-md">
            You can start selling as soon as you add a product.
          </p>
          <Button className="mt-4 w-full sm:w-auto">Add Product</Button>
        </div>
      </div>
    </div>
  );
}
