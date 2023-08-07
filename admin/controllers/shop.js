//SHOP

// Hàm lấy sản phẩm từ API để hiển thị ra giao diện ( cần hàm displayForShop)
function getProductsForShop() {
  apiGetProducts()
    .then((response) => {
      // gọi hàm display để hiển thị ra giao diện
      displayForShop(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Hàm hiển thị sản phẩm
function displayForShop(products) {
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
          <div class="product_item">
                <img
                  src="${product.img}"
                  alt=""
                />
                <p>${product.price}</p>
                <p>${product.type}</p>
                <p>
                ${product.desc}
                </p>
                <button onclick="addToCart('${product.productName}', '${product.img}', '${product.price}','${product.id}')">Add to cart</button>
              </div>
          `
    );
  }, "");

  document.getElementById("products_list").innerHTML = html;
}

// gọi hàm lấy sản phẩm từ API để hiển thị ra giao diện
getProductsForShop();

// GIỎ HÀNG

// tiền đơn hàng
let total = 0;

// object giỏ hàng ( chứa các sản phẩm cần thanh toán)
const cart = {
  items: [],
};

// object product thanh toán
let product = {
  name: "",
  img: "",
  price: 0,
  quantity: 0,
};

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productName, productImg, productPrice) {
  const price = parseFloat(productPrice);
  total += price;

  const existingProduct = cart.items.find((item) => item.name === productName);

  if (existingProduct) {
    // Nếu sản phẩm đã có trong giỏ hàng, chỉ tăng số lượng của sản phẩm đó
    existingProduct.quantity++;
    console.log(existingProduct.quantity);
    displayCartItem2(cart.items);
    saveCartToLocalStorage();
  } else {
    // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới vào giỏ hàng
    product = {
      name: productName,
      img: productImg,
      price: price,
      quantity: 1,
    };
    cart.items.push(product);
    displayCartItem2(cart.items);
    localStorage.setItem("productsInCart", JSON.stringify(cart.items));
  }

  displayTotalPrice();

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "ĐÃ THÊM VÀO GIỎ HÀNG ",
    showConfirmButton: false,
    timer: 1500,
  });
}

// Hàm hiển thị thông tin của sản phẩm trong giỏ hàng ( test )
// function displayCartItem(productName) {
//   const existingProduct = cart.items.find((item) => item.name === productName);

//   // Tìm sản phẩm trong giỏ hàng dựa trên tên sản phẩm
//   let product = cart.items.find((item) => item.name === productName);
//   console.log(product);
//   if (product) {
//     // Tạo đoạn mã HTML động cho sản phẩm
//     console.log("sản phẩm đã tồn tại");
//     let cartItemHTML = `

//       <div class="cart_item mt-3 data-product-name="${product.name}">
//                           <div class="cart_item_img">
//                             <img
//                               src="${product.img}"
//                               alt=""
//                             />
//                           </div>

//                           <div class="cart_item_info">
//                             <p>${product.name}</p>
//                             <p>Số lượng :${product.quantity}</p>
//                             <p>${product.price}</p>
//                           </div>
//                           <div class="cart_item_buttons">
//                             <button onclick="increaseQuantity(${product.quantity})">+</button>
//                             <button onclick=""decreaseQuantity()">-</button>
//                           </div>
//                         </div>`;

//     // Chèn đoạn mã HTML vào phần tử container
//     document.getElementById("cart").innerHTML += cartItemHTML;
//   } else {
//   }
// }

// Hàm hiển thị thông tin của sản phẩm trong giỏ hàng ( Chính thức )
function displayCartItem2(products) {
  // reduce nhận 2 tham số, tham số đầu là callback, tham số 2 giá trị khởi tạo
  let html = products.reduce((result, value, index) => {
    // return trong () để cho nó hiểu là nội dung trong () cần return
    return (
      result +
      `
        <div class="cart_item mt-3 data-product-name="${value.name} data-quantity="1"">
        <div class="cart_item_img">
          <img
            src="${value.img}"
            alt=""
          />
        </div>

        <div class="cart_item_info">
          <p>${value.name}</p>
          <p>Số lượng :${value.quantity}</p>
          <p>${value.price}</p>
        </div>
        <div class="cart_item_buttons">
          <button onclick="increaseQuantity('${value.name}')"><i class="fa fa-plus"></i></button>
          <button onclick="decreaseQuantity('${value.name}')"><i class="fa fa-minus"></i></button>
          <button onclick="removeProductFromCart('${value.name}')"><i class="fa fa-trash"></i></button>
        </div>
      </div>
            `
    );
  }, "");

  document.getElementById("cart").innerHTML = html;
}

// Hàm tăng số lương sản phẩm
function increaseQuantity(productName) {
  const existingProduct = cart.items.find((item) => item.name === productName);

  if (existingProduct) {
    // Nếu sản phẩm đã có trong giỏ hàng, chỉ tăng số lượng của sản phẩm đó
    existingProduct.quantity++;
    total += existingProduct.price;

    displayCartItem2(cart.items);
    displayTotalPrice();
    saveCartToLocalStorage();
  }
}

// Hàm giảm số lượng sản phẩm
function decreaseQuantity(productName) {
  const existingProduct = cart.items.find((item) => item.name === productName);

  if (existingProduct && existingProduct.quantity > 1) {
    // Nếu sản phẩm đã có trong giỏ hàng và số lượng lớn hơn 1, giảm số lượng của sản phẩm đó
    existingProduct.quantity--;
    total -= existingProduct.price;
    displayCartItem2(cart.items);
    displayTotalPrice();
    saveCartToLocalStorage();
  }
}

// Hàm hiển thị tổng tiền
function displayTotalPrice() {
  let html = `<p>TỔNG TIỀN: ${total}$</p>`;
  document.getElementById("totalPrice").innerHTML = html;
}

// Hàm khởi tạo giỏ hàng còn lưu trong LocalStorage
function init() {
  cart.items = JSON.parse(localStorage.getItem("productsInCart")) || [];
  console.log(cart.items.length);
  if (cart.items.length === 0) {
    let html = `
                    <p>Hiện chưa có sản phẩm trong giỏ hàng</p>
                  `;
    document.getElementById("cart").innerHTML = html;
  } else {
    cart.items.forEach((item) => {
      total += item.price * item.quantity;
    });
    displayCartItem2(cart.items);
    displayTotalPrice();
  }
}

// chạy hàm tạo giỏ hàng còn lưu trong LocalStorage
init();

// Sự kiện thanh toán
document.getElementById("thanhToan").onclick = function () {
  if (cart.items.length === 0) {
    html = `
    <p>Không có sản phẩm nào để thanh toán</p>
  `;

    displayCartItem2(cart.items);
    document.getElementById("cart").innerHTML = html;
    displayTotalPrice();
  } else {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "THANH TOÁN THÀNH CÔNG",
      showConfirmButton: false,
      timer: 1500,
    });
    localStorage.removeItem("productsInCart");
    cart.items = JSON.parse(localStorage.getItem("productsInCart")) || [];
    total = 0;
    html = `
                    <p>Bạn đã thanh toán hết sản phẩm trong giỏ hàng</p>
                  `;

    displayCartItem2(cart.items);
    document.getElementById("cart").innerHTML = html;
    displayTotalPrice();
  }
};

// Hàm xóa sản phẩm khỏi giỏ hàng và cập nhật local storage
function removeProductFromCart(productName) {
  Swal.fire({
    title: "Bạn có muốn xóa sản phẩm ra khỏi cửa hàng?",
    showDenyButton: true,
    // showCancelButton: true,
    confirmButtonText: "Có",
    denyButtonText: `Không`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      // Tìm sản phẩm có tên là productName trong giỏ hàng
      const productIndex = cart.items.findIndex(
        (item) => item.name === productName
      );

      if (productIndex !== -1) {
        // Xóa sản phẩm khỏi giỏ hàng
        const removedProduct = cart.items.splice(productIndex, 1)[0];

        // Giảm tổng tiền sau khi xóa sản phẩm
        total -= removedProduct.price * removedProduct.quantity;

        // Lưu giỏ hàng đã cập nhật vào local storage
        saveCartToLocalStorage();
      }
      displayCartItem2(cart.items);
      displayTotalPrice();
      Swal.fire("Đã Xóa!", "", "success");
    } else if (result.isDenied) {
      // Swal.fire('Changes are not saved', '', 'info')
    }
  });
}

// hàm lưu cart vào localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("productsInCart", JSON.stringify(cart.items));
}
