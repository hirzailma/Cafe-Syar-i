/**
 * setup.gs - Inisiasi Tabel Google Spreadsheet untuk Cafe Syar'i
 * 
 * FUNGSI INI IDEMPOTEN:
 * Aman dijalankan berulang kali. Hanya akan membuat sheet/kolom dan data bawaan
 * jika belum tersedia, tanpa menghapus atau menimpa data yang sudah ada.
 */

function initTables() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Inisiasi Tabel Roles
  var rolesSheet = getOrCreateSheet(ss, 'Roles');
  var rolesHeaders = ['id', 'name', 'description', 'permissions', 'is_system', 'created_at'];
  ensureHeaders(rolesSheet, rolesHeaders);

  var existingRoles = getSheetData(rolesSheet);
  var adminRole = existingRoles.find(function(r) { return r.name === 'admin'; });
  var userRole = existingRoles.find(function(r) { return r.name === 'user'; });

  var now = new Date().toISOString();

  if (!adminRole) {
    adminRole = {
      id: 'role_admin_system',
      name: 'admin',
      description: 'Administrator dengan akses penuh ke seluruh sistem dan dashboard',
      permissions: JSON.stringify(['all']),
      is_system: 'true',
      created_at: now
    };
    appendRowFromObject(rolesSheet, rolesHeaders, adminRole);
  }

  if (!userRole) {
    userRole = {
      id: 'role_user_system',
      name: 'user',
      description: 'Pengguna terdaftar dengan akses publik dan pemesanan',
      permissions: JSON.stringify(['read', 'order']),
      is_system: 'true',
      created_at: now
    };
    appendRowFromObject(rolesSheet, rolesHeaders, userRole);
  }

  // 2. Inisiasi Tabel Users
  var usersSheet = getOrCreateSheet(ss, 'Users');
  var usersHeaders = ['id', 'name', 'email', 'password_hash', 'role_id', 'status', 'created_at', 'updated_at'];
  ensureHeaders(usersSheet, usersHeaders);

  var existingUsers = getSheetData(usersSheet);
  var adminUser = existingUsers.find(function(u) { return u.email === 'admin@gmail.com'; });

  if (!adminUser) {
    // Password bawaan: '123456' (tersimpan dalam bentuk Bcrypt Hash)
    // PERINGATAN KEAMANAN: Harap ubah kata sandi ini melalui dashboard sebelum website dipublikasikan!
    var adminHash = '$2b$10$xtMPgNwzmDst8ugBkyBuhulYZj1F5SnjLeLotaovkJG3zZQypGHqW';
    var defaultAdmin = {
      id: 'usr_admin_default',
      name: 'Super Admin Cafe Syari',
      email: 'admin@gmail.com',
      password_hash: adminHash,
      role_id: adminRole.id || 'role_admin_system',
      status: 'active',
      created_at: now,
      updated_at: now
    };
    appendRowFromObject(usersSheet, usersHeaders, defaultAdmin);
  }

  // 3. Inisiasi Tabel News
  var newsSheet = getOrCreateSheet(ss, 'News');
  var newsHeaders = ['id', 'title', 'slug', 'excerpt', 'content', 'thumbnail_path', 'status', 'author_id', 'created_at', 'updated_at'];
  ensureHeaders(newsSheet, newsHeaders);

  var existingNews = getSheetData(newsSheet);
  if (existingNews.length === 0) {
    // Masukkan data awal berita
    var initialNews = [
      {
        id: 'news_1',
        title: 'Mengenal Karakter Single Origin Gayo: Washed vs Natural',
        slug: 'mengenal-karakter-single-origin-gayo-washed-vs-natural',
        excerpt: 'Pelajari perbedaan cita rasa keasaman lembut dan sweetness legit pada proses pasca panen kopi nusantara.',
        content: 'Proses pasca panen memainkan peran krusial dalam membentuk profil rasa kopi Aceh Gayo. Proses Washed menghasilkan cangkir yang bersih dengan tingkat keasaman cerah dan aroma floral. Sedangkan proses Natural memberikan rasa manis pekat seperti buah matang (fruity notes) dan body yang tebal. Di Cafe Syari Kediri, kami mengkurasi kedua varian ini dengan standar kebersihan thayyib.',
        thumbnail_path: '/images/coffee-beans.png',
        status: 'published',
        author_id: 'usr_admin_default',
        created_at: now,
        updated_at: now
      },
      {
        id: 'news_2',
        title: 'Keseruan Workshop Manual Brew Komunitas Akhir Pekan',
        slug: 'keseruan-workshop-manual-brew-komunitas-banjaran',
        excerpt: 'Dokumentasi sesi berbagi teknik seduh pour-over bersama barista dan penikmat kopi di kawasan Banjaran Kediri.',
        content: 'Akhir pekan lalu, puluhan rekan komunitas berkumpul di Cafe Syari Banjaran untuk mendalami rasio seduhan, temperatur air, dan ukuran gilingan biji kopi lokal. Suasana hangat dan ramah keluarga membuat para peserta betah berdiskusi santai sembari menikmati seduhan kopi halal.',
        thumbnail_path: '/images/about-barista.png',
        status: 'published',
        author_id: 'usr_admin_default',
        created_at: now,
        updated_at: now
      },
      {
        id: 'news_3',
        title: 'Konsep Kafe Ramah Keluarga & Ruang Edukasi yang Berkah',
        slug: 'konsep-kafe-syari-ramah-keluarga-dan-kajian-ringan',
        excerpt: 'Bagaimana Cafe Syari merancang ruang santun bebas asap rokok yang nyaman untuk keluarga dan anak muda berkarya.',
        content: 'Menghadirkan kenyamanan bagi seluruh anggota keluarga adalah misi utama kami. Dengan area indoor non-smoking ber-AC, musholla yang bersih, serta spot baca buku, Cafe Syari menjadi tempat ideal untuk silaturahmi, belajar kelompok, maupun kajian ringan tanpa hingar-bingar kebisingan.',
        thumbnail_path: '/images/hero-cafe.png',
        status: 'published',
        author_id: 'usr_admin_default',
        created_at: now,
        updated_at: now
      }
    ];

    for (var i = 0; i < initialNews.length; i++) {
      appendRowFromObject(newsSheet, newsHeaders, initialNews[i]);
    }
  }

  // 4. Inisiasi Tabel Menu
  var menuSheet = getOrCreateSheet(ss, 'Menu');
  var menuHeaders = ['id', 'name', 'description', 'price', 'category', 'image_path', 'is_available', 'created_at', 'updated_at'];
  ensureHeaders(menuSheet, menuHeaders);

  var existingMenu = getSheetData(menuSheet);
  if (existingMenu.length === 0) {
    var initialMenu = [
      { id: 'menu_001', name: 'Espresso Single Shot', description: 'Ekstraksi tunggal biji kopi single origin Gayo, intens dan aromatik.', price: 18000, category: 'minuman', image_path: '/images/coffee-beans.png', is_available: true, created_at: now, updated_at: now },
      { id: 'menu_002', name: 'V60 Pour Over', description: 'Seduhan manual V60 dengan biji kopi pilihan, bersih dan floral.', price: 25000, category: 'minuman', image_path: '/images/coffee-beans.png', is_available: true, created_at: now, updated_at: now },
      { id: 'menu_003', name: 'Kopi Susu Syar\'i', description: 'Espresso double shot + susu segar full cream, manis alami tanpa sirup artifisial.', price: 22000, category: 'minuman', image_path: '/images/coffee-beans.png', is_available: true, created_at: now, updated_at: now },
      { id: 'menu_004', name: 'Mocktail Kurma Lemon', description: 'Minuman segar non-alkohol dari sari kurma Ajwa, lemon, dan soda.', price: 20000, category: 'minuman', image_path: '/images/coffee-beans.png', is_available: true, created_at: now, updated_at: now },
      { id: 'menu_005', name: 'Roti Bakar Coklat Keju', description: 'Roti tawar tebal panggang dengan selai coklat premium dan keju cheddar leleh.', price: 15000, category: 'makanan', image_path: '/images/hero-cafe.png', is_available: true, created_at: now, updated_at: now },
      { id: 'menu_006', name: 'Pisang Goreng Crispy', description: 'Pisang kepok lokal digoreng renyah, disajikan dengan es krim vanila halal.', price: 18000, category: 'makanan', image_path: '/images/hero-cafe.png', is_available: true, created_at: now, updated_at: now }
    ];
    for (var m = 0; m < initialMenu.length; m++) {
      appendRowFromObject(menuSheet, menuHeaders, initialMenu[m]);
    }
  }

  // 5. Inisiasi Tabel Orders
  var ordersSheet = getOrCreateSheet(ss, 'Orders');
  var ordersHeaders = ['id', 'customer_name', 'customer_phone', 'customer_email', 'table_slot_id', 'table_slot_label', 'order_date', 'visit_date', 'visit_time', 'items', 'total_amount', 'payment_method', 'status', 'notes', 'created_at', 'updated_at'];
  ensureHeaders(ordersSheet, ordersHeaders);

  Logger.log('Inisiasi tabel Cafe Syari berhasil diselesaikan.');
}

// Helper Functions
function getOrCreateSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function ensureHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function getSheetData(sheet) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1) return [];

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  var result = [];
  for (var r = 0; r < rows.length; r++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      obj[headers[c]] = rows[r][c];
    }
    result.push(obj);
  }
  return result;
}

function appendRowFromObject(sheet, headers, obj) {
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var val = obj[headers[i]];
    row.push(val !== undefined && val !== null ? val : '');
  }
  sheet.appendRow(row);
}
