const selectTag = document.getElementById("selectCategory");
const container = document.getElementById("cards");

// تحميل التصنيفات
async function selectCategory() {
    let response = await fetch("https://dummyjson.com/products/categories");
    let categories = await response.json();

    selectTag.innerHTML += categories
        .map((cat) => `<option value="${cat.url}">${cat.name}</option>`)
        .join("");

    // نخلي Beauty افتراضي
    let beauty = categories.find(cat => cat.slug === "beauty");
    if (beauty) {
        selectTag.value = beauty.url;
        loadProducts(beauty.url);
    }
}

// تحميل المنتجات لأي تصنيف
async function loadProducts(url) {
    let response = await fetch(url);
    let data = await response.json();
    let products = data.products;

    container.innerHTML = products
        .map(
            (product) => `
          <div class="position-relative inner-card col-md-3">
              <img src="${product.thumbnail}" class="rounded" alt="${product.title}" />
              <h6 class="text-center mt-3 fw-bold">${product.title}</h6>
              <p class="text-center fw-medium">$ ${product.price} USD</p>
              <div class="card-icons d-flex flex-column align-items-center">
                <p class="icon cart-btn" title="add to cart" data-id="${product.id}">
                    <i class="fa-solid fa-cart-shopping text-dark"></i>
                </p>
                <p class="icon wishlist-btn" title="add to wishlist" data-id="${product.id}">
                    <i class="fa-solid fa-heart text-dark"></i>
                </p>
                <a href="#" class="btn btn-warning">View</a>
              </div>
          </div>
        `
        )
        .join("");

    // ✅ إضافة الأحداث بعد عرض المنتجات
    document.querySelectorAll(".cart-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            let id = btn.getAttribute("data-id");
            let product = products.find((p) => p.id == id);
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (!cart.find((item) => item.id === product.id)) {
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail
                });
                localStorage.setItem("cart", JSON.stringify(cart));
            }
        });
    });

    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            let id = btn.getAttribute("data-id");
            let product = products.find((p) => p.id == id);
            let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            if (!wishlist.find((item) => item.id === product.id)) {
                wishlist.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail
                });
                localStorage.setItem("wishlist", JSON.stringify(wishlist));
            }
        });
    });
}

// عند تغيير الاختيار
selectTag.addEventListener("change", () => {
    if (selectTag.value) loadProducts(selectTag.value);
});

// أول تحميل
selectCategory();
