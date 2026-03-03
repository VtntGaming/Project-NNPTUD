// ===== State =====
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 10;
let sortField = null;   // 'title' | 'price' | null
let sortOrder = 'none'; // 'asc' | 'desc' | 'none'

// ===== DOM refs =====
const searchInput = document.getElementById('searchInput');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const tableBody = document.getElementById('tableBody');
const paginationEl = document.getElementById('pagination');
const infoText = document.getElementById('infoText');

// ===== Load Data =====
fetch('https://api.escuelajs.co/api/v1/products')
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        filteredProducts = [...allProducts];
        render();
    })
    .catch(err => {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Lỗi tải dữ liệu: ${err.message}</td></tr>`;
    });

// ===== Events =====
// Search onChange (fires on every keystroke)
searchInput.addEventListener('input', function () {
    const keyword = this.value.trim().toLowerCase();
    filteredProducts = allProducts.filter(p =>
        p.title.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    applySort();
    render();
});

// Page size change
pageSizeSelect.addEventListener('change', function () {
    pageSize = parseInt(this.value);
    currentPage = 1;
    render();
});

// Sort buttons
document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const field = this.dataset.sort;
        const currentOrder = this.dataset.order;

        // Reset all other sort buttons
        document.querySelectorAll('.sort-btn').forEach(b => {
            if (b !== this) {
                b.dataset.order = 'none';
                b.classList.remove('active');
                b.querySelector('i').className = 'bi bi-arrow-down-up';
            }
        });

        // Cycle: none -> asc -> desc -> none
        let newOrder;
        if (currentOrder === 'none') newOrder = 'asc';
        else if (currentOrder === 'asc') newOrder = 'desc';
        else newOrder = 'none';

        this.dataset.order = newOrder;

        // Update icon
        if (newOrder === 'asc') {
            this.querySelector('i').className = 'bi bi-sort-up';
            this.classList.add('active');
        } else if (newOrder === 'desc') {
            this.querySelector('i').className = 'bi bi-sort-down';
            this.classList.add('active');
        } else {
            this.querySelector('i').className = 'bi bi-arrow-down-up';
            this.classList.remove('active');
        }

        sortField = newOrder === 'none' ? null : field;
        sortOrder = newOrder;

        applySort();
        currentPage = 1;
        render();
    });
});

// ===== Sort logic =====
function applySort() {
    if (!sortField || sortOrder === 'none') {
        // Re-filter from allProducts to reset order
        const keyword = searchInput.value.trim().toLowerCase();
        filteredProducts = allProducts.filter(p =>
            p.title.toLowerCase().includes(keyword)
        );
        return;
    }

    filteredProducts.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'title') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        }

        if (sortField === 'price') {
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        }

        return 0;
    });
}

// ===== Render =====
function render() {
    renderTable();
    renderPagination();
    renderInfo();
}

function renderTable() {
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = filteredProducts.slice(start, end);

    if (pageItems.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">
            <i class="bi bi-inbox fs-1 d-block mb-2"></i>Không tìm thấy sản phẩm nào.
        </td></tr>`;
        return;
    }

    tableBody.innerHTML = pageItems.map((p, idx) => {
        const img = (p.images && p.images.length > 0) ? p.images[0] : 'https://via.placeholder.com/50';
        const desc = p.description || '';
        const truncDesc = desc.length > 120 ? desc.substring(0, 120) + '...' : desc;

        return `<tr>
            <td class="text-center">${start + idx + 1}</td>
            <td class="text-center">
                <img src="${img}" alt="${p.title}" class="product-img"
                     onerror="this.src='https://via.placeholder.com/50'">
            </td>
            <td class="fw-semibold">${highlightText(p.title)}</td>
            <td class="text-end">
                <span class="badge bg-success fs-6">$${p.price}</span>
            </td>
            <td>
                <span class="badge bg-info text-dark">${p.category ? p.category.name : 'N/A'}</span>
            </td>
            <td style="min-width:250px">
                <span class="desc-placeholder">Di chuột để xem</span>
                <div class="desc-cell">${truncDesc}</div>
            </td>
        </tr>`;
    }).join('');
}

// Highlight matching search text
function highlightText(text) {
    const keyword = searchInput.value.trim();
    if (!keyword) return text;
    const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }

    let html = '';

    // Previous
    html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo;</a>
             </li>`;

    // Page numbers with ellipsis
    const pages = getPageNumbers(currentPage, totalPages);
    pages.forEach(p => {
        if (p === '...') {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        } else {
            html += `<li class="page-item ${p === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${p}">${p}</a>
                     </li>`;
        }
    });

    // Next
    html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">&raquo;</a>
             </li>`;

    paginationEl.innerHTML = html;

    // Attach events
    paginationEl.querySelectorAll('a.page-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = parseInt(this.dataset.page);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                render();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

// Smart page number generation
function getPageNumbers(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);

    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) pages.push('...');

    pages.push(total);
    return pages;
}

function renderInfo() {
    const total = filteredProducts.length;
    const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);
    infoText.textContent = `Hiển thị ${start}–${end} / ${total} sản phẩm`;
}
