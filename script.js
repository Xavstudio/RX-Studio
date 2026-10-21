// Nomor WhatsApp yang dapat dikonfigurasi
const WHATSAPP_NUMBER = "6281234567890"; // Ganti dengan nomor WhatsApp aktual

let quantity = 1;

// Tombol Menu Seluler
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Fungsi Filter Portofolio
function filterPortfolio(category) {
    const items = document.querySelectorAll('.portfolio-item');
    const buttons = document.querySelectorAll('.portfolio-filter-btn');

    buttons.forEach(btn => {
        if(btn.dataset.filter === category) {
            btn.classList.add('bg-white/10', 'text-white');
            btn.classList.remove('text-gray-400');
        } else {
            btn.classList.remove('bg-white/10', 'text-white');
            btn.classList.add('text-gray-400');
        }
    });

    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Logika Kalkulator
function adjustQuantity(delta) {
    quantity = Math.max(1, quantity + delta);
    document.getElementById('quantityDisplay').innerText = quantity;
    calculateTotal();
}

function calculateTotal() {
    const serviceSelect = document.getElementById('serviceType');
    const basePrice = parseInt(serviceSelect.value);
    
    const speedRadio = document.querySelector('input[name="speed"]:checked');
    const speedPrice = parseInt(speedRadio.value);

    const sourceFileCheck = document.getElementById('addonSourceFile');
    const mockupCheck = document.getElementById('addonMockup');

    let addonTotal = 0;
    if (sourceFileCheck.checked) addonTotal += parseInt(sourceFileCheck.value);
    if (mockupCheck.checked) addonTotal += parseInt(mockupCheck.value);

    const subtotal = (basePrice * quantity) + speedPrice + addonTotal;

    // Format ke Rupiah IDR
    const formattedTotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(subtotal);
    const formattedBase = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(basePrice);
    const formattedSpeed = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(speedPrice);
    const formattedAddons = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(addonTotal);

    // Memperbarui elemen UI
    document.getElementById('totalPriceDisplay').innerText = formattedTotal;
    document.getElementById('summaryBase').innerText = formattedBase;
    document.getElementById('summaryQty').innerText = quantity + ' x';
    document.getElementById('summarySpeed').innerText = formattedSpeed;
    document.getElementById('summaryAddons').innerText = formattedAddons;
}

// Pembangkit Tautan WhatsApp
function sendToWhatsApp() {
    const serviceSelect = document.getElementById('serviceType');
    const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
    
    const speedRadio = document.querySelector('input[name="speed"]:checked');
    const speedLabel = speedRadio.value === "0" ? "Reguler (2-3 Hari)" : "Ekspres 24 Jam";

    const sourceFileCheck = document.getElementById('addonSourceFile').checked ? "Ya (+Master File)" : "Tidak";
    const mockupCheck = document.getElementById('addonMockup').checked ? "Ya (+Mockup Resolusi Tinggi)" : "Tidak";

    const totalPrice = document.getElementById('totalPriceDisplay').innerText;

    const message = `Halo RX Studio! Saya ingin memesan desain berikut:%0A%0A` +
                    `🎨 *Layanan:* ${serviceName}%0A` +
                    `🔢 *Jumlah Variasi:* ${quantity}%0A` +
                    `⚡ *Kecepatan:* ${speedLabel}%0A` +
                    `📂 *Master File Sumber:* ${sourceFileCheck}%0A` +
                    `👕 *Mockup Resolusi Tinggi:* ${mockupCheck}%0A%0A` +
                    `💰 *Total Estimasi:* ${totalPrice}%0A%0A` +
                    `Mohon konfirmasi dan info langkah selanjutnya ya! Terima kasih.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

// Inisialisasi kalkulator saat halaman dimuat
window.onload = function() {
    calculateTotal();
};
