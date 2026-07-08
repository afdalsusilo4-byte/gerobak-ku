// ===== GEROBAK KU - CONFIG =====
// Edit file ini untuk mengubah konten website.
// Atau gunakan Admin Panel: /admin.html

const SITE_CONFIG = {
    // ===== PROFIL BISNIS =====
    brand: {
        name: "Gerobak Ku",
        tagline: "Gerobak Berkah Untuk Kita Semua",
        description: "Spesialis pembuatan gerobak profesional untuk mall, food court, dan bisnis kuliner.",
        logo: "images/logo.svg",
        yearFounded: 2015,
    },

    // ===== KONTAK =====
    contact: {
        whatsapp: "628xxxxxxxxx",  // Format: 628xxx (tanpa +)
        email: "info@gerobakku.com",
        address: "Sidoarjo, Jawa Timur",
        workHours: "Senin-Sabtu, 08.00 - 17.00 WIB",
        instagram: "",  // opsional
    },

    // ===== STATISTIK =====
    stats: {
        gerobakTerjual: 500,
        klienPuas: 50,
        tahunPengalaman: 10,
    },

    // ===== LAYANAN =====
    services: [
        {
            id: "fnb",
            name: "Gerobak F&B",
            badge: "🔥 POPULER",
            badgeColor: "accent",
            description: "Gerobak khusus makanan & minuman untuk food court, street food, dan booth festival.",
            image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&h=400&fit=crop",
            icon: "utensils",
            price: "Rp 5 Jt",
            priceLabel: "Mulai dari",
            features: [
                "Food cart & food truck mini",
                "Booth festival & event",
                "Gerobak kopi & boba",
            ],
            waMessage: "Halo, saya tertarik dengan Gerobak F&B",
        },
        {
            id: "mall",
            name: "Kiosk Counter Mall",
            badge: "👑 PREMIUM",
            badgeColor: "white",
            description: "Kiosk dan counter premium untuk mall, plaza, dan pusat perbelanjaan standar internasional.",
            image: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&h=400&fit=crop",
            icon: "store",
            price: "Rp 15 Jt",
            priceLabel: "Mulai dari",
            features: [
                "Counter kosmetik & fashion",
                "Kiosk F&B mall standard",
                "Display & showcase unit",
            ],
            waMessage: "Halo, saya tertarik dengan Kiosk Counter Mall",
        },
        {
            id: "custom",
            name: "Custom Design",
            badge: "✨ CUSTOM",
            badgeColor: "primary-light",
            description: "Buat gerobak dengan desain sesuai keinginan Anda. Konsultasi gratis, revisi sampai puas.",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
            icon: "pencil-ruler",
            price: "Rp 8 Jt",
            priceLabel: "Mulai dari",
            features: [
                "Desain 3D sebelum produksi",
                "Branding & wrapping",
                "Revisi unlimited",
            ],
            waMessage: "Halo, saya mau buat gerobak custom",
        },
    ],

    // ===== GALERI =====
    gallery: [
        {
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=450&fit=crop",
            title: "Gerobak Makanan Modern",
            location: "Food Court Jakarta Selatan",
            category: "fnb",
            categoryLabel: "F&B",
        },
        {
            image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=450&fit=crop",
            title: "Kiosk Kopi Premium",
            location: "Mall Central Park Jakarta",
            category: "mall",
            categoryLabel: "Mall",
        },
        {
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=450&fit=crop",
            title: "Counter Restoran Elegan",
            location: "Mall Tunjungan Surabaya",
            category: "custom",
            categoryLabel: "Custom",
        },
        {
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=450&fit=crop",
            title: "Gerobak Street Food",
            location: "Pasar Modern BSD",
            category: "fnb",
            categoryLabel: "F&B",
        },
        {
            image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=450&fit=crop",
            title: "Kiosk Minuman Bubble",
            location: "Mall Galaxy Surabaya",
            category: "mall",
            categoryLabel: "Mall",
        },
        {
            image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=450&fit=crop",
            title: "Gerobak Franchise",
            location: "Berbagai Lokasi Indonesia",
            category: "custom",
            categoryLabel: "Custom",
        },
    ],

    // ===== TESTIMONI =====
    testimonials: [
        {
            name: "Rina Susanti",
            role: "Owner — Rina's Kitchen, Jakarta",
            initial: "R",
            rating: 5,
            text: "Gerobaknya premium banget! Desainnya sesuai permintaan, material kokoh, dan finishing-nya rapi. Sekarang gerobak saya jadi yang paling ramai di food court. Terima kasih Gerobak Ku!",
        },
        {
            name: "Budi Hartono",
            role: "CEO — Bakso Sejahtera Group",
            initial: "B",
            rating: 5,
            text: "Kami butuh 15 kiosk untuk franchise di 3 kota. Gerobak Ku handle semuanya dengan profesional dan tepat waktu. Kualitas konsisten di setiap kiosk. Highly recommended!",
        },
        {
            name: "Dewi Lestari",
            role: "Founder — Kopi Dewi, Surabaya",
            initial: "D",
            rating: 5,
            text: "Dari desain sampai pasang, semuanya smooth banget. Tim-nya ramah, responsif, dan mau revisi sampai puas. Gerobak kopi saya sekarang keliatan profesional. Worth it!",
        },
    ],

    // ===== FAQ =====
    faq: [
        {
            question: "Berapa lama proses pembuatan gerobak?",
            answer: "Tergantung jenis dan kompleksitas desain. Untuk gerobak standar F&B, estimasi 7-14 hari kerja. Kiosk counter mall 14-21 hari kerja. Custom design 21-30 hari kerja. Kami akan memberikan timeline pasti setelah desain disetujui.",
        },
        {
            question: "Apakah bisa kirim ke luar kota?",
            answer: "Ya! Kami melayani pengiriman ke seluruh Indonesia. Untuk area Jawa Timur, pengiriman menggunakan armada sendiri. Untuk luar Jawa, kami bekerja sama dengan ekspedisi terpercaya. Biaya pengiriman dihitung berdasarkan jarak dan ukuran gerobak.",
        },
        {
            question: "Apakah ada garansi?",
            answer: "Tentu! Semua gerobak kami bergaransi 1 tahun untuk kerangka dan struktur. Garansi meliputi perbaikan kerusakan akibat kesalahan produksi. Untuk kerusakan akibat pemakaian, kami menyediakan layanan perbaikan dengan biaya terjangkau.",
        },
        {
            question: "Bagaimana sistem pembayarannya?",
            answer: "DP 50% saat desain disetujui, dan pelunasan 50% saat gerobak selesai dan siap kirim. Kami juga menyediakan opsi cicilan tanpa kartu kredit untuk pembelian di atas Rp 10 juta.",
        },
        {
            question: "Bisa request desain dari gambar referensi?",
            answer: "Bisa banget! Kirimkan gambar referensi atau moodboard ke tim kami, dan kami akan buatkan desain 3D berdasarkan referensi tersebut. Revisi bisa dilakukan sampai desain benar-benar sesuai keinginan Anda.",
        },
    ],
};
