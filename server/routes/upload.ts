import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function uploadFile(req: any, res: any) {
  // Handle file from fetch with FormData
  const contentType = req.get("content-type") || "";
  const filename = req.get("x-filename") || `file-${Date.now()}`;

  // Allow image MIME types and application/octet-stream
  const isValidContentType = contentType.startsWith("image/") ||
                             contentType === "application/octet-stream" ||
                             contentType === "application/pdf";

  if (!isValidContentType && !filename) {
    res.status(400).json({ error: "No file provided" });
    return;
  }

  // Get file extension
  const fileExt = path.extname(filename);

  // Validate file extension
  const allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"];
  if (!allowedExts.includes(fileExt.toLowerCase())) {
    res.status(400).json({ error: "File type not allowed" });
    return;
  }

  // Generate unique filename
  const uniqueFilename = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}${fileExt}`;
  const filepath = path.join(UPLOAD_DIR, uniqueFilename);

  // Write file
  const chunks: Buffer[] = [];
  let fileSize = 0;

  req.on("data", (chunk: Buffer) => {
    fileSize += chunk.length;
    if (fileSize > MAX_FILE_SIZE) {
      res.status(413).json({ error: "File too large" });
      req.pause();
      return;
    }
    chunks.push(chunk);
  });

  req.on("end", () => {
    try {
      const fileBuffer = Buffer.concat(chunks);
      fs.writeFileSync(filepath, fileBuffer);

      const fileUrl = `/uploads/${uniqueFilename}`;
      res.json({
        success: true,
        filename: uniqueFilename,
        url: fileUrl,
        originalName: filename,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to save file" });
    }
  });

  req.on("error", (error) => {
    console.error("Upload stream error:", error);
    res.status(500).json({ error: "Upload failed" });
  });
}
