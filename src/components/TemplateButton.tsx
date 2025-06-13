import { Button } from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";

import buttonClickEffect from "../styles/buttonClickEffect";

export type TemplateData = Record<string, string>[];

type TemplateButtonProps = {
  data: TemplateData;
  filename: string;
};

export default function TemplateButton({
  data,
  filename,
}: TemplateButtonProps) {
  const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: filename });

  // Converts your Array<Object> to a CsvOutput string based on the configs
  const csv = generateCsv(csvConfig)(data);

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => download(csvConfig)(csv)}
      sx={{
        ...buttonClickEffect,
      }}
    >
      Descargar Plantilla CSV
    </Button>
  );
}
