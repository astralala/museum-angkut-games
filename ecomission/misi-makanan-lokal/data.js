// Ubah angka di sini untuk menyesuaikan data makanan & batas ending
const THRESHOLD=500; // km. Batas tengah meter: <= ini = good ending, > ini = bad ending
const MAXKM=7000;    // km di ujung kanan meter
const A='assets/';
// area: gambar area piring kosong (lokal_0018-0021)
const CATS=[
 {id:'karbo',name:'Karbohidrat',icon:'🌾',color:'#ffe0b3',area:A+'lokal_0018_area-pring-karbohidrat.png'},
 {id:'sayur',name:'Sayuran',icon:'🍃',color:'#c8f0cc',area:A+'lokal_0019_area-piring-sayuran.png'},
 {id:'protein',name:'Protein',icon:'🍗',color:'#ffc9cf',area:A+'lokal_0021_area-piring-protein.png'},
 {id:'lengkap',name:'Buah',icon:'🍎',color:'#fff1a8',area:A+'lokal_0020_area-piring-buah.png'}];
// img: kartu makanan di panel kiri; plate: gambar makanan saat sudah ditaruh di piring
const FOODS=[
 {id:'beras-garut',cat:'karbo',name:'Beras Garut',emoji:'🍚',origin:'Garut, Jawa Barat',flag:'🇮🇩',km:15,local:1,
  img:A+'lokal_0001_beras-garut.png',plate:A+'lokal_0010_area-piring-beras-garut.png'},
 {id:'beras-thailand',cat:'karbo',name:'Beras Thailand',emoji:'🍚',origin:'Thailand',flag:'🇹🇭',km:2300,
  img:A+'lokal_0002_beras-thailand.png',plate:A+'lokal_0011_area-piring-beras-thailand.png'},
 {id:'timun-lokal',cat:'sayur',name:'Timun Lokal',emoji:'🥒',origin:'Indonesia',flag:'🇮🇩',km:10,local:1,
  img:A+'lokal_0003_timun-lokal.png',plate:A+'lokal_0012_area-piring-timun-lokal.png'},
 {id:'zucchini',cat:'sayur',name:'Zucchini',emoji:'🥒',origin:'Jepang',flag:'🇯🇵',km:5800,
  img:A+'lokal_0004_zucchini.png',plate:A+'lokal_0013_area-piring-zuchinni.png'},
 {id:'daging-lokal',cat:'protein',name:'Daging Sapi Lokal',emoji:'🥩',origin:'Indonesia',flag:'🇮🇩',km:5,local:1,
  img:A+'lokal_0008_daging-sapi-lokal_crop.png',plate:A+'lokal_0016_area-piring-daging-sapi-lokal_crop.png'},
 {id:'sirloin-australia',cat:'protein',name:'Sirloin Australia',emoji:'🥩',origin:'Australia',flag:'🇦🇺',km:5000,
  img:A+'lokal_0007_sirloin-australia.png',plate:A+'lokal_0017_area-piring-sirloin-australia.png'},
 {id:'apel-batu',cat:'lengkap',name:'Apel Batu',emoji:'🍏',origin:'Batu, Jawa Timur',flag:'🇮🇩',km:5,local:1,
  img:A+'lokal_0006_apel-batu.png',plate:A+'lokal_0014_area-piring-apel-batu.png'},
 {id:'stroberi-korea',cat:'lengkap',name:'Stroberi Korea',emoji:'🍓',origin:'Korea Selatan',flag:'🇰🇷',km:5400,
  img:A+'lokal_0005_stoberi-korea.png',plate:A+'lokal_0015_area-piring-stroberi-korea.png'}];
// posisi bar (%), mengikuti warna di gambar meter (lokal_0026_meterjarak.png):
// hijau 0-45km=0-38%, kuning 45-500km=38-77%, merah >500km=77-100%
function barPos(km){return km<=45?km/45*38:km<=THRESHOLD?38+(km-45)/(THRESHOLD-45)*39:77+Math.min(1,(km-THRESHOLD)/(MAXKM-THRESHOLD))*23}
