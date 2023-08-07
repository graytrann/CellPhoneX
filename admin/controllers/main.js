let isSubmitted = false;
// lấy sản phẩm
function getProducts() {
  apiGetProducts()
    .then((response) => {
      // gọi hàm display để hiển thị ra giao diện
      display(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

// lấy danh sách sản phẩm từ bé đến cao
function getProductsIncrease() {
  apiGetProducts()
    .then((response) => {
      console.log(response.data);
      // Sắp xếp danh sách sản phẩm theo giá từ thấp đến cao
      const sortedProducts = response.data.sort((a, b) => a.price - b.price);
      // gọi hàm display để hiển thị ra giao diện
      display(sortedProducts);
    })
    .catch((error) => {
      console.log(error);
    });

  Swal.fire("Giá sản phẩm từ thấp đến cao");
}

// lấy danh sách sản phẩm từ cao đến bé
function getProductsDecrease() {
  apiGetProducts()
    .then((response) => {
      // Sắp xếp danh sách sản phẩm theo giá từ cao đến thấp
      const sortedProducts = response.data.sort((a, b) => b.price - a.price);

      // Gọi hàm display để hiển thị danh sách sản phẩm đã sắp xếp
      display(sortedProducts);
    })
    .catch((error) => {
      console.log(error);
    });
  Swal.fire("Giá sản phẩm từ cao đến thấp");
}

getProducts();

// hàm tạo sản phẩm
function createProduct() {
  // DOM và khởi tạo các object product
  // let product = {
  //   productName: getElement("#TenSP").value,
  //   price: +getElement("#GiaSP").value,
  //   screen: getElement("#screenSP").value,
  //   backCamera: getElement("#screenBack").value,
  //   frontCamera: getElement("#screenFront").value,
  //   img: getElement("#HinhSP").value,
  //   desc: getElement("#DescSP").value,
  //   type: getElement("#loaiSP").value,
  // };
  isSubmitted = true;
  let product = validation();
  if (!product) {
    return;
  } else {
    // GỌI API THÊM SẢN PHẨM
    apiCreateProduct(product)
      .then((response) => {
        // sau khi thêm thành công, dữ liệu chỉ mới đc cập nhật ở phía server. Ta cần gọi lại hàm apiGetProducts để lấy được danh sách những sản phẩm mới nhất(bao gồm sản phẩm mình mới thêm)
        return apiGetProducts();
      })
      .then((response) => {
        // và hiển thị lại trên trình duyệt
        display(response.data);

        // ẩn modal sau khi thêm
        $("#myModal").modal("hide");
      })
      .catch((error) => {
        console.log(error);
      });

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "THÊM THÀNH CÔNG",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  reset();
}

// hàm xóa sản phẩm
function deleteProduct(productId) {
  apiDeleteProduct(productId)
    .then(() => {
      // Xóa thành công
      return apiGetProducts();
    })
    .then((response) => {
      // hiển thị trở lại
      display(response.data);
    })
    .catch(() => {
      console.log(error);
    });
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "XÓA THÀNH CÔNG",
    showConfirmButton: false,
    timer: 1500,
  });
}

// xem sản phẩm
function selectProduct(productId) {
  // hiển thị modal
  $("#myModal").modal("show");
  // Hiển thị title và footer của modal
  getElement(".modal-title").innerHTML = "Cập nhật sản phẩm";
  getElement(".modal-footer").innerHTML = `
    <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
    <button class="btn btn-success" onclick="updateProduct('${productId}')">Cập nhật</button>
    `;

  apiGetProductById(productId)
    .then((response) => {
      // Lấy thông tin sản phẩm thành công => hiển thị dữ liệu lên form
      let product = response.data;

      getElement("#TenSP").value = product.productName;
      getElement("#GiaSP").value = product.price;
      getElement("#screenSP").value = product.screen;
      getElement("#screenBack").value = product.backCamera;
      getElement("#screenFront").value = product.frontCamera;
      getElement("#HinhSP").value = product.img;
      getElement("#DescSP").value = product.desc;
      getElement("#loaiSP").value = product.type;
    })
    .catch((error) => {
      console.log(error);
    });
}

// cập nhật sản phẩm
function updateProduct(productId) {
  // DOM và khởi tạo các object product
  // let newProduct = {
  //   productName: getElement("#TenSP").value,
  //   price: +getElement("#GiaSP").value,
  //   screen: getElement("#screenSP").value,
  //   backCamera: getElement("#screenBack").value,
  //   frontCamera: getElement("#screenFront").value,
  //   img: getElement("#HinhSP").value,
  //   desc: getElement("#DescSP").value,
  //   type: getElement("#loaiSP").value,
  // };
  let newProduct = validation();
  if (!newProduct) {
    return;
  } else {
    apiUpdateProduct(productId, newProduct)
      .then(() => {
        // cập nhật thành công
        return apiGetProducts();
      })
      .then((response) => {
        display(response.data);
        // ẩn modal sau khi cập nhật
        $("#myModal").modal("hide");
      })
      .catch((error) => {
        console.log(error);
      });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "CẬP NHẬT THÀNH CÔNG",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
// hiển thị sản phẩm
function display(products) {
  // reduce nhận 2 tham số, tham số đầu là callback, tham số 2 giá trị khởi tạo
  let html = products.reduce((result, value, index) => {
    let product = new Product(
      value.id,
      value.productName,
      value.price,
      value.screen,
      value.backCamera,
      value.frontCamera,
      value.img,
      value.desc,
      value.type
    );

    // return trong () để cho nó hiểu là nội dung trong () cần return
    return (
      result +
      `
        <tr>
            <td>${index + 1}</td>
            <td>${product.productName}</td>
            <td>${product.price}</td>
            <td>
                <img src="${product.img}" width="100px" height="150px" />
            </td>
            <td>${product.type}</td>
            <td>
                <button 
                onclick="selectProduct('${product.id}')"
                class="btn btn-primary">Xem</button>
                <button 
                onclick="deleteProduct('${product.id}')"
                class="btn btn-danger">Xóa</button>
            </td>
        </tr>
        `
    );
  }, "");

  document.getElementById("tblDanhSachSP").innerHTML = html;
}

// reset
function reset() {
  // inputs
  getElement("#TenSP").value = "";
  getElement("#GiaSP").value = "";
  getElement("#screenSP").value = "";
  getElement("#screenBack").value = "";
  getElement("#screenFront").value = "";
  getElement("#HinhSP").value = "";
  getElement("#DescSP").value = "";
  getElement("#loaiSP").value = "";

  // spans
  getElement("#spanTenSP").value = "";
  getElement("#spanGiaSP").value = "";
  getElement("#spanMHSP").value = "";
  getElement("#spanBackSP").value = "";
  getElement("#spanFrontSP").value = "";
  getElement("#spanImgSP").value = "";
  getElement("#spanDescSP").value = "";
  getElement("#spanBrandSP").value = "";
}

//search - tìm sản phẩm trong input
getElement("#txtSearch").onkeypress = (event) => {
  if (event.key !== "Enter") {
    return;
  }

  apiGetProducts(event.target.value)
    .then((response) => {
      display(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
// DOM - Nút thêm sản phẩm
getElement("#btnThemSP").onclick = () => {
  getElement(".modal-title").innerHTML = "Thêm sản phẩm";
  getElement(".modal-footer").innerHTML = `
     <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
     <button class="btn btn-success" onclick="createProduct()">Thêm</button>
      `;
  reset();
};

// Hàm tìm sản phẩm
function find() {
  apiGetProducts(getElement("#txtSearch").value)
    .then((response) => {
      display(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

// ===== Utils ====
function getElement(selector) {
  return document.querySelector(selector);
}

// kiểm tra chuỗi rỗng
function isRequired(value) {
  // trim xỏa bỏ khảng trắng đầu và cuối
  if (!value.trim()) {
    // chuỗi rỗng là falsy value, !false => true , nếu true là chuỗi rỗng
    return false;
  }
  return true;
}

// hàm kiểm tra tên tài khoản
function checkStringWithoutSpecialCharacters(inputString) {
  var regex = /^[a-zA-Z0-9\s]+$/; // Biểu thức chính quy kiểm tra chuỗi không chứa ký tự đặc biệt và cho phép khoảng trắng (\s)

  return regex.test(inputString);
}

// hàm kiểm tra giá là 1 số
function checkPrice(price) {
  var regex = /^\d+$/; // Biểu thức chính quy kiểm tra chuỗi là một số hoàn toàn

  return regex.test(price);
}

// Validation
function validation() {
  let productName = getElement("#TenSP").value;
  let price = getElement("#GiaSP").value;
  let screen = getElement("#screenSP").value;
  let backCamera = getElement("#screenBack").value;
  let frontCamera = getElement("#screenFront").value;
  let img = getElement("#HinhSP").value;
  let desc = getElement("#DescSP").value;
  let type = getElement("#loaiSP").value;

  let isValid = true;

  // product name
  if (!isRequired(productName)) {
    isValid = false;
    getElement("#spanTenSP").innerHTML = "Tên sản phẩm được để trống";
  } else if (!checkStringWithoutSpecialCharacters(productName)) {
    isValid = false;
    getElement("#spanTenSP").innerHTML = "Tên sản phẩm được có ký tự đặc biệt ";
  }

  // product price
  if (!isRequired(price)) {
    isValid = false;
    getElement("#spanGiaSP").innerHTML = "Giá sản phẩm không được để trống";
  } else if (!checkPrice(price)) {
    isValid = false;
    getElement("#spanGiaSP").innerHTML = "Giá sản phẩm không được chứa chuỗi ";
  }

  // product screen
  if (!isRequired(screen)) {
    isValid = false;
    getElement("#spanMHSP").innerHTML = "Màn hình sản phẩm không được để trống";
  } else if (!checkStringWithoutSpecialCharacters(screen)) {
    isValid = false;
    getElement("#spanMHSP").innerHTML =
      "Màn hình sản phẩm không được chứa ký tự đặc biệt ";
  }

  // product back-screen
  if (!isRequired(backCamera)) {
    isValid = false;
    getElement("#spanBackSP").innerHTML =
      "Màn hình sau sản phẩm không được để trống";
  } else if (!checkStringWithoutSpecialCharacters(backCamera)) {
    isValid = false;
    getElement("#spanBackSP").innerHTML =
      "Màn hình sau sản phẩm không được chứa ký tự đặc biệt ";
  }

  // product front-screen
  if (!isRequired(frontCamera)) {
    isValid = false;
    getElement("#spanFrontSP").innerHTML =
      "Màn hình trước sản phẩm không được để trống";
  } else if (!checkStringWithoutSpecialCharacters(frontCamera)) {
    isValid = false;
    getElement("#spanFrontSP").innerHTML =
      "Màn hình trước sản phẩm không được chứa ký tự đặc biệt ";
  }

  // product img
  if (!isRequired(img)) {
    isValid = false;
    getElement("#spanImgSP").innerHTML =
      "Hình ảnh của sản phẩm không được để trống";
  }

  // product description
  if (!isRequired(desc)) {
    isValid = false;
    getElement("#spanDescSP").innerHTML =
      "Nội dung của sản phẩm không được để trống";
  }

  // product type
  if (!isRequired(type)) {
    isValid = false;
    getElement("#spanBrandSP").innerHTML = "Hãng sản phẩm không được để trống";
  } else if (getElement("#loaiSP").value === "select") {
    isValid = false;
    getElement("#spanBrandSP").innerHTML = "Vui lòng hãng sản phẩm";
  }

  // if (isValid) {
  //   let product = {
  //     productName: getElement("#TenSP").value,
  //     price: +getElement("#GiaSP").value,
  //     screen: getElement("#screenSP").value,
  //     backCamera: getElement("#screenBack").value,
  //     frontCamera: getElement("#screenFront").value,
  //     img: getElement("#HinhSP").value,
  //     desc: getElement("#DescSP").value,
  //     type: getElement("#loaiSP").value,
  //   };

  if (isValid) {
    let product = new Product(
      "không có id",
      productName,
      price,
      screen,
      backCamera,
      frontCamera,
      img,
      desc,
      type
    );

    return product;
  }

  //   return product;
  // }

  return undefined;
}

// OnInput Validation

// Tên Sản Phẩm
getElement("#TenSP").oninput = (event) => {
  if (!isSubmitted) return;

  let productNameSpan = getElement("#spanTenSP");

  if (isRequired(event.target.value)) {
    productNameSpan.innerHTML = "";
  }
};

// Giá Sản Phẩm
getElement("#GiaSP").oninput = (event) => {
  if (!isSubmitted) return;

  let priceSpan = getElement("#spanGiaSP");

  if (isRequired(event.target.value)) {
    priceSpan.innerHTML = "";
  }
};

// Màn Hình
getElement("#screenSP").oninput = (event) => {
  if (!isSubmitted) return;

  let screenSpan = getElement("#spanMHSP");

  if (isRequired(event.target.value)) {
    screenSpan.innerHTML = "";
  }
};

// Màn Hình sau screenBack
getElement("#screenBack").oninput = (event) => {
  if (!isSubmitted) return;

  let backScreenSpan = getElement("#spanBackSP");

  if (isRequired(event.target.value)) {
    backScreenSpan.innerHTML = "";
  }
};

// Màn hình trước screenFront
getElement("#screenFront").oninput = (event) => {
  if (!isSubmitted) return;

  let frontScreenSpan = getElement("#spanFrontSP");

  if (isRequired(event.target.value)) {
    frontScreenSpan.innerHTML = "";
  }
};

// Image sản phẩm
getElement("#HinhSP").oninput = (event) => {
  if (!isSubmitted) return;

  let imgSpan = getElement("#spanImgSP");

  if (isRequired(event.target.value)) {
    imgSpan.innerHTML = "";
  }
};

// Mô tả sản phẩm
getElement("#DescSP").oninput = (event) => {
  if (!isSubmitted) return;

  let descSpan = getElement("#spanDescSP");

  if (isRequired(event.target.value)) {
    descSpan.innerHTML = "";
  }
};

// Loại sản phẩm
getElement("#loaiSP").oninput = (event) => {
  if (!isSubmitted) return;

  let brandSpan = getElement("#spanBrandSP");

  if (isRequired(event.target.value)) {
    brandSpan.innerHTML = "";
  }
};
