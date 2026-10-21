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
    titleLine1: "Mini houses —",
    titleLine2: ["designed, built and sold", "in one place"],
    subtitle: "From garden annexes to farm rest spaces — houses we build ourselves",
    ctaPrimary: "Consultation & Quote",
    ctaSecondary: "See our process",
    renderNote: "Some images are concept renders",
    scroll: "Scroll",
    keyFactsHeading: "Key facts",
    keyFacts: {
      structure: "Structure",
      baseArea: "Base floor area",
      constructionPeriod: "Construction period",
      warranty: "Warranty",
    },
    processEyebrow: "Process",
    processHeading: "Build process",
    processAll: "View full process",
    processScrollLabel: "Build process steps (scroll horizontally)",
    projectsEyebrow: "Projects",
    projectsHeading: "Featured projects",
    contactHeading: "Planning a garden annex or a farm retreat?",
    contactBody: "Garden annexes and farm rest spaces — let's plan a small house for rest and leisure together.",
  },
  process: {
    eyebrow: "Process",
    title: "Process",
    intro: "How one of our mini houses is built, step by step. Every photo on this page was taken on the build site.",
    recordLabel: "Photo record",
    legendObserved: "The work or material is shown in a photo",
    legendUnconfirmed: "Not yet confirmed by the company; updated as confirmed",
    progressLabel: "Build steps",
    whatHeading: "What happens in this step",
    materialsHeading: "Materials seen in the photos",
    qcHeading: "Quality checks",
    observed: "In photo",
    evidence: "Photo",
    photoPending: "Photo coming soon",
    noPhotosYet: "Photos for this step are being prepared",
    photoCount: "{n} photos",
    morePhotos: "View {n} more photos",
    openPhoto: "View larger",
    annotationsLabel: "Photo notes",
    compareHeading: "Bump-out comparison",
    annotateHint: "Coordinate mode — click a photo to read its % coordinates (development only)",
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
