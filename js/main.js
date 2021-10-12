/* lazyload */
(function () {
  let canUseWebp = function () {
    var elem = document.createElement("canvas");

    if (!!(elem.getContext && elem.getContext("2d"))) {
      // was able or not to get WebP representation
      return elem.toDataURL("image/webp").indexOf("data:image/webp") == 0;
    } else {
      // very old browser like IE 8, canvas not supported
      return false;
    }
  };

  let isWebpSupported = canUseWebp();

  if (isWebpSupported === false) {
    let lazyItems = document.querySelectorAll("[data-src-replace]");
    for (let i = 0; i < lazyItems.length; i += 1) {
      let item = lazyItems[i];
      let dataSrcReplace = item.getAttribute("data-src-replace");
      if (dataSrcReplace !== null) {
        item.setAttribute("data-scr", dataSrcReplace);
      }
    }
  }

  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
  });
})();

/* lazyload */

/* catalog */
(function () {
  let catalogSection = document.querySelector(".section-catalog");

  if (catalogSection === null) {
    return;
  }

  let removeChildren = function (item) {
    while (item.firstChild) {
      item.removeChild(item.firstChild);
    }
  };

  let updateChildren = function (item, children) {
    removeChildren(item);
    for (let i = 0; i < children.length; i += 1) {
      item.appendChild(children[i]);
    }
  };

  let catalog = catalogSection.querySelector(".catalog");
  let catalogNav = catalogSection.querySelector(".catalog-nav");
  let catalogItems = catalogSection.querySelectorAll(".catalog-item");

  catalogNav.addEventListener("click", function (e) {
    let target = e.target;
    let item = myLib.closesItemByClass(target, "catalog-nav-btn");
    if (item === null || item.classList.contains("is-active")) {
      return;
    }

    e.preventDefault();

    let filterValue = item.getAttribute("data-filter");

    let previousBtnActive = catalogNav.querySelector(
      ".catalog-nav-btn.is-active"
    );

    previousBtnActive.classList.remove("is-active");
    item.classList.add("is-active");

    if (filterValue === "All") {
      updateChildren(catalog, catalogItems);
      return;
    }
    let filteredItems = [];
    for (let i = 0; i < catalogItems.length; i += 1) {
      let current = catalogItems[i];
      if (current.getAttribute("data-category") === filterValue) {
        filteredItems.push(current);
      }
    }
    updateChildren(catalog, filteredItems);
  });
})();
/* catalog */

/* ############################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################ */

/* form */
(function () {
  let forms = document.querySelectorAll(".form-send");

  if (forms.length === 0) {
    return;
  }

  let serialize = function (form) {
    let items = form.querySelectorAll("input, select, textarea");
    let str = "";
    for (let i = 0; (i = items.length); i += 1) {
      let item = items[i];
      let name = item.name;
      let value = item.value;
      let sepatator = i === 0 ? "" : "&";

      if (name) {
        str += sepatator + name + "=" + value;
      }
    }
    return str;
  };

  let formSend = function (form) {
    let data = serialize(form);
    return;
    let xhr = new XMLHttpRequest();
    let url = "/mail/mail.php";

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      let activePopup = document.querySelector(".popup.is-active");

      if (activePopup) {
        activePopup.classList.remove("is-active");
      } else {
        myLib.toggleScroll();
      }

      if (xhr.response === "success") {
        document.querySelector("popup-thanks").classList.add("is-active");
      } else {
        document.querySelector("popup-error").classList.add("is-active");
      }
      form.reset();
    };

    xhr.send(data);
  };

  for (let i = 0; i < forms.length; i += 1) {
    forms[i].addEventListener("submit", function (e) {
      e.preventDefault();
      let form = e.currentTarget;
      formSend(form);
    });
  }
})();

/* form */

/* ############################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################ */

/* header */
(function () {
  if (window.matchMedia("(max-width:992px)").matches) {
    return;
  }

  let headerPage = document.querySelector(".header-page");

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 0) {
      headerPage.classList.add("is-active");
    } else {
      headerPage.classList.remove("is-active");
    }
  });
})();

/* header */

/* ############################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################ */

/* library */
(function () {
  window.myLib = {};

  window.myLib.body = document.querySelector("body");

  window.myLib.closesAttr = function (item, attr) {
    let node = item;

    while (node) {
      let attrValue = node.getAttribute(attr);
      if (attrValue) {
        return attrValue;
      }
      node = node.parentElement;
    }
    return null;
  };

  window.myLib.closesItemByClass = function (item, className) {
    let node = item;

    while (node) {
      if (node.classList.contains(className)) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  };

  window.myLib.toggleScroll = function () {
    myLib.body.classList.toggle("no-scroll");
  };
})();

/* library */

/* ############################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################ */

/* popup */
(function () {
  let showPopup = function (target) {
    target.classList.add("popup-is-active");
  };
  let closePopup = function (target) {
    target.classList.remove("popup-is-active");
  };
  myLib.body.addEventListener("click", function (e) {
    let target = e.target;
    let popupClass = myLib.closesAttr(target, "data-popup");

    if (popupClass === null) {
      return;
    }
    e.preventDefault();
    let popup = document.querySelector("." + popupClass);
    if (popup) {
      showPopup(popup);
      myLib.toggleScroll();
    }
  });
  myLib.body.addEventListener("keydown", function (e) {
    if (e.keyCode !== 27) {
      return;
    }
    let popup = document.querySelector(".popup-is-active");
    if (popup) {
      closePopup(popup);
      myLib.toggleScroll();
    }
  });
  myLib.body.addEventListener("click", function (e) {
    let target = e.target;
    if (
      target.classList.contains("popup-close") ||
      target.classList.contains("popup-inner")
    ) {
      let popup = myLib.closesItemByClass(target, "popup");
      closePopup(popup);
      myLib.toggleScroll();
    }
  });
})();

/* popup */

/* ############################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################ */

/* product */
(function () {
  let catalog = document.querySelector(".catalog");

  if (catalog === null) {
    return;
  }

  let updateProductPrice = function (product, price) {
    let productPrice = product.querySelector(".product-price-value");
    productPrice.textContent = price;
  };

  let changeProductSize = function (target) {
    let product = myLib.closesItemByClass(target, "product");
    let previousBtnActive = product.querySelector(".product-size.is-active");
    let newPrice = target.getAttribute("data-product-size-price");

    previousBtnActive.classList.remove("is-active");
    target.classList.add("is-active");
    updateProductPrice(product, newPrice);
  };
  let changeProductOrderInfo = function (target) {
    let product = myLib.closesItemByClass(target, "product");
    let order = document.querySelector(".popup-order");

    let productTitle = product.querySelector(".product-title").textContent;
    let productSize = product.querySelector(".product-size.is-active")
      .textContent;
    let productPrice = product.querySelector(".product-price-value")
      .textContent;
    let productImgSrc = product
      .querySelector(".product-img")
      .getAttribute("src");

    order
      .querySelector(".order-info-title")
      .setAttribute("value", productTitle);
    order.querySelector(".order-info-size").setAttribute("value", productSize);
    order
      .querySelector(".order-info-price")
      .setAttribute("value", productPrice);

    order.querySelector(".order-product-title").textContent = productTitle;
    order.querySelector(".order-product-price").textContent = productPrice;
    order.querySelector(".order-size").textContent = productSize;
    order.querySelector(".order-img").setAttribute("src", productImgSrc);
  };

  catalog.addEventListener("click", function (e) {
    let target = e.target;

    if (target.classList.contains("product-size")) {
      e.preventDefault();
      changeProductSize(target);
    }

    if (target.classList.contains("product-btn")) {
      e.preventDefault();
      changeProductOrderInfo(target);
    }
  });
})();

/* product */

/* ############################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################ */

/* scrollTo */
(function () {
  let scroll = function (target) {
    let targetTop = target.getBoundingClientRect().top;
    let scrollTop = window.pageYOffset;
    let targetOffsetTop = targetTop + scrollTop;

    window.scrollTo(0, targetOffsetTop);
  };

  myLib.body.addEventListener("click", function (e) {
    let target = e.target;
    let scrollToItemClass = myLib.closesAttr(target, "data-scroll-to");

    if (scrollToItemClass === null) {
      return;
    }
    e.preventDefault();
    let scrollToItem = document.querySelector("." + scrollToItemClass);

    if (scrollToItem) {
      scroll(scrollToItem);
    }
  });
})();

/* scrollTo */

/* ############################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################ */
