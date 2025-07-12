
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-muted/50">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full btn-gradient">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 text-sm">
           <p>
            Don't have an account?
            <Button variant="link" asChild>
                <Link href="/admin-register">Register here</Link>
            </Button>
          </p>
          <Button variant="link" asChild className="text-xs">
            <Link href="/forgot-password">Forgot your password?</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
