import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import stream from 'stream';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
        
    // Set up Google Drive API
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64!, 'base64').toString('utf-8')
    );
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    

    const drive = google.drive({ version: 'v3', auth });

    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    // Upload file to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
      },
      media: {
        mimeType: file.type,
        body: bufferStream,
      },
      fields: 'id',
    });

    // Make file public
    await drive.permissions.create({
      fileId: response.data.id ?? '',
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const viewUrl = `https://drive.google.com/uc?id=${response.data.id}`;
    const previewUrl = `https://drive.google.com/file/d/${response.data.id}/view`;

    return NextResponse.json({ fileId: response.data.id, url: viewUrl, previewUrl });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}