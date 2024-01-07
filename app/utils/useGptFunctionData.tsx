import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useGptFunctionData = () => {
  const [gptFunctionRecords, setGptFunctionRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const endpoint = `${process.env.API_SERVER}/api/functions`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGptFunctionRecords(data);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  const addFunction = async (newFunctionData: any) => {
    try {
        const newFunction = {
            ...newFunctionData,
            id: uuidv4(),
            createdBy: 'First name Last name',
            lastModified: new Date().toISOString(),
            fileSize: '1Kb'
          };
      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFunction),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchData(); // Refetch data after successful addition
    } catch (err) {
      console.log(err);
    }
  };

  const getFunction = async (id:any) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${endpoint}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const functionData = await response.json();
      setIsLoading(false);
      return functionData;
    } catch (err) {
      console.error(err);
      console.log(err);
      setIsLoading(false);
      return null;
    }
  };


  const updateFunction = async (id: any, updatedFunction: any) => {
    try {
        updatedFunction.lastModified = new Date().toISOString();
        const response = await fetch(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFunction),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchData(); // Refetch data after successful update
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFunction = async (id: any) => {
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchData(); // Refetch data after successful deletion
    } catch (err) {
      console.log(err);
    }
  };

  return { gptFunctionRecords, isLoading, error, addFunction, updateFunction, deleteFunction, getFunction };
};

export default useGptFunctionData;
