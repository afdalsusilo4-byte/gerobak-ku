<!DOCTYPE html>
<html>
<head>
    <base target="_top">
    <meta charset="UTF-8">
</head>
<body>
<script>
// ===== GEROBAK KU - Google Sheets CMS Backend =====
// Dengan keamanan: API Key + Rate Limiting + Input Sanitization

// ===== KONFIGURASI KEAMANAN =====
const API_KEY = 'GKU-2026-xxxxx';  // Ganti dengan key random Anda!
const RATE_LIMIT_PER_MINUTE = 30;  // Max request per menit
const ALLOWED_ORIGINS = [
    'https://afdalsusilo4-byte.github.io',
    'https://gerobak-ku.vercel.app',
    'https://gerobakku.com',        // Ganti dengan domain Anda
    'http://localhost:8080',         // Untuk testing lokal
];

// ===== RATE LIMITER (in-memory, reset saat redeploy) =====
const rateLimitStore = {};

function checkRateLimit(ip) {
    const now = Date.now();
    const minute = Math.floor(now / 60000);
    const key = `${ip}_${minute}`;

    if (!rateLimitStore[key]) {
        // Bersihkan entry lama
        for (const k in rateLimitStore) {
            if (parseInt(k.split('_')[1]) < minute - 2) {
                delete rateLimitStore[k];
            }
        }
        rateLimitStore[key] = 0;
    }

    rateLimitStore[key]++;
    return rateLimitStore[key] <= RATE_LIMIT_PER_MINUTE;
}

// ===== SANITIZATION =====
function sanitize(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

function sanitizeRow(row) {
    return row.map(cell => {
        if (typeof cell === 'string') return sanitize(cell);
        return cell;
    });
}

// ===== CORS CHECK =====
function getCORSHeaders(origin) {
    const headers = {};
    if (ALLOWED_ORIGINS.includes(origin) || origin === 'null') {
        headers['Access-Control-Allow-Origin'] = origin;
    } else {
        // Default: izinkan GitHub Pages dan Vercel
        headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGINS[0];
    }
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, X-API-Key';
    return headers;
}

// ===== MAIN HANDLER =====
function doGet(e) {
    try {
        // Rate limiting
        const ip = e.parameter._ip || 'unknown';
        if (!checkRateLimit(ip)) {
            return createJSONResponse({
                success: false,
                error: 'Rate limit exceeded. Coba lagi nanti.'
            }, 429, e);
        }

        // API Key check (opsional - uncomment untuk mengaktifkan)
        // const key = e.parameter.key || e.parameter.api_key;
        // if (key !== API_KEY) {
        //     return createJSONResponse({
        //         success: false,
        //         error: 'Invalid API key'
        //     }, 403, e);
        // }

        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const result = {};

        // Sheet: Profil
        const profilSheet = ss.getSheetByName('Profil');
        if (profilSheet) {
            const data = profilSheet.getDataRange().getValues();
            result.brand = {};
            for (let i = 1; i < data.length; i++) {
                if (data[i][0] && data[i][1]) {
                    result.brand[sanitize(data[i][0])] = sanitize(String(data[i][1]));
                }
            }
        }

        // Sheet: Kontak
        const kontakSheet = ss.getSheetByName('Kontak');
        if (kontakSheet) {
            const data = kontakSheet.getDataRange().getValues();
            result.contact = {};
            for (let i = 1; i < data.length; i++) {
                if (data[i][0] && data[i][1]) {
                    result.contact[sanitize(data[i][0])] = sanitize(String(data[i][1]));
                }
            }
        }

        // Sheet: Layanan
        const layananSheet = ss.getSheetByName('Layanan');
        if (layananSheet) {
            const data = layananSheet.getDataRange().getValues();
            result.services = [];
            for (let i = 1; i < data.length; i++) {
                if (data[i][0]) {
                    const row = sanitizeRow(data[i]);
                    result.services.push({
                        name: row[0] || '',
                        badge: row[1] || '',
                        description: row[2] || '',
                        image: row[3] || '',
                        icon: row[4] || 'box',
                        price: row[5] || '',
                        features: [row[6], row[7], row[8]].filter(f => f),
                        waMessage: row[9] || '',
                    });
                }
            }
        }

        // Sheet: Galeri
        const galeriSheet = ss.getSheetByName('Galeri');
        if (galeriSheet) {
            const data = galeriSheet.getDataRange().getValues();
            result.gallery = [];
            for (let i = 1; i < data.length; i++) {
                if (data[i][0]) {
                    const row = sanitizeRow(data[i]);
                    result.gallery.push({
                        image: row[0] || '',
                        title: row[1] || '',
                        location: row[2] || '',
                        category: row[3] || 'all',
                        categoryLabel: row[4] || '',
                    });
                }
            }
        }

        // Sheet: Testimoni
        const testimoniSheet = ss.getSheetByName('Testimoni');
        if (testimoniSheet) {
            const data = testimoniSheet.getDataRange().getValues();
            result.testimonials = [];
            for (let i = 1; i < data.length; i++) {
                if (data[i][0]) {
                    const row = sanitizeRow(data[i]);
                    result.testimonials.push({
                        name: row[0] || '',
                        role: row[1] || '',
                        initial: row[2] || '?',
                        rating: parseInt(row[3]) || 5,
                        text: row[4] || '',
                    });
                }
            }
        }

        // Sheet: FAQ
        const faqSheet = ss.getSheetByName('FAQ');
        if (faqSheet) {
            const data = faqSheet.getDataRange().getValues();
            result.faq = [];
            for (let i = 1; i < data.length; i++) {
                if (data[i][0]) {
                    const row = sanitizeRow(data[i]);
                    result.faq.push({
                        question: row[0] || '',
                        answer: row[1] || '',
                    });
                }
            }
        }

        // Sheet: Statistik
        const statsSheet = ss.getSheetByName('Statistik');
        if (statsSheet) {
            const data = statsSheet.getDataRange().getValues();
            result.stats = {};
            for (let i = 1; i < data.length; i++) {
                if (data[i][0] && data[i][1]) {
                    result.stats[sanitize(data[i][0])] = parseInt(data[i][1]) || 0;
                }
            }
        }

        // Log access (opsional)
        console.log(`✅ Data served to ${ip} at ${new Date().toISOString()}`);

        return createJSONResponse({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        }, 200, e);

    } catch (error) {
        console.error('❌ Error:', error.toString());
        return createJSONResponse({
            success: false,
            error: 'Internal server error'
        }, 500, e);
    }
}

function doPost(e) {
    return doGet(e);
}

function doOptions(e) {
    const origin = e.parameter.origin || '';
    const headers = getCORSHeaders(origin);
    return ContentService.createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeader('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin'])
        .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        .setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
}

// ===== HELPER: JSON Response dengan CORS =====
function createJSONResponse(data, status, e) {
    const origin = '';
    const headers = getCORSHeaders(origin);

    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin']);
}

// ===== SETUP: Jalankan sekali =====
function setupSheets() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Sheet: Profil
    let sheet = ss.getSheetByName('Profil');
    if (!sheet) sheet = ss.insertSheet('Profil');
    sheet.clear();
    sheet.getRange(1, 1, 1, 2).setValues([['Key', 'Value']]).setFontWeight('bold');
    sheet.getRange(2, 1, 7, 2).setValues([
        ['name', 'Gerobak Ku'],
        ['tagline', 'Gerobak Berkah Untuk Kita Semua'],
        ['description', 'Spesialis pembuatan gerobak profesional untuk mall, food court, dan bisnis kuliner.'],
        ['logo', 'images/logo.svg'],
        ['yearFounded', '2015'],
        ['whatsapp', '628xxxxxxxxx'],
        ['address', 'Sidoarjo, Jawa Timur'],
    ]);
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 400);

    // Sheet: Kontak
    sheet = ss.getSheetByName('Kontak');
    if (!sheet) sheet = ss.insertSheet('Kontak');
    sheet.clear();
    sheet.getRange(1, 1, 1, 2).setValues([['Key', 'Value']]).setFontWeight('bold');
    sheet.getRange(2, 1, 5, 2).setValues([
        ['whatsapp', '628xxxxxxxxx'],
        ['email', 'info@gerobakku.com'],
        ['address', 'Sidoarjo, Jawa Timur'],
        ['workHours', 'Senin-Sabtu, 08.00 - 17.00 WIB'],
        ['instagram', ''],
    ]);
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 400);

    // Sheet: Layanan
    sheet = ss.getSheetByName('Layanan');
    if (!sheet) sheet = ss.insertSheet('Layanan');
    sheet.clear();
    sheet.getRange(1, 1, 1, 10).setValues([['Nama', 'Badge', 'Deskripsi', 'URL Gambar', 'Icon', 'Harga', 'Fitur 1', 'Fitur 2', 'Fitur 3', 'WA Message']]).setFontWeight('bold');
    sheet.getRange(2, 1, 3, 10).setValues([
        ['Gerobak F&B', '🔥 POPULER', 'Gerobak khusus makanan & minuman untuk food court, street food, dan booth festival.', 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&h=400&fit=crop', 'utensils', 'Rp 5 Jt', 'Food cart & food truck mini', 'Booth festival & event', 'Gerobak kopi & boba', 'Halo, saya tertarik dengan Gerobak F&B'],
        ['Kiosk Counter Mall', '👑 PREMIUM', 'Kiosk dan counter premium untuk mall, plaza, dan pusat perbelanjaan.', 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&h=400&fit=crop', 'store', 'Rp 15 Jt', 'Counter kosmetik & fashion', 'Kiosk F&B mall standard', 'Display & showcase unit', 'Halo, saya tertarik dengan Kiosk Counter Mall'],
        ['Custom Design', '✨ CUSTOM', 'Buat gerobak dengan desain sesuai keinginan Anda. Konsultasi gratis.', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop', 'pencil-ruler', 'Rp 8 Jt', 'Desain 3D sebelum produksi', 'Branding & wrapping', 'Revisi unlimited', 'Halo, saya mau buat gerobak custom'],
    ]);
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 100);
    sheet.setColumnWidth(3, 300);
    sheet.setColumnWidth(4, 300);

    // Sheet: Galeri
    sheet = ss.getSheetByName('Galeri');
    if (!sheet) sheet = ss.insertSheet('Galeri');
    sheet.clear();
    sheet.getRange(1, 1, 1, 5).setValues([['URL Gambar', 'Judul', 'Lokasi', 'Kategori', 'Label Kategori']]).setFontWeight('bold');
    sheet.getRange(2, 1, 6, 5).setValues([
        ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=450&fit=crop', 'Gerobak Makanan Modern', 'Food Court Jakarta Selatan', 'fnb', 'F&B'],
        ['https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=450&fit=crop', 'Kiosk Kopi Premium', 'Mall Central Park Jakarta', 'mall', 'Mall'],
        ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=450&fit=crop', 'Counter Restoran Elegan', 'Mall Tunjungan Surabaya', 'custom', 'Custom'],
        ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=450&fit=crop', 'Gerobak Street Food', 'Pasar Modern BSD', 'fnb', 'F&B'],
        ['https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=450&fit=crop', 'Kiosk Minuman Bubble', 'Mall Galaxy Surabaya', 'mall', 'Mall'],
        ['https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=450&fit=crop', 'Gerobak Franchise', 'Berbagai Lokasi Indonesia', 'custom', 'Custom'],
    ]);

    // Sheet: Testimoni
    sheet = ss.getSheetByName('Testimoni');
    if (!sheet) sheet = ss.insertSheet('Testimoni');
    sheet.clear();
    sheet.getRange(1, 1, 1, 5).setValues([['Nama', 'Role/Jabatan', 'Inisial', 'Rating (1-5)', 'Testimoni']]).setFontWeight('bold');
    sheet.getRange(2, 1, 3, 5).setValues([
        ['Rina Susanti', 'Owner — Rina\'s Kitchen, Jakarta', 'R', 5, 'Gerobaknya premium banget! Desainnya sesuai permintaan, material kokoh, dan finishing-nya rapi.'],
        ['Budi Hartono', 'CEO — Bakso Sejahtera Group', 'B', 5, 'Kami butuh 15 kiosk untuk franchise di 3 kota. Gerobak Ku handle semuanya dengan profesional dan tepat waktu.'],
        ['Dewi Lestari', 'Founder — Kopi Dewi, Surabaya', 'D', 5, 'Dari desain sampai pasang, semuanya smooth banget. Tim-nya ramah, responsif, dan mau revisi sampai puas.'],
    ]);

    // Sheet: FAQ
    sheet = ss.getSheetByName('FAQ');
    if (!sheet) sheet = ss.insertSheet('FAQ');
    sheet.clear();
    sheet.getRange(1, 1, 1, 2).setValues([['Pertanyaan', 'Jawaban']]).setFontWeight('bold');
    sheet.getRange(2, 1, 5, 2).setValues([
        ['Berapa lama proses pembuatan gerobak?', 'Tergantung jenis dan kompleksitas desain. Gerobak standar F&B 7-14 hari kerja, Kiosk counter mall 14-21 hari, Custom design 21-30 hari.'],
        ['Apakah bisa kirim ke luar kota?', 'Ya! Kami melayani pengiriman ke seluruh Indonesia. Biaya pengiriman dihitung berdasarkan jarak dan ukuran gerobak.'],
        ['Apakah ada garansi?', 'Tentu! Semua gerobak bergaransi 1 tahun untuk kerangka dan struktur.'],
        ['Bagaimana sistem pembayarannya?', 'DP 50% saat desain disetujui, pelunasan 50% saat gerobak selesai. Cicilan tersedia untuk pembelian di atas Rp 10 juta.'],
        ['Bisa request desain dari gambar referensi?', 'Bisa banget! Kirimkan gambar referensi, kami buatkan desain 3D. Revisi unlimited sampai puas.'],
    ]);

    // Sheet: Statistik
    sheet = ss.getSheetByName('Statistik');
    if (!sheet) sheet = ss.insertSheet('Statistik');
    sheet.clear();
    sheet.getRange(1, 1, 1, 2).setValues([['Key', 'Value']]).setFontWeight('bold');
    sheet.getRange(2, 1, 3, 2).setValues([
        ['gerobakTerjual', 500],
        ['klienPuas', 50],
        ['tahunPengalaman', 10],
    ]);

    // Hapus sheet default
    const defaultSheet = ss.getSheetByName('Sheet1');
    if (defaultSheet && ss.getSheets().length > 1) {
        try { ss.deleteSheet(defaultSheet); } catch(e) {}
    }

    SpreadsheetApp.getUi().alert('✅ Setup selesai! 7 sheet telah dibuat.');
}

// ===== GENERATE API KEY =====
function generateAPIKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'GKU-';
    for (let i = 0; i < 24; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    console.log('🔑 API Key baru:', key);
    SpreadsheetApp.getUi().alert('🔑 API Key:\n\n' + key + '\n\nSimpan key ini dan masukkan di app.js');
    return key;
}
</script>
</body>
</html>
