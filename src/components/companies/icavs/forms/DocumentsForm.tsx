import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';
import { FileText, Image, Trash2, Eye, Upload } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export const DocumentsForm = () => {
  const { formData, updateFormData } = useForm();
  const [files, setFiles] = useState<UploadedFile[]>(formData.documents || []);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date()
    }));

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    
    // Store in localStorage
    localStorage.setItem('motor-assessment-files', JSON.stringify(updatedFiles));
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: true
  });

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    localStorage.setItem('motor-assessment-files', JSON.stringify(updatedFiles));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type === 'application/pdf') return <FileText className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const handleSubmit = () => {
    updateFormData({ documents: files });
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">Upload Documents</h2>
          <p className="text-sm text-gray-600">Upload estimates, statements, photos, and other relevant documents</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-primary-600">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF and image files (PNG, JPG, JPEG, GIF, BMP, WebP)
                  </p>
                </div>
              )}
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Uploaded Files ({files.length})</h3>
                <div className="grid gap-3">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FormNavigation onSubmit={handleSubmit} />
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">{previewFile.name}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[80vh]">
              {previewFile.type.startsWith('image/') ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full h-auto"
                />
              ) : previewFile.type === 'application/pdf' ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-96"
                  title={previewFile.name}
                />
              ) : (
                <p className="text-gray-500">Preview not available for this file type</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};