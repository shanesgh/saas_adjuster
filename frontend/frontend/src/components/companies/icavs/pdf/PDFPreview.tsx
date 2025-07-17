import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { generatePdfPreview } from "../pdf/pdfGenerator";
import { useForm } from "../../../../context/companies/icavs/FormContext";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export const PDFPreview = () => {
  const { formData } = useForm();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(1);

  useEffect(() => {
    const updatePreview = async () => {
      const pdfBlob = await generatePdfPreview(formData);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    };

    updatePreview();
  }, [formData]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!pdfUrl) return <div>Loading preview...</div>;

  return (
    <div className="pdf-preview overflow-auto">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center"
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            className="mb-4"
            scale={1.2}
          />
        ))}
      </Document>
    </div>
  );
};
