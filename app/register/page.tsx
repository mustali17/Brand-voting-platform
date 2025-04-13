"use client";
import FormComponent from "@/components/ui/FormComponent";
import {
  useCreateUserMutation,
  useSendOtpMutation,
} from "@/lib/services/user.service";
import { InputFormType } from "@/utils/models/common.model";
import { clear } from "console";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import bcrypt from "bcryptjs";

const formList: InputFormType[] = [
  {
    name: "name",
    key: "name",
    label: "Full Name",
    type: "text",
    validation: "nullValidation",
  },
  {
    name: "email",
    key: "email",
    label: "Email",
    type: "email",
    validation: "emailValidation",
  },
  {
    name: "password",
    key: "password",
    label: "Password",
    type: "password",
    validation: "passwordValidation",
  },
  {
    name: "confirmPassword",
    key: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    validation: "passwordValidation",
  },

  {
    name: "agree",
    key: "agree",
    label: "Accept our terms and privacy policy",
    type: "checkbox",
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
  const [
    postUserData,
    { isLoading: userSubmittingLoading, isError: userSubmitError },
  ] = useCreateUserMutation();
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: undefined,
    },
    mode: "onSubmit",
  });
  //#endregion

  //#region Internal Hooks
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");
    const agree = watch("agree");
    if (password && confirmPassword && password !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
    } else {
      clearErrors("confirmPassword");
    }
    if (!agree && agree !== undefined) {
      setError("agree", {
        type: "manual",
        message: "You must accept the terms and conditions",
      });
    } else {
      clearErrors("agree");
    }
  }, [watch("password"), watch("confirmPassword"), watch("agree")]);
  //#endregion

  //#region Internal Function
  const onSubmit = async (dto: SignUpFormType) => {
    console.log("dto", dto);

    if (dto.email) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
      dto.password = hashedPassword;
      delete dto.confirmPassword;
      delete dto.agree;
      const data = await sendOtp({ email: dto.email }).unwrap();
      if (data) {
        localStorage.setItem("signUpData", JSON.stringify(dto));
        router.push("/verify-email");
      }
    }
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
            <FormComponent<SignUpFormType>
              formList={formList}
              control={control}
              errors={errors}
              submitButtonText='Sign up'
              handleSubmit={formHandleSubmit}
              submit={onSubmit}
              isSubmitting={userSubmittingLoading}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default RegisterPage;
