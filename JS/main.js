// Project Variables
// ------------------- Main Page Variables
let products = document.querySelector(".products");
let buyBttns = document.querySelectorAll(".buy"); 
let cart = document.querySelector(".cart");
let basketIc = document.querySelector(".numOfProduct");
let myPurchases = [];
// ------------------- Basket Page Variables
let basketPage = document.querySelector(".basket");
let container = document.querySelector(".basket__container")

cart.style.display = "none";
// Buy Products Event
products.addEventListener("click", item => {
  if (item.target.classList.contains("buy")) {
    // Toggle Done Class Function
    toggleDone(item.target);
    // Add Products To myPurchases Array
    addProductsToMyPurchases(item.target);
    // Remove Products To myPurchases Array
    removeProductsFromMyPurchases(item.target);
    // Add Product To The Basket
    addToBasket(myPurchases);
    // Add myPurchases To Basket Icon
    basketIc.innerText = myPurchases.length;
    // Appear And Disappear Cart
    myPurchases.length === 0 ? cart.style.display = "none" : cart.style.display = "block"; 
  }
});
// Toggle Done & buyDone Class Function
let toggleDone = (item) => {
  item.classList.toggle("done");
  item.nextElementSibling.classList.toggle("buyDone");
}
// Add Products To myPurchases Array
let addProductsToMyPurchases = (item) => {
  buyBttns.forEach((ele, index) => {
    if (ele === item && item.classList.contains("done")) {
      let imgSource = document.querySelector(`.pro-${index + 1} img`).src;
      let prodTitle = document.querySelector(`.pro-${index + 1} h3`).innerText;
      let prodPrice = item.getAttribute("data-price");
      myPurchases.push({
        "id": Date.now(),
        "num": 1,
        "src": imgSource,
        "title": prodTitle,
        "price": prodPrice,
      });
      item.setAttribute("data-id", `${myPurchases[myPurchases.length - 1].id}`);
    }
  });  
}
// Remove Products From My Purchases
let removeProductsFromMyPurchases = (item, productId) => {
  if (productId) {
    myPurchases = myPurchases.filter((arrItem) => {
      return arrItem.id !== +productId; 
    });
    buyBttns.forEach((ele) => {
      if (ele.getAttribute("data-id") === productId) {
        ele.classList.remove("done");
        ele.nextElementSibling.classList.remove("buyDone");
      }
    });
  }
  else {
    buyBttns.forEach((ele) => {
      if (ele === item && !item.classList.contains("done")) {
        myPurchases = myPurchases.filter((arrItem) => {
          return arrItem.id !== +item.getAttribute("data-id"); 
        });
      }
    }); 
  }
}
// Add Products To Basket Page
let addToBasket = (myPurchases) => {
  container.innerHTML = "";
  for (let i = 0; i < myPurchases.length; ++i) {
    container.innerHTML += `
    <div class="basket__product" data-id="${myPurchases[i].id}">
      <div class="bakset__imgandtitle">
        <div class="imgWrapper">
          <img class="basket__product-img" src="${myPurchases[i].src}" alt="IMAGE"/>
        </div>
        <h4 class="basket__imgtitle">${myPurchases[i].title}</h4>
      </div>
      <div class="basket__numberOfProducts">
        <label for="num">Number Of Products</label>
        <div class="custom-num">
          <i class=" arrowup icon-circle-up"></i>   
          <input 
          type="number" 
          id="num" 
          min="1" 
          max="9" 
          value="1" 
          data-color="21d99b"
          />
          <i class="arrowdown icon-circle-down"></i>
        </div>
      </div>
      <div class="btnprice">
        <button class="btn delete">delete</button>
        <span data-price="${myPurchases[i].price}">$${myPurchases[i].price}</span>
      </div>
    </div>
    `;
  }
}
// Open Basket Page
cart.addEventListener("click", _ => {
  basketPage.style = `
    transform: translateX(0);
  `;
  // Calculate The Net Salary Of MyPurchases
  let netSalaryWrapper = document.createElement("div");
  netSalaryWrapper.className = "netSalaryWrapper";
  let netSalaryTitle = document.createElement("h3");
  netSalaryTitle.innerText = "The Net Price Of Your Purchases";
  netSalaryTitle.className = "netSalaryTitle";
  netSalaryWrapper.appendChild(netSalaryTitle);
  let netSalary = document.createElement("div");
  netSalary.className = "net-salary";
  netSalaryWrapper.appendChild(netSalary);
  container.appendChild(netSalaryWrapper);
  let allPrice = () => {
    let sum = 0;
    for (let i = 0; i < myPurchases.length; ++i) {
      sum += +myPurchases[i].num * +myPurchases[i].price;
    }
    netSalary.innerText = sum;
  }
  allPrice();
  // Arrow Up & Arrow Down
  let customNum = document.querySelectorAll(".custom-num");
  customNum.forEach(num => {
    // Main Variables 
    let myInput = num.querySelector("input");
    let arrowUp = num.querySelector(".arrowup");
    let arrowDown = num.querySelector(".arrowdown");
    let price = num.parentElement.parentElement.querySelector("span");
    let deleteBtn = num.parentElement.parentElement.querySelector(".delete");
    // Increment My Purchases
    arrowUp.addEventListener("click", _ => {
      myInput.stepUp();
      price.innerText = `$${+price.dataset.price * +myInput.value}`;
      let pid = +num.parentElement.parentElement.getAttribute("data-id");
      for (let i = 0; i < myPurchases.length; ++i) {
        if (+myPurchases[i].id === pid) {
          myPurchases[i].num = +myInput.value;
        }
      }
      allPrice();
    });
    // Decrement My Purchases
    arrowDown.addEventListener("click", _ => {
      myInput.stepDown();
      price.innerText = `$${+price.dataset.price * +myInput.value}`;
      let pid = +num.parentElement.parentElement.getAttribute("data-id");
      for (let i = 0; i < myPurchases.length; ++i) {
        if (+myPurchases[i].id === pid) {
          myPurchases[i].num = +myInput.value;
        }
      }
      allPrice();
    });
    // Delete A Product From Basket Page
    deleteBtn.addEventListener("click", _ => {
      let productId = num.parentElement.parentElement.getAttribute("data-id");
      removeProductsFromMyPurchases(null, productId);
      num.parentElement.parentElement.remove();
      basketIc.innerText = myPurchases.length;
      allPrice();
      if (myPurchases.length === 0) {
        let noItem = document.createElement("div");
        noItem.className = "noItem";
        noItem.innerText = "No Products To Show";
        container.appendChild(noItem);
        netSalaryWrapper.remove();
        cart.style.display = "none";
      }
    });
  });
});
// Close Basket Page
let close = document.querySelector(".close");
close.addEventListener("click", _ => {
  basketPage.style = `
    transform: translateX(-100vw);
  `;
});