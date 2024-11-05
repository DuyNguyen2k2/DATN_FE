export const isJsonString = (data) => {
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function getItem(label, key, icon, children, type) {
  return {
    label,
    key,
    icon,
    children,
    type,
  }
}

export const renderOptions = (arr) => {
  let results = []
  if(arr){
    results = arr?.map((opt) => {
      return {
        value: opt,
        label: opt,
      }
    })
  }
  results.push({
    label: 'Thêm Type',
    value: 'add_type',
  })
  return results
}

export const convertPrice = (price) => {
  try {
    // Format the price with a comma as the thousands separator and dot as the decimal point
    const result = price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `${result} VND`;
  } catch (error) {
    return null;
  }
};

