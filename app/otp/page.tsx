"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Card, CardContent } from "@/components/ui/card";

export default function OTP() {
  const [code, setCode] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleResend = () => {
    setIsResending(true);
    // Simulate resend delay
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
      <Card className='w-full max-w-md rounded-xl shadow-sm'>
        <CardContent className='pt-6 pb-8 px-8'>
          <div className='flex flex-col items-center space-y-6'>
            <div className='text-center space-y-2'>
              <h1 className='text-2xl font-bold tracking-tight'>
                Email Verification
              </h1>
              <p className='text-gray-500 text-sm'>
                Enter the 4-digit verification code that was sent to your email.
              </p>
            </div>

            <div className='w-full max-w-xs'>
              <InputOTP maxLength={4} value={code} onChange={setCode}>
                <InputOTPGroup className='gap-3 justify-center'>
                  <InputOTPSlot
                    index={0}
                    className='w-16 h-16 text-xl bg-gray-50 border-gray-200'
                  />
                  <InputOTPSlot
                    index={1}
                    className='w-16 h-16 text-xl bg-gray-50 border-gray-200'
                  />
                  <InputOTPSlot
                    index={2}
                    className='w-16 h-16 text-xl bg-gray-50 border-gray-200'
                  />
                  <InputOTPSlot
                    index={3}
                    className='w-16 h-16 text-xl bg-gray-50 border-gray-200'
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className='w-full space-y-4'>
              <Button className='w-full h-12 text-base font-medium rounded-lg bg-indigo-500 hover:bg-indigo-600'>
                Verify Account
              </Button>

              <div className='text-center text-gray-500 text-sm'>
                Didn't receive code?{" "}
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className='text-indigo-500 hover:text-indigo-600 font-medium focus:outline-none'
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
