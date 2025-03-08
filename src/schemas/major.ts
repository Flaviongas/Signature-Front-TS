import {z} from 'zod';

export const majorSchema = z.object({
    name: z.string({required_error:'El nombre es requerido'}).nonempty("El campo no puede estar vacio")
})

export type majorForm = z.infer<typeof majorSchema>;