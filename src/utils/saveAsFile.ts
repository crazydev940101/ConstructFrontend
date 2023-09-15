export const saveAsFile = (data: any, fileName: string) => {
  try {
    window.URL = window.webkitURL || window.URL;
    const url = window.URL.createObjectURL(data);

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
