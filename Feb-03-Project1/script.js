/*
 * Bài tập: Quản lý sản phẩm với Array Methods
 * Môn: Ngôn ngữ phát triển ứng dụng
 * 
 * Yêu cầu: Dùng Constructor Function + các phương thức mảng ES6
 */

// ============================================
// PHẦN 1: Constructor Function tạo Product
// ============================================

// Hàm khởi tạo đối tượng sản phẩm (không dùng class theo yêu cầu đề)
function Product(id, name, price, quantity, category, isAvailable) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.isAvailable = isAvailable;
}

// ============================================
// PHẦN 2: Dữ liệu mẫu - tạo sẵn 8 sản phẩm
// ============================================

/*
 * Lưu ý khi tạo data mẫu:
 * - Phải có ít nhất 2 category khác nhau
 * - Có sản phẩm giá > 30 triệu (để test câu 5)
 * - Có Accessories mà isAvailable = false (để test câu 6)
 * - Có sản phẩm hết hàng quantity = 0
 */
const originalProducts = [
    new Product(1, "iPhone 15 Pro Max", 34990000, 15, "Electronics", true),
    new Product(2, "Samsung Galaxy S24 Ultra", 31990000, 8, "Electronics", true),
    new Product(3, "AirPods Pro 2", 6790000, 25, "Accessories", true),
    new Product(4, "Ốp lưng iPhone", 350000, 0, "Accessories", false),  // hết hàng + ngưng bán
    new Product(5, "MacBook Pro M3", 52990000, 5, "Electronics", true), // cái này > 30 triệu
    new Product(6, "Cáp sạc USB-C", 250000, 100, "Accessories", true),
    new Product(7, "Máy lọc không khí Xiaomi", 3500000, 12, "Home Appliances", true),
    new Product(8, "Robot hút bụi", 8990000, 0, "Home Appliances", false) // hết hàng
];

// Copy mảng gốc để làm việc (tránh thay đổi data gốc)
let products = JSON.parse(JSON.stringify(originalProducts));

// ============================================
// Các hàm helper - format hiển thị
// ============================================

// Format tiền VNĐ cho dễ đọc (dùng Intl.NumberFormat theo yêu cầu)
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Format số có dấu phẩy phân cách
function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
}

// Trả về text trạng thái
function getStatusText(isAvailable) {
    return isAvailable ? "Đang bán" : "Ngưng bán";
}

// Trả về class css tương ứng
function getStatusClass(isAvailable) {
    return isAvailable ? "status-available" : "status-unavailable";
}

// ============================================
// PHẦN 3: Render bảng sản phẩm ra HTML
// ============================================

// Hàm render bảng - nhận vào mảng products
function renderProductTable(productList = products) {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = ''; // xóa cũ đi
    
    // Dùng forEach duyệt qua từng sp rồi tạo row
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

// Hàm hiển thị kết quả vào vùng result
function displayResult(title, content) {
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = `
        <h3 class="result-title">${title}</h3>
        <div class="result-content">${content}</div>
    `;
}

// ============================================
// CÂU 3: Dùng map() - tạo mảng {name, price}
// ============================================

function handleMap() {
    console.log('--- Câu 3: map() ---');
    
    /*
     * map() sẽ duyệt qua từng phần tử và trả về mảng mới
     * Ở đây mình chỉ lấy 2 thuộc tính name và price thôi
     */
    const mappedProducts = products.map(product => ({
        name: product.name,
        price: product.price
    }));
    
    console.log('Dùng: Array.map()');
    console.log('Kết quả:', mappedProducts);
    
    // Tạo bảng HTML để hiển thị
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

// ============================================
// CÂU 4: Dùng filter() - lọc sp còn hàng
// ============================================

function handleFilterQuantity() {
    console.log('--- Câu 4: filter() ---');
    
    /*
     * filter() trả về mảng mới chỉ chứa các phần tử thỏa điều kiện
     * Ở đây lọc những sp có quantity > 0 (còn hàng)
     */
    const inStockProducts = products.filter(product => product.quantity > 0);
    
    console.log('Dùng: Array.filter()');
    console.log('Điều kiện: quantity > 0');
    console.log('Tìm được:', inStockProducts.length, 'sản phẩm');
    console.log('Kết quả:', inStockProducts);
    
    // Tạo danh sách hiển thị
    let listHTML = `<p><strong>Có ${inStockProducts.length} sản phẩm còn hàng:</strong></p><ul class="result-list">`;
    
    inStockProducts.forEach(product => {
        listHTML += `
            <li>
                <strong>${product.name}</strong> - 
                SL: ${formatNumber(product.quantity)} - 
                Giá: ${formatCurrency(product.price)}
            </li>
        `;
    });
    
    listHTML += '</ul>';
    
    displayResult('🔍 Câu 4: Filter - Sản phẩm còn hàng (quantity > 0)', listHTML);
}

// ============================================
// CÂU 5: Dùng some() - có sp nào > 30 triệu?
// ============================================

function handleSomePrice() {
    console.log('--- Câu 5: some() ---');
    
    const nguong = 30000000; // 30 triệu
    
    /*
     * some() trả về true nếu CÓ ÍT NHẤT 1 phần tử thỏa điều kiện
     * Khác với every() là phải TẤT CẢ thỏa mãn
     */
    const coSpDat = products.some(product => product.price > nguong);
    
    console.log('Dùng: Array.some()');
    console.log('Check: price > 30 triệu');
    console.log('Kết quả:', coSpDat);
    
    // Tìm luôn danh sách sp > 30tr để hiển thị
    const danhSachDat = products.filter(product => product.price > nguong);
    
    let resultHTML = `
        <p><strong>Có sp nào giá > ${formatCurrency(nguong)} không?</strong></p>
        <div class="result-boolean ${coSpDat ? 'result-true' : 'result-false'}">
            ${coSpDat ? '✓ CÓ' : '✗ KHÔNG'}
        </div>
    `;
    
    if (coSpDat) {
        resultHTML += `<p><strong>Danh sách sp > 30 triệu:</strong></p><ul class="result-list">`;
        danhSachDat.forEach(product => {
            resultHTML += `<li><strong>${product.name}</strong> - ${formatCurrency(product.price)}</li>`;
        });
        resultHTML += '</ul>';
        console.log('Các sp > 30tr:', danhSachDat.map(p => p.name));
    }
    
    displayResult('💰 Câu 5: Some - Check giá > 30 triệu', resultHTML);
}

// ============================================
// CÂU 6: Dùng every() - tất cả Accessories available?
// ============================================

function handleEveryAccessories() {
    console.log('--- Câu 6: every() ---');
    
    // Đầu tiên lọc ra các sp thuộc category Accessories
    const accessories = products.filter(product => product.category === "Accessories");
    
    /*
     * every() trả về true nếu TẤT CẢ phần tử đều thỏa điều kiện
     * Nếu có 1 cái false là trả về false luôn
     */
    const tatCaConBan = accessories.every(product => product.isAvailable === true);
    
    console.log('Dùng: Array.every()');
    console.log('Số Accessories:', accessories.length);
    console.log('Tất cả đều available?', tatCaConBan);
    
    let resultHTML = `
        <p><strong>Tất cả Accessories có đang bán không (isAvailable = true)?</strong></p>
        <div class="result-boolean ${tatCaConBan ? 'result-true' : 'result-false'}">
            ${tatCaConBan ? '✓ ĐÚNG - tất cả đều có' : '✗ SAI - có sp ngưng bán'}
        </div>
        <p><strong>DS Accessories (${accessories.length} sp):</strong></p>
        <ul class="result-list">
    `;
    
    accessories.forEach(product => {
        const icon = product.isAvailable ? '✅' : '❌';
        resultHTML += `
            <li>
                ${icon} <strong>${product.name}</strong> - 
                ${getStatusText(product.isAvailable)}
            </li>
        `;
    });
    
    resultHTML += '</ul>';
    
    displayResult('🎧 Câu 6: Every - Check Accessories', resultHTML);
}

// ============================================
// CÂU 7: Dùng reduce() - tính tổng giá trị kho
// ============================================

function handleReduceTotal() {
    console.log('--- Câu 7: reduce() ---');
    
    /*
     * reduce() dùng để gộp mảng thành 1 giá trị
     * Ở đây tính tổng = price * quantity của từng sp
     * accumulator là biến tích lũy, bắt đầu từ 0
     */
    const tongGiaTri = products.reduce((acc, product) => {
        return acc + (product.price * product.quantity);
    }, 0);
    
    console.log('Dùng: Array.reduce()');
    console.log('Công thức: sum(price * quantity)');
    console.log('Tổng:', tongGiaTri);
    
    // Hiển thị chi tiết từng dòng
    let chiTietHTML = '<p><strong>Chi tiết:</strong></p><ul class="result-list">';
    
    products.forEach(product => {
        const giaTriDong = product.price * product.quantity;
        chiTietHTML += `
            <li>
                ${product.name}: ${formatCurrency(product.price)} × ${formatNumber(product.quantity)} = 
                <strong>${formatCurrency(giaTriDong)}</strong>
            </li>
        `;
    });
    
    chiTietHTML += '</ul>';
    
    let resultHTML = `
        <p><strong>Tổng giá trị kho:</strong></p>
        <div class="result-total">${formatCurrency(tongGiaTri)}</div>
        ${chiTietHTML}
    `;
    
    displayResult('💵 Câu 7: Reduce - Tổng giá trị kho', resultHTML);
}

// ============================================
// CÂU 8: Dùng for...of - duyệt mảng
// ============================================

function handleForOf() {
    console.log('--- Câu 8: for...of ---');
    
    let resultHTML = '<p><strong>Duyệt bằng for...of:</strong></p><ul class="result-list">';
    
    /*
     * for...of dùng để duyệt qua các GIÁ TRỊ của mảng
     * Khác với for...in là duyệt qua INDEX/KEY
     * Cú pháp: for (const item of array)
     */
    for (const product of products) {
        const trangThai = product.isAvailable ? "Đang bán" : "Ngưng bán";
        const dong = `${product.name} – ${product.category} – ${trangThai}`;
        
        console.log(dong);
        
        resultHTML += `
            <li>
                <strong>${product.name}</strong> – 
                <em>${product.category}</em> – 
                <span class="${getStatusClass(product.isAvailable)}">${trangThai}</span>
            </li>
        `;
    }
    
    resultHTML += '</ul>';
    
    displayResult('🔄 Câu 8: For...of - Duyệt sản phẩm', resultHTML);
}

// ============================================
// CÂU 9: Dùng for...in - duyệt thuộc tính object
// ============================================

function handleForIn() {
    console.log('--- Câu 9: for...in ---');
    
    // Lấy sp đầu tiên làm mẫu
    const spMau = products[0];
    
    let resultHTML = `
        <p><strong>Duyệt thuộc tính của "${spMau.name}" bằng for...in:</strong></p>
        <div class="property-list">
    `;
    
    /*
     * for...in duyệt qua các KEY (tên thuộc tính) của object
     * Dùng hasOwnProperty để check thuộc tính thuộc về object
     * (không phải từ prototype chain)
     */
    for (const key in spMau) {
        if (spMau.hasOwnProperty(key)) {
            let giaTriHienThi = spMau[key];
            
            // Format lại cho đẹp tùy loại
            if (key === 'price') {
                giaTriHienThi = formatCurrency(spMau[key]);
            } else if (key === 'isAvailable') {
                giaTriHienThi = spMau[key] ? 'Có (true)' : 'Không (false)';
            } else if (key === 'quantity') {
                giaTriHienThi = formatNumber(spMau[key]);
            }
            
            console.log(`${key}: ${spMau[key]}`);
            
            resultHTML += `
                <div class="property-item">
                    <span class="property-key">${key}:</span>
                    <span class="property-value">${giaTriHienThi}</span>
                </div>
            `;
        }
    }
    
    resultHTML += '</div>';
    
    displayResult('🔑 Câu 9: For...in - Thuộc tính của SP[0]', resultHTML);
}

// ============================================
// CÂU 10: Lọc sp đang bán VÀ còn hàng
// ============================================

function handleAvailableInStock() {
    console.log('--- Câu 10: filter + map ---');
    
    /*
     * Kết hợp filter() và map() (method chaining)
     * - filter: lọc sp thỏa 2 điều kiện
     * - map: chỉ lấy tên sp
     */
    const danhSachTen = products
        .filter(product => product.isAvailable === true && product.quantity > 0)
        .map(product => product.name);
    
    console.log('Dùng: filter() + map()');
    console.log('ĐK: isAvailable = true VÀ quantity > 0');
    console.log('Kết quả:', danhSachTen);
    
    let resultHTML = `
        <p><strong>ĐK:</strong> isAvailable = true VÀ quantity > 0</p>
        <p><strong>Có ${danhSachTen.length} sp thỏa mãn:</strong></p>
        <ul class="result-list">
    `;
    
    danhSachTen.forEach((ten, index) => {
        resultHTML += `<li><strong>${index + 1}.</strong> ${ten}</li>`;
    });
    
    resultHTML += '</ul>';
    
    displayResult('✅ Câu 10: SP đang bán & còn hàng', resultHTML);
}

// ============================================
// Nút RESET - khôi phục data gốc
// ============================================

function handleReset() {
    console.log('--- Reset data ---');
    
    // Deep copy lại từ mảng gốc
    products = JSON.parse(JSON.stringify(originalProducts));
    
    // Render lại bảng
    renderProductTable();
    
    // Clear vùng kết quả
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = '<p class="placeholder">Đã reset! Click các nút để xem kết quả...</p>';
    
    console.log('Đã reset về data gốc');
    console.log('Số sp:', products.length);
}

// ============================================
// Gắn event cho các nút
// ============================================

function initEventListeners() {
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

// ============================================
// Hàm init - chạy khi load trang
// ============================================

function init() {
    console.log('App đã load!');
    console.log('Số sản phẩm:', products.length);
    
    renderProductTable();
    initEventListeners();
    
    console.log('Sẵn sàng!');
}

// Chờ DOM load xong rồi mới chạy
document.addEventListener('DOMContentLoaded', init);

// ============================================
// UNIT TEST - kiểm tra data mẫu có đúng ko
// ============================================

function runUnitTests() {
    console.log('\n========================================');
    console.log('CHẠY UNIT TESTS');
    console.log('========================================\n');
    
    // Test 1: Constructor có hoạt động ko
    console.log('Test 1: Constructor Function');
    const testSp = new Product(99, 'Test', 1000000, 10, 'Test', true);
    console.log('  Tạo sp mới:', testSp);
    console.log('  => ' + (testSp.name === 'Test' ? 'PASS ✓' : 'FAIL ✗'));
    
    // Test 2: Đủ 6 sp chưa
    console.log('\nTest 2: Số sp >= 6');
    console.log('  Hiện có:', products.length);
    console.log('  => ' + (products.length >= 6 ? 'PASS ✓' : 'FAIL ✗'));
    
    // Test 3: Có >= 2 category
    console.log('\nTest 3: Có >= 2 category');
    const cats = [...new Set(products.map(p => p.category))];
    console.log('  Các category:', cats);
    console.log('  => ' + (cats.length >= 2 ? 'PASS ✓' : 'FAIL ✗'));
    
    // Test 4: Có sp > 30 triệu (cho câu 5)
    console.log('\nTest 4: Có sp > 30 triệu');
    const coDat = products.some(p => p.price > 30000000);
    const dsDat = products.filter(p => p.price > 30000000).map(p => p.name);
    console.log('  SP > 30tr:', dsDat);
    console.log('  => ' + (coDat ? 'PASS ✓' : 'FAIL ✗'));
    
    // Test 5: Có Accessories unavailable (cho câu 6)
    console.log('\nTest 5: Có Accessories unavailable');
    const accs = products.filter(p => p.category === 'Accessories');
    const coUnavail = accs.some(p => !p.isAvailable);
    console.log('  Số Accessories:', accs.length);
    console.log('  Có unavailable:', coUnavail);
    console.log('  => ' + (coUnavail ? 'PASS ✓' : 'FAIL ✗'));
    
    // Test 6: map() chạy đúng
    console.log('\nTest 6: map()');
    const mapped = products.map(p => ({ name: p.name, price: p.price }));
    console.log('  Kết quả (3 đầu):', mapped.slice(0, 3));
    console.log('  => ' + (mapped.length === products.length ? 'PASS ✓' : 'FAIL ✗'));
    
    // Test 7: filter() chạy đúng
    console.log('\nTest 7: filter()');
    const filtered = products.filter(p => p.quantity > 0);
    console.log('  SP còn hàng:', filtered.length);
    console.log('  => ' + (filtered.every(p => p.quantity > 0) ? 'PASS ✓' : 'FAIL ✗'));
    
    // Test 8: reduce() chạy đúng
    console.log('\nTest 8: reduce()');
    const tong = products.reduce((s, p) => s + (p.price * p.quantity), 0);
    console.log('  Tổng kho:', formatCurrency(tong));
    console.log('  => ' + (typeof tong === 'number' && tong > 0 ? 'PASS ✓' : 'FAIL ✗'));
    
    // Test 9: some() chạy đúng
    console.log('\nTest 9: some()');
    const someKq = products.some(p => p.price > 30000000);
    console.log('  Có sp > 30tr:', someKq);
    console.log('  => ' + (someKq === true ? 'PASS ✓' : 'FAIL ✗'));
    
    // Test 10: every() chạy đúng
    console.log('\nTest 10: every()');
    const everyKq = accs.every(p => p.isAvailable);
    console.log('  Tất cả Accs available:', everyKq);
    console.log('  => ' + (everyKq === false ? 'PASS ✓ (đúng là false)' : 'FAIL ✗'));
    
    console.log('\n========================================');
    console.log('XONG UNIT TESTS');
    console.log('========================================\n');
}

// Chạy test sau khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runUnitTests, 100);
});
