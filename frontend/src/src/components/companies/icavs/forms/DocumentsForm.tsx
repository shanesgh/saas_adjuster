import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';
import { FileText, Image, Trash2, Upload, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { NotesTextbox } from '../../../shared/NotesTextbox';

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
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

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

  const removeFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering preview when clicking delete
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    localStorage.setItem('motor-assessment-files', JSON.stringify(updatedFiles));
    
    // Close preview if the deleted file was being previewed
    if (previewIndex !== null && files[previewIndex]?.id === id) {
      setPreviewIndex(null);
    }
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

  const openPreview = (index: number) => {
    setPreviewIndex(index);
  };

  const closePreview = () => {
    setPreviewIndex(null);
  };

  const goToPrevious = () => {
    if (previewIndex !== null && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  const goToNext = () => {
    if (previewIndex !== null && previewIndex < files.length - 1) {
      setPreviewIndex(previewIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (previewIndex === null) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case 'Escape':
          event.preventDefault();
          closePreview();
          break;
      }
    };

    if (previewIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [previewIndex, files.length]);

  const handleSubmit = () => {
    updateFormData({ documents: files });
  };

  const currentFile = previewIndex !== null ? files[previewIndex] : null;

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
                  {files.map((file, index) => (
                    <div 
                      key={file.id} 
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => openPreview(index)}
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => removeFile(file.id, e)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <NotesTextbox section="documents" placeholder="Add notes about uploaded documents..." />

            <FormNavigation onSubmit={handleSubmit} />
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {currentFile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          tabIndex={-1}
        >
          <div className="bg-white rounded-lg max-w-6xl max-h-[95vh] overflow-hidden flex flex-col w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-4">
                <h3 className="font-medium text-lg">{currentFile.name}</h3>
                <span className="text-sm text-gray-500">
                  {previewIndex! + 1} of {files.length}
                </span>
                <span className="text-xs text-gray-400">
                  Use ← → arrow keys to navigate
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* Navigation buttons */}
                <button
                  onClick={goToPrevious}
                  disabled={previewIndex === 0}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous file"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  disabled={previewIndex === files.length - 1}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next file"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={closePreview}
                  className="p-2 rounded-lg hover:bg-gray-200"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
              {currentFile.type.startsWith('image/') ? (
                <img
                  src={currentFile.url}
                  alt={currentFile.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              ) : currentFile.type === 'application/pdf' ? (
                <iframe
                  src={currentFile.url}
                  className="w-full h-full min-h-[600px] rounded-lg shadow-lg"
                  title={currentFile.name}
                />
              ) : (
                <div className="text-center p-8">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Preview not available for this file type</p>
                </div>
              )}
            </div>
            
            {/* Footer with file info */}
            <div className="p-4 border-t bg-gray-50 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>{formatFileSize(currentFile.size)}</span>
                <span>Uploaded: {currentFile.uploadedAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};