import {
  JOB_LEVEL,
  JOB_TYPE,
  MIN_EDUCATION,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from "@/config/constant";
import { z } from "zod";

export const jobSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Job title must be at least 3 characters long")
      .max(255, "Job title must not exceed 255 characters"),
    description: z
      .string()
      .trim()
      .min(50, "Description must be at least 50 characters long")
      .max(5000, "Description must not exceed 5000 characters"),
    tags: z
      .string()
      .trim()
      .max(500, "Tags must not exceed 500 characters")
      .optional()
      .or(z.literal("")), //This field is allowed to be an empty string.
    // minSalary: z
    //   .string()
    //   .trim()
    //   .regex(/^\d+$/, "Minimum salary must be a valid number")
    //   .optional()
    //   .or(z.literal(""))
    //   .transform((v) => (v === "" ? null : Number(v)))
    //   .nullable(),
    // //⚡ .transform() alone does NOT change what types are considered valid. It only transforms the value. You need .nullable() to tell Zod: "null is an acceptable output type for this schema".

    // maxSalary: z
    //   .string() // Input type: string
    //   .trim() // Still: string
    //   .regex(/^\d+$/, "Maximum salary must be a valid number") // Still: string (but validated)
    //   .optional() // Now: string | undefined
    //   .or(z.literal("")) // Now: string | undefined | ""

    //   .transform((v) => (v === "" ? null : Number(v)))
    //   // ⬆️ TRANSFORMATION HAPPENS HERE
    //   // Output type: number | null
    //   .nullable(), // Confirms: number | null is valid

    minSalary: z
      .union([z.number(), z.string()])
      .optional()
      .transform((v) => {
        if (v === "" || v === undefined || v === null) return null;
        return typeof v === "number" ? v : Number(v);
      })
      .nullable(),

    maxSalary: z
      .union([z.number(), z.string()])
      .optional()
      .transform((v) => {
        if (v === "" || v === undefined || v === null) return null;
        return typeof v === "number" ? v : Number(v);
      })
      .nullable(),

    salaryCurrency: z
      .enum(SALARY_CURRENCY, {
        error: "Please select a valid currency",
      })
      .optional(),
    salaryPeriod: z
      .enum(SALARY_PERIOD, {
        error: "Please select a valid salary period",
      })
      .optional(),
    location: z
      .string()
      .trim()
      .min(2, "Location must be at least 2 characters long")
      .max(255, "Location must not exceed 255 characters")
      .optional()
      .or(z.literal("")),
    jobType: z.enum(JOB_TYPE, {
      error: "Please select a valid job type",
    }),
    workType: z.enum(WORK_TYPE, {
      error: "Please select a valid work type",
    }),
    jobLevel: z.enum(JOB_LEVEL, {
      error: "Please select a valid job level",
    }),
    experience: z
      .string()
      .trim()
      .max(1000, "Experience requirements must not exceed 1000 characters")
      .optional()
      .or(z.literal("")),
    minEducation: z
      .enum(MIN_EDUCATION, {
        error: "Please select a valid education level",
      })
      .optional(),

    // 2026-01-05  ✅  01-05-2026  ❌  2026/01/05  ❌
    // ✅ FIXED: Handle empty string properly before validation
    //   expiresAt: z
    //     .string()
    //     .trim()
    //     .optional()
    //     .or(z.literal(""))
    //     .transform((v) => (!v || v === "" ? null : v))
    //     .pipe(
    //       z
    //         .string()
    //         .regex(
    //           /^\d{4}-\d{2}-\d{2}$/,
    //           "Please enter a valid date (YYYY-MM-DD)"
    //         )
    //         .refine(
    //           (date) => {
    //             const expiryDate = new Date(date);
    //             const today = new Date();
    //             today.setHours(0, 0, 0, 0);
    //             return expiryDate >= today;
    //           },
    //           {
    //             message: "Expiry date must be today or in the future",
    //           }
    //         )
    //         .transform((date) => new Date(date))
    //         .nullable()
    //     )
    //     .nullable(),
    // })
    expiresAt: z
      .union([z.string(), z.date()])
      .optional()
      .transform((v) => {
        if (!v || v === "") return null;
        if (v instanceof Date) return v;
        return new Date(v);
      })
      .refine(
        (date) => {
          if (!date) return true;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        {
          message: "Expiry date must be today or in the future",
        },
      )
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.minSalary && data.maxSalary) {
        return data.minSalary <= data.maxSalary;
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maxSalary"], // path is an array because Zod supports deep/nested paths
    },
  )
  .refine(
    (data) => {
      const hasSalaryInfo =
        data.minSalary ||
        data.maxSalary ||
        data.salaryCurrency ||
        data.salaryPeriod;

      if (hasSalaryInfo) {
        return data.salaryCurrency && data.salaryPeriod;
      }
      return true;
    },
    {
      message: "Currency and period are required when salary is specified",
      path: ["salaryCurrency"],
    },
  );

export type JobFormData = z.infer<typeof jobSchema>;

//   .refine(
//   (data) => BOOLEAN_EXPRESSION,
//   { message, path }
// )
// Rule
// If the function returns true → validation passes
// If the function returns false → validation fails and the error message is shown

// const expiryDate = new Date("2026-01-04"); // 2026-01-04 00:00:00
// const today = new Date();                 //  2026-01-04 14:35:20

// console.log(expiryDate >= today); // ❌ false
