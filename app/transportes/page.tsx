import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  Bus,
  CalendarClock,
  GraduationCap,
  Headset,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactForm from '@/components/ContactForm';
import { CONTACT_INFO, SITE_NAME } from '@/lib/constants';

type TransportImage = {
  src: string;
  alt: string;
};

const HERO_IMAGES = {
  featured: { src: '/images/transportes/5.png', alt: 'Bus de larga distancia en servicio' },
  top: { src: '/images/transportes/4.png', alt: 'Van para traslados ejecutivos y grupales' },
  bottom: { src: '/images/transportes/10.png', alt: 'Unidad mediana para grupos y transfers' },
};

const FEATURE_ITEMS = [
  {
    title: 'Puntualidad que respeta tu agenda',
    description: 'Coordinamos horarios y logistica para que cada salida ocurra a tiempo.',
    Icon: CalendarClock,
  },
  {
    title: 'Unidades habilitadas y confortables',
    description: 'Flota preparada para viajes educativos, corporativos, eventos y turismo.',
    Icon: ShieldCheck,
  },
  {
    title: 'Cobertura nacional e internacional',
    description: 'Planificamos recorridos de corta y larga distancia segun la necesidad del grupo.',
    Icon: MapPin,
  },
  {
    title: 'Acompanamiento antes, durante y despues',
    description: 'Te asistimos en la cotizacion, coordinacion y seguimiento del viaje.',
    Icon: Headset,
  },
];

const PROCESS_STEPS = [
  {
    title: 'Planificacion',
    description: 'Escuchamos tu necesidad, definimos el tipo de servicio y armamos una propuesta a medida.',
  },
  {
    title: 'Coordinacion',
    description: 'Confirmamos fechas, rutas y horarios para que tengas toda la operacion clara.',
  },
  {
    title: 'Seguimiento',
    description: 'Acompanamos cada etapa del viaje para que todo transcurra como lo planeado.',
  },
];

const GALLERY_IMAGES: TransportImage[] = [
  { src: '/images/transportes/3.png', alt: 'Bus mediano preparado para salidas' },
  { src: '/images/transportes/6.png', alt: 'Interior con butacas reclinables' },
  { src: '/images/transportes/7.png', alt: 'Interior premium con pasillo iluminado' },
  { src: '/images/transportes/8.png', alt: 'Butacas comodas para grupos' },
  { src: '/images/transportes/9.png', alt: 'Detalle exterior de unidad de larga distancia' },
];

const AUDIENCE_ITEMS = [
  {
    title: 'Instituciones',
    description: 'Colegios, universidades y organizaciones que viajan con grupos.',
    Icon: GraduationCap,
  },
  {
    title: 'Empresas',
    description: 'Equipos de trabajo, convenciones y viajes corporativos con logistica profesional.',
    Icon: BriefcaseBusiness,
  },
  {
    title: 'Eventos',
    description: 'Traslados para competencias, recitales, torneos y encuentros de todo tipo.',
    Icon: Star,
  },
  {
    title: 'Turismo grupal',
    description: 'Agencias y coordinadores que buscan comodidad y respaldo para sus pasajeros.',
    Icon: Users,
  },
];

const CONTACT_HIGHLIGHTS = [
  {
    title: 'Seguridad',
    description: 'Unidades modernas y habilitadas.',
  },
  {
    title: 'Experiencia',
    description: 'Anos coordinando grupos con detalle.',
  },
  {
    title: 'Tranquilidad',
    description: 'Comunicacion clara en todo momento.',
  },
];

export default function TransportesPage() {
  return (
    <>
      <Navbar reserveSpace theme="default" />
      <WhatsAppButton />

      <main className="min-h-screen bg-[#f7f8f3] text-slate-900">
        <section className="relative overflow-hidden border-b border-emerald-100/80 bg-[linear-gradient(180deg,#ffffff_0%,#f7f8f3_100%)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[-6rem] top-12 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute right-[-4rem] top-20 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
          </div>

          <div className="container relative z-10 mx-auto px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
              <div className="max-w-xl">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Servicio
                </span>
                <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-950 md:text-5xl">
                  Traslados grupales
                  <br />
                  con logistica simple
                  <br />y <span className="text-primary">experiencia cuidada</span>
                </h1>
                <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600 md:text-base">
                  <p>
                    Coordinamos traslados para instituciones, empresas, delegaciones y grupos que necesitan viajar con
                    organizacion, comodidad y respaldo profesional.
                  </p>
                  <p>
                    Cada recorrido se adapta al tipo de viaje, la cantidad de pasajeros y la experiencia que queres
                    ofrecer.
                  </p>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent('Hola! Quiero cotizar un traslado grupal.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(16,185,129,0.25)] transition hover:bg-primary/90"
                  >
                    Quiero cotizar un traslado
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="relative mx-auto max-w-[720px]">
                  <div className="absolute -left-2 top-[22%] hidden h-28 w-28 rounded-full border border-dashed border-primary/35 lg:block" />
                  <div className="absolute -right-2 top-5 hidden h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg lg:flex">
                    <Bus className="h-9 w-9 text-primary" />
                  </div>

                  <div className="relative ml-auto w-full max-w-[640px] overflow-hidden rounded-[2rem] border border-black/5 bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,0.14)] md:p-4">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem] bg-slate-50">
                      <Image
                        src={HERO_IMAGES.featured.src}
                        alt={HERO_IMAGES.featured.alt}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                      />
                    </div>
                  </div>

                  <div className="absolute -left-1 top-4 w-[38%] max-w-[230px] overflow-hidden rounded-[1.5rem] border-[6px] border-white bg-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
                    <div className="relative aspect-[4/5] bg-slate-50">
                      <Image
                        src={HERO_IMAGES.top.src}
                        alt={HERO_IMAGES.top.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 35vw, 16vw"
                      />
                    </div>
                  </div>

                  <div className="absolute -bottom-3 right-0 w-[34%] max-w-[220px] overflow-hidden rounded-[1.4rem] border-[6px] border-white bg-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
                    <div className="relative aspect-[4/3] bg-slate-50">
                      <Image
                        src={HERO_IMAGES.bottom.src}
                        alt={HERO_IMAGES.bottom.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 32vw, 15vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/90">
          <div className="container mx-auto px-4 py-5 md:px-6 lg:px-8">
            <div className="grid gap-4 rounded-[1.8rem] border border-slate-200 bg-white px-5 py-5 shadow-sm md:grid-cols-2 md:px-6 lg:grid-cols-4">
              {FEATURE_ITEMS.map(({ title, description, Icon }) => (
                <div key={title} className="flex items-start gap-3 border-slate-100 lg:border-r lg:pr-4 last:border-r-0">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-2.5 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*
        <section id="como-trabajamos" className="py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="max-w-lg">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Nuestro proceso</span>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
                  Asi organizamos
                  <br />
                  cada traslado
                </h2>

                <div className="mt-8 space-y-6">
                  {PROCESS_STEPS.map((step, index) => (
                    <div key={step.title} className="relative flex gap-4 pl-1">
                      {index < PROCESS_STEPS.length - 1 && (
                        <span className="absolute left-[19px] top-11 h-[calc(100%-1rem)] w-px bg-primary/20" />
                      )}
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-white text-xs font-bold text-primary">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="pt-1">
                        <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.12)] md:p-4">
                <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-slate-50">
                  <Image
                    src="/images/transportes/5.png"
                    alt="Unidad de larga distancia para viajes grupales"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 56vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        */}

        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Flota e interiores</span>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 md:text-4xl">Momentos de viaje y unidades</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                  Imagenes reales de nuestra flota, interiores y servicios para mostrar seguridad, confort y variedad
                  de opciones.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 md:gap-4">
              {GALLERY_IMAGES.map((image, index) => (
                <div
                  key={image.src}
                  className={`group overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-sm ${index === GALLERY_IMAGES.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                    }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={315}
                    height={421}
                    className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Ideal para</span>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
                ¿Para quien es este servicio?
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {AUDIENCE_ITEMS.map(({ title, description, Icon }) => (
                <article
                  key={title}
                  className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                >
                  <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="border-t border-slate-200 bg-white py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-6 max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Hablemos</span>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
                Contanos tu viaje y
                <br />
                te enviamos una propuesta
              </h2>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                <div className="p-5 md:p-7 lg:p-8">
                  <ContactForm />
                </div>

                <div className="relative min-h-[320px] overflow-hidden border-t border-slate-200 bg-slate-900 lg:min-h-full lg:border-l lg:border-t-0">
                  <Image
                    src="/images/transportes/9.png"
                    alt="Servicio de transportes grupales Viaggio Tur"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.18),rgba(15,23,42,0.78))]" />
                  <div className="absolute inset-0 flex flex-col justify-between p-6 text-white md:p-8">
                    <div className="self-start rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                      {SITE_NAME}
                    </div>
                    <div>
                      <p className="max-w-md text-2xl font-semibold leading-tight md:text-3xl">
                        Nos ocupamos de que tu grupo llegue bien, disfrute mas y vuelva mejor.
                      </p>
                      <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {CONTACT_HIGHLIGHTS.map((item) => (
                          <div key={item.title} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                            <p className="text-sm font-semibold">{item.title}</p>
                            <p className="mt-1 text-xs leading-5 text-white/80">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-slate-200 bg-[#fbfcf8] p-4 md:grid-cols-3 md:p-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Direccion</p>
                  <p className="text-sm text-slate-600">{CONTACT_INFO.direccion}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">WhatsApp</p>
                  <a
                    className="text-sm text-slate-600 transition hover:text-primary"
                    href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {CONTACT_INFO.whatsappDisplay ? `+54 9 ${CONTACT_INFO.whatsappDisplay}` : CONTACT_INFO.whatsapp}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email</p>
                  <a className="text-sm text-slate-600 transition hover:text-primary" href={`mailto:${CONTACT_INFO.email}`}>
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

