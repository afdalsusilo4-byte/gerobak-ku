// ===== GEROBAK KU - Dynamic CMS Engine =====
// File ini membaca data dari Google Sheets dan render website otomatis.

// ===== KONFIGURASI =====
// Ganti URL di bawah dengan URL Web App Google Apps Script kamu
const CMS_URL = ''; // Kosongkan untuk pakai data default
const API_KEY = '';  // Opsional: API key untuk keamanan tambahan

// ===== DATA DEFAULT (jika CMS tidak tersedia) =====
const DEFAULT_DATA = {
    brand: {
        name: "Gerobak Ku",
        tagline: "Gerobak Berkah Untuk Kita Semua",
        description: "Spesialis pembuatan gerobak profesional untuk mall, food court, dan bisnis kuliner.",
        logo: "images/logo.svg",
        yearFounded: 2015,
    },
    contact: {
        whatsapp: "628xxxxxxxxx",
        email: "info@gerobakku.com",
        address: "Sidoarjo, Jawa Timur",
        workHours: "Senin-Sabtu, 08.00 - 17.00 WIB",
    },
    stats: {
        gerobakTerjual: 500,
        klienPuas: 50,
        tahunPengalaman: 10,
    },
    services: [
        {
            name: "Gerobak F&B", badge: "🔥 POPULER", badgeColor: "accent",
            description: "Gerobak khusus makanan & minuman untuk food court, street food, dan booth festival.",
            image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&h=400&fit=crop",
            icon: "utensils", price: "Rp 5 Jt",
            features: ["Food cart & food truck mini", "Booth festival & event", "Gerobak kopi & boba"],
            waMessage: "Halo, saya tertarik dengan Gerobak F&B",
        },
        {
            name: "Kiosk Counter Mall", badge: "👑 PREMIUM", badgeColor: "white",
            description: "Kiosk dan counter premium untuk mall, plaza, dan pusat perbelanjaan.",
            image: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&h=400&fit=crop",
            icon: "store", price: "Rp 15 Jt",
            features: ["Counter kosmetik & fashion", "Kiosk F&B mall standard", "Display & showcase unit"],
            waMessage: "Halo, saya tertarik dengan Kiosk Counter Mall",
        },
        {
            name: "Custom Design", badge: "✨ CUSTOM", badgeColor: "primary-light",
            description: "Buat gerobak dengan desain sesuai keinginan Anda. Konsultasi gratis.",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
            icon: "pencil-ruler", price: "Rp 8 Jt",
            features: ["Desain 3D sebelum produksi", "Branding & wrapping", "Revisi unlimited"],
            waMessage: "Halo, saya mau buat gerobak custom",
        },
    ],
    gallery: [
        { image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=450&fit=crop", title: "Gerobak Makanan Modern", location: "Food Court Jakarta Selatan", category: "fnb", categoryLabel: "F&B" },
        { image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=450&fit=crop", title: "Kiosk Kopi Premium", location: "Mall Central Park Jakarta", category: "mall", categoryLabel: "Mall" },
        { image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=450&fit=crop", title: "Counter Restoran Elegan", location: "Mall Tunjungan Surabaya", category: "custom", categoryLabel: "Custom" },
        { image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=450&fit=crop", title: "Gerobak Street Food", location: "Pasar Modern BSD", category: "fnb", categoryLabel: "F&B" },
        { image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=450&fit=crop", title: "Kiosk Minuman Bubble", location: "Mall Galaxy Surabaya", category: "mall", categoryLabel: "Mall" },
        { image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=450&fit=crop", title: "Gerobak Franchise", location: "Berbagai Lokasi Indonesia", category: "custom", categoryLabel: "Custom" },
    ],
    testimonials: [
        { name: "Rina Susanti", role: "Owner — Rina's Kitchen, Jakarta", initial: "R", rating: 5, text: "Gerobaknya premium banget! Desainnya sesuai permintaan, material kokoh, dan finishing-nya rapi. Sekarang gerobak saya jadi yang paling ramai di food court." },
        { name: "Budi Hartono", role: "CEO — Bakso Sejahtera Group", initial: "B", rating: 5, text: "Kami butuh 15 kiosk untuk franchise di 3 kota. Gerobak Ku handle semuanya dengan profesional dan tepat waktu. Highly recommended!" },
        { name: "Dewi Lestari", role: "Founder — Kopi Dewi, Surabaya", initial: "D", rating: 5, text: "Dari desain sampai pasang, semuanya smooth banget. Tim-nya ramah, responsif, dan mau revisi sampai puas. Worth it!" },
    ],
    faq: [
        { question: "Berapa lama proses pembuatan gerobak?", answer: "Tergantung jenis dan kompleksitas desain. Gerobak standar F&B 7-14 hari kerja, Kiosk counter mall 14-21 hari, Custom design 21-30 hari." },
        { question: "Apakah bisa kirim ke luar kota?", answer: "Ya! Kami melayani pengiriman ke seluruh Indonesia. Biaya pengiriman dihitung berdasarkan jarak dan ukuran gerobak." },
        { question: "Apakah ada garansi?", answer: "Tentu! Semua gerobak bergaransi 1 tahun untuk kerangka dan struktur." },
        { question: "Bagaimana sistem pembayarannya?", answer: "DP 50% saat desain disetujui, pelunasan 50% saat gerobak selesai. Cicilan tersedia untuk pembelian di atas Rp 10 juta." },
        { question: "Bisa request desain dari gambar referensi?", answer: "Bisa banget! Kirimkan gambar referensi, kami buatkan desain 3D. Revisi unlimited sampai puas." },
    ],
};

// ===== FETCH DATA DARI CMS =====
async function fetchCMSData() {
    if (!CMS_URL) {
        console.log('📝 CMS URL belum diset. Menggunakan data default.');
        return null;
    }

    try {
        console.log('🔄 Mengambil data dari Google Sheets...');
        const url = new URL(CMS_URL);
        if (API_KEY) {
            url.searchParams.set('key', API_KEY);
        }
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        const result = await response.json();

        if (result.success && result.data) {
            console.log('✅ Data CMS berhasil dimuat!');
            return result.data;
        } else {
            console.warn('⚠️ CMS response error:', result.error);
            return null;
        }
    } catch (error) {
        console.warn('⚠️ Gagal mengambil data CMS:', error.message);
        return null;
    }
}

// ===== MERGE DATA (CMS + DEFAULT) =====
function mergeData(cmsData) {
    if (!cmsData) return DEFAULT_DATA;

    const merged = { ...DEFAULT_DATA };

    // Merge brand
    if (cmsData.brand) {
        merged.brand = { ...merged.brand, ...cmsData.brand };
    }

    // Merge contact
    if (cmsData.contact) {
        merged.contact = { ...merged.contact, ...cmsData.contact };
    }

    // Merge stats
    if (cmsData.stats) {
        merged.stats = { ...merged.stats, ...cmsData.stats };
    }

    // Replace services if CMS has them
    if (cmsData.services && cmsData.services.length > 0) {
        merged.services = cmsData.services.map((s, i) => ({
            ...DEFAULT_DATA.services[i],
            ...s,
            badgeColor: s.badge?.includes('PREMIUM') ? 'white' : s.badge?.includes('CUSTOM') ? 'primary-light' : 'accent',
        }));
    }

    // Replace gallery if CMS has them
    if (cmsData.gallery && cmsData.gallery.length > 0) {
        merged.gallery = cmsData.gallery;
    }

    // Replace testimonials if CMS has them
    if (cmsData.testimonials && cmsData.testimonials.length > 0) {
        merged.testimonials = cmsData.testimonials;
    }

    // Replace FAQ if CMS has them
    if (cmsData.faq && cmsData.faq.length > 0) {
        merged.faq = cmsData.faq;
    }

    return merged;
}

// ===== RENDER FUNCTIONS =====

function renderServices(services) {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;

    grid.innerHTML = services.map((s, i) => `
        <div class="reveal card-glow group relative bg-gradient-to-b from-white/[0.07] to-transparent rounded-3xl overflow-hidden border border-white/[0.08]" style="animation-delay: ${i * 0.15}s;">
            <div class="relative h-72 overflow-hidden">
                <img src="${s.image}" alt="${s.name}" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-brown-dark via-brown-dark/30 to-transparent"></div>
                <div class="absolute top-5 left-5 ${s.badgeColor === 'white' ? 'bg-white/90 text-brown-dark' : s.badgeColor === 'primary-light' ? 'bg-primary-light/90 text-brown-dark' : 'bg-accent text-brown-dark'} backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black tracking-wider shadow-lg">
                    ${s.badge}
                </div>
            </div>
            <div class="p-8 relative">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-accent/10">
                    <i data-lucide="${s.icon}" class="w-7 h-7 text-accent"></i>
                </div>
                <h3 class="font-heading text-2xl font-bold text-white mb-3">${s.name}</h3>
                <p class="text-silver/50 leading-relaxed mb-6 text-sm">${s.description}</p>
                <ul class="space-y-3 mb-8">
                    ${s.features.map(f => `
                        <li class="flex items-center gap-3 text-silver/60 text-sm">
                            <div class="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="check" class="w-3 h-3 text-accent"></i>
                            </div>
                            ${f}
                        </li>
                    `).join('')}
                </ul>
                <div class="flex items-center justify-between pt-6 border-t border-white/5">
                    <div>
                        <span class="text-silver/40 text-xs">Mulai dari</span>
                        <p class="text-accent font-black text-2xl">${s.price}</p>
                    </div>
                    <a href="https://wa.me/${getWhatsApp()}?text=${encodeURIComponent(s.waMessage)}" 
                       class="bg-accent/10 hover:bg-accent text-accent hover:text-brown-dark px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-accent/20">
                        <i data-lucide="message-circle" class="w-4 h-4"></i>
                        Tanya Harga
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

function renderGallery(gallery) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    grid.innerHTML = gallery.map((g, i) => `
        <div class="reveal-scale gallery-item" data-category="${g.category}" onclick="openLightbox(this)" style="animation-delay: ${i * 0.1}s;">
            <div class="card-glow group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer">
                <img src="${g.image}" alt="${g.title}" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy"
                     data-caption="${g.title}" data-sub="${g.location}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <div class="absolute bottom-0 left-0 right-0 p-6">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full font-semibold">${g.categoryLabel}</span>
                        </div>
                        <h4 class="text-white font-bold text-lg">${g.title}</h4>
                        <p class="text-white/60 text-sm">${g.location}</p>
                    </div>
                    <div class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                        <i data-lucide="expand" class="w-5 h-5 text-white"></i>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTestimonials(testimonials) {
    const track = document.getElementById('testimonialTrack');
    const dots = document.getElementById('testimonialDots');
    if (!track) return;

    track.innerHTML = testimonials.map(t => `
        <div class="w-full flex-shrink-0 px-4">
            <div class="glass rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto text-center">
                <div class="flex justify-center gap-1 mb-6">
                    ${'★'.repeat(t.rating).split('').map(() => '<span class="text-accent text-2xl">★</span>').join('')}
                </div>
                <p class="text-white/80 text-lg sm:text-xl leading-relaxed mb-8 italic">"${t.text}"</p>
                <div class="flex items-center justify-center gap-4">
                    <div class="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-primary-light flex items-center justify-center text-brown-dark font-bold text-xl">${t.initial}</div>
                    <div class="text-left">
                        <p class="text-white font-bold text-lg">${t.name}</p>
                        <p class="text-silver/50 text-sm">${t.role}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    if (dots) {
        dots.innerHTML = testimonials.map((_, i) => `
            <button onclick="goToTestimonial(${i})" class="w-3 h-3 rounded-full ${i === 0 ? 'bg-accent' : 'bg-white/20'} transition-all duration-300"></button>
        `).join('');
    }
}

function renderFAQ(faq) {
    const container = document.getElementById('faqContainer');
    if (!container) return;

    container.innerHTML = faq.map(f => `
        <div class="faq-item glass rounded-2xl overflow-hidden reveal cursor-pointer" onclick="toggleFaq(this)">
            <div class="flex items-center justify-between p-6">
                <h4 class="text-white font-semibold text-base pr-4">${f.question}</h4>
                <span class="faq-icon text-accent text-2xl flex-shrink-0 w-8 h-8 flex items-center justify-center">+</span>
            </div>
            <div class="faq-answer px-6">
                <p class="text-silver/60 text-sm leading-relaxed pb-6">${f.answer}</p>
            </div>
        </div>
    `).join('');
}

function renderStats(stats) {
    if (stats.gerobakTerjual) document.getElementById('counter1').dataset.target = stats.gerobakTerjual;
    if (stats.klienPuas) document.getElementById('counter2').dataset.target = stats.klienPuas;
    if (stats.tahunPengalaman) document.getElementById('counter3').dataset.target = stats.tahunPengalaman;
}

function updateBrandInfo(brand) {
    // Update page title
    document.title = `${brand.name} | ${brand.tagline}`;
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = brand.description;
    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${brand.name} | ${brand.tagline}`;
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = brand.description;
    // Update nav logo text
    const navBrand = document.querySelector('.nav-brand-text');
    if (navBrand) navBrand.innerHTML = `${brand.name.replace(' ', '')}`;
}

// ===== HELPER =====
function getWhatsApp() {
    const url = new URLSearchParams(window.location.search);
    return url.get('wa') || (window.__SITE_DATA && window.__SITE_DATA.contact.whatsapp) || '628xxxxxxxxx';
}

// ===== INIT =====
async function initCMS() {
    const cmsData = await fetchCMSData();
    const data = mergeData(cmsData);

    // Store globally
    window.__SITE_DATA = data;

    // Render all sections
    updateBrandInfo(data.brand);
    renderServices(data.services);
    renderGallery(data.gallery);
    renderTestimonials(data.testimonials);
    renderFAQ(data.faq);
    renderStats(data.stats);

    // Re-init Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Re-init scroll observers
    initScrollObservers();

    console.log('🚀 Website berhasil dimuat!');
}

function initScrollObservers() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        if (!el.classList.contains('visible')) {
            observer.observe(el);
        }
    });
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', initCMS);
