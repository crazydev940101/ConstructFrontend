export const saveAsJson = (data: any, fileName: string) => {
    try {
      window.URL = window.webkitURL || window.URL;
      const formattedJson = JSON.stringify(data, null, 2);
      const url = URL.createObjectURL(new Blob([formattedJson], { type: 'application/json' }));
  
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error(error);
    }
  };
  