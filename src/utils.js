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