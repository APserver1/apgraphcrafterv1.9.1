import { useState } from 'react';
import { ParsedData } from '../types/DataTypes';
import { parseExcelFile, processData } from '../utils/excelParser';
import { sampleData } from '../data/sampleData';
import { utils, write } from 'xlsx';
import { EmptyCellHandling } from '../types/SettingsTypes';

export const useDataManagement = () => {
  const [data, setData] = useState<ParsedData>(sampleData);
  const [rawData, setRawData] = useState<ParsedData>(sampleData);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const parsedData = await parseExcelFile(file);
        setRawData(parsedData);
        setData(processData(parsedData, 'zero')); // Default to zero
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing file. Please check the file format.');
      }
    }
  };

  const handleEmptyCellHandlingChange = (handling: EmptyCellHandling) => {
    setData(processData(rawData, handling));
  };

  const handleDownload = () => {
    const worksheet = utils.aoa_to_sheet([
      ['Label', 'Image', 'Color', ...data.labels],
      ...data.data.map(row => [
        row.label,
        row.image,
        row.color,
        ...row.values
      ])
    ]);

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Data');

    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chart-data.xlsx';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDataChange = (newData: ParsedData) => {
    setRawData(newData);
    setData(newData);
  };

  return {
    data,
    setData,
    handleFileUpload,
    handleDownload,
    handleDataChange,
    handleEmptyCellHandlingChange,
  };
};