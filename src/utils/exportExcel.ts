import { utils, writeFileXLSX } from 'xlsx';

function exportExcel(data: any) {
  if (data.extractedData) {
    let excelData = [{}] as any[];
    const resData = JSON.parse(data.extractedData);

    for (const key in resData) {
      const _data = typeof resData[key] === 'object' ? JSON.stringify(resData[key]) : resData[key];

      if (_data.length > 32766) {
        const count = Math.ceil(_data.length / 32767);
        for (let i = 0; i < count; i++) {
          if (!excelData[i]) excelData[i] = {};
          excelData[i][key] = _data.slice(i * 32766, (i + 1) * 32766);
        }
      } else {
        excelData[0][key] = _data;
      }
    }
    const ws = utils.json_to_sheet(excelData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    writeFileXLSX(wb, `${data.documentName.split('.')[0]}.xlsx`);
  }
}

function exportMultilineExcel(data: any) {
  if (data.extractedData) {
    let excelData = [{}] as any[];
    // const resData = JSON.parse(data.extractedData);
    if(Array.isArray(data.extractedData)) 
    for (const extractedData of data.extractedData) {
      let d: any = {}
      for (const key in extractedData) {
        const _data = typeof extractedData[key] === 'object' ? JSON.stringify(extractedData[key]) : extractedData[key];
  
          d[key] = _data;
      }
      excelData.push(d)
    }
    const ws = utils.json_to_sheet(excelData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    writeFileXLSX(wb, `${data.documentName.split('.')[0]}.xlsx`);
  }
}

function exportMultiSheetExcel(data: any[]) {
  const wb = utils.book_new();
  for (let i = 0; i < data.length; i++) {
    let excelData = [{}] as any[];
    const extractedData = JSON.parse(data[i].extractedData);

    const exportData = Array.isArray(extractedData) ? extractedData[0] : extractedData;
    for (const key in exportData) {
      let newKey = ''
      if(key.includes('_')){
        newKey = key.split('_').map(k => `${k.charAt(0).toUpperCase()}${k.substring(1)}`).join(' ')
      } else {
        newKey = `${key.charAt(0).toUpperCase()}${key.substring(1)}`
      }
      const _data = typeof exportData[key] === 'object' ? JSON.stringify(exportData[key]) : exportData[key];

      if (_data.length > 32766) {
        const count = Math.ceil(_data.length / 32767);
        for (let co = 0; co < count; co++) {
          if (!excelData[co]) excelData[co] = {};
          excelData[co][newKey] = _data.slice(co * 32766, (co + 1) * 32766);
        }
      } else {
        excelData[0][newKey] = _data;
      }
    }

    let fileName = data[i].id.toString() + '_' + data[i].documentName;

    if (fileName.length > 30) {
      fileName = fileName.slice(0, 9) + '...' + fileName.slice(fileName.length - 10, fileName.length);
    }
    const ws = utils.json_to_sheet(excelData);
    utils.book_append_sheet(wb, ws, fileName);
  }

  writeFileXLSX(wb, `data.xlsx`);
}

export { exportExcel, exportMultilineExcel, exportMultiSheetExcel };
