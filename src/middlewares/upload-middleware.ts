import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
  fileFilter: (req, file, cb) => {
    console.log('File:', file);
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Arquivo permitido
    } else {
      cb(new Error("Tipo de arquivo inválido. Apenas JPEG e PNG são permitidos."));
    }
  },
});

export default upload;
