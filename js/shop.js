//TODO *МЕТОДЫ ДОБАВЛЕНИЯ/УДАЛЕНИЯ ТОВАРОВ ИЗ КОРЗИНЫ

const API = "https://raw.githubusercontent.com/lapotko/online-store-api/master/responses/";

class ProductList {
  constructor(cart, container = ".products-img") {
    this.container = container;
    this.cart = cart;
    this.goods = [];
    this._fetchProduct().then((data) => {
      this.goods = [...data];
      this.render();
    });
  }

  _fetchProduct() {
    return fetch(`${API}/catalogData.json`).then((result) => result.json());
  }

  render() {
    const block = document.querySelector(this.container);
    for (let unit of this.goods) {
      let item = new ProductItem(unit);
      block.insertAdjacentHTML("beforeend", item.render());
    }
    block.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.classList.contains("buy_button")) {
        this.cart.addToCart(e.target);
      }
    });
  }
}

class ProductItem {
  constructor(product, src = "images/") {
    this.title = product.name;
    this.price = product.price;
    this.id = product.id;
    this.src = src;
  }

  render() {
    return `
        <figure class="product-p">
        <a href="#">
        <img src="${this.src}products-image${this.id}.png" alt="image" />
          <div class="product-label">
            <figcaption class="product-label-top">${this.title}</figcaption>
            <div class="product-label-bottom">
                <span>$${this.price}</span>
                    <button class = 'buy_button' data-name="${this.title}" data-id="${this.id}" data-price="${this.price}">Buy</button>
            </div>
          </div>
        </a>
      </figure>
        `;
  }
}

class Cart {
  constructor(container = ".cart-group") {
    this.container = container;
    this.cartGoods = [];
    this._showHideCart();
    this._getCartList()
      .then((data) => {
        this.cartGoods = [...data.contents];
        this._renderCart();
        this._totalCart();
      })
      .catch((error) => console.log(error));
  }

  _showHideCart() {
    let cartImg = document.querySelector(".headerCart");
    let cartContent = document.querySelector(".cart");
    cartImg.addEventListener("click", () => {
      cartContent.classList.toggle("hidden");
    });
  }

  _getCartList() {
    return fetch(`${API}getBasket.json`)
      .then((result) => result.json())
      .catch((error) => console.log(error));
  }

  _totalCart() {
    let total_wrap = document.querySelector(".cart-summary__value");
    let total = 0;
    this.cartGoods.forEach((item) => {
      let unit = new CartItem(item);
      total += unit.price;
    });
    total_wrap.textContent = total + " ₽";
  }
  _renderCart() {
    let cartBlock = document.querySelector(this.container);
    this.cartGoods.forEach((item) => {
      let cartUnit = new CartItem(item);
      cartBlock.insertAdjacentHTML("beforeend", cartUnit.renderItem());
    });
  }
  addToCart(element) {
    // Нужно проверить есть ли такой товар в массиве cartGoods
    // Если есть - увеличить количество, если нет - добавить.
    let productId = +element.dataset["id"];
    let productInCart = this.cartGoods.find((el) => el.id === productId);
    if (productInCart) {
      productInCart.quantity++;
      console.log(productInCart.quantity);
      this._renderCart();
    } else {
    }
  }
}

class CartItem {
  constructor(product, src = "images/") {
    this.title = product.name;
    this.price = product.price;
    this.id = product.id;
    this.quantity = product.quantity;
    this.src = src;
  }

  renderItem() {
    return `
    <div class="cart-product" >
    <div class="cart-product__img-container">
      <img class="cart-product__img" src="${this.src}products-image${this.id}.png" alt="Здесь должна быть картинка" />
    </div>
    <div class="cart-product__info">
      <div class="cart-product__text">
        <div class="cart-product__product-text">
          <div class="cart-product__name">${this.title}</div>
          <span class="quantity">Количество: ${this.quantity}</span>
          <div class="cart-product__product-delete">
            <div class="cart-product__price">$${this.price}</div>
            <button class="cart-product__delete"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
      
        `;
  }
}
let cart = new Cart();
let list = new ProductList(cart);
console.log(list);
