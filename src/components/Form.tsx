import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import MajorContext from "../contexts/MajorContext";
import axios from "axios";
import { Student } from "../types";
import { studentForm, studentSchema } from "../schemas/student";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  subjectId: number | null;
  onStudentAdded: (newStudent: Student) => void;
};

function Form({ subjectId, onStudentAdded }: Props) {
  const token = localStorage.getItem("Token");
  console.log("token_form ", token);
  const { selectedMajors } = useContext(MajorContext);
  const url = import.meta.env.VITE_API_URL + "/api/students/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<studentForm>({ resolver: zodResolver(studentSchema) });

  const onSubmit = async (data: studentForm) => {
    try {
      const response = await axios.post(
        url,
        {
          subjects: [subjectId],
          rut: data.rut,
          dv: data.dv,
          first_name: data.first_name,
          second_name: data.second_name,
          last_name: data.last_name,
          second_last_name: data.second_last_name,
          major: selectedMajors.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,

          },
        }
      );
      onStudentAdded(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-3">
            <label htmlFor="rutComplet" className="form-label">
              Rut
            </label>
            <input
              {...register("rut")}
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="12345678"
            ></input>
            {errors?.rut?.message ?? <p>{errors?.rut?.message}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="dv" className="form-label">
              DV
            </label>
            <input
              {...register("dv")}
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Digito verificador"
              maxLength={1}
            ></input>
            {errors?.dv?.message ?? <p>{errors?.dv?.message}</p>}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="fist_name" className="form-label">
            Primer Nombre
          </label>
          <input
            {...register("first_name")}
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Ingresar Primer Nombre"
          ></input>
          {errors?.first_name?.message ?? <p>{errors?.first_name?.message}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="second_name" className="form-label">
            Segundo Nombre
          </label>
          <input
            {...register("second_name")}
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Ingresar Segundo Nombre"
          ></input>
          {errors?.second_name?.message ?? (
            <p>{errors?.second_name?.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Apellido
          </label>
          <input
            {...register("last_name")}
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Ingresar Apellido"
          ></input>
          {errors?.last_name?.message ?? <p>{errors?.last_name?.message}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="second_last_name" className="form-label">
            Segundo Apellido
          </label>
          <input
            {...register("second_last_name")}
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Ingresar Segundo Apellido"
          ></input>
          {errors?.second_last_name?.message ?? (
            <p>{errors?.second_last_name?.message}</p>
          )}
        </div>

        <div className="mt-4">
          <Button
            backgroundColor={"blue.500"}
            type="submit"
            textColor={"white"}
          >
            Agregar
          </Button>
        </div>
      </div>
    </form>
  );
}

export default Form;
