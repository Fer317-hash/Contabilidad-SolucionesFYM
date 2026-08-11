// =============================================================================
// ACCOUNTING REGISTRY APPLICATION LOGIC
// =============================================================================

// --- CATEGORY TO FLOW TYPE BUSINESS MAPPING ---
const CATEGORY_MAP = {
    "PAGO ADELANTO CLIENTE": "Ingreso",
    "PAGO TOTAL CLIENTE": "Ingreso",
    "COMPRA DE EQUIPOS": "Egreso",
    "REPARTO RICARDO": "Egreso",
    "REPARTO FERNANDO": "Egreso",
    "PAGO DEUDA": "Egreso",
    "PAGO PUBLICIDAD": "Egreso",
    "PAGO PERSONAL DE VENTA": "Egreso",
    "PAGO DHL": "Egreso"
};

// --- MOCK DEMO TRANSACTIONS ---
const DEMO_TRANSACTIONS = [
    {
        id: 1,
        fecha: "2026-08-08",
        tipo: "Ingreso",
        categoria: "PAGO ADELANTO CLIENTE",
        monto: 1500.00,
        descripcion: "Adelanto del cliente por servicios de desarrollo web"
    },
    {
        id: 2,
        fecha: "2026-08-08",
        tipo: "Egreso",
        categoria: "COMPRA DE EQUIPOS",
        monto: 850.00,
        descripcion: "Compra de monitor y periféricos para oficina"
    },
    {
        id: 3,
        fecha: "2026-08-09",
        tipo: "Egreso",
        categoria: "PAGO DHL",
        monto: 45.90,
        descripcion: "Envío urgente de contratos firmados"
    },
    {
        id: 4,
        fecha: "2026-08-10",
        tipo: "Ingreso",
        categoria: "PAGO TOTAL CLIENTE",
        monto: 3450.00,
        descripcion: "Pago saldo factura de consultoría #890"
    },
    {
        id: 5,
        fecha: "2026-08-10",
        tipo: "Egreso",
        categoria: "PAGO PUBLICIDAD",
        monto: 250.00,
        descripcion: "Campaña publicitaria mensual en redes sociales"
    },
    {
        id: 6,
        fecha: "2026-08-10",
        tipo: "Egreso",
        categoria: "REPARTO RICARDO",
        monto: 120.00,
        descripcion: "Viáticos y gastos de envío sucursal norte"
    }
];

// --- APPLICATION STATE ---
let transactions = [];

// --- DOM ELEMENTS ---
const tableBody = document.getElementById("accounting-table-body");
const transForm = document.getElementById("accounting-form");
const categorySelect = document.getElementById("trans-category");
const detectedBadge = document.getElementById("detected-flow-badge");
const toastContainer = document.getElementById("toast-container");

// Form inputs
const dateInput = document.getElementById("trans-date");
const amountInput = document.getElementById("trans-amount");
const descInput = document.getElementById("trans-desc");

// Filters inputs
const filterDateInput = document.getElementById("filter-date");
const filterCategorySelect = document.getElementById("filter-category");
const filterTypeSelect = document.getElementById("filter-type");
const resetFiltersBtn = document.getElementById("reset-filters-btn");

// KPI Values
const kpiNetBalance = document.getElementById("val-net-balance");
const kpiTotalIncome = document.getElementById("val-total-income");
const kpiTotalExpense = document.getElementById("val-total-expense");

// --- CORE FUNCTIONS ---

// Init App
function initApp() {
    // 1. Set default date in form to today
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;

    // 2. Load transactions from localStorage or load demo data
    const savedTransactions = localStorage.getItem("accounting_transactions");
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    } else {
        transactions = [...DEMO_TRANSACTIONS];
        saveToLocalStorage();
    }

    renderLedger();
}

// Save transactions to local storage
function saveToLocalStorage() {
    localStorage.setItem("accounting_transactions", JSON.stringify(transactions));
}

// Render ledger list, apply filter parameters and update KPI values
function renderLedger() {
    const fDate = filterDateInput.value;
    const fCategory = filterCategorySelect.value;
    const fType = filterTypeSelect.value;

    // 1. Filter transactions array
    const filtered = transactions.filter(t => {
        // Date match
        if (fDate && t.fecha !== fDate) return false;
        // Category match
        if (fCategory && t.categoria !== fCategory) return false;
        // Type match
        if (fType && t.tipo !== fType) return false;
        return true;
    });

    // 2. Sort by date desc, then ID desc
    filtered.sort((a, b) => {
        if (b.fecha !== a.fecha) {
            return b.fecha.localeCompare(a.fecha);
        }
        return b.id - a.id;
    });

    // 3. Clear table and render rows
    tableBody.innerHTML = "";
    if (filtered.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-items-row">
                    No se encontraron transacciones registradas para los filtros aplicados.
                </td>
            </tr>
        `;
    } else {
        filtered.forEach(t => {
            const tr = document.createElement("tr");
            
            // Badge style for dynamic type
            const typeBadgeClass = t.tipo === "Ingreso" ? "badge-ok" : "badge-critical";
            const amtPrefix = t.tipo === "Ingreso" ? "+" : "-";
            const amtColor = t.tipo === "Ingreso" ? "var(--color-success)" : "var(--color-danger)";

            tr.innerHTML = `
                <td><strong>#${t.id}</strong></td>
                <td>${formatDateString(t.fecha)}</td>
                <td>
                    <span class="badge-stock ${typeBadgeClass}">${t.tipo}</span>
                </td>
                <td><strong>${t.categoria}</strong></td>
                <td style="text-align: right; font-family: monospace; font-weight: 600; color: ${amtColor};">
                    ${amtPrefix}$${t.monto.toFixed(2)}
                </td>
                <td><span style="color: var(--text-secondary); font-size: 0.85rem;">${escapeHTML(t.descripcion || 'Sin notas')}</span></td>
                <td>
                    <div class="actions-cell" style="justify-content: center;">
                        <button class="btn btn-icon btn-delete" onclick="deleteTransaction(${t.id})" title="Eliminar Movimiento">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // 4. Recalculate KPIs based on ALL transactions (or you can do it based on filtered, but business standard is overall/monthly balance)
    let totalIncome = transactions.reduce((sum, t) => t.tipo === "Ingreso" ? sum + t.monto : sum, 0);
    let totalExpense = transactions.reduce((sum, t) => t.tipo === "Egreso" ? sum + t.monto : sum, 0);
    let netBalance = totalIncome - totalExpense;

    kpiTotalIncome.textContent = `$${totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    kpiTotalExpense.textContent = `$${totalExpense.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    kpiNetBalance.textContent = `${netBalance >= 0 ? '' : '-'}$${Math.abs(netBalance).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Toggle active balance glowing colors
    const balanceCard = document.getElementById("kpi-net-balance");
    if (netBalance >= 0) {
        balanceCard.classList.remove("kpi-danger");
        balanceCard.classList.add("kpi-success");
    } else {
        balanceCard.classList.remove("kpi-success");
        balanceCard.classList.add("kpi-danger");
    }
}

// Show Toast
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
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
    
    setTimeout(() => {
        toast.classList.add("show");
    }, 50);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// --- INTERACTIVE EVENTS ---

// Auto detect flow type based on selected category
categorySelect.addEventListener("change", () => {
    const category = categorySelect.value;
    const detectedType = CATEGORY_MAP[category];

    // Reset classes
    detectedBadge.className = "movement-badge";

    if (detectedType === "Ingreso") {
        detectedBadge.classList.add("badge-ingreso");
        detectedBadge.textContent = "🟢 INGRESO";
    } else if (detectedType === "Egreso") {
        detectedBadge.classList.add("badge-egreso");
        detectedBadge.textContent = "🔴 EGRESO";
    } else {
        detectedBadge.classList.add("badge-neutral");
        detectedBadge.textContent = "Sin seleccionar";
    }
});

// Form submission handler
transForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fecha = dateInput.value;
    const categoria = categorySelect.value;
    const monto = parseFloat(amountInput.value);
    const descripcion = descInput.value.trim();

    // Validations
    if (!fecha) {
        showToast("Por favor seleccione una fecha válida.", "warning");
        return;
    }
    if (!categoria) {
        showToast("Debe elegir una categoría de movimiento.", "warning");
        return;
    }
    if (isNaN(monto) || monto <= 0) {
        showToast("El monto debe ser un número positivo.", "warning");
        return;
    }

    // Auto detect type
    const tipo = CATEGORY_MAP[categoria];
    if (!tipo) {
        showToast("Categoría inválida detectada.", "danger");
        return;
    }

    // Create record
    const nextId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    const newTrans = {
        id: nextId,
        fecha,
        tipo,
        categoria,
        monto,
        descripcion
    };

    transactions.push(newTrans);
    saveToLocalStorage();
    renderLedger();

    // Reset Form (keep today's date)
    transForm.reset();
    dateInput.value = new Date().toISOString().split("T")[0];
    
    // Reset Badge
    detectedBadge.className = "movement-badge badge-neutral";
    detectedBadge.textContent = "Sin seleccionar";

    showToast(`Movimiento registrado correctamente como ${tipo}.`);
});

// Delete handler
window.deleteTransaction = function(id) {
    const trans = transactions.find(t => t.id === id);
    if (!trans) return;

    const confirmDel = confirm(`¿Estás seguro de que deseas eliminar este registro de $${trans.monto.toFixed(2)} (${trans.categoria})?`);
    if (confirmDel) {
        transactions = transactions.filter(t => t.id !== id);
        saveToLocalStorage();
        renderLedger();
        showToast("Registro contable eliminado.", "danger");
    }
};

// Filter event listeners
filterDateInput.addEventListener("input", renderLedger);
filterCategorySelect.addEventListener("change", renderLedger);
filterTypeSelect.addEventListener("change", renderLedger);

// Reset filters
resetFiltersBtn.addEventListener("click", () => {
    filterDateInput.value = "";
    filterCategorySelect.value = "";
    filterTypeSelect.value = "";
    renderLedger();
    showToast("Filtros limpiados.", "success");
});

// --- HELPER UTILS ---
function formatDateString(dateStr) {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`; // YYYY-MM-DD to DD/MM/YYYY
    }
    return dateStr;
}

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

// Start application
document.addEventListener("DOMContentLoaded", initApp);
