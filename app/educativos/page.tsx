'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, Compass, GraduationCap, Heart, MapPin, ShieldCheck, Sparkles, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactForm from '@/components/ContactForm';

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const experienceCards = [
  {
    title: 'Salidas Educativas',
    description: 'Aprender fuera del aula.',
    image: '/images/educativos/salidas_educativas.jpg',
    Icon: BookOpen,
  },
  {
    title: 'Viajes de Egresados',
    description: 'Celebrar una etapa unica.',
    image: '/images/educativos/viajes_egresados.png',
    Icon: Sparkles,
  },
  {
    title: 'Salidas Recreativas',
    description: 'Diversion, naturaleza y amistad.',
    image: '/images/educativos/salidas_grupales.jpg',
    Icon: Compass,
  },
];

const benefits = [
  'Transporte habilitado',
  'Coordinacion permanente',
  'Seguro y asistencia',
  'Alojamiento y excursiones',
  'Propuestas personalizadas',
];

const highlights = [
  { value: '+15', label: 'años de experiencia', Icon: GraduationCap },
  { value: '+500', label: 'grupos acompañados', Icon: Users },
  { value: 'Cobertura', label: 'nacional', Icon: MapPin },
];

const formBenefits = [
  { title: 'Respuesta rapida', Icon: Sparkles },
  { title: 'Propuestas personalizadas', Icon: Heart },
  { title: 'Asesoramiento sin compromiso', Icon: ShieldCheck },
];

export default function EducativosPage() {
  return (
    <>
      <Navbar reserveSpace theme="default" />
      <WhatsAppButton />

      <main className="min-h-screen bg-white text-slate-950">
        <section className="relative min-h-[100svh] overflow-hidden bg-black">
          <Image
            src="/images/educativos/hero.jpg"
            alt="Grupo de estudiantes caminando por un sendero natural"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.58)_36%,rgba(0,0,0,0.22)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.52)_100%)]" />

          <div className="relative z-10 flex min-h-[100svh] items-end">
            <div className="container mx-auto px-4 pb-10 pt-16 md:px-6 md:pb-14 lg:px-8 lg:pb-16">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="max-w-[720px]"
              >
                <motion.div
                  variants={reveal}
                  className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur-md"
                >
                  Educativos
                </motion.div>
                <motion.h1
                  variants={reveal}
                  className="mt-6 max-w-[760px] text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl"
                >
                  VIAJES
                  <br />
                  EDUCATIVOS
                  <br />
                  <span className="text-[#33B85F]">Y DE EGRESADOS</span>
                </motion.h1>
                <motion.p
                  variants={reveal}
                  className="mt-5 max-w-[620px] text-sm leading-7 text-white/82 md:text-base"
                >
                  Experiencias que inspiran, enseñan y crean recuerdos para toda la vida.
                </motion.p>

                <motion.div variants={reveal} className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#contacto"
                    className="inline-flex items-center justify-center rounded-full bg-[#1F8A46] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#18713A]"
                  >
                    Solicitar propuesta
                  </a>
                  <a
                    href="#experiencias"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                  >
                    Ver experiencias
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </motion.div>

                <motion.div
                  variants={reveal}
                  className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4"
                >
                  {highlights.map(({ value, label, Icon }) => (
                    <div
                      key={`${value}-${label}`}
                      className="rounded-[28px] border border-white/12 bg-white/8 px-5 py-4 text-white backdrop-blur-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-white/10 p-2.5">
                          <Icon className="h-4 w-4 text-[#51D576]" />
                        </div>
                        <div>
                          <div className="text-base font-semibold">{value}</div>
                          <div className="text-sm text-white/72">{label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="experiencias" className="bg-white py-20 md:py-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-120px' }}
              variants={stagger}
              className="mx-auto max-w-3xl text-center"
            >
              <motion.p variants={reveal} className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1F8A46]">
                Experiencias pensadas para cada etapa
              </motion.p>
              <motion.div variants={reveal} className="mx-auto mt-4 h-1 w-14 rounded-full bg-[#1F8A46]/20" />
            </motion.div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {experienceCards.map(({ title, description, image, Icon }) => (
                <motion.article
                  key={title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-120px' }}
                  variants={reveal}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative overflow-hidden rounded-[28px] border border-black/5 shadow-[0_10px_35px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative aspect-[16/11]">
                    <Image src={image} alt={title} fill className="object-cover transition duration-700 group-hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.7))]" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="mb-4 inline-flex rounded-full bg-[#1F8A46] p-3 shadow-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white md:text-xl">{title}</h3>
                    <p className="mt-2 text-sm text-white/82 md:text-base">{description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-6 md:py-8">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-120px' }}
                variants={reveal}
                className="overflow-hidden rounded-[28px] border border-black/5 bg-[#F7F8F7] shadow-[0_10px_35px_rgba(15,23,42,0.06)]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/educativos/porque_elegirnos.jpg"
                    alt="Grupo disfrutando una experiencia educativa"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-120px' }}
                variants={stagger}
                className="max-w-xl"
              >
                <motion.p variants={reveal} className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1F8A46]">
                  Por qué elegirnos
                </motion.p>
                <motion.h2 variants={reveal} className="mt-3 text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
                  Todo lo que necesita tu grupo,
                  <br />
                  <span className="text-[#1F8A46]">en un solo lugar.</span>
                </motion.h2>
                <motion.div variants={reveal} className="mt-8 space-y-4">
                  {benefits.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1F8A46]" />
                      <p className="text-sm leading-7 text-slate-700 md:text-base">{item}</p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* <section className="bg-white py-20 md:py-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-120px' }}
              variants={stagger}
              className="text-center"
            >
              <motion.p variants={reveal} className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1F8A46]">
                Momentos que quedan para siempre
              </motion.p>
            </motion.div>

            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {galleryImages.map((src, index) => (
                <motion.div
                  key={`${src}-${index}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-120px' }}
                  variants={reveal}
                  className="overflow-hidden rounded-[28px] border border-black/5 bg-[#F8F8F8] shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={src}
                      alt={`Momentos educativos ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 20vw"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        <section className="relative overflow-hidden bg-slate-950 py-20 md:py-24">
          <Image
            src="/images/educativos/4.png"
            alt=""
            fill
            className="object-cover blur-[2px] opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 container mx-auto px-4 text-center md:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-120px' }}
              variants={stagger}
              className="mx-auto max-w-4xl"
            >
              <motion.div variants={reveal} className="text-5xl font-semibold text-[#33B85F]">
                “
              </motion.div>
              <motion.p variants={reveal} className="text-2xl font-semibold leading-tight text-white md:text-3xl">
                No organizamos simplemente un viaje.
                <br />
                Creamos experiencias que acompañan toda una etapa de la vida.
              </motion.p>
              <motion.div variants={reveal} className="mt-8 flex justify-center">
                <div className="rounded-full bg-[#1F8A46] p-3 text-white shadow-lg">
                  <Heart className="h-5 w-5" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="contacto" className="bg-white py-20 md:py-24 scroll-mt-32">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-120px' }}
              variants={stagger}
              className="mb-8 max-w-3xl"
            >
              <motion.p variants={reveal} className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1F8A46]">
                Hablemos
              </motion.p>
              <motion.h2 variants={reveal} className="mt-3 text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
                Organizá el próximo viaje
                <br />
                de tu institución
              </motion.h2>
            </motion.div>

            <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
                <div className="border-b border-slate-100 p-6 md:p-8 lg:border-b-0 lg:border-r lg:p-10">
                  <div className="rounded-[28px] border border-slate-100 bg-white p-1">
                    <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
                      <div className="p-4 md:p-5">
                        <ContactForm paqueteTitulo="Viaje educativo" paqueteId="educativos" />
                      </div>
                      <div className="hidden lg:block w-px bg-slate-100" />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {formBenefits.map(({ title, Icon }) => (
                      <div key={title} className="rounded-3xl border border-slate-100 bg-[#FAFAFA] p-4">
                        <Icon className="h-4 w-4 text-[#1F8A46]" />
                        <p className="mt-3 text-sm font-medium text-slate-700">{title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative min-h-[420px] overflow-hidden bg-slate-950">
                  <Image
                    src="/images/educativos/1.jpg"
                    alt="Grupo de estudiantes felices"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 46vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.65))]" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white md:p-8">
                    <div className="max-w-md rounded-[28px] border border-white/12 bg-white/10 p-6 backdrop-blur-md">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Recuerdos que duran</p>
                      <p className="mt-4 text-xl font-semibold leading-tight md:text-2xl">
                        Una experiencia bien diseñada deja aprendizajes, vínculos y recuerdos inolvidables.
                      </p>
                    </div>
                  </div>
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
