
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-muted/50">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Account</CardTitle>
          <CardDescription>
            We've sent a verification code to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input id="otp" type="text" placeholder="123456" required />
            </div>
            <Button type="submit" className="w-full btn-gradient">
              Verify Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 text-sm">
            <p>Didn't receive a code?</p>
             <Button variant="link" asChild>
                <Link href="#">Resend Code</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
