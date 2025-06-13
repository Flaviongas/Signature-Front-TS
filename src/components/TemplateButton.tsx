import { Button } from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";


import buttonClickEffect from "../styles/buttonClickEffect";
import ConfirmModal from "./helpers/ConfirmModal";
import { useState } from "react";

export type TemplateData = Record<string, string>[];

type TemplateButtonProps = {
  data: TemplateData;
  filename: string;
};

export default function TemplateButton({
  data,
  filename,
}: TemplateButtonProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: filename });

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  // Converts your Array<Object> to a CsvOutput string based on the configs
  const csv = generateCsv(csvConfig)(data);

  return (
    <>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={() => { download(csvConfig)(csv) }}
        title="Descargar Plantilla CSV"
        message="¿Estás seguro de que deseas descargar la plantilla CSV? Esta acción descargará un archivo con los datos de la plantilla."
      />

      <Button
        variant="contained"
        color="secondary"
        onClick={() => { setIsConfirmModalOpen(true); }}
        sx={{
          ...buttonClickEffect,
        }}
      >
        Descargar Plantilla CSV
      </Button>
    </>
  );
}
