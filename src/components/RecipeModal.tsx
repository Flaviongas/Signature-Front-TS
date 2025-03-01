import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

type Props = { isOpen: boolean; onClose: () => void };

function RecipeModal({ isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6x1">
      <ModalOverlay />
      <ModalContent maxW="90vw">
        <ModalHeader>Asistencia</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="70vh" overflowY="auto">
          <input type="Date" className="form-control"></input>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">RUT</th>
                <th scope="col">DV</th>
                <th scope="col">FirstName</th>
                <th scope="col">SecondName</th>
                <th scope="col">LastName</th>
                <th scope="col">SecondLastName</th>
                <th scope="col">Major</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RecipeModal;
