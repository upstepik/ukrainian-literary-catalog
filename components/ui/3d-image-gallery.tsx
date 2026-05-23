"use client";

import React, { Suspense, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Plane, Sphere } from "@react-three/drei";
import { ArrowLeft, BookOpen, Heart, X } from "lucide-react";
import { catalogBooks, type CatalogBook } from "@/lib/books";

/**
 * Single-file Stellar Card Gallery
 * - Context, Starfield, Galaxy, FloatingCard, Modal, and Page in one.
 */

/* =========================
   Card Context (inlined)
   ========================= */

type Card = {
  id: string;
  imageUrl: string;
  alt: string;
  title: string;
  author: string;
  genre: string;
};

type CardContextType = {
  selectedCard: Card | null;
  setSelectedCard: (card: Card | null) => void;
  cards: Card[];
  highlightedCardId: string | null;
  isRouletteRunning: boolean;
  startRoulette: () => Promise<void>;
};

const CardContext = createContext<CardContextType | undefined>(undefined);

function useCard() {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("useCard must be used within CardProvider");
  return ctx;
}

function CardProvider({ children }: { children: React.ReactNode }) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);
  const [isRouletteRunning, setIsRouletteRunning] = useState(false);

  const cards: Card[] = catalogBooks.map((book) => ({
    id: book.id,
    imageUrl: book.imageUrl,
    alt: book.alt,
    title: book.title,
    author: book.author,
    genre: book.genre,
  }));

  const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

  const startRoulette = async () => {
    if (isRouletteRunning || cards.length === 0) return;

    setSelectedCard(null);
    setIsRouletteRunning(true);

    let delay = 28;
    const steps = 34 + Math.floor(Math.random() * 12);
    let currentIndex = Math.floor(Math.random() * cards.length);

    for (let i = 0; i < steps; i += 1) {
      currentIndex = (currentIndex + 1 + Math.floor(Math.random() * 2)) % cards.length;
      setHighlightedCardId(cards[currentIndex].id);
      await wait(delay);
      delay = Math.min(delay * 1.11, 185);
    }

    const winner = cards[currentIndex];
    setHighlightedCardId(winner.id);
    await wait(360);
    setIsRouletteRunning(false);
    setSelectedCard(winner);
  };

  return (
    <CardContext.Provider
      value={{ selectedCard, setSelectedCard, cards, highlightedCardId, isRouletteRunning, startRoulette }}
    >
      {children}
    </CardContext.Provider>
  );
}

/* =========================
   Starfield Background (inlined)
   ========================= */

function StarfieldBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Match the site's deep-blue theme (still allows the starfield to pop)
    renderer.setClearColor(0x05060d, 1);
    mountRef.current.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 10000;
    const positions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, sizeAttenuation: true });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 10;

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full z-0 bg-[#05060d]" />;
}

/* =========================
   Floating Card (inlined)
   ========================= */

function FloatingCard({
  card,
  position,
}: {
  card: Card;
  position: { x: number; y: number; z: number; rotationX: number; rotationY: number; rotationZ: number };
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { setSelectedCard, highlightedCardId, isRouletteRunning } = useCard();
  const isHighlighted = highlightedCardId === card.id;

  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <Plane ref={meshRef} args={[4.5, 6]} raycast={() => null}>
        <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
      </Plane>

      <Html
        transform
        distanceFactor={10}
        position={[0, 0, 0.01]}
        style={{
          transition: "all 0.3s ease",
          transform: hovered ? "scale(1.15)" : "scale(1)",
          pointerEvents: "auto",
        }}
      >
        <div
          className="w-40 h-52 rounded-lg overflow-hidden shadow-2xl bg-[#1F2121] p-3 select-none"
          style={{
            boxShadow: isHighlighted
              ? "0 32px 70px rgba(255, 211, 118, 0.45), 0 0 45px rgba(255, 211, 118, 0.45)"
              : hovered
                ? "0 25px 50px rgba(49, 184, 198, 0.52), 0 0 30px rgba(49, 184, 198, 0.34)"
                : "0 15px 30px rgba(0, 0, 0, 0.6)",
            border: isHighlighted
              ? "2px solid rgba(255, 211, 118, 0.75)"
              : hovered
                ? "2px solid rgba(56, 189, 248, 0.72)"
                : "1px solid rgba(56, 189, 248, 0.38)",
          }}
          onMouseEnter={handlePointerOver}
          onMouseLeave={handlePointerOut}
          onClick={() => {
            if (!isRouletteRunning) setSelectedCard(card);
          }}
        >
          <img
            src={card.imageUrl || "/placeholder.svg"}
            alt={card.alt}
            className="w-full h-40 object-cover rounded-md"
            loading="eager"
            draggable={false}
          />
          <div className="mt-1 text-center">
            <p className="text-white text-xs font-medium truncate">{card.title}</p>
            <p className="text-[10px] text-slate-300 truncate">{card.author}</p>
          </div>
        </div>
      </Html>
    </group>
  );
}

/* =========================
   Card Modal (inlined)
   ========================= */

function CardModal() {
  const { selectedCard, setSelectedCard } = useCard();
  const [isFavorited, setIsFavorited] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!selectedCard) return null;

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rawRotateX = (y - centerY) / 35;
    const rawRotateY = (centerX - x) / 35;
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    const rotateX = clamp(rawRotateX, -6, 6);
    const rotateY = clamp(rawRotateY, -6, 6);
    cardRef.current.style.transition = "transform 70ms linear";
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    cardRef.current.style.setProperty("--img-rx", `${rotateX * 0.7}deg`);
    cardRef.current.style.setProperty("--img-ry", `${rotateY * 0.7}deg`);
  };

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = "transform 160ms ease-out";
  };
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.5s ease-out";
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      cardRef.current.style.setProperty("--img-rx", "0deg");
      cardRef.current.style.setProperty("--img-ry", "0deg");
    }
  };

  const toggleFavorite = () => setIsFavorited((v) => !v);
  const handleClose = () => setSelectedCard(null);
  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };
  const openBookDetail = (
    event: React.MouseEvent<HTMLAnchorElement> | React.PointerEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    window.location.assign(`/book/${selectedCard.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="relative max-w-md w-full mx-4">
        <button onClick={handleClose} className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10">
          <X className="w-8 h-8" />
        </button>

        <div style={{ perspective: "1000px" }} className="w-full">
          <div
            ref={cardRef}
            className="relative cursor-pointer rounded-[16px] bg-[#1F2121] p-4 transition-all duration-500 ease-out w-full"
            style={{
              transformStyle: "preserve-3d",
              boxShadow:
                "rgba(0, 0, 0, 0.01) 0px 520px 146px 0px, rgba(0, 0, 0, 0.04) 0px 333px 133px 0px, rgba(0, 0, 0, 0.26) 0px 83px 83px 0px, rgba(0, 0, 0, 0.29) 0px 21px 46px 0px",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-full mb-4" style={{ aspectRatio: "3 / 4" }}>
              <img
                loading="eager"
                className="absolute inset-0 h-full w-full rounded-[16px] bg-[#000000] object-cover"
                alt={selectedCard.alt}
                src={selectedCard.imageUrl || "/placeholder.svg"}
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                  opacity: 1,
                  transform: "translateZ(18px) rotateX(var(--img-rx, 0deg)) rotateY(var(--img-ry, 0deg)) scale(1.02)",
                  transformStyle: "preserve-3d",
                  transition: "transform 260ms ease-out",
                  willChange: "transform",
                }}
              />
            </div>

            <h3 className="text-white text-lg font-semibold mb-4 text-center">{selectedCard.title}</h3>
            <p className="text-slate-300 text-xs mb-1 text-center">{selectedCard.author}</p>
            <p className="text-slate-400 text-[11px] mb-4 text-center">{selectedCard.genre}</p>

            <div className="flex gap-2">
              <a
                href={`/book/${selectedCard.id}`}
                onPointerDownCapture={openBookDetail}
                onClick={openBookDetail}
                className="inline-flex h-9 flex-1 items-center justify-center rounded-lg text-base font-medium text-black outline-none transition duration-300 ease-out hover:opacity-80 active:scale-[0.97]"
                style={{ backgroundColor: "#31b8c6", pointerEvents: "auto", position: "relative", zIndex: 5 }}
              >
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" strokeWidth={1.8} />
                  <span>Читати далі</span>
                </div>
              </a>
              <button
                type="button"
                onClick={toggleFavorite}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-black outline-none transition duration-300 ease-out hover:opacity-80 active:scale-[0.97]"
                style={{ backgroundColor: "#31b8c6" }}
              >
                <Heart className="h-4 w-4" strokeWidth={1.8} fill={isFavorited ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Card Galaxy (inlined)
   ========================= */

function CardGalaxy() {
  const { cards } = useCard();

  const cardPositions = useMemo(() => {
    const positions: {
      x: number;
      y: number;
      z: number;
      rotationX: number;
      rotationY: number;
      rotationZ: number;
    }[] = [];
    const numCards = cards.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < numCards; i++) {
      const y = 1 - (i / (numCards - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = (2 * Math.PI * i) / goldenRatio;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const layerRadius = 12 + (i % 3) * 4;

      positions.push({
        x: x * layerRadius,
        y: y * layerRadius,
        z: z * layerRadius,
        rotationX: Math.atan2(z, Math.sqrt(x * x + y * y)),
        rotationY: Math.atan2(x, z),
        rotationZ: (Math.random() - 0.5) * 0.2,
      });
    }
    return positions;
  }, [cards.length]);

  return (
    <>
      <Sphere args={[2, 32, 32]} position={[0, 0, 0]} raycast={() => null}>
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.15} wireframe />
      </Sphere>
      <Sphere args={[12, 32, 32]} position={[0, 0, 0]} raycast={() => null}>
        <meshStandardMaterial color="#31b8c6" transparent opacity={0.05} wireframe />
      </Sphere>
      <Sphere args={[16, 32, 32]} position={[0, 0, 0]} raycast={() => null}>
        <meshStandardMaterial color="#31b8c6" transparent opacity={0.03} wireframe />
      </Sphere>
      <Sphere args={[20, 32, 32]} position={[0, 0, 0]} raycast={() => null}>
        <meshStandardMaterial color="#31b8c6" transparent opacity={0.02} wireframe />
      </Sphere>

      {cards.map((card, i) => (
        <FloatingCard key={card.id} card={card} position={cardPositions[i]} />
      ))}
    </>
  );
}

function RouletteCameraRig({ active }: { active: boolean }) {
  const { camera } = useThree();
  const tRef = useRef(0);
  const phaseRef = useRef({
    x: Math.random() * Math.PI * 2,
    y: Math.random() * Math.PI * 2,
    z: Math.random() * Math.PI * 2,
  });
  const targetRef = useRef(new THREE.Vector3(0, 0, 15));

  useFrame((_, delta) => {
    if (!active) return;

    tRef.current += delta * 2.9;
    const t = tRef.current;
    const phase = phaseRef.current;
    const radius = 16 + Math.sin(t * 0.72 + phase.x) * 2.4;

    targetRef.current.set(
      Math.cos(t * 1.45 + phase.x) * radius * 0.92 + Math.sin(t * 2.05 + phase.y) * 1.7,
      Math.sin(t * 1.12 + phase.y) * 7.2 + Math.cos(t * 1.7 + phase.z) * 1.8,
      Math.sin(t * 1.58 + phase.z) * radius * 0.92 + Math.cos(t * 2.18 + phase.x) * 1.4,
    );

    camera.position.lerp(targetRef.current, 0.16);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* =========================
   Page/Component Export
   ========================= */

export default function StellarCardGallerySingle() {
  return (
    <CardProvider>
      <GalleryScene />
    </CardProvider>
  );
}

function LuckyButton() {
  const { startRoulette, isRouletteRunning } = useCard();

  return (
    <button
      type="button"
      onClick={() => void startRoulette()}
      disabled={isRouletteRunning}
      className="absolute left-4 bottom-4 z-30 inline-flex items-center gap-2 rounded-full border border-amber-200/40 bg-amber-200/20 px-4 py-2.5 text-sm font-semibold text-amber-100 shadow-2xl shadow-black/40 backdrop-blur-md transition hover:border-amber-100 hover:bg-amber-200 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span className="inline-block h-2 w-2 rounded-full bg-amber-200" />
      {isRouletteRunning ? "Крутиться..." : "Рандомна книга"}
    </button>
  );
}

function GalleryScene() {
  const { isRouletteRunning } = useCard();

  return (
    <div className="w-full h-screen relative overflow-hidden bg-[#05060d]">
      <StarfieldBackground />
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 82%, rgba(49, 77, 113, 0.48), transparent 18rem), radial-gradient(circle at 50% 100%, rgba(245, 182, 80, 0.18), transparent 24rem), radial-gradient(circle at 18% 16%, rgba(125, 211, 252, 0.08), transparent 18rem), linear-gradient(180deg, rgba(2,4,10,0) 0%, rgba(7,9,24,0.35) 44%, rgba(5,6,13,0.88) 100%)",
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        className="absolute inset-0 z-10"
        style={{ position: "absolute", inset: 0, zIndex: 10 }}
        onCreated={({ gl }) => {
          gl.domElement.style.pointerEvents = "auto";
        }}
      >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.6} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
            <CardGalaxy />
            <RouletteCameraRig active={isRouletteRunning} />
            <OrbitControls
              enabled={!isRouletteRunning}
              enablePan
              enableZoom={!isRouletteRunning}
              enableRotate
            minDistance={5}
            maxDistance={40}
            autoRotate={isRouletteRunning}
            autoRotateSpeed={isRouletteRunning ? 9.5 : 0}
            rotateSpeed={isRouletteRunning ? 0.2 : 0.5}
            zoomSpeed={1.2}
            panSpeed={0.8}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>

      <CardModal />

      <div className="absolute top-4 left-4 z-20 text-white pointer-events-none">
        <h1 className="text-2xl font-bold mb-2">Каталог обкладинок</h1>
        <p className="text-sm opacity-70">Перетягуйте для огляду • Прокручуйте для масштабу • Натискайте на обкладинки, щоб відкрити</p>
      </div>

      <LuckyButton />

      <a
        href="/"
        className="absolute right-4 top-4 z-30 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-2xl shadow-black/40 backdrop-blur-md transition hover:border-amber-200/60 hover:bg-amber-200 hover:text-slate-950"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Повернутися на головну
      </a>
    </div>
  );
}

