import { useState } from "react";
import { useForm } from "../../../../context/companies/icavs/FormContext";
import { Input } from "../../../ui/input";
import { Checkbox } from "../../../ui/checkbox";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { FormNavigation } from "../navigation/FormNavigation";
import { z } from "zod";
import { NotesTextbox } from "../../../shared/NotesTextbox";

// Trinidad and Tobago registration validation schema
const registrationSchema = z
  .string()
  .min(1, "Registration number is required")
  .regex(
    /^[PDHRVXT]([A-HJ-NP-UW-Z]{0,2})?[\s-]?[1-9]\d{0,3}$|^[1-5]\s?(TTR|TTCG|VDF|TTAG|TTDF)\s?\d{1,3}$|^(PM|PCM|PDM)\s?1$/i,
    "Invalid Trinidad and Tobago registration format"
  );

export const VehicleForm = () => {
  const { formData, updateFormData } = useForm();
  const [vehicleData, setVehicleData] = useState({
    makeAndModel: formData.vehicle?.makeAndModel || "",
    fuelType: formData.vehicle?.fuelType || "",
    transmissionType: formData.vehicle?.transmissionType || "",
    registration: formData.vehicle?.registration || "",
    yearOfManufacture: formData.vehicle?.yearOfManufacture || "",
    color: formData.vehicle?.color || "",
    odometer: formData.vehicle?.odometer || 0,
    vinChassis: formData.vehicle?.identification?.vinChassis || "",
    engine: formData.vehicle?.identification?.engine || "",
    isForeignUsed: formData.vehicle?.isForeignUsed || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fuelTypeOptions = [
    { value: "", label: "Select fuel type..." },
    { value: "gasoline", label: "Gasoline" },
    { value: "diesel", label: "Diesel" },
    { value: "hybrid", label: "Hybrid Electric" },
    { value: "electric", label: "Full Electric" },
    { value: "cng", label: "CNG (Compressed Natural Gas)" },
    { value: "manual", label: "Manual" },
  ];

  const transmissionOptions = [
    { value: "", label: "Select transmission type..." },
    { value: "MT", label: "Manual Transmission (MT)" },
    { value: "AT", label: "Automatic Transmission (AT)" },
    { value: "AMT", label: "Automated Manual Transmission (AMT)" },
    { value: "CVT", label: "Continuously Variable Transmission (CVT)" },
    { value: "DCT", label: "Dual-Clutch Transmission (DCT)" },
    { value: "Tiptronic", label: "Tiptronic" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    let parsedValue: string | number | boolean = value;

    if (e.target instanceof HTMLInputElement && type === "checkbox") {
      parsedValue = e.target.checked;
    } else if (name === "odometer") {
      parsedValue = value === "" ? 0 : parseInt(value) || 0;
    }

    setVehicleData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required field validations
    if (!vehicleData.makeAndModel.trim()) {
      newErrors.makeAndModel = "Make & Model is required";
    }
    if (!vehicleData.fuelType) {
      newErrors.fuelType = "Fuel type is required";
    }
    if (!vehicleData.transmissionType) {
      newErrors.transmissionType = "Transmission type is required";
    }
    if (!vehicleData.registration.trim()) {
      newErrors.registration = "Registration number is required";
    } else {
      // Validate registration format
      try {
        registrationSchema.parse(vehicleData.registration);
      } catch (error) {
        if (error instanceof z.ZodError) {
          newErrors.registration = error.errors[0].message;
        }
      }
    }
    if (!vehicleData.yearOfManufacture.trim()) {
      newErrors.yearOfManufacture = "Year of manufacture is required";
    }
    if (!vehicleData.color.trim()) {
      newErrors.color = "Color is required";
    }
    if (!vehicleData.vinChassis.trim()) {
      newErrors.vinChassis = "VIN/Chassis number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    updateFormData({
      vehicle: {
        makeAndModel: vehicleData.makeAndModel,
        fuelType: vehicleData.fuelType,
        transmissionType: vehicleData.transmissionType,
        registration: vehicleData.registration,
        yearOfManufacture: vehicleData.yearOfManufacture,
        color: vehicleData.color,
        odometer: vehicleData.odometer,
        identification: {
          vinChassis: vehicleData.vinChassis,
          engine: vehicleData.engine,
        },
        isForeignUsed: vehicleData.isForeignUsed,
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Vehicle Information</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            label="Make & Model *"
            name="makeAndModel"
            value={vehicleData.makeAndModel}
            onChange={handleChange}
            placeholder="e.g. Toyota Aqua 3 Hatchback"
            error={errors.makeAndModel}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fuelType"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Fuel Type *
              </label>
              <select
                name="fuelType"
                value={vehicleData.fuelType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.fuelType ? "border-red-300" : "border-gray-300"
                }`}
              >
                {fuelTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.fuelType && (
                <p className="mt-1 text-sm text-red-600">{errors.fuelType}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="transmissionType"
                className="block text-sm font-medium text-secondary-700 mb-2"
              >
                Transmission Type *
              </label>
              <select
                name="transmissionType"
                value={vehicleData.transmissionType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.transmissionType ? "border-red-300" : "border-gray-300"
                }`}
              >
                {transmissionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.transmissionType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.transmissionType}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Registration Number *"
              name="registration"
              value={vehicleData.registration}
              onChange={handleChange}
              placeholder="e.g. PDX-7167 or PEH 1234"
              error={errors.registration}
            />

            <Input
              label="Year of Manufacture *"
              name="yearOfManufacture"
              value={vehicleData.yearOfManufacture}
              onChange={handleChange}
              placeholder="e.g. 2016"
              error={errors.yearOfManufacture}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Color *"
              name="color"
              value={vehicleData.color}
              onChange={handleChange}
              placeholder="e.g. Blue"
              error={errors.color}
            />

            <Input
              label="Odometer Reading (km)"
              type="number"
              name="odometer"
              value={vehicleData.odometer}
              onChange={handleChange}
              placeholder="e.g. 67614"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="VIN/Chassis Number *"
              name="vinChassis"
              value={vehicleData.vinChassis}
              onChange={handleChange}
              placeholder="e.g. NHP10-6500472"
              error={errors.vinChassis}
            />

            <Input
              label="Engine Number"
              name="engine"
              value={vehicleData.engine}
              onChange={handleChange}
              placeholder="e.g. 1NZ7898389"
            />
          </div>

          <Checkbox
            id="isForeignUsed"
            name="isForeignUsed"
            label="Foreign Used"
            checked={vehicleData.isForeignUsed}
            onChange={handleChange}
          />

          <NotesTextbox
            section="vehicle"
            placeholder="Add notes about vehicle information..."
          />

          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};
