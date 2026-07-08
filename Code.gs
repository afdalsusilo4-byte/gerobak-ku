<!DOCTYPE html>
<html>
<head>
    <base target="_top">
    <meta charset="UTF-8">
</head>
<body>
<script>
// ===== GEROBAK KU - Google Sheets CMS Backend =====
// Deploy script ini sebagai Web App (Execute as: Me, Access: Anyone)

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const result = {};

        // Sheet: Profil
        const profilSheet = ss.getSheetByName('Profil');
        if (profilSheet) {
            const data = profilSheet.getDataRange().getValues();
            result.brand = {};
            for (let i = 1; i < data.length; i++) {
                if (data[i][0] && data[i][1]) {
                    result.brand[data[i][0]] = data[i][1];
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
                    result.contact[data[i][0]] = data[i][1];
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
                    result.services.push({
                        name: data[i][0] || '',
                        badge: data[i][1] || '',
                        description: data[i][2] || '',
                        image: data[i][3] || '',
                        icon: data[i][4] || 'box',
                        price: data[i][5] || '',
                        features: [
                            data[i][6] || '',
                            data[i][7] || '',
                            data[i][8] || '',
                        ].filter(f => f),
                        waMessage: data[i][9] || '',
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
                    result.gallery.push({
                        image: data[i][0] || '',
                        title: data[i][1] || '',
                        location: data[i][2] || '',
                        category: data[i][3] || 'all',
                        categoryLabel: data[i][4] || '',
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
                    result.testimonials.push({
                        name: data[i][0] || '',
                        role: data[i][1] || '',
                        initial: data[i][2] || '?',
                        rating: parseInt(data[i][3]) || 5,
                        text: data[i][4] || '',
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
                    result.faq.push({
                        question: data[i][0] || '',
                        answer: data[i][1] || '',
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
                    result.stats[data[i][0]] = parseInt(data[i][1]) || 0;
                }
            }
        }

        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', '*');

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
}

function doPost(e) {
    return doGet(e);
}

// ===== SETUP: Jalankan fungsi ini sekali untuk membuat sheet =====
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
        ['Apakah ada garansi?', 'Tentu! Semua gerobak bergaransi 1 tahun untuk kerangka dan struktur. Garansi meliputi perbaikan kerusakan akibat kesalahan produksi.'],
        ['Bagaimana sistem pembayarannya?', 'DP 50% saat desain disetujui, pelunasan 50% saat gerobak selesai. Cicilan tanpa kartu kredit tersedia untuk pembelian di atas Rp 10 juta.'],
        ['Bisa request desain dari gambar referensi?', 'Bisa banget! Kirimkan gambar referensi ke tim kami, kami buatkan desain 3D berdasarkan referensi tersebut. Revisi unlimited sampai puas.'],
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

    // Hapus sheet default jika ada
    const defaultSheet = ss.getSheetByName('Sheet1');
    if (defaultSheet && ss.getSheets().length > 1) {
        ss.deleteSheet(defaultSheet);
    }

    SpreadsheetApp.getUi().alert('✅ Setup selesai! 7 sheet telah dibuat.\n\nSekarang deploy script ini:\n1. Deploy → New deployment\n2. Type: Web app\n3. Execute as: Me\n4. Who has access: Anyone\n5. Deploy!\n\nCopy URL yang diberikan.');
}
</script>
</body>
</html>
