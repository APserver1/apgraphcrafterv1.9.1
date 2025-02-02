import { read, utils } from 'xlsx';
import { ParsedData, BarData } from '../types/DataTypes';
import { EmptyCellHandling } from '../types/SettingsTypes';

function formatExcelDate(serial: number): string {
  // Excel usa un sistema de fecha serial donde 1 es 1/1/1900
  // 60 días se restan para corregir un error histórico en Excel
  // y para manejar fechas antes de 1/3/1900
  const date = new Date((serial - (serial > 60 ? 1 : 0) - 25569) * 86400 * 1000);
  
  // Formatear la fecha como "mmm-yyyy"
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${months[date.getMonth()]}-${date.getFullYear()}`;
}

function isExcelDateFormat(value: any): boolean {
  // Verificar si el valor es un número y está en el rango válido de fechas de Excel
  return typeof value === 'number' && value > 0 && value < 2958466; // 31/12/9999
}

function cleanNumberValue(val: any): number {
  if (typeof val === 'number') {
    return val;
  }
  if (typeof val === 'string') {
    // Remove spaces, commas and convert to number
    const cleaned = val.replace(/\s+/g, '').replace(/,/g, '');
    const num = Number(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

function isRowEmpty(row: any[]): boolean {
  return row.every(cell => 
    cell === null || 
    cell === undefined || 
    cell === '' || 
    (typeof cell === 'string' && cell.trim() === '')
  );
}

function isColumnEmpty(data: any[][], columnIndex: number): boolean {
  return data.every(row => {
    const cell = row[columnIndex];
    return cell === null || 
           cell === undefined || 
           cell === '' || 
           (typeof cell === 'string' && cell.trim() === '');
  });
}

function removeEmptyColumns(data: any[][]): any[][] {
  if (data.length === 0) return data;
  
  const columnsToKeep: number[] = [];
  
  // Always keep the first 3 columns (label, image, color)
  for (let i = 0; i < 3; i++) {
    columnsToKeep.push(i);
  }
  
  // Check remaining columns
  for (let col = 3; col < data[0].length; col++) {
    if (!isColumnEmpty(data, col)) {
      columnsToKeep.push(col);
    }
  }
  
  return data.map(row => columnsToKeep.map(col => row[col]));
}

function interpolateEmptyValues(values: number[]): number[] {
  const result = [...values];
  
  // Find all valid indices (non-zero values)
  const validIndices = values.reduce((acc, val, idx) => {
    if (val !== 0 && !isNaN(val)) {
      acc.push(idx);
    }
    return acc;
  }, [] as number[]);

  // If no valid values found, return zeros
  if (validIndices.length === 0) {
    return result;
  }

  // If only one valid value, fill all with that value
  if (validIndices.length === 1) {
    const value = values[validIndices[0]];
    return result.map(() => value);
  }

  // Interpolate between valid values
  for (let i = 0; i < validIndices.length - 1; i++) {
    const startIdx = validIndices[i];
    const endIdx = validIndices[i + 1];
    const startVal = values[startIdx];
    const endVal = values[endIdx];
    const gap = endIdx - startIdx;

    // Linear interpolation between two points
    for (let j = 1; j < gap; j++) {
      const fraction = j / gap;
      result[startIdx + j] = startVal + (endVal - startVal) * fraction;
    }
  }

  // Fill values before first valid index
  if (validIndices[0] > 0) {
    const firstValue = values[validIndices[0]];
    for (let i = 0; i < validIndices[0]; i++) {
      result[i] = firstValue;
    }
  }

  // Fill values after last valid index
  if (validIndices[validIndices.length - 1] < values.length - 1) {
    const lastValue = values[validIndices[validIndices.length - 1]];
    for (let i = validIndices[validIndices.length - 1] + 1; i < values.length; i++) {
      result[i] = lastValue;
    }
  }

  return result;
}

export const parseExcelFile = async (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let jsonData = utils.sheet_to_json(worksheet, { header: 1, defval: null });

        // Remove empty rows
        jsonData = jsonData.filter(row => !isRowEmpty(row));

        // Remove empty columns
        jsonData = removeEmptyColumns(jsonData);

        const rawHeaders = jsonData[0] as any[];
        // Convertir fechas en los encabezados
        const labels = rawHeaders.slice(3).map(header => {
          if (isExcelDateFormat(header)) {
            return formatExcelDate(header);
          }
          return String(header);
        });
        
        const parsedData: BarData[] = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          const values = row.slice(3).map(val => cleanNumberValue(val));

          parsedData.push({
            label: row[0] || '',
            image: row[1] || '',
            color: row[2] || '#000000',
            values: values
          });
        }

        resolve({
          labels,
          data: parsedData
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

export const processData = (data: ParsedData, emptyCellHandling: EmptyCellHandling): ParsedData => {
  return {
    ...data,
    data: data.data.map(bar => ({
      ...bar,
      values: emptyCellHandling === 'interpolate' 
        ? interpolateEmptyValues(bar.values)
        : bar.values.map(v => isNaN(v) ? 0 : v)
    }))
  };
};