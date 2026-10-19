/**
 * lib/i18n/dictionaries/en.ts — 영어 사전
 *
 * - Dictionary 타입(ko.ts 기준)을 따르므로 키가 빠지거나 다르면 빌드 오류가 난다.
 */
import type { Dictionary } from "./ko";

export const en: Dictionary = {
  meta: {
    siteName: "CW_ArtHouse",
    description: "Mini house design, build and sales",
  },
  nav: {
    label: "Main navigation",
    tagline: "Mini House Design & Build",
    process: "Process",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  language: {
    label: "Select language",
  },
  common: {
    comingSoon: "Coming soon.",
    backToList: "Back to list",
    viewDetail: "View details",
    allRightsReserved: "All rights reserved.",
  },
  notFound: {
    title: "Page not found",
    backHome: "Home",
  },
  home: {
    eyebrow: "Mini House — Design · Build",
    subtitle: "Mini house design, build & sales",
    accent: "Jung Chang-Won",
    scroll: "Scroll",
    projectsHeading: "Projects",
  },
  process: {
    eyebrow: "Process",
    title: "Process",
  },
  projects: {
    eyebrow: "Projects",
    title: "Projects",
  },
  projectDetail: {
    specsHeading: "Specifications",
    specs: {
      type: "Type",
      location: "Location",
      grossFloorArea: "Gross floor area",
      structure: "Structure",
      foundation: "Foundation",
      exteriorCladding: "Exterior cladding",
      insulation: "Insulation",
      windows: "Windows & doors",
      constructionPeriod: "Construction period",
    },
  },
  about: {
    eyebrow: "About",
    title: "About",
    coverCaption: "Exterior under construction (photo)",
  },
  contact: {
    eyebrow: "Contact",
    title: "Consultation & Quote",
  },
};
