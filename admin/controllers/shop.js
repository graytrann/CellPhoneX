//SHOP
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

getProductsForShop();

// GIỎ HÀNG
let total = 0;

const cart = {
  items: [],
};

let product = {
  name: "",
  img: "",
  price: 0,
  quantity: 0,
};

function addToCart(productName, productImg, productPrice) {
  const price = parseFloat(productPrice);
  total += price;

  const existingProduct = cart.items.find((item) => item.name === productName);

  if (existingProduct) {
    // Nếu sản phẩm đã có trong giỏ hàng, chỉ tăng số lượng của sản phẩm đó
    existingProduct.quantity++;
    console.log(existingProduct.quantity);
    displayCartItem2(cart.items);
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

// Hàm hiển thị thông tin của sản phẩm trong giỏ hàng
function displayCartItem(productName) {
  const existingProduct = cart.items.find((item) => item.name === productName);

  // Tìm sản phẩm trong giỏ hàng dựa trên tên sản phẩm
  let product = cart.items.find((item) => item.name === productName);
  console.log(product);
  if (product) {
    // Tạo đoạn mã HTML động cho sản phẩm
    console.log("sản phẩm đã tồn tại");
    let cartItemHTML = `
      
      <div class="cart_item mt-3 data-product-name="${product.name}">
                          <div class="cart_item_img">
                            <img
                              src="${product.img}"
                              alt=""
                            />
                          </div>
    
                          <div class="cart_item_info">
                            <p>${product.name}</p>
                            <p>Số lượng :${product.quantity}</p>
                            <p>${product.price}</p>
                          </div>
                          <div class="cart_item_buttons">
                            <button onclick="increaseQuantity(${product.quantity})">+</button>
                            <button onclick=""decreaseQuantity()">-</button>
                          </div>
                        </div>`;

    // Chèn đoạn mã HTML vào phần tử container
    document.getElementById("cart").innerHTML += cartItemHTML;
  } else {
  }
}

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
          <button onclick="increaseQuantity('${value.name}')">+</button>
          <button onclick="decreaseQuantity('${value.name}')">-</button>
        </div>
      </div>
            `
    );
  }, "");

  document.getElementById("cart").innerHTML = html;
}

function increaseQuantity(productName) {
  const existingProduct = cart.items.find((item) => item.name === productName);

  if (existingProduct) {
    // Nếu sản phẩm đã có trong giỏ hàng, chỉ tăng số lượng của sản phẩm đó
    existingProduct.quantity++;
    total += existingProduct.price;
    displayCartItem2(cart.items);
    displayTotalPrice();
  }
}

function decreaseQuantity(productName) {
  const existingProduct = cart.items.find((item) => item.name === productName);

  if (existingProduct && existingProduct.quantity > 1) {
    // Nếu sản phẩm đã có trong giỏ hàng và số lượng lớn hơn 1, giảm số lượng của sản phẩm đó
    existingProduct.quantity--;
    total -= existingProduct.price;
    displayCartItem2(cart.items);
    displayTotalPrice();
  }
}

function displayTotalPrice() {
  let html = `<p>TỔNG TIỀN: ${total}$</p>`;
  document.getElementById("totalPrice").innerHTML = html;
}
