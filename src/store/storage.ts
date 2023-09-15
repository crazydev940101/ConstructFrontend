export const getLocalStorage = (key: string) => {
  try {
    const value = window.localStorage.getItem(key);
    if (value) {
      return {
        status: true,
        data: JSON.parse(value),
      };
    } else {
      return {
        status: false,
        data: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      status: false,
      data: null,
    };
  }
};

export const setLocalStorage = (key: string, value: string) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const destroyStorage = (key: string) => {
  window.localStorage.removeItem(key);
};
