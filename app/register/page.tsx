"use client";
import FormComponent from "@/components/ui/FormComponent";
import { useCreateUserMutation } from "@/lib/services/user.service";
import { InputFormType } from "@/utils/models/common.model";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const formList: InputFormType[] = [
  {
    name: "name",
    key: "name",
    label: "Full Name",
    type: "text",
  },
  {
    name: "email",
    key: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "password",
    key: "password",
    label: "Password",
    type: "password",
  },
  {
    name: "confirmPassword",
    key: "confirmPassword",
    label: "Confirm Password",
    type: "password",
  },

  {
    name: "agree",
    key: "agree",
    label: "Accept our terms and privacy policy",
    type: "checkbox",
  },
];

const RegisterPage = () => {
  //#region External Hooks
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [
    postUserData,
    { isLoading: userSubmittingLoading, isError: userSubmitError },
  ] = useCreateUserMutation();
  const {
    control,
    handleSubmit: formHandleSubmit,
    formState: { errors },
  } = useForm();
  //#endregion

  //#region Internal Hooks
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);
  //#endregion

  //#region Internal Function
  const onSubmit = async (dto: any) => {
    console.log("dto", dto);
  };
  //#endregion

  //#region UI Component
  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }
  //#endregion
  return (
    sessionStatus !== "authenticated" && (
      <div className='flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='flex justify-center flex-col items-center'>
          <h2 className='mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900'>
            Sign up on our website
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
          <div className='bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12'>
            {/* <form className='space-y-6' onSubmit={handleSubmit}>
              <div>
                <InputLabel htmlFor='name' label='Full Name' />
                <Input type='text' id='name' name='name' />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Password
                </label>
                <div className='mt-2'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='confirmpassword'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Confirm password
                </label>
                <div className='mt-2'>
                  <input
                    id='confirmpassword'
                    name='confirmpassword'
                    type='password'
                    autoComplete='current-password'
                    required
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-black focus:ring-black'
                  />
                  <label
                    htmlFor='remember-me'
                    className='ml-3 block text-sm leading-6 text-gray-900'
                  >
                    Accept our terms and privacy policy
                  </label>
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  className='flex w-full border border-black justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                >
                  Sign up
                </button>
                <p className='text-red-600 text-center text-[16px] my-4'>
                  {error && error}
                </p>
              </div>
            </form> */}

            <FormComponent
              formList={formList}
              control={control}
              errors={errors}
              submitButtonText='Sign up'
              handleSubmit={formHandleSubmit}
              submit={onSubmit}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default RegisterPage;
