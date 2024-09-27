import React, { useState } from 'react';
import ModelSelector from './components/ModelSelector';
import ModelViewer from './components/ModelViewer';
import 'tailwindcss/tailwind.css';

const App: React.FC = () => {
  const [models, setModels] = useState<{ name: string; file: File }[]>([]);
  const [selectedModel, setSelectedModel] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'gltf' || fileExtension === 'glb') {
        setModels((prev) => [...prev, { name: file.name, file }]);
      } else if (fileExtension === 'blend') {
        alert('Please convert your .blend file to .gltf or .glb format.');
      }
    }
  };

  const handleModelSelect = (file: File) => {
    setSelectedModel(file);
  };

  return (
    <div className="flex min-h-screen bg-orange-600 text-white">
      <ModelSelector
        models={models}
        onFileChange={handleFileChange}
        onModelSelect={handleModelSelect}
      />
      <ModelViewer selectedModel={selectedModel} />
    </div>
  );
};

export default App;
