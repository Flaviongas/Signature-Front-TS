import { Button } from "@chakra-ui/react";
import React, { FormEvent, useRef } from "react";

type Props = { subjectId: number | null };

function Form({ subjectId }: Props) {
  const rutRef = useRef<HTMLInputElement>(null);
  const fist_nameRef = useRef<HTMLInputElement>(null);
  const second_nameRef = useRef<HTMLInputElement>(null);
  const last_nameRef = useRef<HTMLInputElement>(null);
  const second_last_nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const rutValue = rutRef?.current?.value;
    const fist_nameValue = fist_nameRef?.current?.value;
    const second_nameValue = second_nameRef?.current?.value;
    const last_nameValue = last_nameRef?.current?.value;
    const second_last_nameValue = second_last_nameRef?.current?.value;
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
              ref={rutRef}
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
            ref={fist_nameRef}
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
