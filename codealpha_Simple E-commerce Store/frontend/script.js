// ================= CART =================

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// Update cart count when page loads
updateCartCount();


function addToCart(name, price) {

    const existingProduct = cart.find(
        product => product.name === name
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert(`${name} added to cart!`);
}


function updateCartCount() {

    const cartCount = document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    const totalItems = cart.reduce(
        (total, product) => total + product.quantity,
        0
    );

    cartCount.textContent = totalItems;
}


// ================= SEARCH =================

function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    const searchValue =
        searchInput.value.toLowerCase().trim();

    const products =
        document.querySelectorAll(".product-card");

    products.forEach(product => {

        const productName =
            product.dataset.name.toLowerCase();

        if (productName.includes(searchValue)) {

            product.style.display = "block";

        } else {

            product.style.display = "none";

        }

    });
}


// ================= SORT PRODUCTS =================

function sortProducts() {

    const container =
        document.getElementById("productContainer");

    const products =
        Array.from(
            container.querySelectorAll(".product-card")
        );

    const sortValue =
        document.getElementById("sortProducts").value;


    if (sortValue === "low") {

        products.sort(
            (a, b) =>
                Number(a.dataset.price) -
                Number(b.dataset.price)
        );

    }


    if (sortValue === "high") {

        products.sort(
            (a, b) =>
                Number(b.dataset.price) -
                Number(a.dataset.price)
        );

    }


    products.forEach(product => {

        container.appendChild(product);

    });
}

// ================= LOAD PRODUCTS =================

async function loadProducts() {

    try {

        const response = await fetch(
            "http://localhost:5000/products"
        );

        const products = await response.json();

        const container =
            document.getElementById("productContainer");

        container.innerHTML = "";

        products.forEach(product => {

            if (!product.name || !product.price) {
                return;
            }

            const productCard = document.createElement("div");

            // rest of your code...

            productCard.className = "product-card";

            productCard.innerHTML = `

    <div class="product-image">

        <img
            src="${product.image}"
            alt="${product.name}"
        >

    </div>

    <div class="product-info">

        <h3>${product.name}</h3>

        <p class="product-description">
            ${product.description}
        </p>

        <div class="product-bottom">

            <span class="price">
                ₹${product.price}
            </span>

            <button
                class="add-cart-btn"
                onclick="addToCart('${product.name}', ${product.price})"
            >
                Add to Cart
            </button>

        </div>

        <button
            class="details-btn"
            onclick="viewProduct('${product._id}')"
        >
            View Details
        </button>

    </div>

`;

            container.appendChild(productCard);

        });

    } catch (error) {

        console.log("Error loading products:", error);

    }
}


// Load products when page opens
loadProducts();


function viewProduct(id) {

    window.location.href = `product.html?id=${id}`;

}


// ================= PRODUCT DETAILS =================

async function loadProductDetails() {

    const params = new URLSearchParams(
        window.location.search
    );

    const productId = params.get("id");

    if (!productId) {
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:5000/products/${productId}`
        );


        if (!response.ok) {

            throw new Error("Product not found");

        }


        const product = await response.json();


        // Product image
        document.getElementById("productImage").src =
            product.image;


        // Product name
        document.getElementById("productName").textContent =
            product.name;


        // Product price
        document.getElementById("productPrice").textContent =
            `₹${product.price}`;


        // Product description
        document.getElementById("productDescription").textContent =
            product.description;


        // Product stock
        document.getElementById("productStock").textContent =
            product.stock;


        // Add to cart button
        document.getElementById("addProductButton").onclick =
            function () {

                addToCart(
                    product.name,
                    product.price
                );

            };


    } catch (error) {

        console.log(error);

    }

}

loadProductDetails();


// ================= CART PAGE =================

function loadCart() {

    const cartContainer =
        document.getElementById("cartContainer");

    const cartTotal =
        document.getElementById("cartTotal");

    if (!cartContainer || !cartTotal) {
        return;
    }

    cartContainer.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        cartTotal.textContent = "0";

        return;
    }


    cart.forEach((product, index) => {

        const itemTotal =
            product.price * product.quantity;

        total += itemTotal;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ₹${product.price}
                </p>

            </div>


            <div>

                <button
                    onclick="decreaseQuantity(${index})"
                >
                    -
                </button>

                <span>
                    ${product.quantity}
                </span>

                <button
                    onclick="increaseQuantity(${index})"
                >
                    +
                </button>

            </div>


            <div>

                <strong>
                    ₹${itemTotal}
                </strong>

                <button
                    onclick="removeFromCart(${index})"
                >
                    Remove
                </button>

            </div>

        `;

        cartContainer.appendChild(cartItem);

    });


    cartTotal.textContent = total;
}


function increaseQuantity(index) {

    cart[index].quantity += 1;

    saveCart();

    loadCart();
}


function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);

    }

    saveCart();

    loadCart();
}


function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

    loadCart();
}


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


loadCart();

// ================= REGISTER =================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document.getElementById("name").value;

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;


            if (password !== confirmPassword) {

                alert("Passwords do not match");

                return;
            }


            const response = await fetch(
                "http://localhost:5000/register",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })

                }
            );


            const data = await response.json();


            alert(data.message);


            if (response.ok) {

                window.location.href =
                    "login.html";

            }

        }
    );

}


// ================= LOGIN =================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;


            const response = await fetch(
                "http://localhost:5000/login",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })

                }
            );


            const data = await response.json();


            alert(data.message);


            if (response.ok) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                window.location.href =
                    "index.html";

            }

        }
    );

}


// ================= CHECKOUT =================

const checkoutForm =
    document.getElementById("checkoutForm");


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert("Your cart is empty");

                return;

            }


            const user =
                JSON.parse(
                    localStorage.getItem("user")
                );


            if (!user) {

                alert("Please login first");

                window.location.href =
                    "login.html";

                return;

            }


            const name =
                document.getElementById(
                    "checkoutName"
                ).value;


            const phone =
                document.getElementById(
                    "phone"
                ).value;


            const address =
                document.getElementById(
                    "address"
                ).value;


            const city =
                document.getElementById(
                    "city"
                ).value;


            const pincode =
                document.getElementById(
                    "pincode"
                ).value;


            const total =
                cart.reduce(
                    (sum, product) =>
                        sum +
                        product.price *
                        product.quantity,
                    0
                );


            const orderData = {

                userId: user.id,

                customerName: name,

                phone: phone,

                address: address,

                city: city,

                pincode: pincode,

                products: cart,

                total: total

            };


            const response = await fetch(
                "http://localhost:5000/orders",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(orderData)

                }
            );


            const data =
                await response.json();


            alert(data.message);


            if (response.ok) {

                localStorage.removeItem("cart");

                cart = [];

                window.location.href =
                    "index.html";

            }

        }
    );

}



// 


function loadCheckout() {

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutTotal =
        document.getElementById("checkoutTotal");


    if (!checkoutItems || !checkoutTotal) {
        return;
    }


    checkoutItems.innerHTML = "";


    let total = 0;


    cart.forEach(product => {

        const itemTotal =
            product.price * product.quantity;

        total += itemTotal;


        checkoutItems.innerHTML += `

            <p>
                ${product.name}
                × ${product.quantity}
                = ₹${itemTotal}
            </p>

        `;

    });


    checkoutTotal.textContent = total;

}


loadCheckout();