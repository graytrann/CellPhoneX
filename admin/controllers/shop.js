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
                <button>Add to cart</button>
              </div>
          `
    );
  }, "");

  document.getElementById("products_list").innerHTML = html;
}

getProductsForShop();
