import React from 'react';

interface ModelSelectorProps {
  models: { name: string; file: File }[];
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onModelSelect: (file: File) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  onFileChange,
  onModelSelect,
}) => {
  return (
    <div className="flex flex-col w-1/4 p-4">
      <img className="w-28 m-2" src='sobo-white-logo.png'></img>
      <h2 className="mb-2 text-lg font-semibold">Pick your favorite SOBO drinks</h2>
      <input
        type="file"
        onChange={onFileChange}
        accept=".gltf,.glb,.blend"
        className="px-4 py-2 mb-4 text-gray-900 bg-white rounded-md shadow hover:bg-gray-100 focus:outline-none"
      />
      <ul className="space-y-2">
        {models.map((model) => (
          <li
            key={model.name}
            className="cursor-pointer hover:text-blue-400"
            onClick={() => onModelSelect(model.file)}
          >
            {model.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModelSelector;
