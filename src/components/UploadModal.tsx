
import {
  Dialog,
} from "@mui/material";
import FileUploader from "./FileUploader";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSomethingCreated: () => void;
  uploadText: string;
  route: string;
  subjectId?: string;
}

export default function UploadModal({
  open,
  onClose,
  onSomethingCreated,
  uploadText,
  route,
  subjectId,

}: UploadModalProps) {



  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <FileUploader onClose={onClose} onSomethingCreated={onSomethingCreated} uploadText={uploadText} route={route} subjectId={subjectId} />
    </Dialog >
  );
}

