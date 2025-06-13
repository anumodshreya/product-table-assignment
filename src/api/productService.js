import productsData from '../data/products.json';


const simulateDelay = (data, delay = 500) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });

export const getAllProducts = () => {
  return simulateDelay(productsData.products);
};

export const deleteProduct = (id) => {
  const updated = productsData.products.filter((p) => p.id !== id);
  return simulateDelay(updated);
};

export const updateProductTitle = (id, newTitle) => {
  const updated = productsData.products.map((p) =>
    p.id === id ? { ...p, title: newTitle } : p
  );
  return simulateDelay(updated);
};

// ✅ NEW FUNCTION TO HANDLE MOQ UPDATES
export const updateProductMOQ = (id, newMOQ) => {
  const updated = productsData.products.map((p) =>
    p.id === id ? { ...p, moq: newMOQ } : p
  );
  return simulateDelay(updated);
};
