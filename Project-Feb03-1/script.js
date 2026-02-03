/**
 * ===================================================================
 * QUẢN LÝ SẢN PHẨM - Demo Constructor Function & Array Methods (ES6)
 * ===================================================================
 * File: script.js
 * Mô tả: Triển khai các chức năng quản lý sản phẩm sử dụng 
 *        Constructor Function và các Array Methods của JavaScript
 */

// ===================================================================
// 1. CONSTRUCTOR FUNCTION - Tạo đối tượng Product
// ===================================================================
/**
 * Constructor function để tạo đối tượng sản phẩm
 * @param {number} id - Mã sản phẩm
 * @param {string} name - Tên sản phẩm
 * @param {number} price - Giá sản phẩm (VNĐ)
 * @param {number} quantity - Số lượng trong kho
 * @param {string} category - Danh mục sản phẩm
 * @param {boolean} isAvailable - Trạng thái còn bán hay không
 */
function Product(id, name, price, quantity, category, isAvailable) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.isAvailable = isAvailable;
}

// ===================================================================
// 2. KHỞI TẠO DỮ LIỆU MẪU - Mảng products với ít nhất 6 sản phẩm
// ===================================================================
/**
 * Dữ liệu gốc - được sử dụng để reset
 * Bao gồm:
 * - Ít nhất 2 danh mục: "Electronics", "Accessories", "Home Appliances"
 * - Ít nhất 1 sản phẩm có giá > 30,000,000 VNĐ (để test câu 5)
 * - Sản phẩm "Accessories" với isAvailable = false (để test câu 6)
 */
const originalProducts = [
    new Product(1, "iPhone 15 Pro Max", 34990000, 15, "Electronics", true),
    new Product(2, "Samsung Galaxy S24 Ultra", 31990000, 8, "Electronics", true),
    new Product(3, "AirPods Pro 2", 6790000, 25, "Accessories", true),
    new Product(4, "Ốp lưng iPhone", 350000, 0, "Accessories", false), // quantity = 0, isAvailable = false
    new Product(5, "MacBook Pro M3", 52990000, 5, "Electronics", true), // price > 30M
    new Product(6, "Cáp sạc USB-C", 250000, 100, "Accessories", true),
    new Product(7, "Máy lọc không khí Xiaomi", 3500000, 12, "Home Appliances", true),
    new Product(8, "Robot hút bụi", 8990000, 0, "Home Appliances", false) // quantity = 0
];

// Deep copy để tạo mảng products làm việc
let products = JSON.parse(JSON.stringify(originalProducts));

// ===================================================================
// UTILITY FUNCTIONS - Các hàm tiện ích
// ===================================================================

/**
 * Định dạng số tiền theo chuẩn Việt Nam
 * Sử dụng Intl.NumberFormat để format currency
 * @param {number} amount - Số tiền cần định dạng
 * @returns {string} - Chuỗi tiền tệ đã định dạng
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

/**
 * Định dạng số với dấu phân cách hàng nghìn
 * @param {number} num - Số cần định dạng
 * @returns {string} - Chuỗi số đã định dạng
 */
function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Lấy text trạng thái sản phẩm
 * @param {boolean} isAvailable - Trạng thái
 * @returns {string} - Text hiển thị
 */
function getStatusText(isAvailable) {
    return isAvailable ? "Đang bán" : "Ngưng bán";
}

/**
 * Lấy class CSS cho trạng thái
 * @param {boolean} isAvailable - Trạng thái
 * @returns {string} - CSS class name
 */
function getStatusClass(isAvailable) {
    return isAvailable ? "status-available" : "status-unavailable";
}

// ===================================================================
// 3. RENDER BẢNG SẢN PHẨM
// ===================================================================
/**
 * Render bảng sản phẩm lên giao diện
 * @param {Array} productList - Danh sách sản phẩm cần hiển thị
 */
function renderProductTable(productList = products) {
    const tbody = document.getElementById('productTableBody');
    
    // Xóa nội dung cũ
    tbody.innerHTML = '';
    
    // Duyệt qua từng sản phẩm và tạo row
    productList.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${formatNumber(product.quantity)}</td>
            <td>${product.category}</td>
            <td><span class="${getStatusClass(product.isAvailable)}">${getStatusText(product.isAvailable)}</span></td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Hiển thị kết quả trong vùng result
 * @param {string} title - Tiêu đề kết quả
 * @param {string} content - Nội dung HTML
 */
function displayResult(title, content) {
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = `
        <h3 class="result-title">${title}</h3>
        <div class="result-content">${content}</div>
    `;
}

// ===================================================================
// CÂU 3: SỬ DỤNG MAP - Tạo mảng mới chỉ chứa {name, price}
// ===================================================================
/**
 * Sử dụng Array.map() để tạo mảng mới chỉ chứa name và price
 * map() tạo một mảng mới với kết quả của việc gọi function cho mỗi phần tử
 */
function handleMap() {
    console.log('=== CÂU 3: Sử dụng map() ===');
    
    // Sử dụng map() để transform mảng products thành mảng mới
    // chỉ chứa 2 thuộc tính: name và price
    const mappedProducts = products.map(product => ({
        name: product.name,
        price: product.price
    }));
    
    console.log('Phương thức: Array.map()');
    console.log('Kết quả:', mappedProducts);
    
    // Tạo HTML table để hiển thị
    let tableHTML = `
        <table class="result-table">
            <thead>
                <tr>
                    <th>Tên sản phẩm</th>
                    <th>Giá (VNĐ)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    mappedProducts.forEach(item => {
        tableHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${formatCurrency(item.price)}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    
    displayResult('📋 Câu 3: Map - Danh sách {name, price}', tableHTML);
}

// ===================================================================
// CÂU 4: SỬ DỤNG FILTER - Lọc sản phẩm còn hàng (quantity > 0)
// ===================================================================
/**
 * Sử dụng Array.filter() để lọc sản phẩm có quantity > 0
 * filter() tạo mảng mới với các phần tử thỏa mãn điều kiện
 */
function handleFilterQuantity() {
    console.log('=== CÂU 4: Sử dụng filter() ===');
    
    // Sử dụng filter() để lọc các sản phẩm có số lượng > 0
    const inStockProducts = products.filter(product => product.quantity > 0);
    
    console.log('Phương thức: Array.filter()');
    console.log('Điều kiện: quantity > 0');
    console.log('Số sản phẩm còn hàng:', inStockProducts.length);
    console.log('Kết quả:', inStockProducts);
    
    // Tạo HTML list để hiển thị
    let listHTML = `<p><strong>Tìm thấy ${inStockProducts.length} sản phẩm còn hàng:</strong></p><ul class="result-list">`;
    
    inStockProducts.forEach(product => {
        listHTML += `
            <li>
                <strong>${product.name}</strong> - 
                Số lượng: ${formatNumber(product.quantity)} - 
                Giá: ${formatCurrency(product.price)}
            </li>
        `;
    });
    
    listHTML += '</ul>';
    
    displayResult('🔍 Câu 4: Filter - Sản phẩm còn hàng (quantity > 0)', listHTML);
}

// ===================================================================
// CÂU 5: SỬ DỤNG SOME - Kiểm tra có sản phẩm nào giá > 30 triệu?
// ===================================================================
/**
 * Sử dụng Array.some() để kiểm tra có ít nhất 1 sản phẩm giá > 30M
 * some() trả về true nếu có ít nhất 1 phần tử thỏa mãn điều kiện
 */
function handleSomePrice() {
    console.log('=== CÂU 5: Sử dụng some() ===');
    
    const threshold = 30000000; // 30 triệu VNĐ
    
    // Sử dụng some() để kiểm tra có sản phẩm nào giá > 30 triệu không
    const hasExpensiveProduct = products.some(product => product.price > threshold);
    
    console.log('Phương thức: Array.some()');
    console.log('Điều kiện: price > 30,000,000 VNĐ');
    console.log('Kết quả:', hasExpensiveProduct);
    
    // Tìm các sản phẩm thỏa mãn để hiển thị chi tiết
    const expensiveProducts = products.filter(product => product.price > threshold);
    
    let resultHTML = `
        <p><strong>Có sản phẩm nào giá > ${formatCurrency(threshold)}?</strong></p>
        <div class="result-boolean ${hasExpensiveProduct ? 'result-true' : 'result-false'}">
            ${hasExpensiveProduct ? '✓ CÓ' : '✗ KHÔNG'}
        </div>
    `;
    
    if (hasExpensiveProduct) {
        resultHTML += `<p><strong>Danh sách sản phẩm giá > 30 triệu:</strong></p><ul class="result-list">`;
        expensiveProducts.forEach(product => {
            resultHTML += `<li><strong>${product.name}</strong> - ${formatCurrency(product.price)}</li>`;
        });
        resultHTML += '</ul>';
        console.log('Sản phẩm giá > 30 triệu:', expensiveProducts.map(p => p.name));
    }
    
    displayResult('💰 Câu 5: Some - Kiểm tra giá > 30 triệu', resultHTML);
}

// ===================================================================
// CÂU 6: SỬ DỤNG EVERY - Tất cả Accessories có available không?
// ===================================================================
/**
 * Sử dụng Array.every() để kiểm tra tất cả sản phẩm Accessories có isAvailable = true
 * every() trả về true nếu TẤT CẢ phần tử thỏa mãn điều kiện
 */
function handleEveryAccessories() {
    console.log('=== CÂU 6: Sử dụng every() ===');
    
    // Lọc các sản phẩm thuộc category "Accessories"
    const accessories = products.filter(product => product.category === "Accessories");
    
    // Sử dụng every() để kiểm tra tất cả đều isAvailable = true
    const allAvailable = accessories.every(product => product.isAvailable === true);
    
    console.log('Phương thức: Array.every()');
    console.log('Điều kiện: Tất cả Accessories có isAvailable === true');
    console.log('Số lượng Accessories:', accessories.length);
    console.log('Kết quả:', allAvailable);
    
    let resultHTML = `
        <p><strong>Tất cả sản phẩm "Accessories" có đang được bán (isAvailable = true)?</strong></p>
        <div class="result-boolean ${allAvailable ? 'result-true' : 'result-false'}">
            ${allAvailable ? '✓ TẤT CẢ ĐỀU CÓ' : '✗ KHÔNG PHẢI TẤT CẢ'}
        </div>
        <p><strong>Danh sách sản phẩm Accessories (${accessories.length} sản phẩm):</strong></p>
        <ul class="result-list">
    `;
    
    accessories.forEach(product => {
        const statusIcon = product.isAvailable ? '✅' : '❌';
        resultHTML += `
            <li>
                ${statusIcon} <strong>${product.name}</strong> - 
                Trạng thái: ${getStatusText(product.isAvailable)}
            </li>
        `;
    });
    
    resultHTML += '</ul>';
    
    displayResult('🎧 Câu 6: Every - Kiểm tra Accessories', resultHTML);
}

// ===================================================================
// CÂU 7: SỬ DỤNG REDUCE - Tính tổng giá trị kho
// ===================================================================
/**
 * Sử dụng Array.reduce() để tính tổng giá trị kho = sum(price * quantity)
 * reduce() gộp mảng thành một giá trị duy nhất
 */
function handleReduceTotal() {
    console.log('=== CÂU 7: Sử dụng reduce() ===');
    
    // Sử dụng reduce() để tính tổng giá trị kho
    // Công thức: Tổng = sum(price * quantity) cho tất cả sản phẩm
    const totalValue = products.reduce((accumulator, product) => {
        return accumulator + (product.price * product.quantity);
    }, 0); // 0 là giá trị khởi tạo của accumulator
    
    console.log('Phương thức: Array.reduce()');
    console.log('Công thức: sum(price * quantity)');
    console.log('Tổng giá trị kho:', totalValue);
    
    // Hiển thị chi tiết tính toán
    let detailHTML = '<p><strong>Chi tiết tính toán:</strong></p><ul class="result-list">';
    
    products.forEach(product => {
        const lineValue = product.price * product.quantity;
        detailHTML += `
            <li>
                ${product.name}: ${formatCurrency(product.price)} × ${formatNumber(product.quantity)} = 
                <strong>${formatCurrency(lineValue)}</strong>
            </li>
        `;
    });
    
    detailHTML += '</ul>';
    
    let resultHTML = `
        <p><strong>Tổng giá trị kho hàng:</strong></p>
        <div class="result-total">${formatCurrency(totalValue)}</div>
        ${detailHTML}
    `;
    
    displayResult('💵 Câu 7: Reduce - Tổng giá trị kho', resultHTML);
}

// ===================================================================
// CÂU 8: SỬ DỤNG FOR...OF - Duyệt sản phẩm
// ===================================================================
/**
 * Sử dụng for...of để duyệt qua mảng products
 * for...of duyệt qua các giá trị của iterable object
 */
function handleForOf() {
    console.log('=== CÂU 8: Sử dụng for...of ===');
    console.log('Cú pháp: for (const product of products)');
    
    let resultHTML = '<p><strong>Duyệt sản phẩm bằng for...of:</strong></p><ul class="result-list">';
    
    // Sử dụng for...of để duyệt qua từng sản phẩm trong mảng
    for (const product of products) {
        const status = product.isAvailable ? "Đang bán" : "Ngưng bán";
        const line = `${product.name} – ${product.category} – ${status}`;
        
        console.log(line);
        
        resultHTML += `
            <li>
                <strong>${product.name}</strong> – 
                <em>${product.category}</em> – 
                <span class="${getStatusClass(product.isAvailable)}">${status}</span>
            </li>
        `;
    }
    
    resultHTML += '</ul>';
    
    displayResult('🔄 Câu 8: For...of - Duyệt sản phẩm', resultHTML);
}

// ===================================================================
// CÂU 9: SỬ DỤNG FOR...IN - Duyệt thuộc tính của object
// ===================================================================
/**
 * Sử dụng for...in để duyệt qua các thuộc tính của một product
 * for...in duyệt qua các key (tên thuộc tính) của object
 */
function handleForIn() {
    console.log('=== CÂU 9: Sử dụng for...in ===');
    console.log('Cú pháp: for (const key in object)');
    
    // Lấy sản phẩm đầu tiên làm mẫu
    const sampleProduct = products[0];
    
    let resultHTML = `
        <p><strong>Duyệt thuộc tính của sản phẩm đầu tiên (${sampleProduct.name}) bằng for...in:</strong></p>
        <div class="property-list">
    `;
    
    // Sử dụng for...in để duyệt qua các thuộc tính của object
    for (const key in sampleProduct) {
        // Kiểm tra thuộc tính thuộc về object (không phải prototype)
        if (sampleProduct.hasOwnProperty(key)) {
            let displayValue = sampleProduct[key];
            
            // Format giá trị hiển thị dựa trên loại thuộc tính
            if (key === 'price') {
                displayValue = formatCurrency(sampleProduct[key]);
            } else if (key === 'isAvailable') {
                displayValue = sampleProduct[key] ? 'Có (true)' : 'Không (false)';
            } else if (key === 'quantity') {
                displayValue = formatNumber(sampleProduct[key]);
            }
            
            console.log(`${key}: ${sampleProduct[key]}`);
            
            resultHTML += `
                <div class="property-item">
                    <span class="property-key">${key}:</span>
                    <span class="property-value">${displayValue}</span>
                </div>
            `;
        }
    }
    
    resultHTML += '</div>';
    
    displayResult('🔑 Câu 9: For...in - Thuộc tính của Product[0]', resultHTML);
}

// ===================================================================
// CÂU 10: LỌC SẢN PHẨM ĐANG BÁN VÀ CÒN HÀNG
// ===================================================================
/**
 * Lọc và hiển thị tên các sản phẩm có isAvailable = true VÀ quantity > 0
 * Kết hợp filter() và map()
 */
function handleAvailableInStock() {
    console.log('=== CÂU 10: Sản phẩm đang bán và còn hàng ===');
    
    // Sử dụng filter() để lọc sản phẩm thỏa mãn cả 2 điều kiện
    // Sau đó dùng map() để lấy tên
    const availableInStock = products
        .filter(product => product.isAvailable === true && product.quantity > 0)
        .map(product => product.name);
    
    console.log('Phương thức: Array.filter() + Array.map()');
    console.log('Điều kiện: isAvailable === true && quantity > 0');
    console.log('Kết quả:', availableInStock);
    
    let resultHTML = `
        <p><strong>Điều kiện:</strong> isAvailable = true VÀ quantity > 0</p>
        <p><strong>Tìm thấy ${availableInStock.length} sản phẩm:</strong></p>
        <ul class="result-list">
    `;
    
    availableInStock.forEach((name, index) => {
        resultHTML += `<li><strong>${index + 1}.</strong> ${name}</li>`;
    });
    
    resultHTML += '</ul>';
    
    displayResult('✅ Câu 10: Sản phẩm đang bán & còn hàng', resultHTML);
}

// ===================================================================
// RESET FUNCTION - Khôi phục dữ liệu gốc
// ===================================================================
/**
 * Reset mảng products về trạng thái ban đầu
 * Sử dụng deep copy để tránh reference issues
 */
function handleReset() {
    console.log('=== RESET: Khôi phục dữ liệu gốc ===');
    
    // Deep copy từ originalProducts
    products = JSON.parse(JSON.stringify(originalProducts));
    
    // Render lại bảng
    renderProductTable();
    
    // Xóa vùng kết quả
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = '<p class="placeholder">Dữ liệu đã được reset! Nhấn vào các nút để xem kết quả...</p>';
    
    console.log('Đã reset products về trạng thái ban đầu');
    console.log('Số lượng sản phẩm:', products.length);
}

// ===================================================================
// EVENT LISTENERS - Gắn sự kiện cho các nút
// ===================================================================
/**
 * Khởi tạo các event listeners khi DOM đã load xong
 */
function initEventListeners() {
    // Gắn sự kiện cho từng nút
    document.getElementById('btnMap').addEventListener('click', handleMap);
    document.getElementById('btnFilterQuantity').addEventListener('click', handleFilterQuantity);
    document.getElementById('btnSomePrice').addEventListener('click', handleSomePrice);
    document.getElementById('btnEveryAccessories').addEventListener('click', handleEveryAccessories);
    document.getElementById('btnReduceTotal').addEventListener('click', handleReduceTotal);
    document.getElementById('btnForOf').addEventListener('click', handleForOf);
    document.getElementById('btnForIn').addEventListener('click', handleForIn);
    document.getElementById('btnAvailableInStock').addEventListener('click', handleAvailableInStock);
    document.getElementById('btnReset').addEventListener('click', handleReset);
}

// ===================================================================
// INITIALIZATION - Khởi tạo ứng dụng
// ===================================================================
/**
 * Hàm khởi tạo chính - chạy khi DOM đã sẵn sàng
 */
function init() {
    console.log('🚀 Khởi tạo ứng dụng Quản lý Sản phẩm');
    console.log('Số lượng sản phẩm:', products.length);
    
    // Render bảng sản phẩm
    renderProductTable();
    
    // Gắn event listeners
    initEventListeners();
    
    console.log('✅ Ứng dụng đã sẵn sàng!');
}

// Chờ DOM load xong rồi khởi tạo
document.addEventListener('DOMContentLoaded', init);

// ===================================================================
// UNIT TESTS - Tự kiểm thử các chức năng
// ===================================================================
/**
 * Chạy các unit test cơ bản để kiểm tra dữ liệu mẫu
 */
function runUnitTests() {
    console.log('\n');
    console.log('========================================');
    console.log('🧪 BẮT ĐẦU UNIT TESTS');
    console.log('========================================\n');
    
    // Test 1: Kiểm tra Constructor Function
    console.log('📌 Test 1: Constructor Function');
    const testProduct = new Product(99, 'Test Product', 1000000, 10, 'Test', true);
    console.log('  - Tạo product mới:', testProduct);
    console.log('  - Kết quả: ' + (testProduct.name === 'Test Product' ? '✅ PASS' : '❌ FAIL'));
    
    // Test 2: Kiểm tra số lượng sản phẩm >= 6
    console.log('\n📌 Test 2: Số lượng sản phẩm >= 6');
    console.log('  - Số sản phẩm hiện tại:', products.length);
    console.log('  - Kết quả: ' + (products.length >= 6 ? '✅ PASS' : '❌ FAIL'));
    
    // Test 3: Kiểm tra có ít nhất 2 danh mục
    console.log('\n📌 Test 3: Có ít nhất 2 danh mục');
    const categories = [...new Set(products.map(p => p.category))];
    console.log('  - Các danh mục:', categories);
    console.log('  - Kết quả: ' + (categories.length >= 2 ? '✅ PASS' : '❌ FAIL'));
    
    // Test 4: Kiểm tra có sản phẩm giá > 30 triệu (cho câu 5)
    console.log('\n📌 Test 4: Có sản phẩm giá > 30 triệu');
    const hasExpensive = products.some(p => p.price > 30000000);
    const expensiveProducts = products.filter(p => p.price > 30000000).map(p => p.name);
    console.log('  - Sản phẩm > 30 triệu:', expensiveProducts);
    console.log('  - Kết quả: ' + (hasExpensive ? '✅ PASS' : '❌ FAIL'));
    
    // Test 5: Kiểm tra có Accessories với isAvailable = false (cho câu 6)
    console.log('\n📌 Test 5: Có Accessories với isAvailable = false');
    const accessories = products.filter(p => p.category === 'Accessories');
    const hasUnavailableAccessory = accessories.some(p => !p.isAvailable);
    console.log('  - Số Accessories:', accessories.length);
    console.log('  - Có Accessories unavailable:', hasUnavailableAccessory);
    console.log('  - Kết quả: ' + (hasUnavailableAccessory ? '✅ PASS' : '❌ FAIL'));
    
    // Test 6: Kiểm tra map() function
    console.log('\n📌 Test 6: Array.map()');
    const mapped = products.map(p => ({ name: p.name, price: p.price }));
    console.log('  - Mapped array (3 phần tử đầu):', mapped.slice(0, 3));
    console.log('  - Kết quả: ' + (mapped.length === products.length && mapped[0].name && mapped[0].price ? '✅ PASS' : '❌ FAIL'));
    
    // Test 7: Kiểm tra filter() function
    console.log('\n📌 Test 7: Array.filter()');
    const filtered = products.filter(p => p.quantity > 0);
    console.log('  - Sản phẩm có quantity > 0:', filtered.length);
    console.log('  - Kết quả: ' + (filtered.every(p => p.quantity > 0) ? '✅ PASS' : '❌ FAIL'));
    
    // Test 8: Kiểm tra reduce() function
    console.log('\n📌 Test 8: Array.reduce()');
    const total = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    console.log('  - Tổng giá trị kho:', formatCurrency(total));
    console.log('  - Kết quả: ' + (typeof total === 'number' && total > 0 ? '✅ PASS' : '❌ FAIL'));
    
    // Test 9: Kiểm tra some() function
    console.log('\n📌 Test 9: Array.some()');
    const someResult = products.some(p => p.price > 30000000);
    console.log('  - Có sản phẩm > 30 triệu:', someResult);
    console.log('  - Kết quả: ' + (someResult === true ? '✅ PASS' : '❌ FAIL'));
    
    // Test 10: Kiểm tra every() function
    console.log('\n📌 Test 10: Array.every()');
    const everyResult = accessories.every(p => p.isAvailable);
    console.log('  - Tất cả Accessories available:', everyResult);
    console.log('  - Kết quả: ' + (everyResult === false ? '✅ PASS (expected false)' : '❌ FAIL'));
    
    console.log('\n========================================');
    console.log('🏁 KẾT THÚC UNIT TESTS');
    console.log('========================================\n');
}

// Chạy unit tests khi script load (sau khi DOM ready)
document.addEventListener('DOMContentLoaded', () => {
    // Delay một chút để tách biệt với log khởi tạo
    setTimeout(runUnitTests, 100);
});
