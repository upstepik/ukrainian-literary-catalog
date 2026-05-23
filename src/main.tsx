import React from "react";
import ReactDOM from "react-dom/client";
import { ArrowLeft, ArrowUpRight, BookOpen, LibraryBig, Sparkles } from "lucide-react";
import StellarCardGallerySingle from "@/components/ui/3d-image-gallery";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";
import { catalogBooks } from "@/lib/books";
import "./index.css";

function getHashPath() {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}
function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05060d] text-white">
      <CosmicParallaxBg
        head="РЈРєСЂР°С—РЅСЃСЊРєР° РїРѕР»РёС†СЏ"
        text="РєР»Р°СЃРёРєР°, РєР°С‚Р°Р»РѕРі, С‡РёС‚Р°РЅРЅСЏ"
        loop
        showPlanet={false}
        className="fixed inset-0"
      />

      <div className="relative z-10">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
          <a className="group inline-flex items-center gap-3" href="#/" aria-label="РќР° РіРѕР»РѕРІРЅСѓ">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 shadow-2xl shadow-cyan-950/30 backdrop-blur">
              <LibraryBig className="h-5 w-5 text-amber-200" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-serif text-lg font-semibold tracking-wide">РЈРєСЂР°С—РЅСЃСЊРєР° РїРѕР»РёС†СЏ</span>
              <span className="block text-xs uppercase tracking-[0.28em] text-white/45">РєР°С‚Р°Р»РѕРі С‚РІРѕСЂС–РІ</span>
            </span>
          </a>

          <a
            className="hidden rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-amber-200/50 hover:bg-amber-200 hover:text-slate-950 sm:inline-flex"
            href="#/catalog"
          >
            Р’С–РґРєСЂРёС‚Рё РєР°С‚Р°Р»РѕРі
          </a>
        </header>

        <section className="mx-auto grid min-h-[760px] w-full max-w-7xl items-end gap-10 px-5 pb-14 pt-20 sm:min-h-[calc(100vh-92px)] sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100 backdrop-blur">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              РєСѓСЂР°С‚РѕСЂСЃСЊРєР° РґРѕР±С–СЂРєР°
            </div>
            <h1 className="max-w-full break-words font-serif text-5xl font-semibold leading-[0.92] tracking-normal text-white sm:text-7xl sm:leading-[0.86] lg:text-8xl">
              РљР°С‚Р°Р»РѕРі СѓРєСЂР°С—РЅСЃСЊРєРёС… С…СѓРґРѕР¶РЅС–С… С‚РІРѕСЂС–РІ
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-200/82 sm:text-lg">
              РЎСѓС‡Р°СЃРЅРёР№ Р»С–С‚РµСЂР°С‚СѓСЂРЅРёР№ РїСЂРѕСЃС‚С–СЂ РґР»СЏ СѓРєСЂР°С—РЅСЃСЊРєРѕС— РєР»Р°СЃРёРєРё. РќР° РѕРєСЂРµРјС–Р№ СЃС‚РѕСЂС–РЅС†С– РєР°С‚Р°Р»РѕРі
              РІС–РґРєСЂРёРІР°С”С‚СЊСЃСЏ СЏРє 3D-РѕСЂР±С–С‚Р° РєРЅРёР¶РєРѕРІРёС… РѕР±РєР»Р°РґРёРЅРѕРє Сѓ Р·РѕСЂСЏРЅРѕРјСѓ РїСЂРѕСЃС‚РѕСЂС–.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-200 px-6 py-4 text-sm font-bold text-slate-950 shadow-2xl shadow-amber-950/30 transition hover:-translate-y-0.5 hover:bg-white"
                href="#/catalog"
              >
                Р’С–РґРєСЂРёС‚Рё РєР°С‚Р°Р»РѕРі
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-4 text-sm font-semibold text-white/80 backdrop-blur">
                <BookOpen className="h-4 w-4 text-amber-200" aria-hidden="true" />
                Р›РµР±РµРґС”РІ Р†Р»Р»СЏ В· РљРѕСЂРІРµРіС–РЅ РћР»РµРєСЃР°РЅРґСЂ
              </span>
            </div>
          </div>

          <div className="relative hidden min-h-[580px] lg:block" aria-hidden="true">
            <div className="absolute right-0 top-16 h-[510px] w-[380px] rotate-6 rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/60 backdrop-blur-md">
              <img
                className="h-full w-full rounded-[1.35rem] object-cover"
                src="/assets/covers/hiba-revut-voly.png"
                alt=""
              />
            </div>
            <div className="absolute bottom-12 left-10 h-[390px] w-[290px] -rotate-6 rounded-[1.6rem] border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/50 backdrop-blur-md">
              <img
                className="h-full w-full rounded-[1rem] object-cover"
                src="/assets/covers/kaidasheva-simya.png"
                alt=""
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function BookDetailPage({ bookId }: { bookId: string }) {
  const book = catalogBooks.find((item) => item.id === bookId);

  if (!book) {
    return (
      <main className="min-h-screen bg-[#05060d] text-white">
        <CosmicParallaxBg head="РџРѕРјРёР»РєР°" text="РєРЅРёРіР°, РЅРµ Р·РЅР°Р№РґРµРЅР°" loop className="fixed inset-0" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
          <a
            href="#/catalog"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur"
          >
            <ArrowLeft className="h-4 w-4" />
            РќР°Р·Р°Рґ РґРѕ РєР°С‚Р°Р»РѕРіСѓ
          </a>
          <h1 className="mt-10 font-serif text-5xl">РљРЅРёРіСѓ РЅРµ Р·РЅР°Р№РґРµРЅРѕ</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05060d] text-white">
      <CosmicParallaxBg
        head={book.title}
        text="РєРЅРёР¶РєР°, СѓРєСЂР°С—РЅСЃСЊРєР° Р»С–С‚РµСЂР°С‚СѓСЂР°, РґРµС‚Р°Р»СЊРЅРёР№ РїРµСЂРµРіР»СЏРґ"
        loop
        showPlanet={false}
        className="fixed inset-0"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-14 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pt-24">
        <a
          href="#/catalog"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          РќР°Р·Р°Рґ РґРѕ РєР°С‚Р°Р»РѕРіСѓ
        </a>

        <section className="mt-14 grid gap-10 rounded-3xl border border-white/10 bg-black/60 p-6 shadow-[0_34px_120px_rgba(0,0,0,0.58)] backdrop-blur-xl sm:mt-16 sm:p-8 lg:grid-cols-[430px_1fr] lg:gap-12 lg:p-12">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
            <img src={book.imageUrl} alt={book.alt} className="h-full w-full object-cover" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200/85">РґРµС‚Р°Р»СЊРЅР° СЃС‚РѕСЂС–РЅРєР°</p>
            <h1 className="mt-3 font-serif text-5xl leading-[0.92] sm:text-6xl">{book.title}</h1>
            <p className="mt-4 text-lg text-cyan-100">{book.author}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-amber-200/80">
              {book.genre} В· {book.year}
            </p>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-200/90">{book.summary}</p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-serif text-3xl">РџСЂРѕ С‚РІС–СЂ</h2>
              <p className="mt-3 leading-8 text-slate-200/85">{book.description}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function App() {
  const [path, setPath] = React.useState(getHashPath);

  React.useEffect(() => {
    const onHashChange = () => setPath(getHashPath());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (path === "/catalog") return <StellarCardGallerySingle />;
  if (path.startsWith("/book/")) return <BookDetailPage bookId={path.replace("/book/", "")} />;
  return <HomePage />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

