# Panduan Deploy GitHub Pages — Untuk Pemula

Dokumentasi ini menjelaskan **semua yang terjadi** saat deploy situs portofolio ini ke
GitHub Pages, lengkap dengan istilah-istilahnya. Ditulis untuk junior developer —
tidak perlu tahu GitHub Pages sebelumnya.

---

## 1. Konsep dasar

### GitHub Pages itu apa?

GitHub Pages adalah **layanan hosting gratis dari GitHub** khusus untuk situs statis
(HTML/CSS/JS tanpa server/database). Cara kerjanya sederhana:

```
Kamu push kode ke GitHub  →  GitHub mendeteksi repo-nya  →  Situs otomatis dipublish
```

Tidak perlu build tool, tidak perlu bayar, tidak perlu konfigurasi server.

### Kenapa situs ini bisa langsung deploy?

Situs ini dibuat **statis murni**: buka `index.html` → jalan. Tidak ada proses
kompilasi (seperti React/Vite yang harus `npm run build` dulu). Jadi GitHub Pages
tinggal menyalin file apa adanya ke internet.

### User page vs project page (INI PENTING)

| | User page | Project page |
|---|---|---|
| **Nama repo** | `username.github.io` | nama bebas, mis. `myportofolio` |
| **URL hasil** | `username.github.io/` | `username.github.io/nama-repo/` |
| **Contoh kita** | `mzikrialviansy12.github.io/` ✅ dipakai | `mzikrialviansy12.github.io/myportofolio/` |

**Kenapa kita pilih user page?** Karena situs ini memakai path absolut di HTML:

```html
<link href="/assets/css/style.css">   <!-- garis miring di depan = path absolut -->
```

Path absolut selalu dihitung dari **akar domain**. Di user page, berarti
`mzikrialviansy12.github.io/assets/css/style.css` → benar ✅.
Di project page, browser mencari `mzikrialviansy12.github.io/assets/...`
(padahal file ada di `/myportofolio/assets/...`) → **404, CSS hilang, tampilan rusak** ❌.

> Pelajaran: path absolut (`/assets/...`) hanya aman kalau situsmu menempati
> **akar domain**. Kalau suatu saat pindah ke repo biasa, ganti semua path
> menjadi relatif: `assets/css/style.css` (tanpa garis miring di depan).

---

## 2. Arsitektur situs ini (singkat)

```
myportofolio/
├── index.html          ← SATU halaman berisi 4 tab (About, Experience, Lab, Work)
├── .nojekyll           ← perintah untuk GitHub: "jangan proses dengan Jekyll"
├── .gitignore          ← daftar file yang TIDAK boleh masuk repo
├── README.md           ← dokumentasi proyek (bahasa Inggris)
├── DEPLOYMENT.md       ← dokumen yang sedang kamu baca
├── assets/
│   ├── css/style.css   ← SEMUA gaya situs (layout, warna, responsif)
│   ├── js/main.js      ← logika tab (hash routing #about, #experience, dst.)
│   ├── favicon.svg     ← ikon tab browser
│   └── network-topology.svg
└── content/
    └── proxmox-datastore-incident.html   ← halaman studi kasus (terpisah)
```

Konsep kuncinya: **satu halaman HTML, empat "tab"**. Yang berganti bukan halaman
tapi tampilan: `main.js` menampilkan/menyembunyikan bagian berdasarkan URL fragment
(`#about`, `#experience`, `#lab`, `#work`). Ini disebut **hash routing**.

---

## 3. Persiapan yang sudah dilakukan (dan alasannya)

### `git init -b main`

```
git init    → membuat folder ini menjadi "repo Git" (mulai dilacak riwayatnya)
-b main     → nama branch utamanya "main" (dulu default-nya "master")
```

**Branch** itu seperti versi paralel dari kode. `main` adalah versi resmi yang
nanti dipublish GitHub Pages.

### `.nojekyll` (file kosong)

GitHub Pages punya fitur lama bernama **Jekyll** yang memproses file sebelum
dipublish — misalnya **mengabaikan file/folder yang diawali `_`**. Kita tidak
butuh Jekyll. File `.nojekyll` (berisi kosong) mematikan pemrosesan itu supaya
file kita disajikan **persis apa adanya**.

### `.gitignore`

Daftar pola file yang **tidak pernah boleh masuk repo**:

```
.env, .env.*    ← file rahasia (API key, token) — tidak ada di proyek ini, tapi
                  pengaman tetap dipasang supaya kelak tidak salah commit
*.pdf, drafts/  ← CV asli dan catatan draft pribadi
content.md      ← brief internal (isi catatan editorial, TODO, anjuran "jangan
                  publikasikan") — TIDAK ikut repo publik
```

> Aturan emas: **repo publik = semua orang bisa melihat isinya** (termasuk
> riwayat commit). Kalaupun salah commit file rahasia dan langsung dihapus,
> file itu masih bisa dilihat di riwayat. Karena itu `.gitignore` dipasang
> **sebelum** commit pertama.

### Kenapa `content.md` dikecualikan?

Sudah diperiksa: `content.md` **tidak berisi nomor telepon** (bagian "Dirahasiakan"
hanya berisi kategori catatan, bukan nilainya). Tapi tetap saja itu dokumen kerja
internal dengan catatan editorial — tidak perlu untuk publik.

---

## 4. Autentikasi: kenapa tidak asal push?

GitHub menolak push dari orang yang tidak punya izin. Ada dua cara memberi izin:

1. **Password** — sudah tidak didukung untuk Git (keamanan).
2. **Token** — kata sandi khusus dengan izin terbatas dan bisa dicabut kapan saja.
   Istilah resminya: **Personal Access Token (PAT)**.

### Kenapa kita pakai "device flow" (`gh auth login`)?

Kamu menjalankan perintah di Termux, lalu GitHub memberi **one-time code**
(contoh `ABCD-1234`). Kamu membuka `github.com/login/device` di **browser**,
memasukkan kode, dan mengizinkan. Artinya:

- Token **tidak pernah diketik atau dikirim lewat chat** — hanya tersimpan
  di perangkat kamu (`~/.config/gh/hosts.yml`).
- Kalau perangkat hilang / token bocor, kamu bisa **cabut** token dari
  `github.com/settings/tokens` tanpa mengganti password GitHub.

`gh` itu **GitHub CLI** — program resmi GitHub untuk perintah-perintah di terminal
(bikin repo, cek status, dll.), mirip `git` tapi untuk API GitHub.

---

## 5. Deploy pertama — langkah demi langkah

Kamu sudah menyelesaikan login (bagian `gh auth login` di chat). Sisanya dijalankan
otomatis, tapi di sini penjelasannya supaya kamu paham apa yang terjadi:

```bash
# 1. Pastikan login berhasil — menampilkan akun yang aktif
gh auth status

# 2. Buat repo BARU di GitHub (nama harus persis, karena ini user page)
#    --public = bisa dilihat siapa saja
gh repo create mzikrialviansy12.github.io --public

# 3. Hubungkan repo lokal ini ke repo GitHub (sekali saja)
git remote add origin https://github.com/mzikrialviansy12/mzikrialviansy12.github.io.git
#    "remote" = alamat repo di GitHub. "origin" = nama panggilan untuk alamat itu.

# 4. Set identitas penulis commit (sekali saja, disimpan di config repo)
git config user.name  "Muhamad Zikri Alviansyah"
git config user.email "…@users.noreply.github.com"
#    Email noreply dipakai supaya email asli kamu tidak tersebar di riwayat commit.

# 5. Masukkan SEMUA perubahan ke "staging area" (area persiapan commit)
git add -A

# 6. "Commit" = menyimpan snapshot + pesan keterangan
git commit -m "Initial deploy: portfolio site"

# 7. "Push" = mengunggah commit dari lokal ke GitHub
git push -u origin main
#    -u origin main = sekali ini saja, seterusnya cukup ketik "git push".
```

**Setelah push?** Tidak ada lagi. GitHub Pages mendeteksi commit di branch `main`
repo `mzikrialviansy12.github.io`, lalu membangun ulang situs otomatis dalam
**1–3 menit**. Situs langsung tayang di:

```
https://mzikrialviansy12.github.io/
```

Status build bisa dipantau di tab **Actions** repo kamu, atau lewat CLI:

```bash
gh api repos/mzikrialviansy12/mzikrialviansy12.github.io/pages
```

---

## 6. Cara update situs setelah deploy

Siklusnya selalu sama — **3 perintah**:

```bash
# (edit file dulu, mis. index.html atau assets/css/style.css)

git add -A                              # 1. siapkan perubahan
git commit -m "Perbaiki layout tab Lab"  # 2. simpan snapshot + keterangan
git push                                 # 3. unggah → GitHub Pages rebuild otomatis
```

> Keterangan commit yang baik menjelaskan **APA dan MENGAPA**, bukan "update".
> Contoh: `"Sembunyikan stripe di layar < 768px"`.

---

## 7. Troubleshooting

| Gejala | Penyebab | Solusi |
|---|---|---|
| Situs 404 setelah push | GitHub Pages masih membangun | Tunggu 1–3 menit, muat ulang. Cek tab **Actions** |
| CSS/JS hilang, tampilan rusak total | Path absolut di URL subpath | Pastikan repo bernama persis `mzikrialviansy12.github.io` (user page) |
| `gh auth login` gagal / token kedaluwarsa | Token dicabut atau expired | Jalankan `gh auth login` lagi dari awal |
| `git push` ditolak / diminta login | Kredensial belum tersimpan | `gh auth status`; kalau kosong, login ulang |
| File `_penting` tidak muncul di situs | Jekyll memakannya | Pastikan `.nojekyll` ikut ter-commit (bukan di .gitignore) |
| Perubahan tidak kelihatan | Cache browser/CDN | Muat ulang dengan cache bypass (Ctrl+Shift+R) atau tunggu beberapa menit |

### Cara melihat isi repo tanpa membuka browser

```bash
gh repo view mzikrialviansy12.github.io
git log --oneline        # daftar commit terakhir
git status               # perubahan apa yang belum di-commit
```

---

## 8. Kamus git mini untuk pemula

| Perintah | Analogi sederhananya |
|---|---|
| `git status` | "Cek dulu apa yang berubah sebelum simpan" |
| `git add -A` | "Masukkan semua berkas ke keranjang belanja" |
| `git commit -m "..."` | "Simpan keranjang dengan label keterangan" |
| `git push` | "Kirim keranjang yang tersimpan ke toko (GitHub)" |
| `git pull` | "Ambil perubahan terbaru dari toko (mis. dari komputer lain)" |
| `git log --oneline` | "Lihat riwayat label yang pernah dibuat" |
| `git remote -v` | "Ke alamat toko mana repo ini terhubung?" |

---

## Checklist terakhir

- [x] Repo Git dibuat (`git init -b main`)
- [x] `.nojekyll` dipasang ( GitHub Pages menyajikan file apa adanya )
- [x] `.gitignore` melindungi file rahasia & draft
- [x] `README.md` menjelaskan proyek (Inggris)
- [x] `content.md` dikecualikan dari repo publik
- [x] Login GitHub (`gh auth login`)
- [x] Repo dibuat + push pertama
- [x] Situs live di `https://mzikrialviansy12.github.io/`
