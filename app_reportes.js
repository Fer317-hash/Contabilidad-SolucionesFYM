// =============================================================================
// ACCOUNTING REPORTS APPLICATION LOGIC
// =============================================================================

// --- CATEGORY TO FLOW TYPE MAP ---
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

// --- MOCK DEMO TRANSACTIONS (FALLBACK) ---
const DEMO_TRANSACTIONS = [
    { id: 1, fecha: "2026-08-08", tipo: "Ingreso", categoria: "PAGO ADELANTO CLIENTE", monto: 1500.00, descripcion: "Adelanto del cliente por servicios de desarrollo web" },
    { id: 2, fecha: "2026-08-08", tipo: "Egreso", categoria: "COMPRA DE EQUIPOS", monto: 850.00, descripcion: "Compra de monitor y periféricos para oficina" },
    { id: 3, fecha: "2026-08-09", tipo: "Egreso", categoria: "PAGO DHL", monto: 45.90, descripcion: "Envío urgente de contratos firmados" },
    { id: 4, fecha: "2026-08-10", tipo: "Ingreso", categoria: "PAGO TOTAL CLIENTE", monto: 3450.00, descripcion: "Pago saldo factura de consultoría #890" },
    { id: 5, fecha: "2026-08-10", tipo: "Egreso", categoria: "PAGO PUBLICIDAD", monto: 250.00, descripcion: "Campaña publicitaria mensual en redes sociales" },
    { id: 6, fecha: "2026-08-10", tipo: "Egreso", categoria: "REPARTO RICARDO", monto: 120.00, descripcion: "Viáticos y gastos de envío sucursal norte" }
];

// --- STATE MANAGEMENT ---
let transactions = [];
let currentChartType = "Egreso"; // Toggle between "Ingreso" and "Egreso" for chart
let categoryChartInstance = null;

// --- DOM ELEMENTS ---
const periodSelect = document.getElementById("report-period-select");
const customRangeInputs = document.getElementById("custom-range-inputs");
const startDateInput = document.getElementById("report-start-date");
const endDateInput = document.getElementById("report-end-date");
const activeRangeLabel = document.getElementById("active-range-label");

// KPIs
const valIncome = document.getElementById("val-report-income");
const valExpense = document.getElementById("val-report-expense");
const valBalance = document.getElementById("val-report-balance");
const balanceCard = document.getElementById("kpi-net-balance");

// Data Display
const tableBody = document.getElementById("reports-table-body");
const chartBtnExpenses = document.getElementById("chart-btn-expenses");
const chartBtnIncome = document.getElementById("chart-btn-income");

// --- CORE LOGIC ---

// Init App
function initApp() {
    // 1. Load transactions from localStorage or default data
    const saved = localStorage.getItem("accounting_transactions");
    if (saved) {
        transactions = JSON.parse(saved);
    } else {
        transactions = [...DEMO_TRANSACTIONS];
        localStorage.setItem("accounting_transactions", JSON.stringify(transactions));
    }

    // 2. Set default dates for range pickers to today
    const todayStr = new Date().toISOString().split("T")[0];
    startDateInput.value = todayStr;
    endDateInput.value = todayStr;

    // 3. Setup event listeners
    periodSelect.addEventListener("change", handlePeriodChange);
    startDateInput.addEventListener("input", updateReports);
    endDateInput.addEventListener("input", updateReports);

    // 4. Initial rendering
    updateReports();
}

// Handle change in period select dropdown
function handlePeriodChange() {
    const value = periodSelect.value;
    if (value === "personalizado") {
        customRangeInputs.classList.remove("hidden-picker");
    } else {
        customRangeInputs.classList.add("hidden-picker");
    }
    updateReports();
}

// Calculate the range boundary dates
function calculateRange(period) {
    const today = new Date();
    let start, end;
    
    // Set end of range to today
    const endStr = today.toISOString().split("T")[0];

    switch(period) {
        case "dia":
            // Today only
            start = endStr;
            end = endStr;
            break;
        case "semana":
            // Last 7 days
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 6);
            start = weekAgo.toISOString().split("T")[0];
            end = endStr;
            break;
        case "mes":
            // First day of current month to today
            const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            start = firstOfMonth.toISOString().split("T")[0];
            end = endStr;
            break;
        case "personalizado":
            // User selected values
            start = startDateInput.value || endStr;
            end = endDateInput.value || endStr;
            // Validate sequence
            if (start > end) {
                const temp = start;
                start = end;
                end = temp;
                startDateInput.value = start;
                endDateInput.value = end;
            }
            break;
        default:
            start = endStr;
            end = endStr;
    }
    return { start, end };
}

// Core function: filters, aggregates and updates UI
function updateReports() {
    const period = periodSelect.value;
    const { start, end } = calculateRange(period);

    // Update range text label
    activeRangeLabel.textContent = `Período: ${formatDateString(start)} al ${formatDateString(end)}`;

    // 1. Filter transactions inside the date bounds
    const filtered = transactions.filter(t => t.fecha >= start && t.fecha <= end);

    // 2. Compute KPIs
    const totalIncome = filtered.reduce((sum, t) => t.tipo === "Ingreso" ? sum + t.monto : sum, 0);
    const totalExpense = filtered.reduce((sum, t) => t.tipo === "Egreso" ? sum + t.monto : sum, 0);
    const netBalance = totalIncome - totalExpense;

    valIncome.textContent = `$${totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    valExpense.textContent = `$${totalExpense.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    valBalance.textContent = `${netBalance >= 0 ? '' : '-'}$${Math.abs(netBalance).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Dynamic style classes on Net Balance KPI
    balanceCard.className = "kpi-card";
    if (netBalance >= 0) {
        balanceCard.classList.add("kpi-success");
    } else {
        balanceCard.classList.add("kpi-danger");
    }

    // 3. Category Groupings calculation
    // Initialize structure for all 9 categories
    const categorySummary = {};
    Object.keys(CATEGORY_MAP).forEach(cat => {
        categorySummary[cat] = {
            categoria: cat,
            tipo: CATEGORY_MAP[cat],
            monto: 0.00,
            conteo: 0
        };
    });

    // Populate actual data
    filtered.forEach(t => {
        if (categorySummary[t.categoria]) {
            categorySummary[t.categoria].monto += t.monto;
            categorySummary[t.categoria].conteo += 1;
        }
    });

    // Convert object to array and filter out categories with $0.00 to show in list & chart
    const summaryArray = Object.values(categorySummary);

    // 4. Render category summary list table
    renderSummaryTable(summaryArray, totalIncome, totalExpense);

    // 5. Render Chart.js Donut Chart
    renderChart(summaryArray);
}

// Render tabular breakdown
function renderSummaryTable(summaryArray, totalIncome, totalExpense) {
    tableBody.innerHTML = "";

    // Show all categories in the list for full visibility
    // Sort so that active categories appear first
    const sortedSummary = [...summaryArray].sort((a, b) => b.monto - a.monto);
    
    // Check if we have any transaction
    const totalTransactions = sortedSummary.reduce((sum, s) => sum + s.conteo, 0);

    if (totalTransactions === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-items-row">
                    No hay transacciones registradas en este período para desglosar.
                </td>
            </tr>
        `;
        return;
    }

    sortedSummary.forEach(s => {
        // Skip categories with 0 transactions in this period to keep layout clean
        if (s.conteo === 0) return;

        const typeClass = s.tipo === "Ingreso" ? "badge-ok" : "badge-critical";
        
        // Calculate percentage distribution relative to its own category type (Ingreso/Egreso)
        const totalBase = s.tipo === "Ingreso" ? totalIncome : totalExpense;
        const percentage = totalBase > 0 ? (s.monto / totalBase) * 100 : 0.00;

        tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${s.categoria}</strong></td>
            <td><span class="badge-stock ${typeClass}">${s.tipo}</span></td>
            <td style="text-align: center;">${s.conteo}</td>
            <td style="text-align: right; font-family: monospace; font-weight: 600;">$${s.monto.toFixed(2)}</td>
            <td style="text-align: right; font-weight: 500; color: var(--text-secondary);">${percentage.toFixed(1)}%</td>
        `;
        tableBody.appendChild(tr);
    });
}

// Render dynamic Chart.js donut
function renderChart(summaryArray) {
    // Filter summary elements matching the current visual type (Ingreso or Egreso)
    const chartData = summaryArray.filter(s => s.tipo === currentChartType && s.monto > 0);

    const canvas = document.getElementById("category-donut-chart");
    const ctx = canvas.getContext("2d");

    // Destroy existing chart instance to prevent conflicts
    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    if (chartData.length === 0) {
        // Render simple fallback in canvas container if there's no data
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#9aa0b9";
        ctx.font = "14px Inter";
        ctx.textAlign = "center";
        ctx.fillText("Sin datos de " + currentChartType.toLowerCase() + "s en este período", canvas.width / 2, canvas.height / 2);
        return;
    }

    const labels = chartData.map(d => d.categoria);
    const dataValues = chartData.map(d => d.monto);

    // Palette setups
    const colors = currentChartType === "Egreso" 
        ? ["#ff1744", "#ff9100", "#ffd600", "#00e5ff", "#7c4dff", "#e040fb", "#3d5afe", "#2979ff"]
        : ["#00e676", "#00b0ff", "#1de9b6", "#76ff03"];

    // Initialize Chart.js
    categoryChartInstance = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: colors.slice(0, chartData.length),
                borderColor: "#161626",
                borderWidth: 2,
                hoverOffset: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#9aa0b9",
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            family: "Inter",
                            size: 11,
                            weight: "500"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: "rgba(11, 11, 20, 0.95)",
                    titleFont: { family: "Inter", weight: "bold" },
                    bodyFont: { family: "Inter" },
                    borderColor: "rgba(255,255,255,0.08)",
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percent = ((value / total) * 100).toFixed(1);
                            return ` $${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })} (${percent}%)`;
                        }
                    }
                }
            },
            cutout: "60%"
        }
    });
}

// Toggle active display type between expenses/income on the chart
window.setChartType = function(type) {
    currentChartType = type;
    
    // Toggle active state classes on buttons
    if (type === "Egreso") {
        chartBtnExpenses.classList.add("active");
        chartBtnIncome.classList.remove("active");
    } else {
        chartBtnExpenses.classList.remove("active");
        chartBtnIncome.classList.add("active");
    }
    
    // Recalculate
    updateReports();
};

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

// Start reports
document.addEventListener("DOMContentLoaded", initApp);
