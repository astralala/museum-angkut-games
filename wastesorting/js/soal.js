/* ===== BANK SOAL KUIS =====
   Setiap baris = 1 soal:  ['nama file gambar', 'jenis', 'nama Indonesia', 'nama Inggris'],
     - nama file gambar : tanpa .png, dari folder assets/<dir> area tersebut
     - jenis            : 'o' = organik, 'a' = anorganik, 'b' = B3 (jawaban yang benar)
   Pertanyaan otomatis menjadi:
     "Ke mana sebaiknya kita membuang <nama Indonesia>?"
     "Where should we throw the <nama Inggris>?"
   Tambah soal = tambah baris baru. Hapus soal = hapus barisnya. */

const JUMLAH_SOAL = 5;   // soal per permainan (maks = jumlah soal di area)
const WAKTU_SOAL  = 15;  // detik per soal

const AREA = {
  perumahan: { bg: 'bgperumahan', dir: 'sampah_rumah', items: [
    ['organik-rumah-kulit-pisang',     'o', 'kulit pisang',          'banana peel'],
    ['organik-rumah-sayuran',          'o', 'sisa sayuran',          'vegetable scraps'],
    ['organik-rumah-daun-kering',      'o', 'daun kering',           'dry leaves'],
    ['organik-rumah-kulit-apel',       'o', 'sisa apel',             'apple core'],
    ['anorganik-rumah-botol-plastik',  'a', 'botol plastik bekas',   'used plastic bottle'],
    ['anorganik-rumah-kaleng-minuman', 'a', 'kaleng minuman bekas',  'used drink can'],
    ['anorganik-rumah-kantong-plastik','a', 'kantong plastik bekas', 'used plastic bag'],
    ['anorganik-rumah-kardus',         'a', 'kardus bekas',          'used cardboard box'],
    ['anorganik-rumah-kertas',         'a', 'kertas bekas',          'used paper'],
    ['anorganik-rumah-kotak-susu',     'a', 'kotak susu bekas',      'used milk carton'],
    ['b3-rumah-baterai',               'b', 'baterai bekas',         'used battery'],
    ['b3-rumah-bohlam',                'b', 'bohlam bekas',          'used light bulb'],
  ]},
  mall: { bg: 'bgtoko', dir: 'sampah_toko', items: [
    ['organik-toko-sisa-makanan',      'o', 'sisa makanan',          'food leftovers'],
    ['organik-toko-sayuran',           'o', 'sisa sayuran',          'vegetable scraps'],
    ['anorganik-toko-botol-plastik',   'a', 'botol plastik bekas',   'used plastic bottle'],
    ['anorganik-toko-cup-plastik',     'a', 'gelas plastik bekas',   'used plastic cup'],
    ['anorganik-toko-goodiebag',       'a', 'tas belanja kertas',    'paper shopping bag'],
    ['anorganik-toko-kaleng-minuman',  'a', 'kaleng minuman bekas',  'used drink can'],
    ['anorganik-toko-kotak-makanan',   'a', 'kotak sereal bekas',    'used cereal box'],
    ['anorganik-toko-kotak-susu',      'a', 'kotak susu bekas',      'used milk carton'],
    ['anorganik-toko-struk',           'a', 'struk belanja',         'shopping receipt'],
    ['b3-toko-bohlam',                 'b', 'bohlam bekas',          'used light bulb'],
    ['b3-toko-cairan-pemutih',         'b', 'botol cairan pemutih',  'bleach bottle'],
    ['b3-toko-pilox',                  'b', 'kaleng cat semprot',    'spray paint can'],
  ]},
  bengkel: { bg: 'bgbengkel', dir: 'sampah_bengkel', items: [
    ['organik-bengkel-kulit-pisang',   'o', 'kulit pisang',          'banana peel'],
    ['organik-bengkel-sisa-makanan',   'o', 'sisa makanan',          'food leftovers'],
    ['anorganik-bengkel-ban',          'a', 'ban bekas',             'used tire'],
    ['anorganik-bengkel-baut',         'a', 'baut dan mur bekas',    'used nuts and bolts'],
    ['anorganik-bengkel-botol-plastik','a', 'botol plastik bekas',   'used plastic bottle'],
    ['anorganik-bengkel-kardus',       'a', 'kardus bekas',          'used cardboard box'],
    ['anorganik-bengkel-struk',        'a', 'struk servis',          'service receipt'],
    ['b3-bengkel-aki-bekas',           'b', 'aki bekas',             'used car battery'],
    ['b3-bengkel-botol-oli',           'b', 'botol oli bekas',       'used oil bottle'],
    ['b3-bengkel-busi-bekas',          'b', 'busi bekas',            'used spark plug'],
    ['b3-bengkel-filter-oli',          'b', 'filter oli bekas',      'used oil filter'],
    ['b3-bengkel-filter-udara',        'b', 'filter udara bekas',    'used air filter'],
  ]},
};

/* Teks pilihan jawaban: [nama gambar tong, teks Indonesia, teks Inggris] */
const BIN = {
  a: ['anorganik', 'Tempat sampah anorganik (daur ulang)', 'Non-organic trash bin (recyclable)'],
  o: ['organik',   'Tempat sampah organik',                'Organic trash bin'],
  b: ['b3',        'Tempat sampah B3 (bahan berbahaya)',   'Hazardous waste bin (B3)'],
};
