
import {
  Dialog,
} from "@mui/material";
import FileUploader from "./FileUploader";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onStudentCreated: () => void;
  uploadText: string;
  route: string;
}

export default function UploadModal({
  open,
  onClose,
  onStudentCreated,
  uploadText,
  route
}: UploadModalProps) {



  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <FileUploader onClose={onClose} onStudentCreated={onStudentCreated} uploadText={uploadText} route={route} />
    </Dialog >
  );
}

