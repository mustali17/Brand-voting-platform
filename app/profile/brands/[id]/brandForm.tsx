"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/lib/features/user/userSlice";
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "@/lib/services/brand.service";
import { BrandDto, BrandFormDto } from "@/utils/models/brand.model";
import { FileUploadDto } from "@/utils/models/common.model";

interface BrandFormProps {
  brandData?: BrandDto;
  callBack: () => void;
}

const BrandForm: React.FC<BrandFormProps> = ({ brandData, callBack }) => {
  // Redux hooks
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  // API mutation hooks
  const [addBrand, { isError: addBrandError }] = useCreateBrandMutation();
  const [updateBrand, { isError: updateBrandError }] = useUpdateBrandMutation();

  // Form hook
  const {
    control,
    handleSubmit: formHandleSubmit,
    setError,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<BrandFormDto>({
    defaultValues: {
      name: "",
      logoUrl: "",
      website: "",
      description: "",
    },
    mode: "onChange",
  });

  // Watch form values for real-time validation
  const formData = watch();

  // Component state
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Define steps configuration
  const steps = [
    {
      title: "Brand Name",
      description: "Enter your brand name",
      fields: ["name"],
      isValid: () => formData.name && formData.name.trim().length > 0,
    },
    {
      title: "Description",
      description: "Describe your brand",
      fields: ["description"],
      isValid: () =>
        formData.description && formData.description.trim().length > 0,
    },
    {
      title: "Brand Logo",
      description: "Upload your brand logo (optional)",
      fields: ["logoUrl"],
      isValid: () => true, // Logo is optional
    },
    {
      title: "Website",
      description: "Enter your website URL (optional)",
      fields: ["website"],
      isValid: () =>
        !formData.website ||
        formData.website.trim().length === 0 ||
        isValidUrl(formData.website),
    },
  ];

  // URL validation helper
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Initialize form with existing brand data
  useEffect(() => {
    if (brandData && Object.keys(brandData).length) {
      reset({
        name: brandData.name,
        logoUrl: brandData.logoUrl,
        website: brandData.website,
        description: brandData.description,
      });
    } else {
      reset({
        name: "",
        logoUrl: "",
        website: "",
        description: "",
      });
    }
  }, [brandData, reset]);

  // Handle file upload to Google Drive
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploadToDrive", {
        method: "POST",
        body: formData,
      });

      const data: FileUploadDto = await res.json();

      if (data.fileId && data.url) {
        setValue("logoUrl", data.url);
        toast.success("Logo uploaded successfully!");
      } else {
        toast.error("Logo upload failed!");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Logo upload failed!");
    } finally {
      setIsImageUploading(false);
    }
  };

  // Validate current step
  const validateCurrentStep = () => {
    const step = steps[currentStep];
    let hasErrors = false;

    step.fields.forEach((field) => {
      if (
        field === "name" &&
        (!formData.name || formData.name.trim().length === 0)
      ) {
        setError("name", {
          type: "required",
          message: "Brand name is required",
        });
        hasErrors = true;
      }
      if (
        field === "description" &&
        (!formData.description || formData.description.trim().length === 0)
      ) {
        setError("description", {
          type: "required",
          message: "Description is required",
        });
        hasErrors = true;
      }
      if (
        field === "website" &&
        formData.website &&
        !isValidUrl(formData.website)
      ) {
        setError("website", {
          type: "pattern",
          message: "Please enter a valid URL",
        });
        hasErrors = true;
      }
    });

    return !hasErrors;
  };

  // Handle next step
  const handleNext = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      const newCompletedSteps = [...completedSteps];
      newCompletedSteps[currentStep] = true;
      setCompletedSteps(newCompletedSteps);
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle step click
  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps[stepIndex]) {
      setCurrentStep(stepIndex);
    }
  };

  // Handle form submission
  const onSubmit = async (data: BrandFormDto) => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);

    try {
      // Remove empty website field
      const submitData = { ...data };
      if (!submitData.website) {
        delete submitData.website;
      }

      if (brandData) {
        // Update existing brand
        const updatedData = {
          ...brandData,
          name: submitData.name,
          logoUrl: submitData.logoUrl,
          website: submitData.website,
          description: submitData.description,
        };

        const res = await updateBrand({
          id: brandData._id,
          data: updatedData,
        }).unwrap();

        if (res) {
          dispatch(
            updateUser({
              ownedBrands: user?.ownedBrands.map((brand: BrandDto) =>
                brand._id === res.brand._id ? res.brand : brand
              ),
            })
          );
          toast.success("Brand updated successfully!");
        }
      } else {
        // Create new brand
        const res = await addBrand(submitData).unwrap();

        if (res) {
          dispatch(
            updateUser({
              ownedBrands: [...(user?.ownedBrands || []), res.brand],
            })
          );
          toast.success("Brand created successfully!");
        }
      }

      setTimeout(() => {
        callBack();
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      console.error("Brand submission error:", error);
      toast.error(
        brandData ? "Brand update failed!" : "Brand creation failed!"
      );
      setIsSubmitting(false);
    }
  };

  const isCurrentStepValid = steps[currentStep].isValid();
  const isLastStep = currentStep === steps.length - 1;
  const completedCount =
    completedSteps.filter(Boolean).length + (isCurrentStepValid ? 1 : 0);
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  // Render current step form
  const renderCurrentStepForm = () => {
    switch (currentStep) {
      case 0: // Brand Name
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="brandName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Brand Name *
              </label>
              <input
                id="brandName"
                type="text"
                value={formData.name || ""}
                onChange={(e) => setValue("name", e.target.value)}
                placeholder="Enter your brand name"
                className={`
                  w-full px-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all
                  ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
        );

      case 1: // Description
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Brand Description *
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description || ""}
                onChange={(e) => setValue("description", e.target.value)}
                placeholder="Describe your brand in a few sentences..."
                className={`
                  w-full px-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none
                  ${errors.description ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2: // Logo Upload
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Logo
              </label>
              <div className="flex flex-col items-center justify-center w-full">
                {formData.logoUrl ? (
                  <div className="w-full max-w-sm p-6 border-2 border-dashed border-green-300 bg-green-50 rounded-lg text-center">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-green-600 font-medium">
                      Logo uploaded successfully!
                    </p>
                    <button
                      onClick={() => setValue("logoUrl", "")}
                      className="mt-2 text-sm text-green-700 hover:text-green-800 underline"
                    >
                      Remove logo
                    </button>
                  </div>
                ) : (
                  <label className="w-full max-w-sm cursor-pointer">
                    <div className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-lg hover:bg-purple-50 transition-all">
                      {isImageUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-3"></div>
                          <p className="text-sm text-purple-600 font-medium">
                            Uploading...
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mb-3" />
                          <p className="text-sm font-medium text-gray-700">
                            Click to upload logo
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isImageUploading}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        );

      case 3: // Website
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Website URL (Optional)
              </label>
              <input
                id="website"
                type="url"
                value={formData.website || ""}
                onChange={(e) => setValue("website", e.target.value)}
                placeholder="https://www.example.com"
                className={`
                  w-full px-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all
                  ${errors.website ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}
                `}
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.website.message}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 md:mb-8 p-4 md:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <button
            onClick={callBack}
            className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-gray-100 transition-colors mr-3 md:mr-4 flex-shrink-0"
          >
            <ArrowLeft size={18} className="text-gray-600 md:w-5 md:h-5" />
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">
            {brandData ? "Edit Brand" : "Create New Brand"}
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 md:mb-8 p-4 md:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={index > currentStep && !completedSteps[index]}
                  style={{
                    backgroundColor:
                      index === currentStep
                        ? "rgb(122, 51, 209)"
                        : completedSteps[index]
                          ? "rgb(34, 197, 94)"
                          : index < currentStep
                            ? "rgb(156, 163, 175)"
                            : "",
                  }}
                  className={`
                    relative w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-all duration-200 border-2 flex-shrink-0
                    ${
                      index === currentStep
                        ? "text-white border-purple-600 shadow-lg scale-110"
                        : completedSteps[index]
                          ? "text-white border-green-500 cursor-pointer hover:bg-green-600 hover:scale-105"
                          : index < currentStep
                            ? "text-white border-gray-400 cursor-pointer hover:bg-gray-500 hover:scale-105"
                            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    }
                  `}
                >
                  {completedSteps[index] ? (
                    <Check size={14} className="md:w-[18px] md:h-[18px]" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 md:h-1 mx-2 md:mx-4 rounded-full transition-all duration-300
                      ${
                        completedSteps[index] || index < currentStep
                          ? "bg-gradient-to-r from-green-500 to-green-400"
                          : "bg-gray-200"
                      }
                    `}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Title and Description */}
          <div className="text-center">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 text-sm md:text-lg">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          <div className="max-w-md mx-auto">{renderCurrentStepForm()}</div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-3 mb-6">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`
              flex items-center justify-center px-3 py-2 md:px-4 md:py-3 rounded-lg font-medium transition-all duration-200 text-sm md:text-base min-w-[80px] md:min-w-[100px]
              ${
                currentStep === 0
                  ? "invisible"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md border border-gray-200"
              }
            `}
          >
            <ChevronLeft size={16} className="mr-1" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          {!isLastStep ? (
            <button
              onClick={handleNext}
              disabled={!isCurrentStepValid}
              style={{
                backgroundColor: isCurrentStepValid ? "rgb(122, 51, 209)" : "",
              }}
              className={`
                flex items-center justify-center px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-200 text-sm md:text-base min-w-[80px] md:min-w-[100px]
                ${
                  isCurrentStepValid
                    ? "text-white hover:opacity-90 hover:shadow-lg transform hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={formHandleSubmit(onSubmit)}
              disabled={isSubmitting || isImageUploading || !isCurrentStepValid}
              style={{
                backgroundColor:
                  !isSubmitting && !isImageUploading && isCurrentStepValid
                    ? "rgb(34, 197, 94)"
                    : "",
              }}
              className={`
                px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-200 text-sm md:text-base min-w-[120px] md:min-w-[140px] flex items-center justify-center gap-2
                ${
                  isSubmitting || isImageUploading || !isCurrentStepValid
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "text-white hover:bg-green-700 hover:shadow-lg transform hover:scale-105"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span className="hidden sm:inline">
                    {brandData ? "Updating..." : "Creating..."}
                  </span>
                  <span className="sm:hidden">
                    {brandData ? "Update..." : "Create..."}
                  </span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span className="hidden sm:inline">
                    {brandData ? "Update Brand" : "Create Brand"}
                  </span>
                  <span className="sm:hidden">
                    {brandData ? "Update" : "Create"}
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between text-xs md:text-sm font-medium text-gray-700 mb-3">
            <span>Overall Progress</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
            <div
              className="h-2 md:h-3 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent}%`,
                background:
                  "linear-gradient(to right, rgb(122, 51, 209), rgb(34, 197, 94))",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandForm;
