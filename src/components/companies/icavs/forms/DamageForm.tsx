import { useState, useEffect } from 'react';
import { useForm } from '../../../../context/companies/icavs/FormContext';
import { Input } from '../../../ui/input';
import { Select } from '../../../ui/select';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { FormNavigation } from '../navigation/FormNavigation';
import { NotesTextbox } from '../../../shared/NotesTextbox';

const areaOptions = [
  { value: 'Left broadside', label: 'Left broadside' },
  { value: 'Right broadside', label: 'Right broadside' },
  { value: 'Front', label: 'Front' },
  { value: 'Rear', label: 'Rear' },
  { value: 'Front left quarter', label: 'Front left quarter' },
  { value: 'Front right quarter', label: 'Front right quarter' },
  { value: 'Rear left quarter', label: 'Rear left quarter' },
  { value: 'Rear right quarter', label: 'Rear right quarter' },
];

const severityOptions = [
  { value: 'Minor', label: 'Minor' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Major', label: 'Major' },
  { value: 'Severe', label: 'Severe' },
];

export const DamageForm = () => {
  const { formData, updateFormData } = useForm();
  const [damageData, setDamageData] = useState({
    affectedArea: formData.damage?.affectedArea || 'Left broadside',
    deformationSeverity: formData.damage?.deformationSeverity || 'Major',
    affectedStructuralComponents: formData.damage?.affectedStructuralComponents || 'Left "B" pillar and left rear wheel arch',
  });

  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [vehicleImage] = useState(new Image());

  useEffect(() => {
    const canvas = document.getElementById('damageCanvas') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      setCanvasContext(ctx);

      vehicleImage.src = '/src/assets/test.png';
      vehicleImage.onload = () => {
        drawDamage();
      };
    }
  }, []);

  const drawDamage = () => {
    if (!canvasContext || !vehicleImage) return;

    const canvas = canvasContext.canvas;
    canvas.width = vehicleImage.width;
    canvas.height = vehicleImage.height;

    // Clear canvas
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw vehicle image
    canvasContext.drawImage(vehicleImage, 0, 0);

    // Draw damage line based on affected area
    canvasContext.strokeStyle = '#FF0000';
    canvasContext.lineWidth = 4;
    canvasContext.beginPath();

    const centerY = canvas.height / 2;
    const quarterHeight = canvas.height / 4;

    switch (damageData.affectedArea) {
      case 'Left broadside':
        canvasContext.moveTo(canvas.width * 0.2, centerY - quarterHeight);
        canvasContext.lineTo(canvas.width * 0.8, centerY - quarterHeight);
        break;
      case 'Right broadside':
        canvasContext.moveTo(canvas.width * 0.2, centerY + quarterHeight);
        canvasContext.lineTo(canvas.width * 0.8, centerY + quarterHeight);
        break;
      case 'Front':
        canvasContext.moveTo(canvas.width * 0.2, quarterHeight);
        canvasContext.lineTo(canvas.width * 0.4, quarterHeight);
        break;
      case 'Rear':
        canvasContext.moveTo(canvas.width * 0.6, quarterHeight);
        canvasContext.lineTo(canvas.width * 0.8, quarterHeight);
        break;
      // Add more cases for other areas
    }

    canvasContext.stroke();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDamageData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'affectedArea') {
      setTimeout(drawDamage, 0);
    }
  };

  const handleSubmit = () => {
    updateFormData({
      damage: damageData,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">Nature of Damage</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-4 border rounded-md bg-secondary-50 border-secondary-200">
            <h3 className="text-lg font-medium mb-2">Vehicle Damage Diagram</h3>
            <div className="bg-white p-4 rounded border flex items-center justify-center">
              <canvas 
                id="damageCanvas"
                className="w-full max-w-2xl"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>
          </div>
          
          <Select
            label="Affected Area"
            name="affectedArea"
            value={damageData.affectedArea}
            onChange={handleChange}
            options={areaOptions}
          />
          
          <Select
            label="Deformation Severity"
            name="deformationSeverity"
            value={damageData.deformationSeverity}
            onChange={handleChange}
            options={severityOptions}
          />
          
          <Input
            label="Affected Structural Components"
            name="affectedStructuralComponents"
            value={damageData.affectedStructuralComponents}
            onChange={handleChange}
            placeholder="e.g. Left 'B' pillar and left rear wheel arch"
          />
          
          <NotesTextbox section="damage" placeholder="Add notes about damage assessment..." />
          
          <FormNavigation onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  );
};