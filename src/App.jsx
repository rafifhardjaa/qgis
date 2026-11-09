import { useEffect, useRef, useState } from 'react'
import {
  Baby,
  Maximize,
  Minimize,
  RotateCw,
  TriangleAlert,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Data agregat 7 kelurahan dari ekspor QGIS. sttg adalah persentase.
const KELURAHAN = [
  { name: 'Kaligawe', miskin: 1420, sttg: 3, zone: 'Merah', color: '#d73027' },
  { name: 'Tambakrejo', miskin: 1310, sttg: 5, zone: 'Merah', color: '#d73027' },
  { name: 'Gayamsari', miskin: 980, sttg: 4, zone: 'Kuning', color: '#fee08b' },
  { name: 'Pandean Lamper', miskin: 1250, sttg: 4, zone: 'Kuning', color: '#fee08b' },
  { name: 'Sawah Besar', miskin: 850, sttg: 2, zone: 'Hijau', color: '#1a9850' },
  { name: 'Sambirejo', miskin: 720, sttg: 4, zone: 'Hijau', color: '#1a9850' },
  { name: 'Siwalan', miskin: 640, sttg: 1, zone: 'Hijau', color: '#1a9850' },
]

// Warna simbologi peta, sama dengan legenda agar sumber warna tetap satu.
const ZONES = [
  {
    key: 'safe',
    color: '#1a9850',
    label: 'Hijau',
    desc: 'Penduduk miskin 640 sampai 850 jiwa.',
    stuntingDesc: 'Persentase stunting 1% sampai 2%.',
  },
  {
    key: 'warn',
    color: '#fee08b',
    label: 'Kuning',
    desc: 'Penduduk miskin 851 sampai 1250 jiwa.',
    stuntingDesc: 'Persentase stunting 3% sampai 4%.',
  },
  {
    key: 'risk',
    color: '#d73027',
    label: 'Merah',
    desc: 'Penduduk miskin 1251 sampai 1420 jiwa.',
    stuntingDesc: 'Persentase stunting 5% atau lebih.',
  },
]

function SiteHeader() {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[0.5px] border-[#d2d2d7] bg-white px-5 py-8 md:px-11 md:py-9">
      <div className="flex min-w-0 items-start gap-4">
        <img
          src="/img/pemkot-gayamsari.png"
          alt="Logo resmi Pemkot Semarang dan Kecamatan Gayamsari"
          width={56}
          height={73}
          className="h-[73px] w-[56px] shrink-0 object-contain"
        />
        <div className="min-w-0">
          <p className="mb-2.5 font-mono text-[12px] tracking-[0.06em] text-[#6e6e73]">
            Gayamsari, Kota Semarang
          </p>
          <h1 className="max-w-[56ch] text-[32px] font-semibold leading-[1.12] tracking-[-0.024em]">
            Peta Korelasi Kemiskinan dan Stunting Gayamsari
          </h1>
          <p className="mt-2 max-w-[78ch] text-[15px] text-[#424245]">
            Kemiskinan adalah akar masalahnya, stunting adalah dampaknya.
          </p>
        </div>
      </div>
      <p className="shrink-0 text-right font-mono text-[12px] leading-[1.7] text-[#6e6e73]">
        <span className="block">Data agregat per wilayah.</span>
        <span className="block">Tanpa data individu warga.</span>
      </p>
    </header>
  )
}

// Urutan tur: dari beban kemiskinan tertinggi ke bawahnya.
const TOUR_STEPS = ['Tambakrejo', 'Kaligawe', 'Pandean Lamper']

function MapPanel({ mode, setMode }) {
  const stageRef = useRef(null)
  const iframeRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [supported, setSupported] = useState(false)
  const [failed, setFailed] = useState(false)
  const [mapStatus, setMapStatus] = useState('loading')
  const [reloadKey, setReloadKey] = useState(0)
  const [tourIndex, setTourIndex] = useState(-1)

  useEffect(() => {
    const stage = stageRef.current
    if (stage && stage.requestFullscreen) setSupported(true)
    function sync() {
      setIsFullscreen(document.fullscreenElement === stageRef.current)
    }
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  useEffect(() => {
    setMapStatus('loading')
    const timer = window.setTimeout(() => setMapStatus('error'), 10000)
    function handleLoad() {
      const win = iframeRef.current?.contentWindow
      if (win && win.map) {
        window.clearTimeout(timer)
        setMapStatus('ready')
      }
    }
    const iframe = iframeRef.current
    iframe?.addEventListener('load', handleLoad)
    return () => {
      window.clearTimeout(timer)
      iframe?.removeEventListener('load', handleLoad)
    }
  }, [reloadKey])

  function getMapWindow() {
    try {
      const win = iframeRef.current?.contentWindow
      return win && win.map ? win : null
    } catch {
      return null
    }
  }

  function setSymbol(newMode) {
    setMode(newMode)
    const win = getMapWindow()
    if (win && typeof win.setSymbolMode === 'function') {
      win.setSymbolMode(newMode)
    }
  }

  function panicTour(name) {
    const win = getMapWindow()
    if (!win) return
    try {
      const layer = win.map.getLayers().getArray()[0]
      const feature = layer
        .getSource()
        .getFeatures()
        .find((f) => f.get('WADMKD') === name || f.get('NAMOBJ') === name)
      if (!feature) return
      const geom = feature.getGeometry()
      const extent = geom.getExtent()
      const center = [
        (extent[0] + extent[2]) / 2,
        (extent[1] + extent[3]) / 2,
      ]
      win.map.getView().fit(extent, { padding: [70, 70, 70, 70] })
      const pixel = win.map.getPixelFromCoordinate(center)
      win.map.dispatchEvent({
        type: 'singleclick',
        pixel,
        coordinate: center,
        map: win.map,
      })
    } catch {
      // Peta tetap bisa dipakai tanpa tur.
    }
  }

  function goTour(next) {
    const idx =
      next === 'start'
        ? 0
        : next === 'exit'
          ? -1
          : (tourIndex + next + TOUR_STEPS.length) % TOUR_STEPS.length
    setTourIndex(idx)
    if (idx >= 0) panicTour(TOUR_STEPS[idx])
  }

  function toggle() {
    const stage = stageRef.current
    if (document.fullscreenElement === stage) {
      document.exitFullscreen()
    } else {
      stage
        .requestFullscreen()
        .then(() => setFailed(false))
        .catch(() => setFailed(true))
    }
  }

  return (
    <main
      ref={stageRef}
      tabIndex={-1}
      className="flex min-h-0 min-w-0 flex-col gap-3 bg-[#f5f5f7] lg:h-full lg:bg-transparent"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
          Sebaran wilayah
        </h2>
        <div
          role="group"
          aria-label="Simbologi peta"
          className="flex rounded-[9px] bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
        >
          <Button
            size="sm"
            variant={mode === 'miskin' ? 'default' : 'ghost'}
            onClick={() => setSymbol('miskin')}
            aria-pressed={mode === 'miskin'}
            className="rounded-[7px]"
          >
            <Wallet aria-hidden="true" />
            Kemiskinan
          </Button>
          <Button
            size="sm"
            variant={mode === 'stunting' ? 'default' : 'ghost'}
            onClick={() => setSymbol('stunting')}
            aria-pressed={mode === 'stunting'}
            className="rounded-[7px]"
          >
            <Baby aria-hidden="true" />
            Stunting
          </Button>
        </div>
        <Button
          size="sm"
          onClick={() => goTour('start')}
          className="ml-auto"
        >
          Mulai tur prioritas
        </Button>
        {supported && (
          <Button onClick={toggle}>
            {isFullscreen ? (
              <Minimize aria-hidden="true" />
            ) : (
              <Maximize aria-hidden="true" />
            )}
            {failed
              ? 'Layar penuh tidak tersedia'
              : isFullscreen
                ? 'Keluar layar penuh'
                : 'Perbesar peta'}
          </Button>
        )}
      </div>

      {tourIndex >= 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-[10px] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
          <p className="text-[14px]" role="status">
            <strong className="font-semibold">{TOUR_STEPS[tourIndex]}</strong>
            {' — '}
            {TOUR_STEPS.length === 1 ? '' : `titik ${tourIndex + 1} dari ${TOUR_STEPS.length}: `}
            {KELURAHAN.find((k) => k.name === TOUR_STEPS[tourIndex])?.miskin.toLocaleString('id-ID')} jiwa miskin,
            stunting {KELURAHAN.find((k) => k.name === TOUR_STEPS[tourIndex])?.sttg}%{'.'}
          </p>
          <span className="ml-auto flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => goTour(-1)}>
              Sebelumnya
            </Button>
            <Button size="sm" onClick={() => goTour(1)}>
              Berikutnya
            </Button>
            <Button size="sm" variant="ghost" onClick={() => goTour('exit')}>
              Keluar tur
            </Button>
          </span>
        </div>
      )}

      <p className="text-[13px] text-[#6e6e73]">
        Klik satu poligon untuk membaca agregat wilayah.
      </p>

      <div className="map-canvas relative min-h-[56dvh] flex-1 overflow-hidden rounded-[14px] bg-[#ececf0] shadow-[0_12px_32px_rgba(0,0,0,0.08)] lg:min-h-0">
        <iframe
          key={reloadKey}
          ref={iframeRef}
          src="/peta_stunting/index.html"
          title="Peta interaktif kemiskinan dan stunting Gayamsari"
          width={1200}
          height={900}
          className="absolute inset-0 block h-full w-full border-0"
        >
          <p>
            Peramban ini tidak menampilkan peta di dalam halaman.{' '}
            <a href="/peta_stunting/index.html">Buka peta di tab terpisah</a>.
          </p>
        </iframe>
        {(mapStatus === 'loading' || mapStatus === 'error') && (
          <div className="absolute inset-0 grid place-items-center bg-white/85 p-6 text-center">
            <div>
              <p className="text-[15px] font-semibold">
                {mapStatus === 'loading'
                  ? 'Memuat peta…'
                  : 'Peta dasar tidak tersedia.'}
              </p>
              <p className="mt-1 text-[13px] text-[#6e6e73]">
                {mapStatus === 'loading'
                  ? 'Menunggu tile peta dari OpenStreetMap.'
                  : 'Periksa koneksi internet Anda, lalu coba muat ulang.'}
              </p>
              {mapStatus === 'error' && (
                <Button
                  className="mx-auto mt-3"
                  onClick={() => setReloadKey((k) => k + 1)}
                >
                  <RotateCw aria-hidden="true" />
                  Muat ulang peta
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// Daftar persentase per kelurahan. Arahkan kursor (atau fokuskan lewat
// keyboard) ke satu baris untuk melihat detail agregat wilayah tersebut.
function PercentagePanel() {
  const [hovered, setHovered] = useState(null)
  const [showTable, setShowTable] = useState(false)
  if (showTable) {
    return (
      <section aria-labelledby="percent-title">
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <h3
            id="percent-title"
            className="text-[15px] font-semibold tracking-[-0.01em]"
          >
            Tabel persentase per kelurahan
          </h3>
          <Button size="sm" variant="ghost" onClick={() => setShowTable(false)}>
            Lihat daftar
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <caption className="sr-only">
              Persentase balita stunting dan jumlah penduduk miskin per kelurahan
              di Gayamsari
            </caption>
            <thead>
              <tr className="border-b border-[0.5px] border-[#d2d2d7] text-[#6e6e73]">
                <th scope="col" className="py-2 pr-3 font-medium">
                  Kelurahan
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-medium">
                  Stunting
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-medium">
                  Miskin
                </th>
                <th scope="col" className="py-2 font-medium">
                  Zona
                </th>
              </tr>
            </thead>
            <tbody>
              {KELURAHAN.map((k) => (
                <tr
                  key={k.name}
                  className="border-b border-[0.5px] border-[#ececf0]"
                >
                  <th scope="row" className="py-2 pr-3 font-medium">
                    {k.name}
                  </th>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {k.sttg}%
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {k.miskin.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2">{k.zone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[12px] text-[#6e6e73]">
          Angka penduduk miskin dalam jiwa.
        </p>
      </section>
    )
  }
  return (
    <section aria-labelledby="percent-title">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h3
          id="percent-title"
          className="text-[15px] font-semibold tracking-[-0.01em]"
        >
          Persentase stunting per kelurahan
        </h3>
        <Button size="sm" variant="ghost" onClick={() => setShowTable(true)}>
          Lihat tabel
        </Button>
      </div>
      <ol className="list-none p-0">
        {KELURAHAN.map((k) => (
          <li
            key={k.name}
            tabIndex={0}
            aria-label={`${k.name}: stunting ${k.sttg} persen, penduduk miskin ${k.miskin} jiwa, zona ${k.zone}`}
            onMouseEnter={() => setHovered(k.name)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(k.name)}
            onBlur={() => setHovered(null)}
            className="group relative rounded-lg px-2 py-2 outline-none transition-colors hover:bg-[#f5f5f7] focus-visible:bg-[#f5f5f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e5a43]"
          >
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-3 w-3 shrink-0 rounded"
                style={{ background: k.color }}
              />
              <span className="min-w-0 flex-1 truncate text-[14px] font-medium">
                {k.name}
              </span>
              <span className="font-mono text-[13px] font-medium tabular-nums">
                {k.sttg}%
              </span>
            </div>
            <div
              className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-[#e8e8ed]"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${(k.sttg / 5) * 100}%`,
                  background: k.color,
                }}
              />
            </div>
            <div
              aria-hidden="true"
              className={`absolute left-0 right-0 top-full z-20 mt-1 rounded-[10px] border border-[0.5px] border-[#d2d2d7] bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-150 ${
                hovered === k.name
                  ? 'pointer-events-none translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-1 opacity-0'
              }`}
            >
              <p className="text-[13px] font-semibold">{k.name}</p>
              <dl className="mt-1.5 space-y-0.5 text-[12px] text-[#424245]">
                <div className="flex justify-between gap-4">
                  <dt>Persentase stunting</dt>
                  <dd className="font-medium tabular-nums">{k.sttg}%</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Penduduk miskin</dt>
                  <dd className="font-medium tabular-nums">
                    {k.miskin.toLocaleString('id-ID')} jiwa
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Kelas wilayah</dt>
                  <dd className="font-medium">Zona {k.zone}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-[12px] text-[#6e6e73]">
        Arahkan kursor ke satu baris untuk membaca detail agregat wilayahnya.
      </p>
    </section>
  )
}

function LegendPanel({ mode }) {
  return (
    <aside aria-labelledby="legend-title" className="min-h-0 lg:h-full">
      <Card className="flex h-full min-h-0 flex-col">
        <CardHeader className="shrink-0">
          <CardTitle id="legend-title">Membaca peta</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-col gap-8 lg:overflow-y-auto">
          <section aria-labelledby="logic-title">
            <h3 id="logic-title" className="mb-2.5 text-[15px] font-semibold tracking-[-0.01em]">
              Rantai sebab dan akibat
            </h3>
            <p className="mb-4 text-[14px] leading-[1.6] text-[#424245]">
              Logika yang dipakai peta ini:{' '}
              <strong className="font-semibold text-[#1d1d1f]">jika</strong>{' '}
              kemiskinan di suatu wilayah tinggi,{' '}
              <strong className="font-semibold text-[#1d1d1f]">maka</strong>{' '}
              risiko stunting balita di wilayah itu ikut tinggi.
            </p>
            <ol className="list-none p-0">
              <li className="relative pb-[18px] pl-[38px] last:pb-0">
                <span className="absolute left-0 top-[1px] grid h-6 w-6 place-items-center rounded-full bg-[#e8f0ec] text-[#0e5a43]">
                  <Wallet className="size-3.5" aria-hidden="true" />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute bottom-[2px] left-[11px] top-[28px] w-px bg-[#d2d2d7]"
                />
                <p className="mb-0.5 font-mono text-[11px] tracking-[0.05em] text-[#6e6e73]">
                  Akar masalah
                </p>
                <h4 className="mb-[3px] text-[15px] font-semibold">
                  Kemiskinan
                </h4>
                <p className="text-[13px] leading-[1.55] text-[#424245]">
                  Pendapatan rendah membatasi asupan gizi, sanitasi, dan akses
                  layanan kesehatan.
                </p>
              </li>
              <li className="relative pl-[38px]">
                <span className="absolute left-0 top-[1px] grid h-6 w-6 place-items-center rounded-full bg-[#e8f0ec] text-[#0e5a43]">
                  <Baby className="size-3.5" aria-hidden="true" />
                </span>
                <p className="mb-0.5 font-mono text-[11px] tracking-[0.05em] text-[#6e6e73]">
                  Dampak
                </p>
                <h4 className="mb-[3px] text-[15px] font-semibold">
                  Stunting balita
                </h4>
                <p className="text-[13px] leading-[1.55] text-[#424245]">
                  Gizi buruk berkepanjangan membuat balita tumbuh lebih pendek
                  dari standar usianya.
                </p>
              </li>
            </ol>
          </section>

          <section aria-labelledby="scale-title">
            <h3 id="scale-title" className="mb-3.5 text-[15px] font-semibold tracking-[-0.01em]">
              Legenda warna
            </h3>
            <div
              aria-hidden="true"
              className="h-[9px] rounded-[5px]"
              style={{
                background:
                  'linear-gradient(90deg, #1a9850 0 33.33%, #fee08b 33.33% 66.66%, #d73027 66.66% 100%)',
              }}
            />
            <p
              aria-hidden="true"
              className="mb-3.5 mt-1 flex justify-between font-mono text-[11px] text-[#6e6e73]"
            >
              <span>Sedikit</span>
              <span>Banyak</span>
            </p>
            <ul className="grid gap-2.5">
              {ZONES.map((zone) => (
                <li
                  key={zone.key}
                  className="grid grid-cols-[14px_minmax(0,1fr)] items-start gap-2.5 text-[14px] leading-[1.5] text-[#424245]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[3px] h-3.5 w-3.5 rounded"
                    style={{ background: zone.color }}
                  />
                  <p>
                    <strong className="font-semibold text-[#1d1d1f]">
                      {zone.label}.
                    </strong>{' '}
                    {mode === 'stunting' ? zone.stuntingDesc : zone.desc}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13px] leading-[1.55] text-[#6e6e73]">
              {mode === 'stunting'
                ? 'Ganti ke Kemiskinan untuk membaca jumlah penduduk miskin per kelas.'
                : 'Persentase balita stunting tiap kelurahan tampil sebagai label di peta dan di popup saat poligon diklik.'}
            </p>
          </section>

          <PercentagePanel />

          <section
            aria-labelledby="priority-title"
            className="rounded-xl bg-[#fdf3f2] p-4"
          >
            <h3
              id="priority-title"
              className="mb-2 flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-[#b3261e]"
            >
              <TriangleAlert className="size-4" aria-hidden="true" />
              Prioritas penanganan
            </h3>
            <p className="text-[14px] leading-[1.55] text-[#5c2b26]">
              Tambakrejo (1310 jiwa miskin, stunting 5%) dan Kaligawe
              (1420 jiwa miskin, stunting 3%) punya penduduk miskin
              terbanyak. Pandean Lamper (1250 jiwa miskin, stunting 4%)
              berada di puncak zona kuning. Ketiganya jadi titik awal penanganan
              gizi dan ekonomi.
            </p>
          </section>
        </CardContent>
      </Card>
    </aside>
  )
}

function SiteFooter() {
  return (
    <footer className="flex flex-col gap-x-6 gap-y-1 border-t border-[0.5px] border-[#d2d2d7] bg-white px-5 py-3.5 font-mono text-[12px] leading-[1.6] text-[#424245] md:px-11 lg:flex-row lg:items-baseline lg:flex-nowrap lg:overflow-hidden lg:whitespace-nowrap">
      <p className="shrink-0">Sumber: data agregat kelurahan Gayamsari, ekspor QGIS.</p>
      <p className="shrink-0">Peta dasar: &copy; OpenStreetMap contributors.</p>
      <p className="shrink-0">Data individu warga tidak disertakan.</p>
      <p className="shrink-0 text-[#6e6e73] lg:ml-auto lg:text-right">
        Peta risiko stunting, Gayamsari, Kota Semarang.
      </p>
    </footer>
  )
}

function App() {
  const [mode, setMode] = useState('miskin')
  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
      <a
        href="#map"
        className="absolute -left-[9999px] top-0 z-10 rounded-[9px] bg-white px-3.5 py-2.5 text-[14px] text-[#1d1d1f] focus:left-3 focus:top-3"
      >
        Langsung ke peta
      </a>
      <SiteHeader />
      <div className="grid flex-1 gap-4 p-3.5 md:p-5 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-stretch lg:gap-6 lg:p-[22px]">
        <MapPanel mode={mode} setMode={setMode} />
        <LegendPanel mode={mode} />
      </div>
      <SiteFooter />
    </div>
  )
}

export default App
