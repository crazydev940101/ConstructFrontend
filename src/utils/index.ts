export const validateEmail = (mail: string) => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
};

export const getFullDate = (D?: any) => {
  if (!D) D = new Date();

  const y = D.getFullYear();
  const m = D.getMonth() + 1;
  const d = D.getDate();

  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
};

export const getFileType = (ext: string) => {
  const extension = ext.toLowerCase();

  if (extension === 'jpeg' || extension === 'png') {
    return 'image/' + extension;
  }
};

export function sortProject<T>(data: T[]) {
  data.sort((prev: any, next: any) => {
    if (prev.createdAt > next.createdAt) return -1;
    else return 1;
  });

  return data;
}
