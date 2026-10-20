/* ==========================================================
   FLASHVAULT - JAVASCRIPT LOGIC
   Platform Hafalan & Belajar Interaktif Siswa SMA Kelas 11
   ========================================================== */

// 1. DATA DATABASE (Materi Kurikulum SMA Kelas 11)
const defaultDecks = [
  {
    id: "kimia-11-01",
    subject: "Kimia Kelas 11",
    topic: "Stoikiometri & Mol",
    cards: [
      { front: "Apa rumus mencari jumlah Mol (n) jika diketahui Massa (g) dan Ar/Mr?", back: "n = Massa / Ar (atau Mr)" },
      { front: "Berapa volume 1 mol gas ideal pada keadaan standar (STP)?", back: "22,4 Liter" },
      { front: "Apa bunyi Hukum Lavoisier (Kekekalan Massa)?", back: "Massa total zat sebelum dan sesudah reaksi adalah sama." },
      { front: "Apa rumus persentase massa unsur dalam senyawa?", back: "% unsur = (Jumlah atom x Ar / Mr Senyawa) x 100%" }
    ]
  },
  {
    id: "fisika-11-01",
    subject: "Fisika Kelas 11",
    topic: "Dinamika Rotasi & Momen Inersia",
    cards: [
      { front: "Apa rumus Momen Gaya (Torsi)?", back: "τ = F × r × sin(θ)" },
      { front: "Momen inersia silinder pejal dengan poros di pusat adalah...", back: "I = 1/2 × M × R²" },
      { front: "Apa syarat keseimbangan benda tegar?", back: "ΣF = 0 (Translasi) dan Στ = 0 (Rotasi)" },
      { front: "Apa rumus Energi Kinetik Rotasi?", back: "Ek = 1/2 × I × ω²" }
    ]
  },
  {
    id: "biologi-11-01",
    subject: "Biologi Kelas 11",
    topic: "Struktur & Fungsi Sel",
    cards: [
      { front: "Organel sel yang berfungsi sebagai tempat respirasi sel dan penghasil energi (ATP) adalah...", back: "Mitokondria" },
      { front: "Apa perbedaan utama antara sel hewan dan sel tumbuhan?", back: "Sel tumbuhan memiliki dinding sel dan kloroplas, sedangkan sel hewan tidak." },
      { front: "Bagian sel yang berfungsi mengatur seluruh aktivitas sel dan mengandung materi genetik (DNA) adalah...", back: "Nukleus (Inti Sel)" }
    ]
  },
  {
    id: "matematika-11-01",
    subject: "Matematika Peminatan Kelas 11",
    topic: "Persamaan Trigonometri",
    cards: [
      { front: "Berapa nilai dari sin(30°) dan cos(60°)?", back: "sin(30°) = 1/2 dan cos(60°) = 1/2" },
      { front: "Apa identitas trigonometri dasar yang menghubungkan sin dan cos?", back: "sin²(x) + cos²(x) = 1" },
      { front: "Berapa nilai dari tan(45°)?", back: "1" }
    ]
  }
];

// 2. STATE APLIKASI
let flashcardData = [];
let currentDeck = null;
let currentCardIndex = 0;

// 3. REFERENSI ELEMEN DOM
const deckSelection = document.getElementById("deck-selection");
const flashcardSection = document.getElementById("flashcard-section");
const deckListContainer = document.getElementById("deck-list");

const topicTitle = document.getElementById("topic-title");
const flashcard = document.getElementById("flashcard");
const cardFront = document.getElementById("card-front");
const cardBack = document.getElementById("card-back");
const cardCounter = document.getElementById("card-counter");

const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnFlip = document.getElementById("btn-flip");
const btnBackToDecks = document.getElementById("btn-back-to-decks");

// 4. INISIALISASI APLIKASI
function initApp() {
  // Muat data dari localStorage jika ada, atau gunakan data bawaan (defaultDecks)
  const savedDecks = localStorage.getItem("flashvault_decks");
  if (savedDecks) {
    flashcardData = JSON.parse(savedDecks);
  } else {
    flashcardData = defaultDecks;
    localStorage.setItem("flashvault_decks", JSON.stringify(defaultDecks));
  }

  renderDeckList();
}

// 5. RENDER DAFTAR TOPIK DI HALAMAN UTAMA
function renderDeckList() {
  deckListContainer.innerHTML = "";
  
  flashcardData.forEach((deck) => {
    const cardEl = document.createElement("div");
    cardEl.className = "deck-card";
    cardEl.innerHTML = `
      <h3>${deck.topic}</h3>
      <p>${deck.subject}</p>
      <p><strong>📚 ${deck.cards.length} Kartu Hafalan</strong></p>
    `;
    
    // Event ketika kartu topik diklik untuk mulai belajar
    cardEl.addEventListener("click", () => startFlashcardSession(deck));
    deckListContainer.appendChild(cardEl);
  });
}

// 6. MULAI SESI BELAJAR (MEMBUKA FLASHCARD)
function startFlashcardSession(deck) {
  currentDeck = deck;
  currentCardIndex = 0;
  
  // Transisi Tampilan UI
  deckSelection.classList.add("hidden");
  flashcardSection.classList.remove("hidden");
  
  topicTitle.textContent = `${deck.subject} - ${deck.topic}`;
  renderCard();
}

// 7. RENDER KARTU AKTIF (PERTANYAAN & JAWABAN)
function renderCard() {
  // Pastikan posisi kartu kembali menghadap depan setiap berganti kartu
  flashcard.classList.remove("flipped");
  
  const card = currentDeck.cards[currentCardIndex];
  
  // Masukkan teks ke elemen HTML
  cardFront.innerHTML = `
    <span>${card.front}</span>
    <div class="hint-text">(Klik kartu atau tekan Spasi untuk melihat jawaban)</div>
  `;
  
  cardBack.innerHTML = `
    <span>${card.back}</span>
    <div class="hint-text">(Klik kartu untuk kembali ke pertanyaan)</div>
  `;
  
  // Update Indikator Nomor Kartu
  cardCounter.textContent = `Kartu ${currentCardIndex + 1} dari ${currentDeck.cards.length}`;
  
  // Atur status tombol navigasi (disable jika di ujung)
  btnPrev.disabled = currentCardIndex === 0;
  btnNext.disabled = currentCardIndex === currentDeck.cards.length - 1;
  
  btnPrev.style.opacity = currentCardIndex === 0 ? "0.5" : "1";
  btnNext.style.opacity = currentCardIndex === currentDeck.cards.length - 1 ? "0.5" : "1";
}

// 8. EVENT LISTENERS UTAMA
// Aksi Membalik Kartu (Tombol atau Klik Kartu)
function toggleFlipCard() {
  flashcard.classList.toggle("flipped");
}

btnFlip.addEventListener("click", toggleFlipCard);
flashcard.addEventListener("click", toggleFlipCard);

// Aksi Tombol Selanjutnya (Next)
btnNext.addEventListener("click", () => {
  if (currentCardIndex < currentDeck.cards.length - 1) {
    currentCardIndex++;
    renderCard();
  }
});

// Aksi Tombol Sebelumnya (Previous)
btnPrev.addEventListener("click", () => {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    renderCard();
  }
});

// Aksi Kembali ke Pilihan Topik
btnBackToDecks.addEventListener("click", () => {
  flashcardSection.classList.add("hidden");
  deckSelection.classList.remove("hidden");
  currentDeck = null;
});

// 9. DUKUNGAN KEYBOARD SHORTCUTS (KEMUDAHAN NAVIGASI SISWA)
document.addEventListener("keydown", (e) => {
  // Hanya aktif jika sesi flashcard sedang dibuka
  if (!flashcardSection.classList.contains("hidden")) {
    if (e.code === "Space") {
      e.preventDefault(); // Mencegah halaman ikut scroll ke bawah
      toggleFlipCard();
    } else if (e.code === "ArrowRight") {
      if (currentCardIndex < currentDeck.cards.length - 1) {
        currentCardIndex++;
        renderCard();
      }
    } else if (e.code === "ArrowLeft") {
      if (currentCardIndex > 0) {
        currentCardIndex--;
        renderCard();
      }
    }
  }
});

// 10. JALANKAN APLIKASI SAAT HALAMAN DIMUAT
document.addEventListener("DOMContentLoaded", initApp);
