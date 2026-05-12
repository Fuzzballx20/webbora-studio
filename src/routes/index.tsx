import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Instagram, Mail, MessageCircle, Scissors, Shirt, Sparkles, Crown, Gem, Menu, X } from "lucide-react";
import heroStudio from "@/assets/hero-studio.jpg";
import piece1 from "@/assets/piece-1.png";
import piece2 from "@/assets/piece-2.png";
import piece3 from "@/assets/piece-3.png";
import processHands from "@/assets/process-hands.png";
import designer from "@/assets/designer.png";
import { Polaroid } from "@/components/site/Polaroid";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Designs by Webbora — Handmade clothing, made with heart" },
      {
        name: "description",
        content:
          "A small, slow studio creating handmade clothing, custom pieces, tailoring and event wear. Stitched with care by Webbora.",
      },
      { property: "og:title", content: "Designs by Webbora" },
      {
        property: "og:description",
        content: "Handmade clothing & custom services from a tiny earthy studio.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
});

const navLinks = [
  { href: "#pieces", label: "Pieces", note: "from the rack" },
  { href: "#services", label: "Services", note: "made for you" },
  { href: "#about", label: "About", note: "hello, i'm Webbora" },
  { href: "#contact", label: "Contact", note: "say hello ✿" },
];

function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:py-8">
      <a href="#top" className="flex items-baseline gap-2">
        <span className="font-serif text-2xl tracking-tight text-cocoa">Webbora</span>
        <span className="handwritten text-lg text-clay">— designs by</span>
      </a>

      <nav className="hidden items-center gap-8 text-sm text-cocoa/80 md:flex">
        <a href="#pieces" className="hover:text-clay transition-colors">Pieces</a>
        <a href="#services" className="hover:text-clay transition-colors">Services</a>
        <a href="#about" className="hover:text-clay transition-colors">About</a>
        <a
          href="#contact"
          className="rounded-full border border-cocoa/30 px-4 py-1.5 hover:bg-cocoa hover:text-cream transition-colors"
        >
          Say hello
        </a>
      </nav>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/30 bg-cream/70 text-cocoa shadow-[var(--shadow-soft)] backdrop-blur transition hover:border-clay hover:text-clay md:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-cocoa/40 backdrop-blur-sm"
        />
        <div
          className={`paper-texture absolute right-3 top-3 w-[min(22rem,calc(100vw-1.5rem))] rounded-3xl border border-border/70 p-6 shadow-[var(--shadow-card)] transition-all duration-300 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
          style={{ transform: open ? "rotate(-1deg)" : undefined }}
        >
          <span
            className="tape rounded-sm"
            style={{ top: -10, left: "calc(50% - 45px)", transform: "rotate(-3deg)" }}
            aria-hidden="true"
          />
          <div className="flex items-center justify-between">
            <p className="handwritten text-2xl text-clay">— wander in —</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cocoa/20 text-cocoa hover:border-clay hover:text-clay"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <ul className="mt-6 space-y-1">
            {navLinks.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline justify-between rounded-2xl px-3 py-3 transition hover:bg-secondary/70"
                  style={{ transform: `rotate(${i % 2 === 0 ? -0.4 : 0.4}deg)` }}
                >
                  <span className="font-serif text-2xl text-cocoa group-hover:text-clay">
                    {l.label}
                  </span>
                  <span className="handwritten text-base text-cocoa/55 group-hover:text-clay">
                    {l.note}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="handwritten mt-6 border-t border-border/60 pt-4 text-center text-lg text-cocoa/55">
            with love, from the studio ✿
          </p>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-10 md:grid-cols-2 md:py-20">
        <div className="animate-float-up space-y-6">
          <p className="handwritten text-2xl text-clay">welcome to my little studio —</p>
          <h1 className="font-serif text-5xl leading-[1.05] text-cocoa md:text-7xl">
            Clothes,
            <br />
            stitched with <span className="italic text-clay wavy">heart</span>.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-cocoa/75 md:text-lg">
            I'm Webbora — a one-woman studio quietly making clothing for the people who
            wear it. Every piece is cut, stitched and finished by these two hands, in a
            sunny corner of my home.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#pieces"
              className="group inline-flex items-center gap-2 rounded-full bg-cocoa px-6 py-3 text-sm text-cream shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-clay"
            >
              Shop pieces
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#services"
              className="rounded-full border border-cocoa/30 bg-cream/60 px-6 py-3 text-sm text-cocoa backdrop-blur transition hover:border-clay hover:text-clay"
            >
              Custom services
            </a>
            <a
              href="#about"
              className="handwritten px-3 py-3 text-xl text-cocoa/70 underline-offset-4 hover:text-clay hover:underline"
            >
              about me ✿
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <div className="animate-drift" style={{ ["--r" as string]: "2deg" }}>
            <Polaroid
              src={heroStudio}
              alt="Webbora's sunlit sewing studio with fabric and a vintage machine"
              caption="my favourite corner ☼"
              rotate={2}
              aspect="aspect-[5/4]"
            />
          </div>
          <div
            className="absolute -bottom-10 -left-6 hidden w-44 sm:block animate-drift"
            style={{ ["--r" as string]: "-6deg", animationDelay: "1.5s" }}
          >
            <Polaroid
              src={piece3}
              alt="Olive linen blouse with brass scissors"
              rotate={-6}
              aspect="aspect-[4/5]"
            />
          </div>
          <div
            className="absolute -right-4 -top-6 hidden w-36 md:block animate-drift"
            style={{ ["--r" as string]: "8deg", animationDelay: "0.8s" }}
          >
            <Polaroid
              src={processHands}
              alt="Hand stitching linen"
              rotate={8}
              aspect="aspect-square"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const pieces = [
  {
    src: piece1,
    alt: "A Winter Range Piece",
    title: "A Winter Range Piece",
    note: "soft cream colour, made to be lived in",
    rotate: -3,
    span: "md:col-span-5 md:row-span-2",
    aspect: "aspect-[4/5]",
  },
  {
    src: piece2,
    alt: "An Autumn Outfit Piece",
    title: "An Autumn Outfit Piece",
    note: "hand-stitched, the colour of warm earth",
    rotate: 2,
    span: "md:col-span-4 md:mt-16",
    aspect: "aspect-[4/5]",
  },
  {
    src: piece3,
    alt: "Emerald Eclipse Gown",
    title: "Emerald Eclipse Gown",
    note: "Grace in every shimmer, confidence in every step.",
    rotate: -1,
    span: "md:col-span-3 md:mt-4",
    aspect: "aspect-[4/5]",
  },
];

function Pieces() {
  return (
    <section id="pieces" className="relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="handwritten text-2xl text-clay">— recent pieces —</p>
            <h2 className="mt-2 font-serif text-4xl text-cocoa md:text-5xl">
              A few favourites from the rack
            </h2>
          </div>
          <p className="max-w-sm text-cocoa/70">
            Tiny batches. Often one of one. Each piece is photographed in the studio
            the morning it's finished.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-12">
          {pieces.map((p, i) => (
            <div key={i} className={p.span}>
              <Polaroid
                src={p.src}
                alt={p.alt}
                rotate={p.rotate}
                aspect={p.aspect}
                tapeOffset={i * 8}
                caption={
                  <span>
                    {p.title}
                    <span className="block text-base text-cocoa/55">{p.note}</span>
                  </span>
                }
              />
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="#contact"
            className="handwritten text-2xl text-clay underline decoration-wavy underline-offset-8 hover:text-cocoa"
          >
            see the full collection →
          </a>
        </div>
      </div>
    </section>
  );
}

const services = [
  { icon: Shirt, title: "Custom clothing", note: "made just for you, from sketch to seam" },
  { icon: Scissors, title: "Tailoring", note: "perfect-fit adjustments with care" },
  { icon: Sparkles, title: "Alterations", note: "give beloved pieces a second life" },
  { icon: Crown, title: "Event wear", note: "weddings, birthdays, soft celebrations" },
  { icon: Gem, title: "Handmade accessories", note: "scrunchies, bows, wraps & little gifts" },
];

function Services() {
  return (
    <section id="services" className="relative px-6 py-20 md:py-28">
      <div className="paper-texture mx-auto max-w-7xl rounded-3xl border border-border/60 px-6 py-14 shadow-[var(--shadow-soft)] md:px-12">
        <div className="mb-12 max-w-2xl">
          <p className="handwritten text-2xl text-clay">— what i make —</p>
          <h2 className="mt-2 font-serif text-4xl text-cocoa md:text-5xl">
            Slow services, made to measure
          </h2>
          <p className="mt-4 text-cocoa/70">
            Whether you're dreaming up a wedding outfit or breathing new life into a
            grandmother's coat, I'd love to make it with you.
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, note }, i) => (
            <li
              key={title}
              className="group relative rounded-2xl border border-border/70 bg-card/80 p-6 transition hover:-translate-y-1 hover:border-clay/50 hover:shadow-[var(--shadow-card)]"
              style={{ transform: `rotate(${(i % 2 === 0 ? -0.6 : 0.7)}deg)` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-clay">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 font-serif text-2xl text-cocoa">{title}</h3>
              <p className="mt-2 text-sm text-cocoa/70">{note}</p>
              <span className="handwritten mt-4 inline-block text-lg text-clay opacity-0 transition group-hover:opacity-100">
                ask about this →
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
        <div className="relative">
          <Polaroid
            src={designer}
            alt="Webbora smiling in her studio with sketches and fabric"
            caption="hello, i'm Webbora"
            rotate={-3}
            aspect="aspect-[4/5]"
          />
          <div
            className="absolute -bottom-10 -right-4 w-44 sm:w-56"
            style={{ transform: "rotate(6deg)" }}
          >
            <Polaroid
              src={processHands}
              alt="Hands stitching linen"
              caption="every stitch by hand"
              rotate={6}
              aspect="aspect-square"
            />
          </div>
        </div>

        <div className="space-y-6">
          <p className="handwritten text-2xl text-clay">— a little about me —</p>
          <h2 className="font-serif text-4xl text-cocoa md:text-5xl">
            I make clothes the only way I know how — slowly, and with love.
          </h2>
          <p className="leading-relaxed text-cocoa/75">
            My studio is a sunny room in my house. There are dried flowers
            on the windowsill, a kettle that's always on, and stacks of fabric I've
            been collecting for years. I sketch on scraps of paper, choose linens by
            how they feel in my hands, and finish every hem in front of the radio.
          </p>
          <p className="leading-relaxed text-cocoa/75">
            If you'd like something made — a dress for a celebration, a jacket for
            real life, or a beloved piece reimagined — please come and tell me about
            it. The best pieces always start with a story.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-cocoa/30 bg-cream/60 px-6 py-3 text-sm text-cocoa transition hover:border-clay hover:text-clay"
          >
            Read the full story
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const contacts = [
  {
    icon: Instagram,
    label: "Instagram",
    handle: "@designsbywebbora",
    href: "https://www.instagram.com/designsbywebbora",
    note: "peek into the studio",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    handle: "Send a message",
    href: "https://wa.me/0000000000",
    note: "for quick chats & quotes",
  },
  {
    icon: Mail,
    label: "Email",
    handle: "hello@designsbywebbora.com",
    href: "mailto:hello@designsbywebbora.com",
    note: "for the longer letters",
  },
];

function Contact() {
  return (
    <section id="contact" className="relative px-6 py-20 md:py-28">
      <div className="linen-texture mx-auto max-w-5xl rounded-3xl border border-border/60 px-8 py-16 text-center shadow-[var(--shadow-soft)] md:px-16">
        <p className="handwritten text-2xl text-clay">— say hello —</p>
        <h2 className="mt-3 font-serif text-4xl text-cocoa md:text-5xl">
          Let's make something together.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-cocoa/75">
          Whether it's a finished piece you've fallen for, or an idea still living in
          your head — I'd love to hear from you. Pour a cup of tea and write to me.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {contacts.map(({ icon: Icon, label, handle, href, note }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center rounded-2xl border border-border/60 bg-card/80 p-6 text-cocoa transition hover:-translate-y-1 hover:border-clay/60 hover:shadow-[var(--shadow-card)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-clay">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <span className="handwritten mt-4 text-xl text-clay">{label}</span>
              <span className="mt-1 text-sm font-medium">{handle}</span>
              <span className="mt-1 text-xs text-cocoa/55">{note}</span>
            </a>
          ))}
        </div>

        <p className="handwritten mx-auto mt-12 max-w-md text-xl text-cocoa/60">
          with love, from my studio to your wardrobe ✿
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-10 text-center">
      <p className="text-sm text-cocoa/55">
        © {new Date().getFullYear()} Designs by Webbora · made by hand, with patience.
      </p>
    </footer>
  );
}

function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <Pieces />
      <Services />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
