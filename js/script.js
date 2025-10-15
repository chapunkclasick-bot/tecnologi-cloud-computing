const initialBooks = [
    {
        id: 1,
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        year: 2005,
        category: "Fiksi",
        description: "Novel Indonesia yang menceritakan kehidupan anak-anak di Belitung",
        status: "Tersedia"
    },
    {
        id: 2,
        title: "Bumi Manusia",
        author: "Pramoedya Ananta Toer",
        year: 1980,
        category: "Fiksi",
        description: "Novel sejarah Indonesia yang menggambarkan masa kolonial",
        status: "Dipinjam"
    },
    {
        id: 3,
        title: "Filosofi Teras",
        author: "Henry Manampiring",
        year: 2018,
        category: "Filsafat",
        description: "Pengenalan filsafat Stoa untuk kehidupan modern",
        status: "Tersedia"
    }
];

// Fungsi untuk mendapatkan data buku dari localStorage
function getBooks() {
    const books = localStorage.getItem('libraryBooks');
    return books ? JSON.parse(books) : initialBooks;
}

// Fungsi untuk menyimpan data buku ke localStorage
function saveBooks(books) {
    localStorage.setItem('libraryBooks', JSON.stringify(books));
}

// ==================== NAVIGATION ====================

// Fungsi navigasi
function navigateTo(pageId) {
    // Sembunyikan semua halaman
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Tampilkan halaman yang dipilih
    document.getElementById(pageId + 'Page').classList.add('active');
    
    // Update menu navigasi
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    // Sembunyikan mobile menu jika terbuka
    document.getElementById('mobileNav').classList.remove('active');
    
    // Sembunyikan hero section jika bukan home
    document.getElementById('heroSection').style.display = pageId === 'home' ? 'block' : 'none';
    
    // Jika navigasi ke collection, refresh tampilan buku
    if (pageId === 'collection') {
        displayBooks();
    }
    
    // Jika navigasi ke home, tampilkan buku terbaru
    if (pageId === 'home') {
        displayRecentBooks();
        updateStatistics();
    }
}

// ==================== BOOK DISPLAY ====================

// Fungsi untuk menampilkan buku
function displayBooks(books = null) {
    const booksToDisplay = books || getBooks();
    const booksContainer = document.getElementById('books-container');
    const bookCount = document.getElementById('book-count');
    
    bookCount.textContent = `${booksToDisplay.length} buku`;
    
    if (booksToDisplay.length === 0) {
        booksContainer.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 40px;">
                <p>Belum ada buku dalam koleksi. Tambahkan buku pertama Anda!</p>
            </div>
        `;
        return;
    }
    
    booksContainer.innerHTML = booksToDisplay.map(book => `
        <div class="book-card">
            <div class="book-cover">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">Oleh: ${book.author}</p>
                <p class="book-year">Tahun: ${book.year}</p>
                <p>Kategori: ${book.category}</p>
                <p>Status: <span class="${book.status === 'Tersedia' ? 'text-success' : 'text-danger'}">${book.status}</span></p>
                <div class="book-actions mt-20">
                    <button class="btn btn-primary" onclick="toggleStatus(${book.id})">
                        ${book.status === 'Tersedia' ? 'Pinjam' : 'Kembalikan'}
                    </button>
                    <button class="btn btn-danger" onclick="deleteBook(${book.id})">Hapus</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Fungsi untuk menampilkan buku terbaru (5 buku terbaru)
function displayRecentBooks() {
    const books = getBooks();
    const recentBooks = books.slice(-5).reverse(); // Ambil 5 buku terbaru
    const recentBooksContainer = document.getElementById('recent-books-container');
    
    if (recentBooks.length === 0) {
        recentBooksContainer.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 40px;">
                <p>Belum ada buku dalam koleksi. Tambahkan buku pertama Anda!</p>
            </div>
        `;
        return;
    }
    
    recentBooksContainer.innerHTML = recentBooks.map(book => `
        <div class="book-card">
            <div class="book-cover">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">Oleh: ${book.author}</p>
                <p class="book-year">Tahun: ${book.year}</p>
                <p>Kategori: ${book.category}</p>
                <p>Status: <span class="${book.status === 'Tersedia' ? 'text-success' : 'text-danger'}">${book.status}</span></p>
            </div>
        </div>
    `).join('');
}

// ==================== BOOK MANAGEMENT ====================

// Fungsi untuk menambah buku
function addBook(event) {
    event.preventDefault();
    
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const year = document.getElementById('book-year').value || new Date().getFullYear();
    const category = document.getElementById('book-category').value || 'Lainnya';
    const description = document.getElementById('book-description').value;
    const status = document.getElementById('book-status').value;
    
    const books = getBooks();
    const newBook = {
        id: Date.now(), // ID unik berdasarkan timestamp
        title,
        author,
        year: parseInt(year),
        category,
        description,
        status
    };
    
    books.push(newBook);
    saveBooks(books);
    displayRecentBooks();
    updateStatistics();
    
    // Reset form
    document.getElementById('book-form').reset();
    
    // Tampilkan pesan sukses
    alert('Buku berhasil ditambahkan!');
}

// Fungsi untuk menghapus buku
function deleteBook(id) {
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
        const books = getBooks();
        const updatedBooks = books.filter(book => book.id !== id);
        saveBooks(updatedBooks);
        displayBooks();
        displayRecentBooks();
        updateStatistics();
    }
}

// Fungsi untuk mengubah status buku (Tersedia/Dipinjam)
function toggleStatus(id) {
    const books = getBooks();
    const updatedBooks = books.map(book => {
        if (book.id === id) {
            return {
                ...book,
                status: book.status === 'Tersedia' ? 'Dipinjam' : 'Tersedia'
            };
        }
        return book;
    });
    
    saveBooks(updatedBooks);
    displayBooks();
    displayRecentBooks();
    updateStatistics();
}

// ==================== STATISTICS ====================

// Fungsi untuk memperbarui statistik
function updateStatistics() {
    const books = getBooks();
    const totalBooks = books.length;
    const availableBooks = books.filter(book => book.status === 'Tersedia').length;
    const borrowedBooks = books.filter(book => book.status === 'Dipinjam').length;
    
    // Hitung jumlah kategori unik
    const categories = [...new Set(books.map(book => book.category))];
    const categoriesCount = categories.length;
    
    document.getElementById('total-books').textContent = totalBooks;
    document.getElementById('available-books').textContent = availableBooks;
    document.getElementById('borrowed-books').textContent = borrowedBooks;
    document.getElementById('categories-count').textContent = categoriesCount;
}

// ==================== SEARCH & FILTER ====================

// Fungsi untuk mencari buku
function searchBooks() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    const books = getBooks();
    
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                            book.author.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || book.category === categoryFilter;
        const matchesStatus = !statusFilter || book.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    displayBooks(filteredBooks);
}

// ==================== CONTACT FORM ====================

// Fungsi untuk mengirim pesan kontak
function sendMessage(event) {
    event.preventDefault();
    alert('Pesan Anda telah berhasil dikirim! Kami akan menghubungi Anda segera.');
    document.getElementById('contact-form').reset();
}

// ==================== INITIALIZATION ====================

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Sembunyikan loading screen
    setTimeout(function() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }, 1000);
    
    // Tampilkan buku saat halaman dimuat
    displayRecentBooks();
    updateStatistics();
    
    // Event listener untuk form tambah buku
    const bookForm = document.getElementById('book-form');
    if (bookForm) {
        bookForm.addEventListener('submit', addBook);
    }
    
    // Event listener untuk form kontak
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', sendMessage);
    }
    
    // Event listener untuk pencarian dan filter
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', searchBooks);
    }
    
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', searchBooks);
    }
    
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', searchBooks);
    }
    
    // Event listener untuk navigasi
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });
    
    // Event listener untuk CTA button
    const ctaButton = document.getElementById('ctaButton');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo('collection');
        });
    }
    
    // Event listener untuk mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const mobileNav = document.getElementById('mobileNav');
            if (mobileNav) {
                mobileNav.classList.toggle('active');
            }
        });
    }
});

// Export functions untuk global access
window.navigateTo = navigateTo;
window.addBook = addBook;
window.deleteBook = deleteBook;
window.toggleStatus = toggleStatus;
window.searchBooks = searchBooks;
window.sendMessage = sendMessage;
window.getBooks = getBooks;
