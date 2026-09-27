const API_BASE_URL = "https://fakestoreapi.com";

async function request(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getProducts() {
  return request("/products");
}

export async function getCategories() {
  return request("/products/categories");
}
