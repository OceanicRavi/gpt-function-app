'use client'
import React, { useEffect, useState } from 'react';
import useGptFunctionData from '../utils/useGptFunctionData';
import {
    ArrowLeftIcon,
    PlusCircleIcon,
    XCircleIcon
  } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface GptFunctionParameter {
    name: string;
    type: string;
    description: string;
    enum: string[];
    required: boolean;

}

interface GptFunction {
    name: string;
    description: string;
    lambdaFunction: string;
    enabled: boolean;
    parameters: GptFunctionParameter[];
}

interface CRUDFunctionProps {
  searchParams?: {
    id?: string;
  };
}

export default function CRUDFunction({ searchParams }: CRUDFunctionProps) {
    const router = useRouter();
    const { id } = searchParams || {};
    const { addFunction, getFunction, updateFunction } = useGptFunctionData();
    const [currentFunction, setCurrentFunction] = useState<GptFunction>({
      name: '',
      description: '',
      lambdaFunction: '',
      parameters: [],
      enabled: true
    });

  useEffect(() => {
    if (id) {
      const fetchAndSetFunction = async () => {
        const functionToEdit: GptFunction = await getFunction(id);
        setCurrentFunction(functionToEdit);
      };
      fetchAndSetFunction();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFunction({ ...currentFunction, [e.target.name]: e.target.value });
  };

  const handleParameterChange = (index: number, field: string, value: any) => {
    const updatedParameters = currentFunction.parameters.map((param, i) => {
      if (i === index) {
        return { ...param, [field]: value };
      }
      return param;
    });
    setCurrentFunction({ ...currentFunction, parameters: updatedParameters });
  };

  const addParameter = () => {
    setCurrentFunction({
      ...currentFunction,
      parameters: [...currentFunction.parameters, { name: '', type: '', description: '', enum: [], required: false }]
    });
  };

  const removeParameter = (index: number) => {
    const updatedParameters = currentFunction.parameters.filter((_, i) => i !== index);
    setCurrentFunction({ ...currentFunction, parameters: updatedParameters });
  };

  const handleToggleChange = () => {
    setCurrentFunction({
      ...currentFunction,
      enabled: !currentFunction.enabled
    });
  };

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    lambdaFunction: '',
  });
  const [parameterErrors, setParameterErrors] = useState<string[]>([]);

  const validateForm = () => {
    let formIsValid = true;
    let errors = {
      name: '',
      description: '',
      lambdaFunction: '',
    };
    let newParameterErrors = currentFunction.parameters.map((param, index) => {
        if (!param.name || !param.type || !param.description) {
          formIsValid = false;
          return `Parameter must have a name, type, and description.`;
        }
        return '';
      });

    if (!currentFunction.name) {
      formIsValid = false;
      errors.name = 'Function name is required.';
    }

    if (!currentFunction.description) {
      formIsValid = false;
      errors.description = 'Function description is required.';
    }

    if (!currentFunction.lambdaFunction) {
      formIsValid = false;
      errors.lambdaFunction = 'Lambda function ARN is required.';
    }

    setErrors(errors);
    setParameterErrors(newParameterErrors);
    return formIsValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(currentFunction);
      if (id) {
        await updateFunction(id, currentFunction);
      } else {
        await addFunction(currentFunction);
      }
      router.push('/');
    }
  };

  if (!currentFunction && id) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-black bg-opacity-80 shadow-md rounded-lg mt-6 mb-6">
        <Link
          href="/"
          className="mt-2 flex items-center"
         >
            <ArrowLeftIcon className="h-6 mr-2 mb-4 text-white" />
            <span className="text-xl font-semibold mb-4 text-white">{id ? ' Edit Function' : ' Add New Function'}</span>   
        </Link>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-white" htmlFor="name">Function name:</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="The name of the function"
            value={currentFunction.name}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
  
        {/* Description input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-white" htmlFor="description">Description:</label>
          <input
            type="text"
            name="description"
            id="description"
            placeholder="The description of the function"
            value={currentFunction.description}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        {/* Lambda function name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-white" htmlFor="lambdaFunction">Lambda function name:</label>
          <input
            type="text"
            name="lambdaFunction"
            id="lambdaFunction"
            placeholder="The name or ARN of the AWS lambda function"
            value={currentFunction.lambdaFunction}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 rounded-md ${errors.lambdaFunction ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.lambdaFunction && <p className="text-red-500 text-sm">{errors.lambdaFunction}</p>}
        </div>
  
        {/* Parameters */}
        {currentFunction.parameters.map((param, index) => (
          <div key={index} className="border border-gray-200 p-3 rounded-md">
            <input
              type="text"
              placeholder="The name of the property"
              value={param.name}
              onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
              className="mb-2 w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
              type="text"
              placeholder="The type of value of the property"
              value={param.type}
              onChange={(e) => handleParameterChange(index, 'type', e.target.value)}
              className="mb-2 w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
              type="text"
              placeholder="The description of the property"
              value={param.description}
              onChange={(e) => handleParameterChange(index, 'description', e.target.value)}
              className="mb-2 w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
              type="text"
              placeholder="A list of enum values (comma-separated)"
              value={param.enum.join(',')}
              onChange={(e) => handleParameterChange(index, 'enum', e.target.value.split(','))}
              className="mb-2 w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            {parameterErrors[index] && <p className="text-red-500 text-sm">{parameterErrors[index]}</p>}
            <label className="flex items-center mb-2 text-white">
              <input
                type="checkbox"
                checked={param.required}
                onChange={(e) => handleParameterChange(index, 'required', e.target.checked)}
                className="mr-2"
              />
              Required
            </label>
            <button
              type="button"
              onClick={() => removeParameter(index)}
              className="mt-2 flex items-center text-red-500 hover:text-red-700"
            >
              <XCircleIcon className="h-4 w-4"/>Remove function parameter
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addParameter}
          className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
        >
          <PlusCircleIcon className="h-4 w-4"/>Add function parameter
        </button>
        
        <div className="flex items-center justify-between">
          {/* Toggle switch */}
          <div className="relative flex items-center">
            <span className="mr-2 text-sm font-medium  text-white">{currentFunction.enabled ? 'Enabled' : 'Disabled'}</span>
            <input
              id="enabled-toggle"
              type="checkbox"
              className="sr-only"
              checked={currentFunction.enabled ?? true}
              onChange={handleToggleChange}
            />
            <label
              htmlFor="enabled-toggle"
              className={`block bg-gray-200 border-2 border-transparent rounded-full cursor-pointer w-14 h-8 transition-colors duration-200 ease-in-out ${
                currentFunction.enabled ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              <span
                aria-hidden="true"
                className={`translate-x-0 inline-block h-7 w-7 rounded-full bg-white shadow transform transition duration-200 ease-in-out ${
                  currentFunction.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              ></span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {id ? 'Save Changes' : 'Add Function'}
          </button>
        </div>
      </form>
    </div>
  );
  
}
