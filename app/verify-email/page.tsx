'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  useCreateUserMutation,
  useVerifyOtpMutation,
} from '@/lib/services/user.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MobileVerification() {
  //#region External Hook
  const [verifyOtp, { isLoading: verifyOtpLoading, isError: verifyOtpError }] =
    useVerifyOtpMutation();

  const [addUser, { isLoading: addUserLoading, isError: addUserError }] =
    useCreateUserMutation();

  const router = useRouter();
  //#endregion

  //#region Internal Hook
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  //#endregion
  //#region Internal Function
  const handleResend = () => {
    setIsResending(true);
    // Simulate resend delay
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  const handleVerify = async (code: string) => {
    if (code.length === 6) {
      const signUpData = localStorage.getItem('signUpData');
      if (!signUpData) {
        return;
      }
      const parsedData = JSON.parse(signUpData);
      const { email } = parsedData;
      // Call the verifyOtp mutation with the email and code
      const res = await verifyOtp({
        code,
        email,
      }).unwrap();
      if (res.success) {
        // Handle successful verification
        console.log('Verification successful');
        await addUser(parsedData).unwrap();

        localStorage.removeItem('signUpData');
        // Redirect to the next page or show a success message
        router.push('/login');
      }
      if (res.error) {
        // Handle error
        console.log('Verification failed', res.error);
        setError(res.error);
      }
    }
  };
  //#endregion

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4 w-full'>
      <Card className='w-full max-w-md rounded-xl shadow-sm'>
        <CardContent className='pt-6 pb-8 px-8'>
          <div className='flex flex-col items-center space-y-6'>
            <div className='text-center space-y-2'>
              <h1 className='text-2xl font-bold tracking-tight'>
                Email Verification
              </h1>
              <p className='text-gray-500 text-md'>
                Enter the 6-digit verification code that was sent to your email.
              </p>
            </div>
            {error ? <p className='text-red-400'>{error}</p> : <></>}
            <div className='flex justify-center w-full'>
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup className='flex justify-center gap-2'>
                  <InputOTPSlot
                    index={0}
                    className='w-12 h-12 text-lg bg-gray-50 border-gray-200'
                  />
                  <InputOTPSlot
                    index={1}
                    className='w-12 h-12 text-lg bg-gray-50 border-gray-200'
                  />
                  <InputOTPSlot
                    index={2}
                    className='w-12 h-12 text-lg bg-gray-50 border-gray-200'
                  />
                  <InputOTPSlot
                    index={3}
                    className='w-12 h-12 text-lg bg-gray-50 border-gray-200'
                  />
                  <InputOTPSlot
                    index={4}
                    className='w-12 h-12 text-lg bg-gray-50 border-gray-200'
                  />
                  <InputOTPSlot
                    index={5}
                    className='w-12 h-12 text-lg bg-gray-50 border-gray-200'
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className='w-full space-y-4'>
              <Button
                title={'Verify Code'}
                className='mt-4 w-full h-12 text-base font-medium rounded-lg bg-black'
                onClick={() => {
                  handleVerify(code);
                }}
                isLoading={verifyOtpLoading}
                disabled={verifyOtpLoading}
              />

              <div className='text-center text-gray-500 text-sm'>
                {"Didn't receive code?"}{' '}
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className='text-indigo-500 hover:text-indigo-600 font-medium focus:outline-none'
                >
                  {isResending ? 'Sending...' : 'Resend'}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
