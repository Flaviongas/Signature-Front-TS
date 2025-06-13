// import { z } from "zod";

// export const createUserSchema = z.object({
//   username: z
//     .string()
//     .min(1, { message: "El nombre de usuario es obligatorio." })
//     .regex(
//       /^[A-Za-z0-9]+$/,
//       "El nombre de usuario solo puede contener letras y números."
//     ),

//   password: z.string().min(1, { message: "La contraseña es obligatoria." }),

//   confirmPassword: z
//     .string()
//     .min(1, { message: "Debes confirmar la contraseña." })
//     .superRefine((val, ctx) => {
//       if (val !== ctx.parent.password) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "Las contraseñas no coinciden.",
//           path: ["confirmPassword"], error.
//         });
//       }
//     }),
// });
