import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { FormEvent, useContext, useRef, useState } from "react";
import MajorContext from "../contexts/MajorContext";
import axios from "axios";
import { useForm } from "react-hook-form";
import { majorForm, majorSchema } from "../schemas/major";
import { zodResolver } from "@hookform/resolvers/zod";
type Props = { isOpen: boolean; onClose: () => void };

function RecipeModalMajor({ isOpen, onClose }: Props) {
  const { selectedMajors } = useContext(MajorContext);
  const nameRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<majorForm>({ resolver: zodResolver(majorSchema) });

  const url = "https://signature.gidua.xyz/api/subjects/";

  const onSubmit = async (data: majorForm) => {
    console.log(data);

    try {
      const response = await axios.post(
        url,
        {
          name: data.name.toUpperCase(),
          major: [selectedMajors.id],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Error al hacer la petición");
      console.error(err);
    }

    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6x1">
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent maxW="40vw">
          <ModalHeader>Agregar Asignatura</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="20vh" overflowY="auto">
            {/*selectedMajors.name*/}

            <FormControl>
              <FormLabel htmlFor="name">Ingresar Nombre</FormLabel>
              <Input
                {...register("name")}
                textTransform="uppercase"
                type="text"
              />
              <FormHelperText>
                {errors?.name?.message ?? <p>{errors?.name?.message}</p>}
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue">
              Crear
            </Button>

            <Button ml={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

export default RecipeModalMajor;
