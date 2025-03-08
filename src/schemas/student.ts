import {z} from 'zod';


export const studentSchema = z.object({
    rut:z.string().min(7,{message:"El rut debe tener minimo 7 digitos"}).max(8,{message:"Ingresar rut sin guion"}).nonempty("El campo no puede estar vacio").refine(value => [...value].every(char => "0123456789".includes(char)), {
        message: "Solo se permiten números"
    }),
    dv:z.string().max(1,{message: "Debe ser maximo 1 digito"}).regex(/^[0-9kK]+$/, { message: "Solo se permite un número o la letra 'k'" }).nonempty(),
    first_name: z.string().nonempty("El campo no puede estar vacio"),
    second_name:z.string().nonempty("El campo no puede estar vacio"),
    last_name:z.string().nonempty("El campo no puede estar vacio"),
    second_last_name:z.string().nonempty("El campo no puede estar vacio"),
})

export type studentForm = z.infer<typeof studentSchema>;