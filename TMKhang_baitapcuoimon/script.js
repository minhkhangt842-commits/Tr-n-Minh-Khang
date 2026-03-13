// Quản lý trạng thái giỏ hàng
let cart = [];

// 1. Các phần tử DOM cần thiết
const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const icon = menuToggle.querySelector('i');

const cartModal = document.getElementById('cart-modal');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalAmount = document.getElementById('total-amount');

// 2. Xử lý Menu Mobile
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'initial';
});

// Đóng menu khi bấm vào link
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
        document.body.style.overflow = 'initial';
    });
});

// 3. Xử lý Giỏ Hàng (Đóng/Mở)
openCartBtn.onclick = () => {
    cartModal.style.display = 'block';
};

closeCartBtn.onclick = () => {
    cartModal.style.display = 'none';
};

// Đóng giỏ hàng khi click ra ngoài vùng xám
window.onclick = (event) => {
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
};

// 4. Logic Thêm sản phẩm
document.querySelectorAll('.add-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').innerText;
        const productPrice = productCard.querySelector('.price').innerText;
        const productImg = productCard.querySelector('.product-img').src;

        addToCart(productName, productPrice, productImg);
    });
});

function addToCart(name, price, img) {
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }
    
    updateCartUI();
    
    // Mở giỏ hàng ngay khi thêm để người dùng thấy
    cartModal.style.display = 'block';
}

function updateCartUI() {
    // Cập nhật số lượng trên icon giỏ hàng (tổng số lượng các món)
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Hiển thị danh sách sản phẩm trong giỏ
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px;">Giỏ hàng trống</p>';
        totalAmount.innerText = '0đ';
        return;
    }

    let itemsHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        // Render từng món trong giỏ
        itemsHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} x ${item.quantity}</p>
                </div>
            </div>
        `;
        
        // Tính tiền: Chuyển "25.000.000đ" -> 25000000
        let priceValue = parseInt(item.price.replace(/\./g, '').replace('đ', ''));
        totalPrice += priceValue * item.quantity;
    });

    cartItemsContainer.innerHTML = itemsHTML;
    totalAmount.innerText = totalPrice.toLocaleString('vi-VN') + 'đ';
}