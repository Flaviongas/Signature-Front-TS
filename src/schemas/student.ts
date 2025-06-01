import { z } from "zod";

export const studentValidationSchema = z.object({
  rut: z
    .string()
    .min(7, { message: "Mínimo 7 dígitos" })
    .max(8, { message: "Máximo 8 dígitos" })
    .nonempty("El campo no puede estar vacío")
    .refine(
      (value) => [...value].every((char) => "0123456789".includes(char)),
      {
        message: "Solo se permiten números",
      }
    ),
  dv: z
    .string()
    .max(1, { message: "Solo se puede ingresar un dígito verificador" })
    .regex(/^[0-9kK]+$/, { message: "El digito verificador debe ser un número o 'K'" })
    .nonempty(),
  first_name: z.string().nonempty("El campo no puede estar vacío"),
  second_name: z.string().nonempty("El campo no puede estar vacío"),
  last_name: z.string().nonempty("El campo no puede estar vacío"),
  second_last_name: z.string().nonempty("El campo no puede estar vacío"),
});

export type studentFormSchema = z.infer<typeof studentValidationSchema>;
