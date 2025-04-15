import formidable from 'formidable';
import { google } from 'googleapis';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

// Disable Next.js default body parsing
export const config = {
  api: {
    bodyParser: false,
    //#region
  },
  //#endregion
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new formidable.IncomingForm();

  form.parse(
    req,
    async (
      err: Error | null,
      fields: formidable.Fields,
      files: formidable.Files
    ) => {
      if (err) return res.status(500).json({ error: 'Form parse error' });

      const file = (files.file as formidable.File[])[0];
      const filePath: string = file.filepath;

      try {
        const auth = new google.auth.GoogleAuth({
          keyFile: './service-account.json',
          scopes: ['https://www.googleapis.com/auth/drive.file'],
        });

        const drive = google.drive({ version: 'v3', auth });

        const response = await drive.files.create({
          requestBody: {
            name: file.originalFilename as string,
            mimeType: file.mimetype as string,
          },
          media: {
            mimeType: file.mimetype as string,
            body: fs.createReadStream(filePath),
          },
          fields: 'id',
        });

        res.status(200).json({ fileId: response.data.id });
      } catch (e) {
        console.error('Upload error:', e);
        res.status(500).json({ error: 'Upload failed' });
      }
    }
  );
}
