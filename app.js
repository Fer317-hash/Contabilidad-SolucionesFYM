// =============================================================================
// INVENTORY DASHBOARD APPLICATION LOGIC
// =============================================================================

// --- MOCK DEMO DATA ---
const DEMO_PRODUCTS = [
    {
        id: 1,
        nombre: "Laptop Dell Vostro 3520",
        descripcion: "Intel Core i5, 16GB RAM, 512GB SSD, Pantalla 15.6'' FHD",
        stock: 12,
        precioCompra: 540.00,
        precioVenta: 720.00
    },
    {
        id: 2,
        nombre: "Monitor Gamer Asus TUF",
        descripcion: "27'' Curvo, Full HD, 165Hz, 1ms, Freesync Premium",
        stock: 3, // Low stock warning (< 5)
        precioCompra: 180.00,
        precioVenta: 249.99
    },
    {
        id: 3,
        nombre: "Teclado Mecánico Redragon",
        descripcion: "Switch Red, Retroiluminado RGB, Layout Español",
        stock: 0, // Critical stock warning (0)
        precioCompra: 35.00,
        precioVenta: 55.00
    },
    {
        id: 4,
        nombre: "Mouse Inalámbrico Logitech M170",
        descripcion: "Sensor óptico 1000 DPI, Conexión USB 2.4GHz",
        stock: 25,
        precioCompra: 8.50,
        precioVenta: 14.90
    },
    {
        id: 5,
        nombre: "Impresora Multifuncional Epson L3250",
        descripcion: "Sistema continuo Ecotank, Wi-Fi Direct, Copiadora y Escáner",
        stock: 1, // Low stock warning (< 5)
        precioCompra: 210.00,
        precioVenta: 299.00
    }
];

// --- APPLICATION STATE ---
let products = [];

// --- DOM ELEMENTS ---
const tableBody = document.getElementById("products-table-body");
const searchInput = document.getElementById("search-input");
const openModalBtn = document.getElementById("open-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cancelModalBtn = document.getElementById("cancel-modal-btn");
const productModal = document.getElementById("product-modal");
const productForm = document.getElementById("product-form");
const toastContainer = document.getElementById("toast-container");

// Form inputs
const productIdInput = document.getElementById("product-id-input");
const productNameInput = document.getElementById("product-name");
const productDescInput = document.getElementById("product-desc");
const productStockInput = document.getElementById("product-stock");
const productPriceBuyInput = document.getElementById("product-price-buy");
const productPriceSellInput = document.getElementById("product-price-sell");
const modalTitle = document.getElementById("modal-title");

// KPI Values
const kpiTotalProducts = document.getElementById("val-total-products");
const kpiLowStock = document.getElementById("val-low-stock");
const kpiTotalCost = document.getElementById("val-inventory-cost");
const kpiProjectedProfit = document.getElementById("val-projected-profit");

// --- CORE FUNCTIONS ---

// Init App: Load data from localStorage or set default mock data
function initApp() {
    const savedProducts = localStorage.getItem("inventory_products");
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = [...DEMO_PRODUCTS];
        saveToLocalStorage();
    }
    renderDashboard();
}

// Save products state to LocalStorage
function saveToLocalStorage() {
    localStorage.setItem("inventory_products", JSON.stringify(products));
}

// Calculate and render KPIs & Table
function renderDashboard() {
    const searchFilter = searchInput.value.toLowerCase().trim();
    
    // 1. Filtered products list for table
    const filteredProducts = products.filter(product => 
        product.nombre.toLowerCase().includes(searchFilter)
    );

    // 2. Clear table and render rows
    tableBody.innerHTML = "";
    
    if (filteredProducts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-items-row">
                    No se encontraron productos que coincidan con la búsqueda.
                </td>
            </tr>
        `;
    } else {
        filteredProducts.forEach(product => {
            const tr = document.createElement("tr");
            
            // Determine stock level class & badge text
            let stockClass = "";
            let badgeClass = "badge-ok";
            let badgeText = "Stock Sano";
            
            if (product.stock === 0) {
                stockClass = "row-critical";
                badgeClass = "badge-critical";
                badgeText = "Agotado";
            } else if (product.stock < 5) {
                stockClass = "row-low";
                badgeClass = "badge-low";
                badgeText = `Bajo Stock (${product.stock})`;
            } else {
                badgeText = `Disponible (${product.stock})`;
            }

            if (stockClass) {
                tr.classList.add(stockClass);
            }

            // Sales value projection (Stock * Sale Price)
            const totalValue = product.stock * product.precioVenta;

            tr.innerHTML = `
                <td><strong>#${product.id}</strong></td>
                <td><strong>${escapeHTML(product.nombre)}</strong></td>
                <td><span style="color: var(--text-secondary); font-size: 0.85rem;">${escapeHTML(product.descripcion || 'Sin descripción')}</span></td>
                <td style="text-align: center;">
                    <span class="badge-stock ${badgeClass}">${badgeText}</span>
                </td>
                <td style="text-align: right; font-family: monospace;">$${product.precioCompra.toFixed(2)}</td>
                <td style="text-align: right; font-family: monospace;">$${product.precioVenta.toFixed(2)}</td>
                <td style="text-align: right; font-family: monospace; font-weight: 600;">$${totalValue.toFixed(2)}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-icon btn-edit" onclick="editProduct(${product.id})" title="Editar Producto">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                        </button>
                        <button class="btn btn-icon btn-delete" onclick="deleteProduct(${product.id})" title="Eliminar Producto">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // 3. Recalculate and update KPIs
    let totalItems = products.length;
    let lowStockAlerts = products.filter(p => p.stock < 5).length;
    
    // Inventory total value is cost value: stock * buying price
    let totalCostVal = products.reduce((sum, p) => sum + (p.stock * p.precioCompra), 0);
    
    // Profit projection is: stock * (selling price - cost price)
    let totalProfitVal = products.reduce((sum, p) => sum + (p.stock * (p.precioVenta - p.precioCompra)), 0);

    kpiTotalProducts.textContent = totalItems;
    kpiLowStock.textContent = lowStockAlerts;
    kpiTotalCost.textContent = `$${totalCostVal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    kpiProjectedProfit.textContent = `$${totalProfitVal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Show custom toast notification
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    // Icon based on type
    let icon = "";
    if (type === "success") {
        icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-success); margin-right: 8px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === "danger") {
        icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-danger); margin-right: 8px;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
        icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-warning); margin-right: 8px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>`;
    }

    toast.innerHTML = `
        <div style="display: flex; align-items: center;">
            ${icon}
            <span>${escapeHTML(message)}</span>
        </div>
    `;

    toastContainer.appendChild(toast);
    
    // Trigger slide-in animation
    setTimeout(() => {
        toast.classList.add("show");
    }, 50);

    // Auto remove toast
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Open modal form
function openModal(isEdit = false) {
    if (!isEdit) {
        modalTitle.textContent = "Agregar Nuevo Producto";
        productIdInput.value = "";
        productForm.reset();
    }
    productModal.classList.add("active");
}

// Close modal form
function closeModal() {
    productModal.classList.remove("active");
    productForm.reset();
}

// Handle Form Submission (Add or Update)
productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const id = productIdInput.value ? parseInt(productIdInput.value) : null;
    const nombre = productNameInput.value.trim();
    const descripcion = productDescInput.value.trim();
    const stock = parseInt(productStockInput.value);
    const precioCompra = parseFloat(productPriceBuyInput.value);
    const precioVenta = parseFloat(productPriceSellInput.value);

    // Validation checks
    if (!nombre) {
        showToast("El nombre del producto es obligatorio", "warning");
        return;
    }
    if (isNaN(stock) || stock < 0) {
        showToast("La cantidad en stock debe ser mayor o igual a 0", "warning");
        return;
    }
    if (isNaN(precioCompra) || precioCompra < 0 || isNaN(precioVenta) || precioVenta < 0) {
        showToast("Los precios deben ser válidos y mayores o iguales a 0", "warning");
        return;
    }

    if (id) {
        // Edit existing product
        const idx = products.findIndex(p => p.id === id);
        if (idx !== -1) {
            products[idx] = { id, nombre, descripcion, stock, precioCompra, precioVenta };
            showToast(`Producto "${nombre}" actualizado correctamente.`);
        }
    } else {
        // Create new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, nombre, descripcion, stock, precioCompra, precioVenta });
        showToast(`Producto "${nombre}" agregado correctamente.`);
    }

    saveToLocalStorage();
    renderDashboard();
    closeModal();
});

// Edit Product handler (called from table button)
window.editProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    modalTitle.textContent = "Editar Producto";
    productIdInput.value = product.id;
    productNameInput.value = product.nombre;
    productDescInput.value = product.descripcion || "";
    productStockInput.value = product.stock;
    productPriceBuyInput.value = product.precioCompra.toFixed(2);
    productPriceSellInput.value = product.precioVenta.toFixed(2);

    openModal(true);
};

// Delete Product handler (called from table button)
window.deleteProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el producto "${product.nombre}"? Esta acción no se puede deshacer.`);
    if (confirmDelete) {
        products = products.filter(p => p.id !== id);
        saveToLocalStorage();
        renderDashboard();
        showToast(`Producto "${product.nombre}" eliminado correctamente.`, "danger");
    }
};

// Helpers & Event Listeners
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

searchInput.addEventListener("input", renderDashboard);
openModalBtn.addEventListener("click", () => openModal(false));
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);

// Close modal when clicking outside content area
productModal.addEventListener("click", (e) => {
    if (e.target === productModal) {
        closeModal();
    }
});

// Start the application
document.addEventListener("DOMContentLoaded", initApp);
