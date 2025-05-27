import {
  Alert,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Snackbar,
  Typography,
  styled
} from '@mui/material';
import {
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '25%',
}));


export default function FileUploader({ onClose, onSomethingCreated, uploadText, route }: { onClose: () => void; onSomethingCreated: () => void, uploadText: string, route: string }) {
  const [dragOver, setDragOver] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    checkFileTypeCSV(e);
  }

  function showSnackBarError(message: string) {
    setStatus('error');
    setErrorMessage(message);
    setOpenSnackbar(true);
  }
  function showSnackBarSuccess(message: string) {
    setStatus('success');
    setSuccessMessage(message);
    setOpenSnackbar(true);
  }

  useEffect(() => {
  }, [file]);

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function checkFileTypeCSV(e: ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) {
    if ('dataTransfer' in e && e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      if (e.dataTransfer.files[0].type === "text/csv") {
        setFile(e.dataTransfer.files[0]);
        return;
      }
    }
    else if ('target' in e && e.target && 'files' in e.target && e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].type === "text/csv") {
        setFile(e.target.files[0]);
        return;
      }
    }
    showSnackBarError("Por favor, sube un archivo CSV.");
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);

    checkFileTypeCSV(e);
  }

  async function handleFileUpload() {
    if (!file) return;

    setStatus('uploading');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(BASE_URL + route, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${localStorage.getItem('Token')}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });
      setStatus('success');
      setUploadProgress(100);
      setFile(null);
      showSnackBarSuccess(`Archivo ${file.name} subido exitosamente.`);
      onSomethingCreated();
      onClose()
    } catch (error: any) {
      console.error("Error uploading file:", error);
      showSnackBarError("Error al subir el archivo. Por favor, inténtalo de nuevo.");
      setUploadProgress(0);
    }
  }

  return (
    <StyledContainer>
      <IconButton
        sx={{
          position: 'absolute',
          top: 3,
          right: 16,
          fontSize: 30,
          color: 'text.secondary',
        }}
        onClick={() => {
          onClose();
          setTimeout(() => {

            setFile(null);
            setStatus('idle');
            setUploadProgress(0);
          }, 300);
        }}>
        <FontAwesomeIcon icon={faTimes} />
      </IconButton>
      <Typography variant="h5" fontWeight="bold" mt={2} textAlign="center">
        Agregar {uploadText}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {file ? (
          <Box sx={{ textAlign: 'center', width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginY: 1 }}>
            <Typography variant="subtitle1">{file.name}</Typography>
            {
              file && status !== 'uploading' && (
                <Button
                  variant="contained"
                  color='success'
                  onClick={handleFileUpload}
                  disabled={status === 'success'}
                  sx={{ width: '50%', marginX: 'auto', fontWeight: 'bold', mt: 2 }}
                >
                  Subir {uploadText}
                </Button>
              )
            }
            {
              status === 'uploading' && (
                <ProgressContainer>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        backgroundColor: 'primary.main',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {uploadProgress}%
                  </Typography>
                </ProgressContainer>
              )
            }
            <Button variant="contained" onClick={() => setFile(null)} sx={{ mt: 2, width: '50%' }}>
              Eliminar archivo
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              width: '80%',
              height: '350px',
              marginX: 'auto',
              position: 'relative'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Button
              variant="outlined"
              component="label"
              sx={{
                width: '100%',
                height: '300px',
                color: "secondary.main",
                marginX: 'auto',
                fontWeight: 'bold',
                borderStyle: 'dashed',
                backgroundColor: dragOver ? 'action.hover' : 'background.paper',
                '&:hover': {
                  borderStyle: 'dashed',
                  backgroundColor: 'action.hover'
                }
              }}

            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CloudUploadIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6">Sube tu archivo aqui</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Haz click o arrastra</Typography>
              </Box>
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Box>
        )}
      </Box>

      {
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={errorMessage ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {errorMessage || successMessage}
          </Alert>
        </Snackbar>

      }
    </StyledContainer >
  );
}
