// GET PRODUCT
function apiGetProducts(searchValue) {
  // PHẢI CÓ TỪ KHÓA RETURN ĐỂ .THEN VÀ .CATCH
  return axios({
    url: `https://64bd1ac52320b36433c76b24.mockapi.io/Products`,
    method: "GET",
    params: {
      productName: searchValue || undefined,
    },
  });
}

// GET PRODUCT BY ID
function apiGetProductById(productId) {
  return axios({
    url: `https://64bd1ac52320b36433c76b24.mockapi.io/Products/${productId}`,
    method: "GET",
  });
}

// CREATE PRODDUCT
function apiCreateProduct(product) {
  return axios({
    url: "https://64bd1ac52320b36433c76b24.mockapi.io/Products",
    method: "POST",
    data: product, //method post phải có thêm data ( dữ liệu kèm theo )
  });
}

function apiUpdateProduct(productId, newProduct) {
  return axios({
    url: `https://64bd1ac52320b36433c76b24.mockapi.io/Products/${productId}`,
    method: "PUT",
    data: newProduct, //method post phải có thêm data ( dữ liệu kèm theo )
  });
}

// DELELTE PRODUCT
function apiDeleteProduct(productId) {
  return axios({
    url: `https://64bd1ac52320b36433c76b24.mockapi.io/Products/${productId}`,
    method: "DELETE",
  });
}
