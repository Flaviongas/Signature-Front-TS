import { Button } from "@chakra-ui/react";
import React, { FormEvent, useContext, useRef, useState } from "react";
import MajorContext from "../contexts/MajorContext";
import axios from "axios";
import { Student } from "../types";

type Props = {
  subjectId: number | null;
  onStudentAdded: (newStudent: Student) => void;
};

function Form({ subjectId, onStudentAdded }: Props) {
  const rutRef = useRef<HTMLInputElement>(null);
  const dvRef = useRef<HTMLInputElement>(null);
  const first_nameRef = useRef<HTMLInputElement>(null);
  const second_nameRef = useRef<HTMLInputElement>(null);
  const last_nameRef = useRef<HTMLInputElement>(null);
  const second_last_nameRef = useRef<HTMLInputElement>(null);
  const { selectedMajors } = useContext(MajorContext);
  const url = " https://signature.gidua.xyz/api/students/";
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const rutValue = rutRef?.current?.value;
    const dvValue = dvRef?.current?.value;
    const first_nameValue = first_nameRef?.current?.value;
    const second_nameValue = second_nameRef?.current?.value;
    const last_nameValue = last_nameRef?.current?.value;
    const second_last_nameValue = second_last_nameRef?.current?.value;

    console.log(
      subjectId,
      rutValue,
      dvValue,
      first_nameValue,
      second_nameValue,
      last_nameValue,
      second_last_nameValue,
      selectedMajors.id
    );

    try {
      const response = await axios.post(
        url,
        {
          subjects: [subjectId],
          rut: rutValue,
          dv: dvValue,
          first_name: first_nameValue,
          second_name: second_nameValue,
          last_name: last_nameValue,
          second_last_name: second_last_nameValue,
          major: selectedMajors.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      onStudentAdded(response.data);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Error al hacer la petición");
      console.error(err);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-3">
            <label htmlFor="rutComplet" className="form-label">
              Rut
            </label>
            <input
              ref={rutRef}
              type="number"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Ingresar Rut"
            ></input>
          </div>
          <div className="mb-2">
            <label htmlFor="dv" className="form-label">
              DV
            </label>
            <input
              ref={dvRef}
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Ingresar Rut"
              maxLength={1}
            ></input>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="fist_name" className="form-label">
            First name
          </label>
          <input
            ref={first_nameRef}
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Ingresar First name"
          ></input>
        </div>

        <div className="mb-3">
          <label htmlFor="second_name" className="form-label">
            Second name
          </label>
          <input
            ref={second_nameRef}
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Ingresar Second name"
          ></input>
        </div>

        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Last name
          </label>
          <input
            ref={last_nameRef}
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Ingresar Last name"
          ></input>
        </div>

        <div className="mb-3">
          <label htmlFor="second_last_name" className="form-label">
            Second Last name
          </label>
          <input
            ref={second_last_nameRef}
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Ingresar Second Last name"
          ></input>
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
