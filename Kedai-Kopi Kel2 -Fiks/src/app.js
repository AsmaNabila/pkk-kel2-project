document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Strawberry Birthday Cake", img: "1.jpg", price: 80000 },
      { id: 2, name: "Chocholate Birthday Cake", img: "2.jpg", price: 100000 },
      { id: 3, name: "Glitters Cupcake", img: "3.jpg", price: 10000 },
      { id: 4, name: "Rainbow Cupcake", img: "4.jpg", price: 8000 },
      { id: 5, name: "Chocolate Cupcake", img: "5.jpg", price: 8000 },
      { id: 6, name: "Oreo Birthday Cake", img: "6.jpg", price: 200000 },
    ],
    currentItem: null,
    setCurrentItem(item) {
      this.currentItem = item;
    },
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      const cartItem = this.items.find((item) => item.id === newItem.id);

      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price; // Corrected line
      } else {
        this.items = this.items.map((item) => {
          if (item.id === newItem.id) {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
          }
          return item;
        });
      }
    },

    remove(id) {
      //ambil item yang mau di remove berrdasar id
      const cartItem = this.items.find((item) => item.id === id);

      //jika item lebih dri 1
      if (cartItem.quantity > 1) {
        //telusuri 1 1
        this.items = this.items.map((item) => {
          //jika bukan barang yang diklik = skip
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        //jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

//form validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

//kirim data ketika tombol checkout di klik
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open("http://wa.me/6289657392319?text=" + encodeURIComponent(message));
});

//format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
  Nama : ${obj.name}
  Email : ${obj.email}
  No Hp : ${obj.phone}
  Alamat : ${obj.alamat}
Data Pesanan 
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.price)}) \n`
  )}
  Total: ${rupiah(obj.total)}
  Terimakasih.`;
};

//konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
