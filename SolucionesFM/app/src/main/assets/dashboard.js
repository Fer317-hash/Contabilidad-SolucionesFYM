// =============================================================================
// UNIFIED GASTRO-MACHINERY DASHBOARD LOGIC (SOLUCIONES F&M)
// SUPPORT FOR HYBRID DATABASE: FIREBASE REALTIME DATABASE OR LOCALSTORAGE FALLBACK
// =============================================================================

// --- CREDENTIALS CONFIGURATION ---
const AUTH_USER = "SOLUCIONESFYM";
const AUTH_PASS = "73970885";

// --- CLOUD DATABASE CONFIGURATION (FIREBASE) ---
// Pegar aquí la URL de su Firebase Realtime Database para activar la base compartida.
// Ejemplo: "https://solucionesfym-db-default-rtdb.firebaseio.com/"
const FIREBASE_DB_URL = "https://contabilidad-fym-default-rtdb.firebaseio.com/"; 

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

// --- INITIAL MOCK DATA (56 RECONCILED PRODUCTS FROM IMAGES) ---
const DEMO_PRODUCTS = [
    { id: 1, nombre: "REFRACTOMETRO DE 0 A 90 BRIX", descripcion: "Medidor de concentración de azúcar de amplio espectro", stockLima: 78, stockArequipa: 3, stockCritico: 50 },
    { id: 2, nombre: "REFRACTOMETRO DOBLE ESCALA BRIX (0- 40%) Y ALCOHOL (0 A 25%)", descripcion: "Refractómetro con escala brix y alcohol combinadas", stockLima: 0, stockArequipa: 4, stockCritico: 5 },
    { id: 3, nombre: "REFRACTÓMETRO LECHE (0 - 20%)", descripcion: "Medidor de densidad y sólidos para lácteos", stockLima: 17, stockArequipa: 11, stockCritico: 25 },
    { id: 4, nombre: "REFRACTOMETRO ALCOHOL DESTILADO 0-80% ALC", descripcion: "Refractómetro para bebidas espirituosas y destilados", stockLima: 2, stockArequipa: 3, stockCritico: 4 },
    { id: 5, nombre: "VASO PRECIPITADO DE 250 ML PPLASTICOS", descripcion: "Vaso graduado de polipropileno de alta resistencia", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 6, nombre: "BALANZA DE 0 A 3 KG PRECISION 0.1 G", descripcion: "Balanza de mesa digital de precisión comercial", stockLima: 63, stockArequipa: 19, stockCritico: 40 },
    { id: 7, nombre: "BALANZA DE 0 A 500 G PRECISION 0.01 G", descripcion: "Balanza de precisión de joyería e insumos químicos", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 8, nombre: "REFRACTÓMETRO MIEL BRIX/BAUME/WATER 58-90%/12-27%/38-...", descripcion: "Refractómetro apícola de tres escalas", stockLima: 0, stockArequipa: 5, stockCritico: 4 },
    { id: 9, nombre: "REFRACTOMETRO YEIRI DOBLE ESCALA 0 - 32% Y DENS", descripcion: "Medidor de brix de precisión Yeiri", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 10, nombre: "REFRACTOMETRO DOBLE ESCALA BRIX (0- 32%)", descripcion: "Refractómetro estándar para jugos y bebidas", stockLima: 14, stockArequipa: 0, stockCritico: 4 },
    { id: 11, nombre: "REFRACTOMETRO DE SALINIDAD DE 0 A 100", descripcion: "Medidor de partes por mil (ppt) para salmueras", stockLima: 4, stockArequipa: 5, stockCritico: 4 },
    { id: 12, nombre: "MEDIDOR DE SUELO 6 EN 1", descripcion: "Medidor de pH, humedad, temperatura, luz y nutrientes", stockLima: 2, stockArequipa: 0, stockCritico: 5 },
    { id: 13, nombre: "CALIBRADOR VERNIER UNIVERSAL DE ACERO TEMPLADO 200MM X...", descripcion: "Calibrador vernier manual de acero templado", stockLima: 9, stockArequipa: 0, stockCritico: 2 },
    { id: 14, nombre: "LUPA X 60", descripcion: "Lupa de alta resolución con luz LED", stockLima: 0, stockArequipa: 7, stockCritico: 5 },
    { id: 15, nombre: "SELLADORA AL VACIO", descripcion: "Selladora de mesa para conservación de alimentos", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 16, nombre: "BALANZA DIGITAL - TIMER", descripcion: "Balanza de goteo para baristas y control de café", stockLima: 1, stockArequipa: 0, stockCritico: 0 },
    { id: 17, nombre: "Medidor Multiparametro 7 en 1 (pH/Cloro/EC/TDS/Sal/ORP/Temp)", descripcion: "Analizador de agua con conectividad y calibración", stockLima: 10, stockArequipa: 0, stockCritico: 3 },
    { id: 18, nombre: "Medidor de suelo 8 en 1", descripcion: "Analizador avanzado de suelo y sustratos", stockLima: 0, stockArequipa: 1, stockCritico: 5 },
    { id: 19, nombre: "TERMOMETRO VASTAGO 15 CM INOX -TP-101", descripcion: "Termómetro digital de pincho para cocina y líquidos", stockLima: 108, stockArequipa: 34, stockCritico: 50 },
    { id: 20, nombre: "MEDIDOR DE HUMEDAD MG - PRO", descripcion: "Medidor digital para granos y harinas MG-Pro", stockLima: 6, stockArequipa: 1, stockCritico: 2 },
    { id: 21, nombre: "SOBRE BUFFER 6.86 PARA 250 ML", descripcion: "Polvo de calibración pH neutro", stockLima: 10, stockArequipa: 0, stockCritico: 0 },
    { id: 22, nombre: "SOBRE BUFFER 4.01 para 250 mL", descripcion: "Polvo de calibración pH ácido", stockLima: 25, stockArequipa: 0, stockCritico: 0 },
    { id: 23, nombre: "PHMETRO DIGITAL 0 - 14 PRECISSO", descripcion: "Medidor digital de pH tipo bolsillo", stockLima: 115, stockArequipa: 14, stockCritico: 60 },
    { id: 24, nombre: "TERMOMETRO VASTAGO 30 CM INOX TP-101L", descripcion: "Termómetro con vástago largo para ollas industriales", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 25, nombre: "MEDIDOR 4 EM 1", descripcion: "Analizador de agua portátil de cuatro parámetros", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 26, nombre: "MOSTIMETRO - TRIPLE ESCALA", descripcion: "Densímetro para fermentación de cerveza, vino y sidra", stockLima: 169, stockArequipa: 6, stockCritico: 40 },
    { id: 27, nombre: "ALCOHOLÍMETRO PARA DESTILADOS 0 – 100%", descripcion: "Alcoholímetro de vidrio Gay-Lussac", stockLima: 150, stockArequipa: 6, stockCritico: 40 },
    { id: 28, nombre: "VINOMETRO", descripcion: "Medidor capilar rápido para contenido de alcohol en vinos", stockLima: 56, stockArequipa: 1, stockCritico: 5 },
    { id: 29, nombre: "LACTODENSIMETRO DE 15°C - protector transparente blanco", descripcion: "Densímetro para control de adulteración de leche", stockLima: 147, stockArequipa: 10, stockCritico: 40 },
    { id: 30, nombre: "DENSIMETRO DE BAUME", descripcion: "Medidor de densidad de almíbares and salmueras Baumé", stockLima: 63, stockArequipa: 5, stockCritico: 10 },
    { id: 31, nombre: "MEDIDOR DE ELECTROCONDUCTIVIDAD&EC KYNTEL", descripcion: "Conductímetro portátil de precisión", stockLima: 30, stockArequipa: 0, stockCritico: 10 },
    { id: 32, nombre: "MEDIDOR BLUTUE", descripcion: "Analizador multiparamétrico Bluetooth", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 33, nombre: "MULTIPARAMETRO 5 EN1 ( PH/TEMP/EC/TDS/SALINIDAD)", descripcion: "Analizador de calidad de agua sumergible", stockLima: 0, stockArequipa: 3, stockCritico: 0 },
    { id: 34, nombre: "AIRLOCK", descripcion: "Válvula de fermentación de plástico tipo S", stockLima: 5, stockArequipa: 1, stockCritico: 1 },
    { id: 35, nombre: "DENSIMETRO CON TERMOMETRO", descripcion: "Densímetro de líquidos con corrección de temperatura", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 36, nombre: "TERMMETRO CANASTILLA", descripcion: "Termómetro industrial protegido para calderos", stockLima: 0, stockArequipa: 0, stockCritico: 1 },
    { id: 37, nombre: "TERMOMETRO DE LECHE - PEQUEÑO", descripcion: "Termómetro analógico de esfera con clip para jarras", stockLima: 4, stockArequipa: 0, stockCritico: 3 },
    { id: 38, nombre: "PORBETA DE 100 ML VIDRIO", descripcion: "Probeta cilíndrica graduada de vidrio borosilicato", stockLima: 1, stockArequipa: 0, stockCritico: 1 },
    { id: 39, nombre: "AGUA DESTILADA 1L", descripcion: "Agua purificada destilada para análisis y diluciones", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 40, nombre: "TIRAS DE TEMPERATURA", descripcion: "Cintas adhesivas termocrómicas reversibles", stockLima: 3, stockArequipa: 0, stockCritico: 0 },
    { id: 41, nombre: "TERMOMETRO PARA COMPOST", descripcion: "Termómetro de vástago extra largo de 50 cm", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 42, nombre: "REFRACTOMETRO DIGITAL BRIX 0 - 50", descripcion: "Refractómetro electrónico con pantalla LCD", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 43, nombre: "VASO PRECIPITADO DE 100 ML PLASTICO", descripcion: "Vaso graduado pequeño de polipropileno", stockLima: 2, stockArequipa: 0, stockCritico: 0 },
    { id: 44, nombre: "KIT SUELO QUIMICO", descripcion: "Set de reactivos para análisis de nitrógeno y fósforo", stockLima: 1, stockArequipa: 0, stockCritico: 0 },
    { id: 45, nombre: "ANALIZADOR DE OXIGENO", descripcion: "Oxímetro digital para líquidos", stockLima: 0, stockArequipa: 1, stockCritico: 0 },
    { id: 46, nombre: "BALANZAS BLANCAS DE 10 KG", descripcion: "Balanza de cocina clásica de plato blanco", stockLima: 3, stockArequipa: 3, stockCritico: 0 },
    { id: 47, nombre: "MICROMETRO", descripcion: "Tornillo micrométrico digital de alta precisión", stockLima: 1, stockArequipa: 0, stockCritico: 0 },
    { id: 48, "nombre": "SOLUCION BUFFER 4 250 ML", descripcion: "Solución líquida patrón pH 4.01", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 49, nombre: "SOLUCION BUFFER 6.86 250 ML", descripcion: "Solución líquida patrón pH 6.86", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 50, nombre: "TIRAS PH 0 - 14", descripcion: "Caja de tiras reactivas tornasol por 100 unidades", stockLima: 0, stockArequipa: 0, stockCritico: 0 },
    { id: 51, nombre: "MEDIDOR DE CLORO", descripcion: "Fotómetro portátil para cloro libre y total", stockLima: 5, stockArequipa: 0, stockCritico: 0 },
    { id: 52, nombre: "PROBETA DE 250 ML PLASTICO", descripcion: "Probeta graduada de polipropileno translúcido", stockLima: 1, stockArequipa: 2, stockCritico: 4 },
    { id: 53, nombre: "MEDIDOR DE GRANOS MT300 PRO", descripcion: "Medidor inductivo para maderas y granos", stockLima: 6, stockArequipa: 0, stockCritico: 3 },
    { id: 54, nombre: "MEDIDOR DE HUMEDAD PARA SACOS AMARILLO", descripcion: "Medidor digital tipo espada para sacos de yute y papel", stockLima: 6, stockArequipa: 0, stockCritico: 5 },
    { id: 55, "nombre": "KIT DE AGUA", descripcion: "Set de tiras reactivas para dureza e impurezas", stockLima: 1, stockArequipa: 1, stockCritico: 0 },
    { id: 56, nombre: "TERMOHIDRÓMETRO HC-2", descripcion: "Medidor ambiental de temperatura y humedad con sensor externo", stockLima: 4, stockArequipa: 0, stockCritico: 1 }
];

const DEMO_TRANSACTIONS = [];

const DEMO_DEBTS = [];

// --- STATE MANAGEMENT ---
let products = [];
let transactions = [];
let debts = [];
let deductions = [];
let currentChartType = "Egreso";
let categoryChartInstance = null;
let activeInventoryTab = "total";
let eventSource = null;
let deferredPrompt = null;
const installAppBtn = document.getElementById("install-app-btn");

// --- DOM ELEMENTS ---
const toastContainer = document.getElementById("toast-container");
const dbStatusBadge = document.getElementById("db-status-badge");
const syncBtn = document.getElementById("sync-btn");

// Auth Elements
const loginScreen = document.getElementById("login-screen");
const dashboardScreen = document.getElementById("dashboard-screen");
const loginForm = document.getElementById("login-form");
const loginCard = document.getElementById("login-card");
const loginErrorMsg = document.getElementById("login-error-msg");
const logoutBtn = document.getElementById("logout-btn");
const loginUsernameInput = document.getElementById("login-username");
const loginPasswordInput = document.getElementById("login-password");

// Block A: Inventory Multi-Sede
const searchInput = document.getElementById("search-input");
const openModalBtn = document.getElementById("open-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cancelModalBtn = document.getElementById("cancel-modal-btn");
const productModal = document.getElementById("product-modal");
const productForm = document.getElementById("product-form");
// Form inputs (Product)
const productIdInput = document.getElementById("product-id-input");
const productNameInput = document.getElementById("product-name");
const productDescInput = document.getElementById("product-desc");
const productStockLimaInput = document.getElementById("product-stock-lima");
const productStockArequipaInput = document.getElementById("product-stock-arequipa");
const productStockCriticalInput = document.getElementById("product-stock-critical");
const modalTitle = document.getElementById("modal-title");

// Block A: Daily Discount Modal Elements
const discountModal = document.getElementById("discount-modal");
const discountForm = document.getElementById("discount-form");
const openDiscountModalBtn = document.getElementById("open-discount-modal-btn");
const closeDiscountModalBtn = document.getElementById("close-discount-modal-btn");
const cancelDiscountModalBtn = document.getElementById("cancel-discount-modal-btn");
const discountProductSelect = document.getElementById("discount-product-select");
const discountDateInput = document.getElementById("discount-date");
const discountSedeSelect = document.getElementById("discount-sede-select");
const discountQtyInput = document.getElementById("discount-qty");
const discountLedgerSync = document.getElementById("discount-ledger-sync");
const discountLedgerFields = document.getElementById("discount-ledger-fields");
const discountSalePriceInput = document.getElementById("discount-sale-price");
const discountSaleDescInput = document.getElementById("discount-sale-desc");

// Dynamic Inventory Alerts Banner
const inventoryCritAlert = document.getElementById("inventory-crit-alert");
const inventoryCritAlertText = document.getElementById("inventory-crit-alert-text");

// Block B: Accounting Entry Form
const accountingForm = document.getElementById("accounting-form");
const categorySelect = document.getElementById("trans-category");
const detectedBadge = document.getElementById("detected-flow-badge");
const transDateInput = document.getElementById("trans-date");
const transAmountInput = document.getElementById("trans-amount");
const transDescInput = document.getElementById("trans-desc");

// Block C: Debt Tracker
const debtsTableBodyPen = document.getElementById("debts-table-body-pen");
const debtsTableBodyUsd = document.getElementById("debts-table-body-usd");
const debtForm = document.getElementById("debt-form");
const debtCreditorInput = document.getElementById("debt-creditor");
const debtAmountPenInput = document.getElementById("debt-amount-pen");
const debtAmountUsdInput = document.getElementById("debt-amount-usd");
const debtDueMonthInput = document.getElementById("debt-due-month");
const valDebtPen = document.getElementById("debt-total-pen");
const valDebtUsd = document.getElementById("debt-total-usd");
const debtDueAlert = document.getElementById("debt-due-alert");
const debtAlertText = document.getElementById("debt-alert-text");

// Block D: Reports
const periodSelect = document.getElementById("report-period-select");
const customRangeInputs = document.getElementById("custom-range-inputs");
const reportStartDate = document.getElementById("report-start-date");
const reportEndDate = document.getElementById("report-end-date");
const activeRangeLabel = document.getElementById("active-range-label");
// KPIs Reports
const valReportIncome = document.getElementById("val-report-income");
const valReportExpense = document.getElementById("val-report-expense");
const valReportBalance = document.getElementById("val-report-balance");
const balanceCard = document.getElementById("kpi-net-balance");
// Reports breakdown
const reportsTableBody = document.getElementById("reports-table-body");
const chartBtnExpenses = document.getElementById("chart-btn-expenses");
const chartBtnIncome = document.getElementById("chart-btn-income");

// --- ENTRY POINT ---
document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("soluciones_logged_in") === "true") {
        showDashboard();
    } else {
        showLogin();
    }
    loginForm.addEventListener("submit", handleLoginSubmit);
    logoutBtn.addEventListener("click", handleLogout);
});

// --- SESSION FLOW CONTROLLERS ---

function showLogin() {
    loginScreen.style.display = "block";
    dashboardScreen.style.display = "none";
    loginErrorMsg.style.display = "none";
}

function showDashboard() {
    loginScreen.style.display = "none";
    dashboardScreen.style.display = "block";
    initApp();
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    if (username === AUTH_USER && password === AUTH_PASS) {
        loginErrorMsg.style.display = "none";
        sessionStorage.setItem("soluciones_logged_in", "true");
        showDashboard();
        showToast("Acceso autorizado. ¡Bienvenido, SOLUCIONES F&M!", "success");
    } else {
        loginErrorMsg.style.display = "block";
        loginCard.classList.add("shake-card");
        setTimeout(() => { loginCard.classList.remove("shake-card"); }, 400);
    }
}

function handleLogout() {
    if (confirm("¿Estás seguro de que deseas cerrar la sesión?")) {
        if (eventSource) {
            eventSource.close();
            eventSource = null;
            console.log("Sincronización en tiempo real cerrada al cerrar sesión.");
        }
        sessionStorage.removeItem("soluciones_logged_in");
        showLogin();
        loginUsernameInput.value = "";
        loginPasswordInput.value = "";
        showToast("Sesión cerrada correctamente.", "warning");
    }
}

// --- HYBRID STORAGE HELPER FUNCTIONS ---

function getFirebaseUrl() {
    if (!FIREBASE_DB_URL) return null;
    let url = FIREBASE_DB_URL.trim();
    if (!url.endsWith("/")) url += "/";
    return url + ".json";
}

async function loadData() {
    const url = getFirebaseUrl();
    if (url) {
        try {
            dbStatusBadge.textContent = "Base de Datos: Conectando...";
            dbStatusBadge.style.background = "#fffbeb";
            dbStatusBadge.style.color = "#d97706";

            const res = await fetch(url);
            if (!res.ok) throw new Error("Network error fetching Firebase");
            const cloudData = await res.json();

            if (cloudData && (cloudData.products || cloudData.transactions || cloudData.debts || cloudData.deductions)) {
                products = cloudData.products || [];
                transactions = cloudData.transactions || [];
                debts = cloudData.debts || [];
                deductions = cloudData.deductions || [];
                console.log("Datos cargados correctamente desde la Nube (Firebase).");
            } else {
                // Initialize empty Firebase DB with default demo values
                products = [...DEMO_PRODUCTS];
                transactions = [...DEMO_TRANSACTIONS];
                debts = [...DEMO_DEBTS];
                deductions = [];
                await saveToCloud(url);
                console.log("Base de datos vacía inicializada en la Nube con valores demo.");
            }

            dbStatusBadge.textContent = "Base de Datos: Nube 🟢";
            dbStatusBadge.style.background = "#f0fdf4";
            dbStatusBadge.style.color = "#16a34a";
            syncBtn.style.display = "inline-block";
            return;
        } catch (err) {
            console.warn("Error de conexión a la nube, usando almacenamiento local:", err);
            showToast("Sin conexión a la nube. Operando en modo local.", "warning");
        }
    }

    // Fallback: LocalStorage
    dbStatusBadge.textContent = "Base de Datos: Local 💻";
    dbStatusBadge.style.background = "#f1f5f9";
    dbStatusBadge.style.color = "#475569";
    syncBtn.style.display = "none";

    loadLocalStorage();
}

async function saveData() {
    const url = getFirebaseUrl();
    if (url) {
        try {
            await saveToCloud(url);
            dbStatusBadge.textContent = "Base de Datos: Nube 🟢";
            dbStatusBadge.style.background = "#f0fdf4";
            dbStatusBadge.style.color = "#16a34a";
            return;
        } catch (err) {
            console.error("Fallo al guardar en la nube, respaldando localmente:", err);
            dbStatusBadge.textContent = "Base de Datos: Sin Conexión ⚠️";
            dbStatusBadge.style.background = "#fef2f2";
            dbStatusBadge.style.color = "#dc2626";
            showToast("Fallo al sincronizar. Guardando en almacenamiento local.", "danger");
        }
    }
    
    // Save to LocalStorage fallback
    saveLocalStorage();
}

async function saveToCloud(url) {
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products, transactions, debts, deductions })
    });
    if (!res.ok) throw new Error("Sync failed on PUT request to Firebase");
}

function loadLocalStorage() {
    const savedInventory = localStorage.getItem("inventory_products_fym_v5");
    if (savedInventory) {
        products = JSON.parse(savedInventory);
    } else {
        products = [...DEMO_PRODUCTS];
        localStorage.setItem("inventory_products_fym_v5", JSON.stringify(products));
    }

    const savedTransactions = localStorage.getItem("accounting_transactions");
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    } else {
        transactions = [...DEMO_TRANSACTIONS];
        localStorage.setItem("accounting_transactions", JSON.stringify(transactions));
    }

    const savedDebts = localStorage.getItem("accounting_debts");
    if (savedDebts) {
        debts = JSON.parse(savedDebts);
    } else {
        debts = [...DEMO_DEBTS];
        localStorage.setItem("accounting_debts", JSON.stringify(debts));
    }

    const savedDeductions = localStorage.getItem("inventory_deductions");
    if (savedDeductions) {
        deductions = JSON.parse(savedDeductions);
    } else {
        deductions = [];
        localStorage.setItem("inventory_deductions", JSON.stringify(deductions));
    }
}

function saveLocalStorage() {
    localStorage.setItem("inventory_products_fym_v5", JSON.stringify(products));
    localStorage.setItem("accounting_transactions", JSON.stringify(transactions));
    localStorage.setItem("accounting_debts", JSON.stringify(debts));
    localStorage.setItem("inventory_deductions", JSON.stringify(deductions));
}

// --- REALTIME SYNC & PWA INSTALLATION CONTROLLERS ---

function startRealtimeSync() {
    const url = getFirebaseUrl();
    if (!url) return;

    if (eventSource) {
        eventSource.close();
    }

    try {
        console.log("Iniciando sincronización en tiempo real mediante SSE...");
        eventSource = new EventSource(url);

        eventSource.addEventListener("put", (event) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload && payload.path === "/") {
                    const cloudData = payload.data;
                    if (cloudData) {
                        const incomingProducts = cloudData.products || [];
                        const incomingTransactions = cloudData.transactions || [];
                        const incomingDebts = cloudData.debts || [];
                        const incomingDeductions = cloudData.deductions || [];

                        // Comparar con el estado local para evitar re-renderizados innecesarios o sobrescribir cambios en curso
                        const currentStr = JSON.stringify({ products, transactions, debts, deductions });
                        const incomingStr = JSON.stringify({
                            products: incomingProducts,
                            transactions: incomingTransactions,
                            debts: incomingDebts,
                            deductions: incomingDeductions
                        });

                        if (currentStr !== incomingStr) {
                            products = incomingProducts;
                            transactions = incomingTransactions;
                            debts = incomingDebts;
                            deductions = incomingDeductions;

                            console.log("Realtime sync: Datos locales actualizados desde Firebase.");
                            
                            // Re-renderizar componentes
                            renderInventory();
                            renderDebts();
                            renderReports();

                            // Actualizar indicador de base de datos
                            dbStatusBadge.textContent = "Base de Datos: Nube 🟢";
                            dbStatusBadge.style.background = "#f0fdf4";
                            dbStatusBadge.style.color = "#16a34a";
                        }
                    }
                }
            } catch (err) {
                console.error("Error al procesar el mensaje de sincronización:", err);
            }
        });

        eventSource.onerror = (err) => {
            console.warn("Conexión de tiempo real caída temporalmente, reintentando automáticamente...", err);
        };
    } catch (err) {
        console.error("No se pudo establecer la sincronización en tiempo real:", err);
    }
}

// PWA: Registrar Service Worker si el protocolo es http/https (contexto seguro)
if ("serviceWorker" in navigator && (window.location.protocol === "http:" || window.location.protocol === "https:")) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(reg => console.log("Service Worker registrado con éxito en el ámbito:", reg.scope))
            .catch(err => console.warn("Fallo al registrar el Service Worker:", err));
    });
}

// PWA: Manejar aviso de instalación de la aplicación
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installAppBtn) {
        installAppBtn.style.display = "inline-block";
    }
});

if (installAppBtn) {
    installAppBtn.addEventListener("click", async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Resultado de la instalación PWA: ${outcome}`);
        deferredPrompt = null;
        installAppBtn.style.display = "none";
    });
}

// --- CORE APP CONTROLLER ---

async function initApp() {
    // 1. Sync & Load data (Firebase or LocalStorage fallback)
    await loadData();

    // Iniciar escucha de cambios en tiempo real
    startRealtimeSync();

    // 2. Set default dates
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const monthStr = today.toISOString().substring(0, 7);
    transDateInput.value = todayStr;
    reportStartDate.value = todayStr;
    reportEndDate.value = todayStr;
    debtDueMonthInput.value = monthStr;
    if (discountDateInput) {
        discountDateInput.value = todayStr;
    }

    // 3. Setup Listeners
    searchInput.removeEventListener("input", renderInventory);
    searchInput.addEventListener("input", renderInventory);
    
    openModalBtn.onclick = () => openProductModal(false);
    closeModalBtn.onclick = closeProductModal;
    cancelModalBtn.onclick = closeProductModal;
    
    productForm.onsubmit = handleProductSubmit;
    productModal.onclick = (e) => { if (e.target === productModal) closeProductModal(); };

    // Discount Modal Setup
    if (openDiscountModalBtn) {
        openDiscountModalBtn.onclick = openDiscountModal;
    }
    if (closeDiscountModalBtn) {
        closeDiscountModalBtn.onclick = closeDiscountModal;
    }
    if (cancelDiscountModalBtn) {
        cancelDiscountModalBtn.onclick = closeDiscountModal;
    }
    if (discountLedgerSync) {
        discountLedgerSync.onchange = () => {
            discountLedgerFields.style.display = discountLedgerSync.checked ? "block" : "none";
            if (discountLedgerSync.checked) {
                discountSalePriceInput.required = true;
            } else {
                discountSalePriceInput.required = false;
                discountSalePriceInput.value = "";
                discountSaleDescInput.value = "";
            }
        };
    }
    if (discountForm) {
        discountForm.onsubmit = handleDiscountSubmit;
    }
    if (discountModal) {
        discountModal.onclick = (e) => { if (e.target === discountModal) closeDiscountModal(); };
    }

    categorySelect.onchange = handleCategoryChange;
    accountingForm.onsubmit = handleLedgerSubmit;

    periodSelect.onchange = handlePeriodChange;
    reportStartDate.oninput = renderReports;
    reportEndDate.oninput = renderReports;

    debtForm.onsubmit = handleDebtSubmit;

    syncBtn.onclick = async () => {
        await initApp();
        showToast("¡Datos sincronizados con la nube!", "success");
    };

    const exportSummaryPdfBtn = document.getElementById("export-summary-pdf-btn");
    if (exportSummaryPdfBtn) {
        exportSummaryPdfBtn.onclick = exportSummaryPDF;
    }

    // 4. Render
    renderInventory();
    renderDebts();
    renderReports();
}

// --- BLOCK A: INVENTORY CONTROLLER (MULTI-SEDE TABS & CONSOLIDATED CRIT ALERTS) ---

window.switchInventoryTab = function(tabName) {
    activeInventoryTab = tabName;

    const buttons = ["total", "lima", "arequipa"];
    buttons.forEach(b => {
        const btn = document.getElementById(`tab-btn-${b}`);
        const content = document.getElementById(`tab-content-${b}`);
        if (b === tabName) {
            btn.classList.add("active");
            content.classList.add("active");
        } else {
            btn.classList.remove("active");
            content.classList.remove("active");
        }
    });

    renderInventory();
};

function renderInventory() {
    const searchFilter = searchInput.value.toLowerCase().trim();
    const filtered = products.filter(p => p.nombre.toLowerCase().includes(searchFilter));

    const totalBody = document.getElementById("products-table-body-total");
    const limaBody = document.getElementById("products-table-body-lima");
    const arequipaBody = document.getElementById("products-table-body-arequipa");

    totalBody.innerHTML = "";
    limaBody.innerHTML = "";
    arequipaBody.innerHTML = "";

    // Count products below safety limit
    const critCount = products.filter(p => {
        const stockTotal = (p.stockLima || 0) + (p.stockArequipa || 0);
        return stockTotal < (p.stockCritico || 0);
    }).length;

    if (critCount > 0) {
        inventoryCritAlert.classList.remove("hidden-banner");
        inventoryCritAlertText.textContent = `⚠️ ¡ALERTA DE SEGURIDAD! Hay ${critCount} producto(s) por debajo del stock crítico consolidado en el Inventario General. Revise las filas resaltadas en rojo.`;
    } else {
        inventoryCritAlert.classList.add("hidden-banner");
    }

    if (filtered.length === 0) {
        totalBody.innerHTML = `<tr><td colspan="7" class="no-items-row">No se encontraron productos en el inventario.</td></tr>`;
        limaBody.innerHTML = `<tr><td colspan="4" class="no-items-row">No se encontraron productos.</td></tr>`;
        arequipaBody.innerHTML = `<tr><td colspan="4" class="no-items-row">No se encontraron productos.</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        const sLima = p.stockLima || 0;
        const sArequipa = p.stockArequipa || 0;
        const stockTotal = sLima + sArequipa;
        const stockCrit = p.stockCritico || 0;

        let rowClass = "";
        let badgeClass = "badge-ok";
        let badgeText = "Disponible";

        if (stockTotal < stockCrit) {
            rowClass = "row-critical";
            badgeClass = "badge-critical";
            badgeText = stockTotal === 0 ? "Agotado" : `Crítico (<${stockCrit})`;
        } else if (stockTotal === 0 && stockCrit === 0) {
            badgeClass = "badge-low";
            badgeText = "Vacío";
        } else {
            badgeText = `${stockTotal} Unidades`;
        }

        // 1. Total Table
        const trTotal = document.createElement("tr");
        if (rowClass) trTotal.className = rowClass;
        trTotal.innerHTML = `
            <td><strong>#${p.id}</strong></td>
            <td>
                <span style="font-weight:600; display:block;">${escapeHTML(p.nombre)}</span>
                <small style="color:var(--text-secondary); font-size:0.73rem;">${escapeHTML(p.descripcion || 'Sin especificaciones')}</small>
            </td>
            <td style="text-align: center; font-family: monospace;">${sLima}</td>
            <td style="text-align: center; font-family: monospace;">${sArequipa}</td>
            <td style="text-align: center;">
                <span class="badge-stock ${badgeClass}">${badgeText}</span>
            </td>
            <td style="text-align: center; font-family: monospace; font-weight:600; color:var(--text-secondary);">${stockCrit}</td>
            <td style="text-align: center;">
                <button class="btn btn-icon btn-edit" onclick="editProduct(${p.id})" title="Editar">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                </button>
            </td>
        `;
        totalBody.appendChild(trTotal);

        // 2. Lima Table
        const trLima = document.createElement("tr");
        if (rowClass) trLima.className = rowClass;
        trLima.innerHTML = `
            <td><strong>#${p.id}</strong></td>
            <td><strong>${escapeHTML(p.nombre)}</strong></td>
            <td style="text-align: center; font-family: monospace; font-weight: 600;">${sLima}</td>
            <td style="text-align: center;">
                <button class="btn btn-icon btn-edit" onclick="editProduct(${p.id})" title="Editar">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                </button>
            </td>
        `;
        limaBody.appendChild(trLima);

        // 3. Arequipa Table
        const trAqp = document.createElement("tr");
        if (rowClass) trAqp.className = rowClass;
        trAqp.innerHTML = `
            <td><strong>#${p.id}</strong></td>
            <td><strong>${escapeHTML(p.nombre)}</strong></td>
            <td style="text-align: center; font-family: monospace; font-weight: 600;">${sArequipa}</td>
            <td style="text-align: center;">
                <button class="btn btn-icon btn-edit" onclick="editProduct(${p.id})" title="Editar">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                </button>
            </td>
        `;
        arequipaBody.appendChild(trAqp);
    });
}

function openProductModal(isEdit = false) {
    if (!isEdit) {
        modalTitle.textContent = "Agregar Nuevo Equipo";
        productIdInput.value = "";
        productForm.reset();
    }
    productModal.classList.add("active");
}

function closeProductModal() {
    productModal.classList.remove("active");
    productForm.reset();
}

async function handleProductSubmit(e) {
    e.preventDefault();

    const id = productIdInput.value ? parseInt(productIdInput.value) : null;
    const nombre = productNameInput.value.trim();
    const descripcion = productDescInput.value.trim();
    const stockLima = parseInt(productStockLimaInput.value) || 0;
    const stockArequipa = parseInt(productStockArequipaInput.value) || 0;
    const stockCritico = parseInt(productStockCriticalInput.value) || 0;

    const productObj = {
        id: id || (products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1),
        nombre,
        descripcion,
        stockLima,
        stockArequipa,
        stockCritico
    };

    if (id) {
        const idx = products.findIndex(p => p.id === id);
        if (idx !== -1) {
            products[idx] = productObj;
            showToast(`Producto "${nombre}" actualizado.`);
        }
    } else {
        products.push(productObj);
        showToast(`Producto "${nombre}" agregado al catálogo.`);
    }

    // Sync DB
    await saveData();
    
    renderInventory();
    closeProductModal();
}

window.editProduct = function(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    modalTitle.textContent = "Editar Producto";
    productIdInput.value = p.id;
    productNameInput.value = p.nombre;
    productDescInput.value = p.descripcion || "";
    productStockLimaInput.value = p.stockLima || 0;
    productStockArequipaInput.value = p.stockArequipa || 0;
    productStockCriticalInput.value = p.stockCritico || 0;

    openProductModal(true);
};

// --- BLOCK B: ACCOUNTING LEDGER ENTRY CONTROLLER ---

function handleCategoryChange() {
    const cat = categorySelect.value;
    const type = CATEGORY_MAP[cat];

    detectedBadge.className = "movement-badge";

    if (type === "Ingreso") {
        detectedBadge.classList.add("badge-ingreso");
        detectedBadge.textContent = "🟢 INGRESO";
    } else if (type === "Egreso") {
        detectedBadge.classList.add("badge-egreso");
        detectedBadge.textContent = "🔴 EGRESO";
    } else {
        detectedBadge.classList.add("badge-neutral");
        detectedBadge.textContent = "Sin seleccionar";
    }
}

async function handleLedgerSubmit(e) {
    e.preventDefault();

    const fecha = transDateInput.value;
    const categoria = categorySelect.value;
    const monto = parseFloat(transAmountInput.value);
    const descripcion = transDescInput.value.trim();

    const tipo = CATEGORY_MAP[categoria];
    if (!tipo) {
        showToast("Seleccione una categoría válida.", "warning");
        return;
    }

    const nextId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    const newTrans = { id: nextId, fecha, tipo, categoria, monto, descripcion };

    transactions.push(newTrans);

    await saveData();
    
    accountingForm.reset();
    transDateInput.value = new Date().toISOString().split("T")[0];
    detectedBadge.className = "movement-badge badge-neutral";
    detectedBadge.textContent = "Sin seleccionar";

    showToast(`Transacción #${nextId} guardada.`);
    renderReports();
}

// --- BLOCK C: DEBTS CONTROLLER (SPLIT PEN/USD & DAY 05 WARNING) ---

function calculateDaysToNext05() {
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let targetYear = now.getFullYear();
    let targetMonth = now.getMonth();
    
    if (now.getDate() > 5) {
        targetMonth += 1;
    }
    
    const nextDue = new Date(targetYear, targetMonth, 5);
    const diffMs = nextDue.getTime() - todayMidnight.getTime();
    
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function renderDebts() {
    debtsTableBodyPen.innerHTML = "";
    debtsTableBodyUsd.innerHTML = "";

    const pendingDebts = debts.filter(d => d.estado === "Pendiente");
    const totalPen = pendingDebts.reduce((sum, d) => sum + (d.montoPen || 0), 0);
    const totalUsd = pendingDebts.reduce((sum, d) => sum + (d.montoUsd || 0), 0);

    valDebtPen.textContent = `S/. ${totalPen.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    valDebtUsd.textContent = `$${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const daysRemaining = calculateDaysToNext05();
    
    if (daysRemaining <= 5) {
        debtDueAlert.classList.remove("hidden-banner");
        
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const today = new Date();
        let targetMonthIndex = today.getMonth();
        if (today.getDate() > 5) {
            targetMonthIndex = (targetMonthIndex + 1) % 12;
        }
        const targetMonthName = monthNames[targetMonthIndex];

        if (daysRemaining === 0) {
            debtAlertText.textContent = `⚠️ ¡HOY VENCE EL PAGO DE DEUDAS! Fecha límite de pago obligatorio del día 05 de ${targetMonthName}.`;
        } else {
            debtAlertText.textContent = `⚠️ ¡AVISO DE VENCIMIENTO! Quedan ${daysRemaining} día(s) para el pago obligatorio del día 05 de ${targetMonthName}.`;
        }
    } else {
        debtDueAlert.classList.add("hidden-banner");
    }

    // Soles List (PEN)
    const penList = debts.filter(d => (d.montoPen || 0) > 0);
    penList.sort((a, b) => {
        if (a.estado !== b.estado) return a.estado === "Pendiente" ? -1 : 1;
        return b.vencimiento.localeCompare(a.vencimiento);
    });

    if (penList.length === 0) {
        debtsTableBodyPen.innerHTML = `<tr><td colspan="4" class="no-items-row">Sin cuentas en soles.</td></tr>`;
    } else {
        penList.forEach(d => {
            const tr = document.createElement("tr");
            const amtColor = d.estado === "Pendiente" ? "#b45309" : "var(--text-secondary)";
            
            let actionBtn = "";
            if (d.estado === "Pendiente") {
                actionBtn = `<button class="btn btn-icon btn-edit" style="padding:4px 8px; font-size:0.75rem;" onclick="payDebt(${d.id})">Pagar</button>`;
            } else {
                actionBtn = `<span style="color:var(--color-success); font-weight:600; font-size:0.75rem;">✓ Pagado</span>`;
            }

            tr.innerHTML = `
                <td>
                    <strong>${escapeHTML(d.acreedor)}</strong><br>
                    <span style="font-size:0.65rem; color:var(--text-secondary)">ID #${d.id}</span>
                </td>
                <td style="text-align: right; font-family: monospace; font-weight: 600; color: ${amtColor};">S/. ${d.montoPen.toFixed(2)}</td>
                <td style="text-align: center; font-size: 0.75rem;">${formatDateString(d.vencimiento)}</td>
                <td style="text-align: center;">${actionBtn}</td>
            `;
            debtsTableBodyPen.appendChild(tr);
        });
    }

    // Dollars List (USD)
    const usdList = debts.filter(d => (d.montoUsd || 0) > 0);
    usdList.sort((a, b) => {
        if (a.estado !== b.estado) return a.estado === "Pendiente" ? -1 : 1;
        return b.vencimiento.localeCompare(a.vencimiento);
    });

    if (usdList.length === 0) {
        debtsTableBodyUsd.innerHTML = `<tr><td colspan="4" class="no-items-row">Sin cuentas en dólares.</td></tr>`;
    } else {
        usdList.forEach(d => {
            const tr = document.createElement("tr");
            const amtColor = d.estado === "Pendiente" ? "var(--color-usd)" : "var(--text-secondary)";
            
            let actionBtn = "";
            if (d.estado === "Pendiente") {
                actionBtn = `<button class="btn btn-icon btn-edit" style="padding:4px 8px; font-size:0.75rem;" onclick="payDebt(${d.id})">Pagar</button>`;
            } else {
                actionBtn = `<span style="color:var(--color-success); font-weight:600; font-size:0.75rem;">✓ Pagado</span>`;
            }

            tr.innerHTML = `
                <td>
                    <strong>${escapeHTML(d.acreedor)}</strong><br>
                    <span style="font-size:0.65rem; color:var(--text-secondary)">ID #${d.id}</span>
                </td>
                <td style="text-align: right; font-family: monospace; font-weight: 600; color: ${amtColor};">$${d.montoUsd.toFixed(2)}</td>
                <td style="text-align: center; font-size: 0.75rem;">${formatDateString(d.vencimiento)}</td>
                <td style="text-align: center;">${actionBtn}</td>
            `;
            debtsTableBodyUsd.appendChild(tr);
        });
    }
}

async function handleDebtSubmit(e) {
    e.preventDefault();

    const acreedor = debtCreditorInput.value.trim();
    const montoPen = parseFloat(debtAmountPenInput.value) || 0;
    const montoUsd = parseFloat(debtAmountUsdInput.value) || 0;
    const mesVence = debtDueMonthInput.value;

    if (!acreedor) {
        showToast("Ingrese el acreedor.", "warning");
        return;
    }
    if (montoPen === 0 && montoUsd === 0) {
        showToast("Ingrese un monto.", "warning");
        return;
    }
    if (!mesVence) {
        showToast("Seleccione el mes.", "warning");
        return;
    }

    const vencimiento = `${mesVence}-05`;
    const nextId = debts.length > 0 ? Math.max(...debts.map(d => d.id)) + 1 : 1;
    const newDebt = { id: nextId, acreedor, montoPen, montoUsd, vencimiento, estado: "Pendiente" };

    debts.push(newDebt);

    await saveData();
    
    renderDebts();

    debtCreditorInput.value = "";
    debtAmountPenInput.value = "0";
    debtAmountUsdInput.value = "0";

    showToast(`Cuenta por pagar registrada para el día 05.`);
}

window.payDebt = async function(id) {
    const d = debts.find(debt => debt.id === id);
    if (!d) return;

    if (!confirm(`¿Confirmar pago de la cuenta de "${d.acreedor}"?`)) return;

    const registerExpense = confirm(`¿Deseas registrar este pago automáticamente como un Egreso contable bajo la categoría "PAGO DEUDA"?`);
    if (registerExpense) {
        let expenseAmount = 0.00;
        let noteExtra = `Pago de cuenta por pagar #${d.id} a ${d.acreedor}.`;

        if (d.montoUsd > 0) {
            expenseAmount = d.montoUsd;
        } else if (d.montoPen > 0) {
            const exchangeRate = 3.75;
            expenseAmount = d.montoPen / exchangeRate;
            noteExtra += ` Monto original: S/. ${d.montoPen.toFixed(2)} (TC ${exchangeRate})`;
        }

        const nextId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
        const newTrans = {
            id: nextId,
            fecha: new Date().toISOString().split("T")[0],
            tipo: "Egreso",
            categoria: "PAGO DEUDA",
            monto: expenseAmount,
            descripcion: noteExtra
        };

        transactions.push(newTrans);
    }

    d.estado = "Pagado";
    await saveData();
    
    renderDebts();
    showToast(`Deuda marcada como Pagada.`);
    renderReports();
}

// --- BLOCK D: FINANCIAL REPORTS CONTROLLER ---

function handlePeriodChange() {
    if (periodSelect.value === "personalizado") {
        customRangeInputs.classList.remove("hidden-picker");
    } else {
        customRangeInputs.classList.add("hidden-picker");
    }
    renderReports();
}

function calculateRange(period) {
    const today = new Date();
    const endStr = today.toISOString().split("T")[0];
    let start;

    switch (period) {
        case "dia":
            start = endStr;
            break;
        case "semana":
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 6);
            start = weekAgo.toISOString().split("T")[0];
            break;
        case "mes":
            const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            start = firstOfMonth.toISOString().split("T")[0];
            break;
        case "personalizado":
            start = reportStartDate.value || endStr;
            const end = reportEndDate.value || endStr;
            if (start > end) {
                return { start: end, end: start };
            }
            return { start, end };
        default:
            start = endStr;
    }
    return { start, end: endStr };
}

function renderReports() {
    const period = periodSelect.value;
    const { start, end } = calculateRange(period);

    activeRangeLabel.textContent = `${formatDateString(start)} al ${formatDateString(end)}`;

    const filtered = transactions.filter(t => t.fecha >= start && t.fecha <= end);

    const incomeSum = filtered.reduce((sum, t) => t.tipo === "Ingreso" ? sum + t.monto : sum, 0);
    const expenseSum = filtered.reduce((sum, t) => t.tipo === "Egreso" ? sum + t.monto : sum, 0);
    const netBalance = incomeSum - expenseSum;

    valReportIncome.textContent = `$${incomeSum.toFixed(2)}`;
    valReportExpense.textContent = `$${expenseSum.toFixed(2)}`;
    valReportBalance.textContent = `${netBalance >= 0 ? '' : '-'}$${Math.abs(netBalance).toFixed(2)}`;

    balanceCard.className = "kpi-card";
    if (netBalance >= 0) {
        balanceCard.classList.add("kpi-success");
    } else {
        balanceCard.classList.add("kpi-danger");
    }

    if (currentChartType === "Salidas") {
        const filteredDeductions = deductions.filter(d => d.fecha >= start && d.fecha <= end);
        const pGroup = {};
        filteredDeductions.forEach(d => {
            if (!pGroup[d.productName]) {
                pGroup[d.productName] = { label: d.productName, qty: 0, lima: 0, aqp: 0 };
            }
            pGroup[d.productName].qty += d.qty;
            if (d.sede === "lima") pGroup[d.productName].lima += d.qty;
            else pGroup[d.productName].aqp += d.qty;
        });

        const summaryList = Object.values(pGroup);
        reportsTableBody.innerHTML = "";

        if (summaryList.length === 0) {
            reportsTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="no-items-row">No hay salidas de equipos en este período.</td>
                </tr>
            `;
            if (categoryChartInstance) categoryChartInstance.destroy();
            const canvas = document.getElementById("category-donut-chart");
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#475569";
            ctx.font = "12px Inter";
            ctx.textAlign = "center";
            ctx.fillText("Sin salidas de equipos en este período", canvas.width / 2, canvas.height / 2);
            return;
        }

        summaryList.sort((a, b) => b.qty - a.qty);
        const totalQty = summaryList.reduce((sum, s) => sum + s.qty, 0);

        summaryList.forEach(s => {
            const pct = totalQty > 0 ? (s.qty / totalQty) * 100 : 0;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${s.label}</strong></td>
                <td style="text-align: center; font-size: 0.72rem; color: var(--text-secondary);">Lima: ${s.lima} | Aqp: ${s.aqp}</td>
                <td style="text-align: right; font-family: monospace; font-weight: 600;">${s.qty} Uds</td>
                <td style="text-align: right; font-weight: 500; color:var(--text-secondary);">${pct.toFixed(1)}%</td>
            `;
            reportsTableBody.appendChild(tr);
        });

        // Render Doughnut Chart for Outputs
        const canvas = document.getElementById("category-donut-chart");
        if (categoryChartInstance) categoryChartInstance.destroy();

        const labels = summaryList.map(s => s.label);
        const values = summaryList.map(s => s.qty);
        const colors = ["#f97316", "#ef4444", "#2563eb", "#10b981", "#ca8a04", "#8b5cf6", "#06b6d4", "#475569"];

        categoryChartInstance = new Chart(canvas, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors.slice(0, summaryList.length),
                    borderColor: "#ffffff",
                    borderWidth: 2.5,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        borderColor: "rgba(255,255,255,0.06)",
                        borderWidth: 1,
                        titleFont: { family: "Inter", size: 10, weight: "bold" },
                        bodyFont: { family: "Inter", size: 10 },
                        callbacks: {
                            label: function(context) {
                                const val = context.raw;
                                const sum = context.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = ((val / sum) * 100).toFixed(1);
                                return ` ${val} unidades (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: "55%"
            }
        });

    } else {
        const catGroup = {};
        Object.keys(CATEGORY_MAP).forEach(cat => {
            catGroup[cat] = { categoria: cat, tipo: CATEGORY_MAP[cat], monto: 0.0, conteo: 0 };
        });

        filtered.forEach(t => {
            if (catGroup[t.categoria]) {
                catGroup[t.categoria].monto += t.monto;
                catGroup[t.categoria].conteo += 1;
            }
        });

        const summaryList = Object.values(catGroup).filter(s => s.conteo > 0);

        renderReportsTable(summaryList, incomeSum, expenseSum);
        renderCategoryChart(summaryList);
    }
}

function renderReportsTable(summaryList, totalIncome, totalExpense) {
    reportsTableBody.innerHTML = "";

    if (summaryList.length === 0) {
        reportsTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="no-items-row">No hay registros financieros en este período.</td>
            </tr>
        `;
        return;
    }

    summaryList.sort((a, b) => b.monto - a.monto);

    summaryList.forEach(s => {
        const totalBase = s.tipo === "Ingreso" ? totalIncome : totalExpense;
        const percentage = totalBase > 0 ? (s.monto / totalBase) * 100 : 0;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${s.categoria}</strong></td>
            <td style="text-align: center;">${s.conteo}</td>
            <td style="text-align: right; font-family: monospace; font-weight: 600;">$${s.monto.toFixed(2)}</td>
            <td style="text-align: right; font-weight: 500; color:var(--text-secondary);">${percentage.toFixed(1)}%</td>
        `;
        reportsTableBody.appendChild(tr);
    });
}

function renderCategoryChart(summaryList) {
    const chartData = summaryList.filter(s => s.tipo === currentChartType);
    const canvas = document.getElementById("category-donut-chart");
    const ctx = canvas.getContext("2d");

    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    if (chartData.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#475569";
        ctx.font = "12px Inter";
        ctx.textAlign = "center";
        ctx.fillText(`Sin ${currentChartType.toLowerCase()}s en este período`, canvas.width / 2, canvas.height / 2);
        return;
    }

    const labels = chartData.map(d => d.categoria);
    const values = chartData.map(d => d.monto);
    
    const colors = currentChartType === "Egreso"
        ? ["#ef4444", "#f97316", "#ca8a04", "#06b6d4", "#6366f1", "#a855f7", "#3b82f6", "#0f172a"]
        : ["#10b981", "#0284c7", "#0d9488", "#4ade80"];

    categoryChartInstance = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, chartData.length),
                borderColor: "#ffffff",
                borderWidth: 2.5,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderColor: "rgba(255,255,255,0.06)",
                    borderWidth: 1,
                    titleFont: { family: "Inter", size: 10, weight: "bold" },
                    bodyFont: { family: "Inter", size: 10 },
                    callbacks: {
                        label: function(context) {
                            const val = context.raw;
                            const sum = context.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = ((val / sum) * 100).toFixed(1);
                            return ` $${val.toFixed(2)} (${pct}%)`;
                        }
                    }
                }
            },
            cutout: "55%"
        }
    });
}

window.setChartType = function(type) {
    currentChartType = type;
    const btnExp = document.getElementById("chart-btn-expenses");
    const btnInc = document.getElementById("chart-btn-income");
    const btnOut = document.getElementById("chart-btn-outputs");

    if (btnExp) btnExp.classList.remove("active");
    if (btnInc) btnInc.classList.remove("active");
    if (btnOut) btnOut.classList.remove("active");

    if (type === "Egreso" && btnExp) {
        btnExp.classList.add("active");
    } else if (type === "Ingreso" && btnInc) {
        btnInc.classList.add("active");
    } else if (type === "Salidas" && btnOut) {
        btnOut.classList.add("active");
    }
    renderReports();
};

// --- HELPERS ---

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "";
    if (type === "success") {
        icon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-success); margin-right:6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === "danger") {
        icon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-danger); margin-right:6px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
        icon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-warning); margin-right:6px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    }

    toast.innerHTML = `
        <div style="display:flex; align-items:center;">
            ${icon}
            <span>${escapeHTML(message)}</span>
        </div>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 50);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 250);
    }, 2800);
}

function formatDateString(dateStr) {
    const p = dateStr.split("-");
    return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : dateStr;
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

// --- DAILY DISCOUNT/DEDUCTION CONTROLLERS ---

function openDiscountModal() {
    discountForm.reset();
    discountLedgerFields.style.display = "none";
    discountProductSelect.innerHTML = '<option value="" disabled selected>Seleccione un producto...</option>';
    
    // Sort products by name and populate select dropdown
    const sorted = [...products].sort((a, b) => a.nombre.localeCompare(b.nombre));
    sorted.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = `${p.nombre} (Stock Total: ${(p.stockLima || 0) + (p.stockArequipa || 0)})`;
        discountProductSelect.appendChild(option);
    });

    if (discountDateInput) {
        discountDateInput.value = new Date().toISOString().split("T")[0];
    }

    discountModal.classList.add("active");
}

function closeDiscountModal() {
    discountModal.classList.remove("active");
    discountForm.reset();
}

async function handleDiscountSubmit(e) {
    e.preventDefault();

    const productId = parseInt(discountProductSelect.value);
    const sede = discountSedeSelect.value;
    const qty = parseInt(discountQtyInput.value) || 0;
    const dateVal = discountDateInput ? discountDateInput.value : new Date().toISOString().split("T")[0];

    const p = products.find(prod => prod.id === productId);
    if (!p) {
        showToast("Producto no encontrado.", "danger");
        return;
    }

    if (qty <= 0) {
        showToast("La cantidad a descontar debe ser mayor a 0.", "warning");
        return;
    }

    // Process Stock Deduction
    if (sede === "lima") {
        if ((p.stockLima || 0) < qty) {
            showToast("Stock insuficiente en Sede Lima.", "danger");
            return;
        }
        p.stockLima -= qty;
    } else {
        if ((p.stockArequipa || 0) < qty) {
            showToast("Stock insuficiente en Sede Arequipa.", "danger");
            return;
        }
        p.stockArequipa -= qty;
    }

    // Record Deduction Log
    const nextDeductionId = deductions.length > 0 ? Math.max(...deductions.map(d => d.id)) + 1 : 1;
    const newDeduction = {
        id: nextDeductionId,
        productId: p.id,
        productName: p.nombre,
        qty: qty,
        sede: sede,
        fecha: dateVal
    };
    deductions.push(newDeduction);

    // Auto Ledger Sync Venta Contable
    if (discountLedgerSync.checked) {
        const unitPrice = parseFloat(discountSalePriceInput.value) || 0;
        const totalAmount = unitPrice * qty;
        const note = discountSaleDescInput.value.trim() || "Venta rápida";

        if (totalAmount <= 0) {
            showToast("El precio de venta debe ser mayor a 0 para registrar en caja.", "warning");
            return;
        }

        const nextId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
        const newTrans = {
            id: nextId,
            fecha: dateVal,
            tipo: "Ingreso",
            categoria: "PAGO TOTAL CLIENTE",
            monto: totalAmount,
            descripcion: `Descuento diario: ${qty}x ${p.nombre} (Sede ${sede === "lima" ? "Lima" : "Arequipa"}). ${note}`
        };

        transactions.push(newTrans);
    }

    await saveData();

    renderInventory();
    renderReports();
    closeDiscountModal();
    showToast(`Descuento de ${qty} unidad(es) de "${p.nombre}" procesado.`);
}

// --- BLOCK EXPANSION / FULLSCREEN OVERLAYS CONTROLLERS ---

window.toggleExpandBlock = function(blockId) {
    const block = document.getElementById(blockId);
    if (!block) return;

    const isExpanded = block.classList.toggle("expanded");

    if (isExpanded) {
        document.body.style.overflow = "hidden";
        showToast("Bloque maximizado. Presiona ESC para contraer.", "warning");
    } else {
        document.body.style.overflow = "";
    }
};

// Listen escape key to close any maximized layout overlays
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const expanded = document.querySelector(".dashboard-card.expanded");
        if (expanded) {
            toggleExpandBlock(expanded.id);
        }
    }
});

// =============================================================================
//   EXPORT TO EXCEL AND PDF SYSTEMS
// =============================================================================

window.exportBlockExcel = function(type) {
    let headers = [];
    let rows = [];
    let filename = `fym_export_${type}_${new Date().toISOString().split("T")[0]}`;

    if (type === "inventory") {
        headers = ["ID", "Producto / Equipo", "Descripción", "Stock Lima", "Stock Arequipa", "Stock Total", "Stock Crítico", "Alerta Stock"];
        rows = products.map(p => {
            const tot = (p.stockLima || 0) + (p.stockArequipa || 0);
            return [
                p.id,
                p.nombre,
                p.descripcion || "",
                p.stockLima || 0,
                p.stockArequipa || 0,
                tot,
                p.stockCritico || 5,
                tot < (p.stockCritico || 5) ? "CRÍTICO 🚨" : "OK"
            ];
        });
    } else if (type === "ledger") {
        headers = ["ID", "Fecha", "Tipo Flujo", "Categoría", "Monto (USD $)", "Descripción / Detalle"];
        rows = transactions.map(t => [
            t.id,
            t.fecha,
            t.tipo,
            t.categoria,
            t.monto,
            t.descripcion || ""
        ]);
    } else if (type === "debts") {
        headers = ["ID", "Acreedor / Proveedor", "Monto S/. (PEN)", "Monto $ (USD)", "Fecha Vencimiento", "Estado"];
        rows = debts.map(d => [
            d.id,
            d.acreedor,
            d.montoPen || 0.0,
            d.montoUsd || 0.0,
            d.vencimiento,
            d.estado
        ]);
    } else if (type === "reports") {
        if (currentChartType === "Salidas") {
            headers = ["Producto / Equipo", "Unidades Sede Lima", "Unidades Sede Arequipa", "Total Unidades Descontadas"];
            const pGroup = {};
            deductions.forEach(d => {
                if (!pGroup[d.productName]) pGroup[d.productName] = { name: d.productName, lima: 0, aqp: 0 };
                if (d.sede === "lima") pGroup[d.productName].lima += d.qty;
                else pGroup[d.productName].aqp += d.qty;
            });
            rows = Object.values(pGroup).map(item => [
                item.name,
                item.lima,
                item.aqp,
                item.lima + item.aqp
            ]);
        } else {
            headers = ["Categoría", "Flujo Tipo", "Monto Consolidado (USD $)", "Porcentaje de Participación"];
            const filtered = transactions.filter(t => t.tipo === currentChartType);
            const total = filtered.reduce((sum, t) => sum + t.monto, 0);
            const counts = {};
            filtered.forEach(t => {
                if (!counts[t.categoria]) counts[t.categoria] = 0;
                counts[t.categoria] += t.monto;
            });
            rows = Object.keys(counts).map(cat => [
                cat,
                currentChartType,
                counts[cat],
                total > 0 ? `${((counts[cat] / total) * 100).toFixed(1)}%` : "0.0%"
            ]);
        }
    }

    try {
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Datos");
        XLSX.writeFile(wb, `${filename}.xlsx`);
        showToast(`Documento Excel exportado correctamente.`);
    } catch (e) {
        console.error(e);
        showToast("Error al generar el archivo Excel.", "danger");
    }
};

window.exportBlockPDF = function(type) {
    if (!window.jspdf) {
        showToast("Librería PDF no cargada.", "danger");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();

    // Design branding
    doc.setFillColor(15, 23, 42); // Industrial Navy Slate
    doc.rect(0, 0, 220, 24, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SOLUCIONES F&M - CONTROL DE GESTIÓN", 14, 15);
    doc.setFontSize(8);
    doc.text(`Fecha: ${dateStr} | Sede: Lima & Arequipa`, 150, 15);

    let title = "";
    let headers = [];
    let rows = [];

    if (type === "inventory") {
        title = "INVENTARIO COMPLETO DE EQUIPOS ALIMENTARIOS";
        headers = ["ID", "Producto / Equipo", "Stock Lima", "Stock Aqp", "Total", "Crit", "Alerta"];
        rows = products.map(p => {
            const tot = (p.stockLima || 0) + (p.stockArequipa || 0);
            return [
                p.id,
                p.nombre,
                p.stockLima || 0,
                p.stockArequipa || 0,
                tot,
                p.stockCritico || 5,
                tot < (p.stockCritico || 5) ? "ALERTA" : "OK"
            ];
        });
    } else if (type === "ledger") {
        title = "HISTORIAL CONTABLE DE CAJA DIARIA (TRANSACCIONES)";
        headers = ["ID", "Fecha", "Tipo", "Categoria", "Monto", "Descripcion"];
        rows = transactions.map(t => [
            t.id,
            t.fecha,
            t.tipo,
            t.categoria,
            `$${t.monto.toFixed(2)}`,
            t.descripcion || ""
        ]);
    } else if (type === "debts") {
        title = "SEGUIMIENTO DE CUENTAS POR PAGAR (DEUDAS)";
        headers = ["ID", "Acreedor / Proveedor", "Monto S/.", "Monto $", "Vencimiento", "Estado"];
        rows = debts.map(d => [
            d.id,
            d.acreedor,
            `S/. ${(d.montoPen || 0).toFixed(2)}`,
            `$ ${(d.montoUsd || 0).toFixed(2)}`,
            d.vencimiento,
            d.estado
        ]);
    } else if (type === "reports") {
        title = `REPORTE CONSOLIDADO DE ${currentChartType.toUpperCase()}S`;
        if (currentChartType === "Salidas") {
            headers = ["Producto / Equipo", "Sede Lima", "Sede Arequipa", "Total Salidas"];
            const pGroup = {};
            deductions.forEach(d => {
                if (!pGroup[d.productName]) pGroup[d.productName] = { name: d.productName, lima: 0, aqp: 0 };
                if (d.sede === "lima") pGroup[d.productName].lima += d.qty;
                else pGroup[d.productName].aqp += d.qty;
            });
            rows = Object.values(pGroup).map(item => [
                item.name,
                item.lima,
                item.aqp,
                `${item.lima + item.aqp} Uds`
            ]);
        } else {
            headers = ["Categoria", "Tipo", "Monto Consolidado", "Porcentaje"];
            const filtered = transactions.filter(t => t.tipo === currentChartType);
            const total = filtered.reduce((sum, t) => sum + t.monto, 0);
            const counts = {};
            filtered.forEach(t => {
                if (!counts[t.categoria]) counts[t.categoria] = 0;
                counts[t.categoria] += t.monto;
            });
            rows = Object.keys(counts).map(cat => [
                cat,
                currentChartType,
                `$${counts[cat].toFixed(2)}`,
                total > 0 ? `${((counts[cat] / total) * 100).toFixed(1)}%` : "0%"
            ]);
        }
    }

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 34);

    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 38,
        theme: "grid",
        headStyles: { fillColor: [249, 115, 22] }, // Brand terracotta orange
        styles: { fontSize: 8.5 },
        margin: { left: 14, right: 14 }
    });

    doc.save(`fym_reporte_${type}_${new Date().toISOString().split("T")[0]}.pdf`);
    showToast(`Documento PDF exportado correctamente.`);
};

window.exportSummaryPDF = function() {
    if (!window.jspdf) {
        showToast("Librería PDF no cargada.", "danger");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();

    // PAGE 1: EXECUTIVE SUMMARY
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 220, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("SOLUCIONES F&M - INFORME GENERAL EJECUTIVO", 14, 18);
    doc.setFontSize(8.5);
    doc.text(`Fecha de Emisión: ${dateStr}`, 160, 18);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text("RESUMEN DE ESTADO Y MÉTRICAS DE CONTROL", 14, 38);

    // Build statistics summary block
    const totalItems = products.length;
    const criticalItems = products.filter(p => ((p.stockLima || 0) + (p.stockArequipa || 0)) < (p.stockCritico || 5)).length;
    
    const incomeTotal = transactions.filter(t => t.tipo === "Ingreso").reduce((sum, t) => sum + t.monto, 0);
    const expenseTotal = transactions.filter(t => t.tipo === "Egreso").reduce((sum, t) => sum + t.monto, 0);
    const balanceNeto = incomeTotal - expenseTotal;

    const pendingPen = debts.filter(d => d.estado === "Pendiente").reduce((sum, d) => sum + (d.montoPen || 0), 0);
    const pendingUsd = debts.filter(d => d.estado === "Pendiente").reduce((sum, d) => sum + (d.montoUsd || 0), 0);

    const summaryTable = [
        ["Concepto Indicador", "Métrica de Valor", "Estado"],
        ["Equipos en Catálogo", `${totalItems} productos`, "OK"],
        ["Equipos en Stock Crítico", `${criticalItems} productos`, criticalItems > 0 ? "ALERTA CRÍTICA 🚨" : "Estable"],
        ["Total Ingresos de Caja", `$ ${incomeTotal.toFixed(2)}`, "Caja Activa"],
        ["Total Egresos de Caja", `$ ${expenseTotal.toFixed(2)}`, "Gastos Operativos"],
        ["Balance Operativo Neto", `$ ${balanceNeto.toFixed(2)}`, balanceNeto >= 0 ? "Superávit 🟢" : "Déficit 🔴"],
        ["Deudas Cuentas por Pagar (Soles)", `S/. ${pendingPen.toFixed(2)}`, "Pendientes de Pago"],
        ["Deudas Cuentas por Pagar (Dólares)", `$ ${pendingUsd.toFixed(2)}`, "Pendientes de Pago"]
    ];

    doc.autoTable({
        body: summaryTable,
        startY: 42,
        theme: "striped",
        styles: { fontSize: 9.5 }
    });

    // PAGE 2: INVENTORY DETAIL
    doc.addPage();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 220, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("DETALLE DEL CATÁLOGO DE INVENTARIOS (SEDE LIMA & AREQUIPA)", 14, 13);
    
    const invHeaders = ["ID", "Nombre de Equipo", "Stock Lima", "Stock Arequipa", "Stock Total", "Límite Crítico"];
    const invRows = products.map(p => [
        p.id,
        p.nombre,
        p.stockLima || 0,
        p.stockArequipa || 0,
        (p.stockLima || 0) + (p.stockArequipa || 0),
        p.stockCritico || 5
    ]);
    doc.autoTable({
        head: [invHeaders],
        body: invRows,
        startY: 28,
        theme: "grid",
        headStyles: { fillColor: [249, 115, 22] },
        styles: { fontSize: 8 }
    });

    // PAGE 3: CAJA DETAIL & DEBTS DETAIL
    doc.addPage();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 220, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("HISTORIAL DE CAJA & CUENTAS POR PAGAR (DEUDAS)", 14, 13);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text("Últimos Registros Contables de Caja:", 14, 28);

    const tHeaders = ["Fecha", "Tipo", "Categoría", "Monto", "Nota"];
    const tRows = transactions.slice(-15).map(t => [
        t.fecha,
        t.tipo,
        t.categoria,
        `$ ${t.monto.toFixed(2)}`,
        t.descripcion || ""
    ]);
    doc.autoTable({
        head: [tHeaders],
        body: tRows,
        startY: 32,
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 8 }
    });

    const currentY = doc.lastAutoTable.finalY + 12;
    doc.text("Seguimiento de Proveedores y Acreedores (Deudas Activas):", 14, currentY);

    const dHeaders = ["Acreedor / Proveedor", "Monto S/.", "Monto $", "Vencimiento", "Estado"];
    const dRows = debts.map(d => [
        d.acreedor,
        `S/. ${(d.montoPen || 0).toFixed(2)}`,
        `$ ${(d.montoUsd || 0).toFixed(2)}`,
        d.vencimiento,
        d.estado
    ]);
    doc.autoTable({
        head: [dHeaders],
        body: dRows,
        startY: currentY + 4,
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 8 }
    });

    doc.save(`fym_informe_ejecutivo_${new Date().toISOString().split("T")[0]}.pdf`);
    showToast("Reporte General Ejecutivo PDF generado con éxito.");
};
