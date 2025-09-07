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
        <div class="col-xl-3 col-md-6 col-sm-6 col-12 d-flex flex-column aling-items-center">
            <img src="${product.thumbnail}" class="rounded" alt="${product.title}" />
            <h6 class="text-center mt-3 fw-bold">${product.title}</h6>
            <p class="text-center fw-medium">$ ${product.price} USD</p>
            <div class="card-icons">
                <p class="icon cart-btn w-48" title="add to cart" data-id="${product.id}">
                    <i class="fa-solid fa-cart-shopping text-light"></i>
                    Add to Cart
                </p>
                <p class="icon wishlist-btn text-light w-48 fz-95" title="add to wishlist" data-id="${product.id}">
                    <i class="fa-solid fa-heart text-light"></i>
                    Add to Wishlist
                </p>
            </div>
            <a href="details.html" class="btn btn-warning text-light" title="View More Details">View Details</a>
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
