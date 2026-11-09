# Peta Korelasi Kemiskinan dan Stunting Gayamsari

Peta interaktif yang memperlihatkan korelasi kemiskinan dan stunting balita di Kecamatan Gayamsari, Kota Semarang. Kemiskinan adalah akar masalahnya, stunting adalah dampaknya. Sela satu poligon untuk membaca agregat wilayah, atau alihkan kursor ke daftar persentase di panel kanan untuk melihat detail tiap kelurahan.

## Tech stack

![Node.js](https://img.shields.io/badge/Node.js-v24-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000?style=flat-square&logo=shadcnui&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-latest-F56600?style=flat-square&logo=lucide&logoColor=white)
![OpenLayers](https://img.shields.io/badge/OpenLayers-latest-1E88E5?style=flat-square&logo=openlayers&logoColor=white)
![QGIS](https://img.shields.io/badge/QGIS-589632?style=flat-square&logo=qgis&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-rafifhardjaa%2Fqgis-181717?style=flat-square&logo=github&logoColor=white)

## Cara menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:5173 di peramban. Peta memakai tile OpenStreetMap, jadi ia butuh koneksi internet. Untuk versi produksi:

```bash
npm run build
```

## Data

- 7 kelurahan di Gayamsari: Kaligawe, Tambakrejo, Gayamsari, Pandean Lamper, Sawah Besar, Sambirejo, Siwalan.
- Kolom `miskin_num` berisi jumlah penduduk miskin per kelurahan, `sttg_num` berisi persentase balita stunting.
- Ekspor QGIS (`qgis2web`) tersimpan di `public/peta_stunting/`, font lokal di `public/assets/fonts/`, logo resmi di `public/img/`.
- Semua angka adalah data agregat per wilayah. Data individu warga tidak disertakan.
