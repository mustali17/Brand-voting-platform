'use client';
import LoadingComponent from '@/components/LoadingComponent';
import FormComponent from '@/components/ui/FormComponent';
import { useSendOtpMutation } from '@/lib/services/user.service';
import { InputFormType } from '@/utils/models/common.model';
import bcrypt from 'bcryptjs';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';

const formList: InputFormType[] = [
  {
    name: 'name',
    key: 'name',
    label: 'Full Name',
    type: 'text',
    validation: 'nullValidation',
  },
  {
    name: 'email',
    key: 'email',
    label: 'Email',
    type: 'email',
    validation: 'emailValidation',
  },
  {
    name: 'password',
    key: 'password',
    label: 'Password',
    type: 'password',
    validation: 'passwordValidation',
  },
  {
    name: 'confirmPassword',
    key: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    validation: 'passwordValidation',
  },

  {
    name: 'agree',
    key: 'agree',
    label: 'Accept our terms and privacy policy',
    type: 'checkbox',
  },
];

interface SignUpFormType {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  agree?: boolean;
}

const RegisterPage = () => {
  //#region External Hooks
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [sendOtp, { isLoading: sendOtpLoading, isError: sendOtpError }] =
    useSendOtpMutation();
  const {
    control,
    handleSubmit: formHandleSubmit,
    setError,
    watch,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<SignUpFormType>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: undefined,
    },
    mode: 'onSubmit',
  });
  //#endregion

  //#region Internal Hooks
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      router.replace('/');
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const agree = watch('agree');
    if (password && confirmPassword && password !== confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
    } else {
      clearErrors('confirmPassword');
    }
    if (!agree && agree !== undefined) {
      setError('agree', {
        type: 'manual',
        message: 'You must accept the terms and conditions',
      });
    } else {
      clearErrors('agree');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('password'), watch('confirmPassword'), watch('agree')]);
  //#endregion

  //#region Internal Function
  const onSubmit = async (dto: SignUpFormType) => {
    console.log('dto', dto);

    if (dto.email) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
      dto.password = hashedPassword;
      delete dto.confirmPassword;
      delete dto.agree;
      const data = await sendOtp({ email: dto.email }).unwrap();
      if (data.success) {
        localStorage.setItem('signUpData', JSON.stringify(dto));
        router.push('/verify-email');
      }
      if (data.error) {
        setErrorMessage(data.error);
      }
    }
  };
  //#endregion

  //#region UI Component
  if (sessionStatus === 'loading') {
    return <LoadingComponent />;
  }
  //#endregion
  return (
    sessionStatus !== 'authenticated' && (
      <div
        className='flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8'
        style={{ height: '90vh' }}
      >
        <div className='flex justify-center flex-col items-center'>
          <h2 className='lg:mt-6 sm:mt-2 text-center text-2xl leading-9 tracking-tight text-gray-900'>
            Sign up on our website
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
          <div className='bg-white px-6 lg:py-12 sm:py-6 shadow sm:rounded-lg sm:px-12'>
            {errorMessage ? (
              <p className='text-red-500 text-sm'>{errorMessage}</p>
            ) : null}

            <FormComponent<SignUpFormType>
              formList={formList}
              control={control}
              errors={errors}
              submitButtonText='Sign up'
              handleSubmit={formHandleSubmit}
              submit={onSubmit}
              isSubmitting={sendOtpLoading}
            />
            <div>
              <div className='relative mt-10'>
                <div
                  className='absolute inset-0 flex items-center'
                  aria-hidden='true'
                >
                  <div className='w-full border-t border-gray-200' />
                </div>
                <div className='relative flex justify-center text-sm font-medium leading-6'>
                  <span className='bg-white px-6 text-gray-900'>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className='mt-6'>
                <button
                  onClick={() => {
                    signIn('google');
                  }}
                  className='flex w-full items-center border border-gray-300 justify-center gap-3 rounded-md bg-white px-3 py-1.5 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                >
                  <FcGoogle />
                  <span className='text-sm font-semibold leading-6'>
                    Google
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default RegisterPage;
