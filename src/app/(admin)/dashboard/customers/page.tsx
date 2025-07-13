import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Calendar, Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function CustomersPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Customers</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/avatars/john-doe.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>John Doe</CardTitle>
                  <CardDescription>john.doe@example.com</CardDescription>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Member since Dec 2023</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline">View Profile</Button>
              <Button size="sm" variant="outline">Edit</Button>
              <Button size="sm" variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/avatars/jane-smith.jpg" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Jane Smith</CardTitle>
                  <CardDescription>jane.smith@example.com</CardDescription>
                </div>
              </div>
              <Badge variant="secondary">Inactive</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>+91 87654 32109</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Member since Nov 2023</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline">View Profile</Button>
              <Button size="sm" variant="outline">Edit</Button>
              <Button size="sm" variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/avatars/mike-johnson.jpg" />
                  <AvatarFallback>MJ</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Mike Johnson</CardTitle>
                  <CardDescription>mike.johnson@example.com</CardDescription>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>+91 76543 21098</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Member since Oct 2023</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline">View Profile</Button>
              <Button size="sm" variant="outline">Edit</Button>
              <Button size="sm" variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-8">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            No customers found
          </h3>
          <p className="text-sm text-muted-foreground">
            Add your first customer to get started.
          </p>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>
    </>
  );
} 