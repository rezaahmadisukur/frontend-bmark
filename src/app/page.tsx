"use client";

import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode
} from "react";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants
} from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Folder,
  Globe,
  Heart,
  HelpCircle,
  Layers,
  Library,
  Mail,
  Menu,
  MoonStar,
  Plus,
  Quote,
  Search,
  Send,
  Sparkles,
  Star,
  Sun,
  Tag,
  Users,
  X,
  Zap,
  type LucideIcon
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTheme } from "~/context/theme-provider";
import { cn } from "~/lib/utils";

/* --------------------------------------------------------------------- */
/*                                  DATA                                  */
/* --------------------------------------------------------------------- */

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Folder,
    title: "Organize Bookmarks",
    description:
      "Kelola ribuan bookmark dengan mudah. Gunakan koleksi, tag, dan filter untuk menemukan kembali apa yang Anda simpan."
  },
  {
    icon: Zap,
    title: "Fast & Lightweight",
    description:
      "Dirancang untuk kecepatan. Tanpa bloatware, tanpa iklan mengganggu — hanya alat yang Anda butuhkan."
  },
  {
    icon: Layers,
    title: "Smart Collections",
    description:
      "Kelompokkan bookmark berdasarkan proyek, topik, atau kategori. Album koleksi yang elegan dan mudah diatur."
  },
  {
    icon: Library,
    title: "Bookmark Manager",
    description:
      "Temukan kembali apa yang tersimpan. Cari, filter, dan jelajahi bookmark Anda dengan antarmuka yang intuitif."
  },
  {
    icon: Globe,
    title: "Real-time Metadata",
    description:
      "Auto-fetch title, deskripsi, favicon, dan gambar dari URL yang Anda simpan — semua otomatis."
  },
  {
    icon: MoonStar,
    title: "Dark Mode Ready",
    description:
      "Tampilkan bookmark Anda dengan tema yang Anda sukai. Mendukung mode gelap dan terang dengan mulus."
  }
];

const stats: {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
}[] = [
  { icon: Users, value: 10000, suffix: "+", label: "Pengguna Aktif" },
  { icon: Library, value: 1000000, suffix: "+", label: "Bookmark Tersimpan" },
  { icon: Globe, value: 50, suffix: "+", label: "Negara" }
];

/** Link navigasi in-page untuk scrollspy */
const navLinks: { href: string; label: string; id: string }[] = [
  { href: "/#features", label: "Fitur", id: "features" },
  { href: "/#testimonials", label: "Testimoni", id: "testimonials" },
  { href: "/#faq", label: "FAQ", id: "faq" }
];

const mockBookmarks = [
  {
    letter: "D",
    tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    title: "Dokumen API — Project Alpha",
    url: "docs.projectalpha.io/api/v2",
    tags: ["Project", "Work"]
  },
  {
    letter: "G",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    title: "GitHub — tailwindcss",
    url: "github.com/tailwindlabs/tailwindcss",
    tags: ["Dev", "CSS"]
  },
  {
    letter: "A",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    title: "Artikel — Motion Design 101",
    url: "motion.dev/articles/motion-101",
    tags: ["Design"]
  },
  {
    letter: "N",
    tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    title: "Notion — Roadmap Q4",
    url: "notion.so/bmark/roadmap-q4",
    tags: ["Planning"]
  }
];

const testimonials: {
  initial: string;
  tone: string;
  name: string;
  role: string;
  quote: string;
}[] = [
  {
    initial: "R",
    tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    name: "Rangga Aditya",
    role: "Product Designer",
    quote:
      "B-Mark benar-benar mengubah cara saya menyimpan referensi desain. Pencarian cepat dan tag-nya sangat membantu."
  },
  {
    initial: "S",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    name: "Siti Nurhaliza",
    role: "Frontend Engineer",
    quote:
      "Metadata otomatisnya keren banget. Nggak perlu lagi copy-paste judul & favicon secara manual."
  },
  {
    initial: "D",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    name: "Dimas Prakoso",
    role: "Founder, Startup",
    quote:
      "Tim saya pakai B-Mark untuk kumpulin riset kompetitor. Koleksinya rapi dan enak dilihat setiap hari."
  }
];

const faqs: { question: string; answer: string }[] = [
  {
    question: "Apakah B-Mark gratis digunakan?",
    answer:
      "Ya! B-Mark memiliki paket gratis dengan fitur inti lengkap. Anda bisa upgrade kapan saja jika membutuhkan kapasitas lebih besar."
  },
  {
    question: "Bagaimana cara memindahkan bookmark dari browser saya?",
    answer:
      "Anda dapat mengimpor file HTML bookmark dari Chrome, Firefox, atau Safari secara langsung melalui menu Import di dashboard."
  },
  {
    question: "Apakah data saya aman?",
    answer:
      "Tentu. Semua data dienkripsi saat transit maupun saat disimpan, dan kami tidak pernah membagikan data Anda ke pihak ketiga."
  },
  {
    question: "Apakah tersedia aplikasi mobile?",
    answer:
      "Saat ini B-Mark berbasis web dan sudah responsif penuh di perangkat mobile. Aplikasi native sedang berada di roadmap kami."
  }
];

/* --------------------------------------------------------------------- */
/*                               ANIMATIONS                               */
/* --------------------------------------------------------------------- */

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

/* --------------------------------------------------------------------- */
/*                                 HOOKS                                  */
/* --------------------------------------------------------------------- */

const emptySubscribe = () => () => {};

const getSystemDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const subscribeSystemDark = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
};

/** false saat SSR & first paint → mencegah hydration mismatch */
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/** Subscribe ke prefers-color-scheme via useSyncExternalStore (React-safe) */
function useSystemDark() {
  return useSyncExternalStore(subscribeSystemDark, getSystemDark, () => false);
}

/** Scrollspy: melacak section yang sedang aktif di viewport */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/* --------------------------------------------------------------------- */
/*                          SCROLL PROGRESS BAR                           */
/* --------------------------------------------------------------------- */

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-linear-to-r from-primary via-accent to-primary"
    />
  );
}

/* --------------------------------------------------------------------- */
/*                              THEME TOGGLE                              */
/* --------------------------------------------------------------------- */

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const systemDark = useSystemDark();
  const isDark = theme === "dark" || (theme === "system" && systemDark);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className="relative text-muted-foreground transition-colors hover:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex"
          >
            {isDark ? (
              <Sun className="size-4" />
            ) : (
              <MoonStar className="size-4" />
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}

/* --------------------------------------------------------------------- */
/*                                 NAVBAR                                 */
/* --------------------------------------------------------------------- */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionIds = useMemo(() => navLinks.map((l) => l.id), []);
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Kunci scroll body saat mobile menu terbuka
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <ScrollProgressBar />
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-border/40 bg-background/80 shadow-sm backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <motion.span
              whileHover={{ rotate: -8, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/20"
            >
              <Library className="size-4" />
            </motion.span>
            <span className="text-lg font-bold tracking-tight">B-Mark</span>
          </Link>

          {/* Desktop nav dengan indikator aktif animasi */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-md bg-muted/70"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:inline-flex"
            >
              <Link href="/login">Masuk</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="group/button hidden sm:inline-flex"
            >
              <Link href="/register" className="flex items-center gap-1.5">
                Mulai Gratis
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  {menuOpen ? (
                    <X className="size-5" />
                  ) : (
                    <Menu className="size-5" />
                  )}
                </motion.span>
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-b border-border/40 bg-background/95 backdrop-blur-xl md:hidden"
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-1 px-6 pb-6 pt-2"
              >
                {navLinks.map((link) => (
                  <motion.div key={link.label} variants={fadeUpItem}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={fadeUpItem} className="mt-2 flex gap-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login" onClick={() => setMenuOpen(false)}>
                      Masuk
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/register" onClick={() => setMenuOpen(false)}>
                      Mulai Gratis
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

/* --------------------------------------------------------------------- */
/*                                  HERO                                  */
/* --------------------------------------------------------------------- */

function Hero() {
  const reduce = useReducedMotion();

  // Spotlight yang mengikuti kursor
  const spotX = useMotionValue(-600);
  const spotY = useMotionValue(-600);
  const springX = useSpring(spotX, { stiffness: 60, damping: 20 });
  const springY = useSpring(spotY, { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(480px circle at ${springX}px ${springY}px, hsl(var(--primary) / 0.09), transparent 70%)`;

  const onHeroMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  // Tilt 3D pada mockup
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [6, -6]), {
    stiffness: 140,
    damping: 18
  });
  const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 140,
    damping: 18
  });

  const onMockMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onMockMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section onMouseMove={onHeroMouseMove} className="relative overflow-hidden">
      {/* Grid pattern dengan radial mask */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border) / 0.35) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 60%, transparent 100%)"
        }}
      />

      {/* Aurora blobs */}
      <motion.div
        aria-hidden
        className="absolute -top-32 left-[8%] h-96 w-96 rounded-full bg-primary/20 blur-[110px]"
        animate={reduce ? undefined : { x: [0, 70, -30, 0], y: [0, 30, 60, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 20, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        aria-hidden
        className="absolute right-[4%] top-24 h-80 w-80 rounded-full bg-accent/20 blur-[100px]"
        animate={
          reduce ? undefined : { x: [0, -60, 20, 0], y: [0, 50, -20, 0] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 24, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[-20%] left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-[90px]"
        animate={reduce ? undefined : { x: [0, 40, -50, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 26, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Spotlight mengikuti kursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: spotlight }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 md:pb-20 md:pt-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl text-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUpItem}
            className="mx-auto flex w-fit items-center gap-2.5 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            v2.0 — Sekarang dalam Public Beta
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUpItem}
            className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Kelola{" "}
            <span
              className="animate-gradient-x inline-block bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              style={{ backgroundSize: "200% auto" }}
            >
              Bookmark Anda
            </span>{" "}
            dengan Lebih{" "}
            <span className="relative inline-block text-accent">
              Mudah
              <motion.svg
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
                aria-hidden
                className="absolute -bottom-2 left-0 h-3 w-full overflow-visible"
              >
                <motion.path
                  d="M3 9 C 30 3, 55 10, 80 6 S 110 4, 117 7"
                  fill="none"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="stroke-accent/70"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                />
              </motion.svg>
            </span>
          </motion.h1>

          {/* Deskripsi */}
          <motion.p
            variants={fadeUpItem}
            className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Tempat untuk menyimpan, mengorganisir, dan menemukan kembali semua
            bookmark favorit Anda. Cepat, elegan, dan selalu siap membantu.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUpItem}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <Button
              size="lg"
              asChild
              className="group/button h-11 w-full px-7 text-base shadow-lg shadow-primary/25 sm:h-12 sm:w-auto sm:px-8"
            >
              <Link href="/register">
                Mulai Gratis
                <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-11 w-full px-7 text-base sm:h-12 sm:w-auto sm:px-8"
            >
              <Link href="/login">Masuk</Link>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUpItem}
            className="mt-4 text-xs text-muted-foreground"
          >
            Tidak perlu kartu kredit. Siap dalam 30 detik.
          </motion.p>

          {/* Trust row */}
          <motion.div
            variants={fadeUpItem}
            className="mt-6 flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-2">
              {[
                "bg-sky-500",
                "bg-emerald-500",
                "bg-amber-500",
                "bg-rose-500"
              ].map((c, i) => (
                <span
                  key={c}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-white",
                    c
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Dipercaya oleh{" "}
              <span className="font-semibold text-foreground">10.000+</span>{" "}
              pengguna
            </p>
          </motion.div>
        </motion.div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-14 max-w-3xl md:mt-20"
          style={{ perspective: 1200 }}
        >
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[2rem] bg-linear-to-tr from-primary/20 via-accent/10 to-primary/20 blur-2xl"
          />

          <motion.div
            onMouseMove={onMockMouseMove}
            onMouseLeave={onMockMouseLeave}
            style={
              reduce
                ? undefined
                : { rotateX, rotateY, transformStyle: "preserve-3d" }
            }
            className="relative rounded-2xl border border-border/60 bg-card/90 shadow-2xl shadow-primary/10 backdrop-blur"
          >
            {/* Chrome bar */}
            <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3.5">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-2 flex h-7 min-w-0 flex-1 items-center gap-2 rounded-md bg-muted/70 px-3 text-xs text-muted-foreground">
                <Search className="size-3 shrink-0" />
                <span className="truncate">
                  b-mark.app/dashboard/collections
                </span>
              </div>
              <Sparkles className="size-4 shrink-0 text-accent" />
            </div>

            {/* Bookmark rows */}
            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
              {mockBookmarks.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.75 + i * 0.12,
                    ease: "easeOut"
                  }}
                  whileHover={{ y: -3 }}
                  className="group flex cursor-pointer items-start gap-3 rounded-xl border border-border/50 bg-background/60 p-4 transition-colors hover:border-border hover:bg-background"
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                      b.tone
                    )}
                  >
                    {b.letter}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{b.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {b.url}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {b.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                        >
                          {t}
                        </span>
                      ))}
                      <Star className="ml-auto size-3.5 text-muted-foreground/40 transition-colors group-hover:text-amber-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Floating chip: metadata */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.4, ease: "easeOut" }}
            className="absolute -right-4 -top-6 hidden sm:block md:-right-10"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card px-3.5 py-2.5 shadow-xl shadow-primary/10"
            >
              <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
              <div className="text-xs">
                <p className="font-semibold">Metadata terambil otomatis</p>
                <p className="text-muted-foreground">Title, favicon, preview</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating chip: tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.4, ease: "easeOut" }}
            className="absolute -bottom-6 -left-4 hidden sm:block md:-left-10"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card px-3.5 py-2.5 shadow-xl shadow-primary/10"
            >
              <Tag className="size-4 shrink-0 text-accent" />
              <p className="text-xs font-semibold">#tutorial · tersimpan</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-12 flex justify-center md:mt-16"
        >
          <Link
            href="#features"
            aria-label="Gulir ke bagian fitur"
            className="flex size-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          >
            <motion.span
              animate={reduce ? undefined : { y: [0, 4, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ChevronDown className="size-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/*                          STATS + COUNT-UP                              */
/* --------------------------------------------------------------------- */

function AnimatedStat({
  icon: Icon,
  value,
  suffix = "",
  label
}: {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString("id-ID"))
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="group flex flex-col items-center text-center">
      <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="size-5" />
      </div>
      <div className="text-3xl font-bold tabular-nums sm:text-4xl">
        {display}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function Stats() {
  return (
    <section className="border-y border-border/40 bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 divide-y divide-border/40 sm:grid-cols-3 sm:gap-6 sm:divide-x sm:divide-y-0">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="pt-6 first:pt-0 sm:px-6 sm:pt-0 sm:first:pl-0 sm:last:pr-0"
            >
              <AnimatedStat
                icon={s.icon}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/*                            SHARED SECTION UI                           */
/* --------------------------------------------------------------------- */

function SectionBadge({
  icon: Icon,
  children
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
      <Icon className="size-3 text-accent" />
      {children}
    </span>
  );
}

function SectionHeading({
  badgeIcon,
  badgeLabel,
  title,
  highlight,
  description
}: {
  badgeIcon: LucideIcon;
  badgeLabel: string;
  title: ReactNode;
  highlight?: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl text-center"
    >
      <SectionBadge icon={badgeIcon}>{badgeLabel}</SectionBadge>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {title} {highlight && <span className="text-accent">{highlight}</span>}
      </h2>
      <p className="mt-3 text-muted-foreground">{description}</p>
    </motion.div>
  );
}

/* --------------------------------------------------------------------- */
/*                         FEATURES (SPOTLIGHT CARD)                      */
/* --------------------------------------------------------------------- */

const FeatureCard = memo(function FeatureCard({
  feature,
  index
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bg = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, hsl(var(--primary) / 0.12), transparent 75%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -4 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/30 p-6 transition-colors hover:border-primary/30 hover:bg-card"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundImage: bg }}
      />
      <div className="relative flex flex-1 flex-col">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <feature.icon className="size-5" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
          Pelajari lebih lanjut
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </motion.div>
  );
});

function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionHeading
          badgeIcon={Sparkles}
          badgeLabel="Fitur"
          title="Apa yang membuat"
          highlight="B-Mark berbeda?"
          description="Dirancang untuk membantu Anda mengelola bookmark dengan lebih efisien. Semua yang Anda butuhkan dalam satu tempat."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/*                              TESTIMONIALS                               */
/* --------------------------------------------------------------------- */

const TestimonialCard = memo(function TestimonialCard({
  t,
  index
}: {
  t: (typeof testimonials)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="flex h-full flex-col justify-between rounded-2xl border border-border/50 bg-card/40 p-6 shadow-sm transition-colors hover:border-primary/30 hover:bg-card"
    >
      <div>
        <Quote className="size-6 text-primary/40" />
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          “{t.quote}”
        </p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            t.tone
          )}
        >
          {t.initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{t.name}</p>
          <p className="truncate text-xs text-muted-foreground">{t.role}</p>
        </div>
        <div className="ml-auto flex shrink-0 gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 border-t border-border/40 bg-card/20"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionHeading
          badgeIcon={Star}
          badgeLabel="Testimoni"
          title="Dicintai oleh"
          highlight="ribuan pengguna"
          description="Berikut cerita nyata dari mereka yang sudah merapikan bookmark-nya bersama B-Mark."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/*                              FAQ ACCORDION                              */
/* --------------------------------------------------------------------- */

function FaqItem({
  faq,
  isOpen,
  onToggle
}: {
  faq: (typeof faqs)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card/40 transition-colors",
        isOpen ? "border-primary/30" : "border-border/50 hover:border-border"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <span className="text-sm font-semibold sm:text-base">
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors",
            isOpen
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Plus className="size-3.5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 border-t border-border/40">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <SectionHeading
          badgeIcon={HelpCircle}
          badgeLabel="FAQ"
          title="Pertanyaan yang"
          highlight="sering diajukan"
          description="Tidak menemukan jawaban yang Anda cari? Hubungi kami kapan saja."
        />

        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/*                                   CTA                                  */
/* --------------------------------------------------------------------- */

function Cta() {
  return (
    <section className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary via-primary to-accent px-6 py-14 text-center text-primary-foreground shadow-2xl shadow-primary/20 sm:px-12 md:py-20"
        >
          {/* Decorative rings */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full border border-white/15"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full border border-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-10 -right-6 size-40 rounded-full border border-white/15"
          />

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Siap memulai perjalanan Anda?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/85">
            Bergabung dengan ribuan pengguna yang sudah mempercayakan bookmark
            mereka kepada B-Mark. Mulai gratis hari ini.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              asChild
              className="group/button h-11 bg-white text-primary hover:bg-white/90 sm:h-12"
            >
              <Link href="/register">
                Daftar Sekarang
                <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-11 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white sm:h-12"
            >
              <Link href="/login">Masuk</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/*                                FOOTER                                  */
/* --------------------------------------------------------------------- */

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

const socialLinks = [
  { Icon: GithubIcon, href: "https://github.com", label: "GitHub" },
  { Icon: XIcon, href: "https://twitter.com", label: "Twitter / X" },
  { Icon: Mail, href: "mailto:hello@b-mark.app", label: "Email" }
];

const footerColumns = [
  {
    title: "Produk",
    links: [
      { href: "/#features", label: "Fitur" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/register", label: "Daftar" },
      { href: "/login", label: "Masuk" }
    ]
  },
  {
    title: "Sumber Daya",
    links: [
      { href: "#", label: "Dokumentasi" },
      { href: "#", label: "Blog" },
      { href: "#", label: "Panduan" },
      { href: "#", label: "Changelog" }
    ]
  },
  {
    title: "Perusahaan",
    links: [
      { href: "#", label: "Tentang" },
      { href: "#", label: "Kontak" },
      { href: "#", label: "Kebijakan Privasi" },
      { href: "#", label: "Syarat & Ketentuan" }
    ]
  }
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    // TODO: sambungkan ke API newsletter sesungguhnya
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 2500);
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex max-w-sm gap-2">
      <div className="relative flex-1">
        <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email kamu"
          className="w-full rounded-lg border border-border/60 bg-background/60 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={status === "loading"}
        className="shrink-0"
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            <motion.span
              key="ok"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="flex"
            >
              <CheckCircle2 className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="send"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="flex"
            >
              <Send className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </form>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20">
      {/* Bagian atas: brand + newsletter + kolom link */}
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:py-16 lg:grid-cols-[1.4fr_2fr]">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent text-primary-foreground shadow-md">
              <Library className="size-4" />
            </span>
            <span className="text-lg font-bold tracking-tight">B-Mark</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Tempat untuk menyimpan, mengorganisir, dan menemukan kembali semua
            bookmark favorit Anda. Cepat, elegan, dan selalu siap membantu.
          </p>

          <NewsletterForm />

          <div className="mt-5 flex items-center gap-1">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-all hover:scale-110 hover:bg-muted/60 hover:text-foreground"
              >
                <social.Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-8 sm:grid-cols-3"
        >
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} B-Mark. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Dibuat dengan
            <Heart className="size-3.5 fill-rose-500 text-rose-500" />
            menggunakan Next.js, NestJS &amp; Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}

/* --------------------------------------------------------------------- */
/*                             BACK TO TOP BUTTON                          */
/* --------------------------------------------------------------------- */

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Kembali ke atas"
          className="fixed bottom-6 right-6 z-50 flex size-11 items-center justify-center rounded-full border border-border/60 bg-card/90 text-foreground shadow-lg backdrop-blur-xl transition-colors hover:border-primary/50 hover:text-primary"
        >
          <ArrowUp className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------------------------------------------- */
/*                               HALAMAN HOME                              */
/* --------------------------------------------------------------------- */

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
