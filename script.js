/* Your Vibe - data produk, keranjang, dan layout bersama (nav, drawer, footer) */
const WA = '62895619240201';
const KEY = 'vyb_keranjang';
const IG = 'https://www.instagram.com/vyb.fficial?igsh=NW03Mjhub2ZmaGgx';
const MAPS = 'https://maps.app.goo.gl/TmKFxYW55ciDxcD6A';

/* Edit produk di sini saja. Halaman lain membaca dari data ini. */
const PRODUK = {
  tshirt: { nama: 'Biarin', jenis: 'T-Shirt', harga: 300000, ukuran: ['S', 'M', 'L', 'XL'],
    bahan: 'Cotton Combed 24s', warna: 'Hitam', badge: 'READY STOCK', kode: 'YV-TS-001',
    foto: 'foto/baju.jpg', halaman: 'tshirt.html',
    kalimat: 'Mereka mau komentar, silakan. Kamu tetap pakai.' },
  hoodie: { nama: 'Lihat Aja', jenis: 'Hoodie', harga: 450000, ukuran: ['M', 'L', 'XL'],
    bahan: 'Heavy Fleece 330 gsm', warna: 'Black / Off White', badge: 'LIMITED', kode: 'YV-HD-002',
    foto: 'foto/baju.jpg', halaman: 'hoodie.html',
    kalimat: 'Tebal, hangat, dan cuek sama tatapan orang.' },
  sweatpants: { nama: 'Gas', jenis: 'Sweatpants', harga: 350000, ukuran: ['S', 'M', 'L', 'XL'],
    bahan: 'Baby Terry Premium', warna: 'Abu-abu / Hitam', badge: 'READY STOCK', kode: 'YV-SP-003',
    foto: 'foto/baju.jpg', halaman: 'sweatpants.html',
    kalimat: 'Buat yang males mikir lama. Pakai, jalan, selesai.' }
};

const $ = s => document.querySelector(s);
const rp = n => 'IDR ' + n.toLocaleString('id-ID');

/* ---------- keranjang (localStorage, item: {id, ukuran, jumlah}) ---------- */
function baca() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(d) ? d.filter(i => PRODUK[i.id] && i.jumlah > 0) : [];
  } catch { return []; }
}
function simpan(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
  renderKeranjang();
}
function tambah(id, ukuran, jumlah) {
  const d = baca();
  const ada = d.find(i => i.id === id && i.ukuran === ukuran);
  if (ada) ada.jumlah += jumlah; else d.push({ id, ukuran, jumlah });
  simpan(d);
}
function ubah(i, selisih) {
  const d = baca();
  if (!d[i]) return;
  d[i].jumlah += selisih;
  if (d[i].jumlah <= 0) d.splice(i, 1);
  simpan(d);
}

function renderKeranjang() {
  const d = baca();
  document.querySelectorAll('.jml-keranjang').forEach(e => e.textContent = d.reduce((s, i) => s + i.jumlah, 0));
  const list = $('#drawer-list');
  if (!list) return;
  let total = 0;
  let wa = 'Halo min, aku mau tampil. Ini pesananku:\n\n';
  list.innerHTML = d.length ? d.map((it, i) => {
    const p = PRODUK[it.id], sub = p.harga * it.jumlah;
    total += sub;
    wa += `${i + 1}. ${p.nama} (${p.jenis}) ukuran ${it.ukuran}, ${it.jumlah}x = ${rp(sub)}\n`;
    return `<div class="item"><div><h3>${p.nama}</h3><small>${p.jenis}, ukuran ${it.ukuran}</small></div>
      <strong>${rp(sub)}</strong>
      <div class="qty-mini"><button data-aksi="min" data-i="${i}" aria-label="Kurangi ${p.nama}">-</button>
      <span>${it.jumlah}</span><button data-aksi="plus" data-i="${i}" aria-label="Tambah ${p.nama}">+</button>
      <button class="hapus" data-aksi="hapus" data-i="${i}">Hapus</button></div></div>`;
  }).join('') : '<p class="kosong">Belum ada apa-apa di sini. Sama kayak alasanmu buat nggak tampil.</p>';
  $('#drawer-total').textContent = rp(total);
  const co = $('#drawer-wa');
  if (d.length) {
    co.href = `https://wa.me/${WA}?text=${encodeURIComponent(wa + `\nTotal: ${rp(total)}`)}`;
    co.removeAttribute('aria-disabled');
  } else {
    co.href = '#';
    co.setAttribute('aria-disabled', 'true');
  }
}

function bukaDrawer() { document.body.classList.add('buka'); $('.btn-tutup').focus(); }
function tutupDrawer() { document.body.classList.remove('buka'); $('.btn-cart').focus(); }

/* ---------- layout bersama: nav, drawer, footer ---------- */
function pasangLayout() {
  const hal = location.pathname.split('/').pop() || 'index.html';
  const menu = [['index.html', 'Home'], ...Object.values(PRODUK).map(p => [p.halaman, p.jenis])];
  document.body.insertAdjacentHTML('afterbegin', `
    <nav class="nav" aria-label="Menu utama">
      <a class="logo" href="index.html">Your Vibe</a>
      <ul class="nav-links">${menu.map(([h, t]) => `<li><a href="${h}"${hal === h ? ' aria-current="page"' : ''}>${t}</a></li>`).join('')}</ul>
      <button class="btn-cart" aria-haspopup="dialog">Keranjang (<span class="jml-keranjang">0</span>)</button>
    </nav>`);
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="footer dark">
      <div><a class="logo" href="index.html">Your Vibe</a><p>Jl. Melati No.40, Lowokwaru, Kota Malang 65141</p></div>
      <div><a href="${IG}" target="_blank" rel="noopener noreferrer">Instagram @vyb.fficial</a>
        <a href="${MAPS}" target="_blank" rel="noopener noreferrer">Lihat di Maps</a>
        <a href="https://wa.me/${WA}" target="_blank" rel="noopener noreferrer">WhatsApp</a></div>
      <p>&copy; 2026 Your Vibe</p>
    </footer>
    <div class="lapis"></div>
    <aside class="drawer" role="dialog" aria-modal="true" aria-label="Keranjang">
      <div class="drawer-kepala"><h2>Keranjang</h2><button class="btn-tutup">Tutup</button></div>
      <div id="drawer-list"></div>
      <div class="drawer-kaki">
        <p class="total">Total <strong id="drawer-total">IDR 0</strong></p>
        <a id="drawer-wa" class="btn btn-beli" href="#" target="_blank" rel="noopener noreferrer">Pesan lewat WhatsApp</a>
        <button class="kosongkan" data-aksi="kosong">Kosongkan keranjang</button>
      </div>
    </aside>`);

  $('.btn-cart').addEventListener('click', bukaDrawer);
  $('.btn-tutup').addEventListener('click', tutupDrawer);
  $('.lapis').addEventListener('click', tutupDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('buka')) tutupDrawer(); });
  $('.drawer').addEventListener('click', e => {
    const t = e.target.closest('[data-aksi]');
    if (!t) return;
    const i = +t.dataset.i;
    if (t.dataset.aksi === 'plus') ubah(i, 1);
    if (t.dataset.aksi === 'min') ubah(i, -1);
    if (t.dataset.aksi === 'hapus') ubah(i, -999);
    if (t.dataset.aksi === 'kosong') simpan([]);
  });
  $('#drawer-wa').addEventListener('click', e => { if (e.currentTarget.getAttribute('aria-disabled')) e.preventDefault(); });
}

/* ---------- halaman Home: daftar koleksi ---------- */
function renderKoleksi() {
  const el = $('#koleksi');
  if (!el) return;
  el.innerHTML = Object.values(PRODUK).map(p => `
    <a class="tile" href="${p.halaman}">
      <span class="tag">${p.badge}</span>
      <img class="foto" src="${p.foto}" alt="${p.jenis} ${p.warna} Your Vibe" loading="lazy">
      <div class="tile-info"><h3>${p.nama}</h3><span>${p.jenis}</span><strong>${rp(p.harga)}</strong></div>
    </a>`).join('');
}

/* ---------- halaman produk ---------- */
function renderProduk() {
  const el = $('#produk-app');
  if (!el) return;
  const id = el.dataset.id, p = PRODUK[id];
  if (!p) return;
  let ukuran = null, jumlah = 1;
  document.title = `${p.nama} (${p.jenis}) | Your Vibe`;
  el.innerHTML = `
    <div class="produk-foto"><span class="tag">${p.badge}</span>
      <img class="foto" src="${p.foto}" alt="${p.jenis} ${p.warna} Your Vibe"></div>
    <div class="produk-info">
      <p class="kode">Kode ${p.kode}</p>
      <h1>${p.nama}</h1>
      <p class="jenis">${p.jenis}</p>
      <p class="harga">${rp(p.harga)}</p>
      <p class="kalimat">${p.kalimat}</p>
      <dl class="spek"><div><dt>Bahan</dt><dd>${p.bahan}</dd></div><div><dt>Warna</dt><dd>${p.warna}</dd></div></dl>
      <p class="label" id="lbl-ukuran">Pilih ukuran</p>
      <div class="ukuran" role="group" aria-labelledby="lbl-ukuran">
        ${p.ukuran.map(u => `<button aria-pressed="false">${u}</button>`).join('')}</div>
      <p class="galat" id="galat" role="alert"></p>
      <div class="qty"><button id="min" aria-label="Kurangi jumlah">-</button><output id="jml">1</output><button id="plus" aria-label="Tambah jumlah">+</button></div>
      <p class="total">Total <strong id="total">${rp(p.harga)}</strong></p>
      <button class="btn btn-beli" id="beli">Masukin ke keranjang</button>
      <p class="lain">Lihat juga: ${Object.entries(PRODUK).filter(([k]) => k !== id).map(([, x]) => `<a href="${x.halaman}">${x.nama}</a>`).join('')}</p>
    </div>`;
  const hitung = () => { $('#jml').textContent = jumlah; $('#total').textContent = rp(p.harga * jumlah); };
  el.querySelectorAll('.ukuran button').forEach(b => b.addEventListener('click', () => {
    ukuran = b.textContent;
    el.querySelectorAll('.ukuran button').forEach(x => x.setAttribute('aria-pressed', x === b));
    $('#galat').textContent = '';
  }));
  $('#min').addEventListener('click', () => { if (jumlah > 1) { jumlah--; hitung(); } });
  $('#plus').addEventListener('click', () => { jumlah++; hitung(); });
  $('#beli').addEventListener('click', () => {
    if (!ukuran) { $('#galat').textContent = 'Pilih ukuran dulu.'; return; }
    tambah(id, ukuran, jumlah);
    bukaDrawer();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  pasangLayout();
  renderKoleksi();
  renderProduk();
  renderKeranjang();
});
