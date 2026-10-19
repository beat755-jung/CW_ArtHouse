/**
 * lib/artworks.ts — 작품 및 전시 데이터 레이어
 *
 * [역할]
 * - 사이트 전체에서 사용되는 작품(Artwork)·전시(Exhibition) 데이터의 단일 출처
 * - 이 파일만 수정하면 Exhibition, Artist, Home 페이지에 자동 반영됩니다.
 *
 * [이미지 경로 규칙]
 * - public/artworks/{year}_year/{series_folder}/{filename} 구조
 * - makeImages(dir, files) 헬퍼에서 dir = "{year}_year/{series_folder}" 형태 사용
 * - 폴더명 공백은 그대로 사용 (Next.js 정적 파일 서버가 URL 디코딩 처리)
 *
 * [작품 추가 방법]
 * 1. public/artworks/{year}_year/{새_시리즈}/ 에 이미지 복사
 * 2. artworks 배열에 Artwork 객체 추가
 * 3. featured: true 설정 시 홈 Featured Works 표시 (최대 6개)
 *
 * [전시 추가 방법]
 * 1. exhibitions 배열에 Exhibition 객체 추가
 * 2. artworkSlugs 에 연결할 작품의 seriesSlug 나열
 *
 * [헬퍼 함수]
 * - getArtworkBySlug()        : seriesSlug로 단일 작품 조회
 * - getExhibitionBySlug()     : slug로 단일 전시 조회
 * - getArtworksForExhibition(): 전시에 연결된 Artwork 배열 반환
 * - getFeaturedArtworks()     : featured=true 인 작품 반환
 * - getArtworksByCategory()   : 카테고리 필터링
 * - exhibitionsByYear()       : 연도→전시 Map 반환 (전시 목록 페이지용)
 */
export type Category = "ceramic" | "painting" | "drawing" | "installation" | "video" | "press";

export interface Artwork {
  id: string;
  title: string;
  year: number;
  medium: string;
  dimensions?: string;
  category: Category;
  series: string;
  seriesSlug: string;
  images: string[];
  coverImage: string;
  description?: string;
  featured?: boolean;
}

export interface Exhibition {
  id: string;
  slug: string;
  title: string;
  year: number;
  venue: string;
  location: string;
  dateStart: string;
  dateEnd?: string;
  coverImage?: string;
  images?: string[];
  description?: string;
  artworkSlugs: string[];
  category?: "press" | "exhibition";
}

// ── Helpers ────────────────────────────────────────────────────────

const makeImages = (dir: string, files: string[]): string[] =>
  files.map((f) => `/artist/${dir.replace(/^(\d{4})_year\//, '$1_year_a/')}/${f}`);

const makeExhibitionImages = (dir: string, files: string[]): string[] =>
  files.map((f) => `/exhibition/${dir.replace(/^(\d{4})_year\//, '$1_year_e/')}/${f}`);

// ── Artworks ───────────────────────────────────────────────────────

export const artworks: Artwork[] = [

  // ════════════════════════════════════════════════════════ 2026 ══

  // ── House Searching for Home: 집 ─────────────────────────────────
  {
    id: "house-searching-for-home",
    title: "House Searching for Home: 집",
    year: 2026,
    medium: "Sculpture clay, underglaze pencil, and glaze",
    category: "ceramic",
    series: "House Searching for Home",
    seriesSlug: "house-searching-for-home",
    coverImage: "/artist/2026_year_a/2026.03.27_House Searching for Home/1231_HYEYOON-71.jpg",
    images: makeImages("2026_year/2026.03.27_House Searching for Home", [
      "1231_HYEYOON-71.jpg",
      "1231_HYEYOON-73.jpg",
      "1231_HYEYOON-74.jpg",
      "1231_HYEYOON-75.jpg",
      "1231_HYEYOON-76.jpg",
    ]),
    description:
      "Made with my core childhood memory of glowing star stickers, the dream of eating 'eat me cookie' from Alice in Wonderland (1951), and the wanting of a true home in Chicago one day. An extension of the project Stars in our palm: 손바닥 별.",
    featured: true,
  },

  // ── The Tower of Blood and Thirst: 아픔과 갈증의 탑 ───────────────
  {
    id: "tower-of-blood-and-thirst",
    title: "The Tower of Blood and Thirst: 아픔과 갈증의 탑",
    year: 2026,
    medium: "Na_archieve — Korean Artist Archive",
    category: "press",
    series: "The Tower of Blood and Thirst",
    seriesSlug: "tower-of-blood-and-thirst",
    coverImage: "/exhibition/2026_year_e/2026.05.02_Na_archieve/The Tower of Blood and Thirst-title.jpg",
    images: makeExhibitionImages("2026_year/2026.05.02_Na_archieve", [
      "The Tower of Blood and Thirst-title.jpg",
      "The Tower of Blood and Thirst_02.jpg",
      "The Tower of Blood and Thirst_03.jpg",
      "The Tower of Blood and Thirst_04.jpg",
      "The Tower of Blood and Thirst_05.jpg",
      "The Tower of Blood and Thirst_06.jpg",
      "The Tower of Blood and Thirst_07.jpg",
      "The Tower of Blood and Thirst_08.jpg",
      "The Tower of Blood and Thirst_09.jpg",
      "The Tower of Blood and Thirst_10.jpg",
    ]),
    description:
      "Featured in Na_archieve, a Korean artist documentation series. SAIC archival record and professional critique of 'The Tower of Blood and Thirst: 아픔과 갈증의 탑' — a work questioning the boundaries between predator and prey through a symbolic clock tower.",
  },

  // ════════════════════════════════════════════════════════ 2025 ══

  // ── Birds of Prey ─────────────────────────────────────────────────
  {
    id: "birds-of-prey",
    title: "Birds of Prey",
    year: 2025,
    medium: "Stained glass, mineral, marble, beads, bird feather, copper rod, found objects, copper-tape, and silver-solder",
    dimensions: "6.3 × 4 × 3\"",
    category: "installation",
    series: "Birds of Prey",
    seriesSlug: "birds-of-prey",
    coverImage: "/artist/2025_year_a/2025.01.10_birds-of-prey/1231_HYEYOON-113.jpg",
    images: makeImages("2025_year/2025.01.10_birds-of-prey", [
      "1231_HYEYOON-113.jpg",
      "1231_HYEYOON-114.jpg",
      "1231_HYEYOON-115.jpg",
      "1231_HYEYOON-116.jpg",
      "1231_HYEYOON-117.jpg",
    ]),
    description: "Palm-sized.",
    featured: true,
  },

  // ── Pond leathers ─────────────────────────────────────────────────
  {
    id: "pond-leathers",
    title: "Pond leathers",
    year: 2025,
    medium: "Studio white clay, glaze, palm-sized",
    category: "ceramic",
    series: "Pond leathers",
    seriesSlug: "pond-leathers",
    coverImage: "/artist/2025_year_a/2025.03.04_Pond leathers_ceramic-sea-leather/1231_HYEYOON-11.jpg",
    images: makeImages("2025_year/2025.03.04_Pond leathers_ceramic-sea-leather", [
      "1231_HYEYOON-11.jpg",
      "1231_HYEYOON-13.jpg",
      "1231_HYEYOON-16.jpg",
      "1231_HYEYOON-18.jpg",
      "1231_HYEYOON-20.jpg",
    ]),
    description: "Moss, lotus leaf, pond water, a crocodile, all leather-ized.",
  },

  // ── SEE-and-SAW ───────────────────────────────────────────────────
  {
    id: "see-and-saw",
    title: "SEE-and-SAW",
    year: 2025,
    medium: "Studio white clay, glaze, screw, plywood",
    category: "ceramic",
    series: "SEE-and-SAW",
    seriesSlug: "see-and-saw",
    coverImage: "/artist/2025_year_a/2025.01.19_SEE-and-SAW_ceramic/1231_HYEYOON-93.jpg",
    images: makeImages("2025_year/2025.01.19_SEE-and-SAW_ceramic", [
      "1231_HYEYOON-93.jpg",
      "1231_HYEYOON-96.jpg",
      "1231_HYEYOON-97.jpg",
      "1231_HYEYOON-98.jpg",
      "1231_HYEYOON-100.jpg",
    ]),
    description:
      "This piece explores the illusion of freedom and the hidden mechanisms of self-imposed confinement. Manually operated, it depicts birds seemingly playful on a seesaw yet their bodies are trapped within. The removable blue birds serve as the addicted; the one watching has managed to break free and observes with pity. The act of removing the birds becomes a metaphor for freeing oneself from cycles of addiction and judgment.",
    featured: true,
  },

  // ── Stars in our palm: 손바닥 별 ─────────────────────────────────
  {
    id: "stars-in-our-palm",
    title: "Stars in our palm: 손바닥 별",
    year: 2025,
    medium: "Studio white clay, glaze, and underglaze pencil",
    category: "ceramic",
    series: "Stars in our palm",
    seriesSlug: "stars-in-our-palm",
    coverImage: "/artist/2025_year_a/2025.02.13_Stars-in-our-palm/1231_HYEYOON-25.jpg",
    images: makeImages("2025_year/2025.02.13_Stars-in-our-palm", [
      "1231_HYEYOON-25.jpg",
      "1231_HYEYOON-31.jpg",
      "1231_HYEYOON-33.jpg",
      "1231_HYEYOON-46.jpg",
      "1231_HYEYOON-47.jpg",
    ]),
    featured: true,
  },

  // ── Masked Up ─────────────────────────────────────────────────────
  {
    id: "masked-up",
    title: "Masked Up",
    year: 2025,
    medium: "Studio white clay and floating black glaze",
    category: "ceramic",
    series: "Masked Up",
    seriesSlug: "masked-up",
    coverImage: "/artist/2025_year_a/2025.04.16_Masked Up/1231_HYEYOON-85.jpg",
    images: makeImages("2025_year/2025.04.16_Masked Up", [
      "1231_HYEYOON-85.jpg",
      "1231_HYEYOON-87.jpg",
      "1231_HYEYOON-89.jpg",
      "1231_HYEYOON-90.jpg",
      "1231_HYEYOON-91.jpg",
    ]),
    description: "Inspired by bird-like beak masks of plague doctors.",
  },

  // ── Ugly Duckling ─────────────────────────────────────────────────
  {
    id: "ugly-duckling",
    title: "Ugly Duckling",
    year: 2025,
    medium: "Steel, electrical tape, DC motor, power source, switch, solder, screw, wire, metal shelf brackets on soil",
    dimensions: "14 × 17 × 18\"",
    category: "installation",
    series: "Ugly Duckling",
    seriesSlug: "ugly-duckling",
    coverImage: "/artist/2025_year_a/2025.01.06_ugly-duckling/1231_HYEYOON-130.jpg",
    images: makeImages("2025_year/2025.01.06_ugly-duckling", [
      "1231_HYEYOON-130.jpg",
      "1231_HYEYOON-132.jpg",
      "1231_HYEYOON-137.jpg",
      "1231_HYEYOON-138.jpg",
      "1231_HYEYOON-141.jpg",
    ]),
    description: "Reconstruction of the story of the ugly duckling.",
    featured: true,
  },

  // ── Speak to Coexistence ──────────────────────────────────────────
  {
    id: "speak-to-coexistence",
    title: "Speak to Coexistence",
    year: 2025,
    medium: "Soil, sprouts, steel",
    dimensions: "18 × 21 × 15\"",
    category: "installation",
    series: "Speak to Coexistence",
    seriesSlug: "speak-to-coexistence",
    coverImage: "/artist/2025_year_a/2025.03.14-Speak to Coexistence/2025.03.14-Speak to Coexistence.jpg",
    images: makeImages("2025_year/2025.03.14-Speak to Coexistence", [
      "2025.03.14-Speak to Coexistence.jpg",
    ]),
    description: "Desire to burst out of the ground, reach a space for more adventure. Seeking for a coexisting environment in a city with artificial nature.",
  },

  // ── Warped ────────────────────────────────────────────────────────
  {
    id: "warped",
    title: "Warped",
    year: 2025,
    medium: "Studio white clay and glaze",
    category: "ceramic",
    series: "Warped",
    seriesSlug: "warped",
    coverImage: "/artist/2025_year_a/2025.05.11_Warped/2025.05.11_Warped1.jpg",
    images: makeImages("2025_year/2025.05.11_Warped", [
      "2025.05.11_Warped1.jpg",
      "2025.05.11_Warped2.jpg",
      "2025.05.11_Warped3.jpg",
      "2025.05.11_Warped4.jpg",
      "2025.05.11_Warped5.jpg",
    ]),
  },

  // ── In a still swamp: 고요한 늪에서 ─────────────────────────────────
  {
    id: "in-a-still-swamp",
    title: "In a still swamp: 고요한 늪에서",
    year: 2025,
    medium: "Studio white clay, glaze",
    category: "ceramic",
    series: "In a still swamp",
    seriesSlug: "in-a-still-swamp",
    coverImage: "/artist/2025_year_a/2025.05.14-In a still swamp/2025.05.14-In a still swamp.jpg",
    images: makeImages("2025_year/2025.05.14-In a still swamp", [
      "2025.05.14-In a still swamp.jpg",
      "2025.05.14-In a still swamp1.jpg",
      "2025.05.14-In a still swamp2.jpg",
      "2025.05.14-In a still swamp3.jpg",
      "2025.05.14-In a still swamp4.jpg",
      "2025.05.14-In a still swamp5.jpg",
      "2025.05.14-In a still swamp6.jpg",
    ]),
  },

  // ── Right Person, Wrong Location ─────────────────────────────────
  {
    id: "right-person-wrong-location",
    title: "Right Person, Wrong Location",
    year: 2025,
    medium: "Steel, ¼\" plywood, gesso, acrylic paint, wood glue, hot glue, soil, dust",
    dimensions: "38 × 33 × 13\"",
    category: "installation",
    series: "Right Person, Wrong Location",
    seriesSlug: "right-person-wrong-location",
    coverImage: "/artist/2025_year_a/2025.05.20_Right Person,Wrong Location/Right Person,Wrong Location1.jpg",
    images: makeImages("2025_year/2025.05.20_Right Person,Wrong Location", [
      "Right Person,Wrong Location1.jpg",
      "Right Person,Wrong Location2.jpg",
      "Right Person,Wrong Location3.jpg",
      "Right Person,Wrong Location4.jpg",
      "Right Person,Wrong Location5.jpg",
    ]),
    description:
      "Reflects a connection that felt destined, yet dissolved quietly under the misalignment of time and physical distance. Metal wings represent sincere emotions and a desire to reach the person one longs to be close to, but they are too heavy to fly. It wasn't the wrong person, just misaligned timing and place.",
    featured: true,
  },

  // ════════════════════════════════════════════════════════ 2024 ══

  // ── Scribbles on the Wall (낙서로 뒤덮인 집) ─────────────────────
  {
    id: "scribbles-on-the-wall",
    title: "Scribbles on the Wall (낙서로 뒤덮인 집)",
    year: 2024,
    medium: "Installation",
    category: "installation",
    series: "Scribbles on the Wall",
    seriesSlug: "scribbles-on-the-wall",
    coverImage: "/artist/2024_year_a/scribbles-on-the-wall/1231_HYEYOON-54.jpg",
    images: makeImages("2024_year/scribbles-on-the-wall", [
      "1231_HYEYOON-54.jpg",
      "1231_HYEYOON-57.jpg",
      "1231_HYEYOON-59.jpg",
      "1231_HYEYOON-64.jpg",
      "1231_HYEYOON-65.jpg",
    ]),
    description:
      "An immersive installation that transforms the domestic interior into a field of accumulated marks, questioning the boundaries between private thought and shared space.",
    featured: true,
  },

  // ── 이빨접시 (Tooth Plate) ────────────────────────────────────────
  {
    id: "tooth-plate",
    title: "이빨접시 (Tooth Plate)",
    year: 2024,
    medium: "Ceramic",
    category: "ceramic",
    series: "이빨접시",
    seriesSlug: "tooth-plate",
    coverImage: "/artist/2024_year_a/tooth-plate/1231_HYEYOON-1.jpg",
    images: makeImages("2024_year/tooth-plate", [
      "1231_HYEYOON-1.jpg",
      "1231_HYEYOON-3.jpg",
      "1231_HYEYOON-6.jpg",
      "1231_HYEYOON-21.jpg",
      "1231_HYEYOON-23.jpg",
    ]),
  },

  // ── Overwhelmed with guilt ────────────────────────────────────────
  {
    id: "overwhelmed-with-guilt",
    title: "Overwhelmed with guilt",
    year: 2024,
    medium: "Acrylic, pen and color pencils on canvas",
    category: "painting",
    series: "Overwhelmed with guilt",
    seriesSlug: "overwhelmed-with-guilt",
    coverImage: "/artist/2024_year_a/2024.03.30_Overwhelmed with guilt/2024_Overwhelmed with guilt.jpg",
    images: makeImages("2024_year/2024.03.30_Overwhelmed with guilt", [
      "2024_Overwhelmed with guilt.jpg",
    ]),
    description: "Featured at the SAIC Sharp building gallery ARTBASH.",
  },

  // ── The world is my oyster? ───────────────────────────────────────
  {
    id: "world-is-my-oyster",
    title: "The world is my oyster?",
    year: 2024,
    medium: "Air-dry clay, clear nail polish, double sided tape, USB light",
    category: "installation",
    series: "The world is my oyster",
    seriesSlug: "world-is-my-oyster",
    coverImage: "/artist/2024_year_a/2024.03.14-The world is my oyster/2024.03.14-The world is my oyster.jpg",
    images: makeImages("2024_year/2024.03.14-The world is my oyster", [
      "2024.03.14-The world is my oyster.jpg",
    ]),
    description: "From Shakespeare's 'The Merry Wives of Windsor' (1602): \"The world's mine oyster, which I with sword will open.\" This work questions whether the world truly is ours — in a time where this generation has so much to consider that they have no time to create their own oyster. (Ideally with 35 clay cones in a site-specific space.)",
  },

  // ── The Studio ───────────────────────────────────────────────────
  {
    id: "the-studio",
    title: "The Studio",
    year: 2024,
    medium: "Oil on canvas",
    dimensions: "21 × 18\"",
    category: "painting",
    series: "The Studio",
    seriesSlug: "the-studio",
    coverImage: "/artist/2024_year_a/2024.09.17-The Studio/2024.09.17-The Studio.jpg",
    images: makeImages("2024_year/2024.09.17-The Studio", [
      "2024.09.17-The Studio.jpg",
    ]),
    description: "Homage to Philip Guston's The Studio, Oil on canvas, 1969.",
  },

  // ── Overlapped dreams with broken trust ──────────────────────────
  {
    id: "overlapped-dreams",
    title: "Overlapped dreams with broken trust",
    year: 2024,
    medium: "Oil and colored pencils on canvas",
    dimensions: "18 × 21\"",
    category: "painting",
    series: "Overlapped dreams with broken trust",
    seriesSlug: "overlapped-dreams",
    coverImage: "/artist/2024_year_a/2024.10.21-Overlapped dreams with broken trust/2024.10.21-Overlapped dreams with broken trust.jpg",
    images: makeImages("2024_year/2024.10.21-Overlapped dreams with broken trust", [
      "2024.10.21-Overlapped dreams with broken trust.jpg",
    ]),
    description: "Combined scenes from my dreams, current thoughts, and real life.",
  },

  // ── Blade beneath the Bloom ──────────────────────────────────────
  {
    id: "blade-beneath-the-bloom",
    title: "Blade beneath the Bloom",
    year: 2024,
    medium: "Steel",
    dimensions: "17 × 15 × 15\"",
    category: "installation",
    series: "Blade beneath the Bloom",
    seriesSlug: "blade-beneath-the-bloom",
    coverImage: "/artist/2024_year_a/2024.11.23-Blade beneath the Bloom/2024.11.23-Blade beneath the Bloom.jpg",
    images: makeImages("2024_year/2024.11.23-Blade beneath the Bloom", [
      "2024.11.23-Blade beneath the Bloom.jpg",
    ]),
    description: "The beings that come close, on the ability and their features to make others focus. Where concentration can be exerted by itself as long as you are caught. The courage to try the uncomfortable and continue even when nothing seems to change.",
  },

  // ── Turbulence in our Conversation ───────────────────────────────
  {
    id: "turbulence-in-our-conversation",
    title: "Turbulence in our Conversation",
    year: 2024,
    medium: "Oil, colored pencil, pencil, and pen on stretched canvas",
    dimensions: "40 × 30\"",
    category: "painting",
    series: "Turbulence in our Conversation",
    seriesSlug: "turbulence-in-our-conversation",
    coverImage: "/artist/2024_year_a/2024.12.15-Turbulence in our Conversation/2024.12.15-Turbulence in our Conversation.jpg",
    images: makeImages("2024_year/2024.12.15-Turbulence in our Conversation", [
      "2024.12.15-Turbulence in our Conversation.jpg",
    ]),
    description: "Absence and refusal of conversation.",
  },

  // ── Endless Pecking ──────────────────────────────────────────────
  {
    id: "endless-pecking",
    title: "Endless Pecking",
    year: 2024,
    medium: "Oil and colored pencil on stretched canvas",
    dimensions: "20 × 16\"",
    category: "painting",
    series: "Endless Pecking",
    seriesSlug: "endless-pecking",
    coverImage: "/artist/2024_year_a/2024.12.16-Endless Pecking/2024.12.16-Endless Pecking.jpg",
    images: makeImages("2024_year/2024.12.16-Endless Pecking", [
      "2024.12.16-Endless Pecking.jpg",
    ]),
    description: "The two bird figures represent us. Constantly pecking on each other over things that don't matter in the end. People who don't have enough rooms to share, meaningless arguments.",
  },

  // ════════════════════════════════════════════════════════ 2023 ══

  // ── No no place place to to hide hide ────────────────────────────
  {
    id: "no-no-place",
    title: "No no place place to to hide hide",
    year: 2022,
    medium: "Acrylic, pen, colored pencils, and pencil on canvas",
    category: "painting",
    series: "No no place place to to hide hide",
    seriesSlug: "no-no-place",
    coverImage: "/artist/2023_year_a/2023.09.18_No no place place to to hide hide/2023.09.18_No no place place to to hide hide-15-x-18,-Acrylic,-colored-pencil,-and-pen-on-canvas,-2022.png",
    images: makeImages("2023_year/2023.09.18_No no place place to to hide hide", [
      "2023.09.18_No no place place to to hide hide-15-x-18,-Acrylic,-colored-pencil,-and-pen-on-canvas,-2022.png",
    ]),
  },

  // ── Dimensions of our stupidity ───────────────────────────────────
  {
    id: "dimensions-of-our-stupidity",
    title: "Dimensions of our stupidity",
    year: 2022,
    medium: "Acrylic, gouache, color pencil, pen, and black paper on canvas",
    category: "painting",
    series: "Dimensions of our stupidity",
    seriesSlug: "dimensions-of-our-stupidity",
    coverImage: "/artist/2023_year_a/2023.08.20_Dimensions of our stupidity/2023.08.20_Dimensions of our stupidity.jpg",
    images: makeImages("2023_year/2023.08.20_Dimensions of our stupidity", [
      "2023.08.20_Dimensions of our stupidity.jpg",
    ]),
  },

  // ── confetti ──────────────────────────────────────────────────────
  {
    id: "confetti",
    title: "confetti",
    year: 2022,
    medium: "Acrylic, colored pencils, oil pastel, and paper scraps on canvas",
    category: "painting",
    series: "confetti",
    seriesSlug: "confetti",
    coverImage: "/artist/2023_year_a/2023.08.04_confetti-after/confetti2-before.jpg",
    images: makeImages("2023_year/2023.08.04_confetti-after", [
      "confetti2-before.jpg",
      "2023.08.04_confetti-after.jpg",
    ]),
  },

  // ── Sense of hollow and old memories ─────────────────────────────
  {
    id: "sense-of-hollow",
    title: "Sense of hollow and old memories",
    year: 2022,
    medium: "Acrylic, pencil, color pencil, oil pastel, and crayon on paper",
    category: "painting",
    series: "Sense of hollow and old memories",
    seriesSlug: "sense-of-hollow",
    coverImage: "/artist/2023_year_a/2023.08.22_Sense of hollow and old memories/2023.08.22_Sense of hollow and old memories.jpg",
    images: makeImages("2023_year/2023.08.22_Sense of hollow and old memories", [
      "2023.08.22_Sense of hollow and old memories.jpg",
      "2023.08.22_Sense of hollow and old memories-detail.jpg",
    ]),
  },

  // ── Self Portraits (SAIC Portfolio) ──────────────────────────────
  {
    id: "saic-portfolio",
    title: "SAIC Application Portfolio",
    year: 2023,
    medium: "Mixed media",
    category: "painting",
    series: "SAIC Application Portfolio",
    seriesSlug: "saic-portfolio",
    coverImage: "/artist/2023_year_a/2023.01.01-03.01_saic-portfolio/self-portrait1.jpg",
    images: makeImages("2023_year/2023.01.01-03.01_saic-portfolio", [
      "self-portrait1.jpg",
      "self-portrait2-road.jpg",
      "self-portrait3-shout.jpg",
      "self-portrait4-body.jpg",
      "self-portrait5-dual.jpg",
      "self-portrait6-side.jpg",
      "self-portrait7-front.jpg",
      "fly1.jpg",
      "fly2.jpg",
      "IMG_0187.jpg",
    ]),
    description:
      "Portfolio submitted for application to the School of the Art Institute of Chicago (SAIC), 2023.",
  },

  // ── The Ones Who Use Them to Move On ─────────────────────────────
  {
    id: "the-ones-who-use-them",
    title: "The Ones Who Use Them to Move On",
    year: 2023,
    medium: "Mixed media",
    category: "painting",
    series: "Individual",
    seriesSlug: "individual",
    coverImage: "/artist/2023_year_a/2023.08.18-The ones who use them to move on  desert/2023.08.18-The ones who use them to move on  desert.png",
    images: ["/artist/2023_year_a/2023.08.18-The ones who use them to move on  desert/2023.08.18-The ones who use them to move on  desert.png"],
  },
];

// ── Exhibition data ──────────────────────────────────────────────

export const exhibitions: Exhibition[] = [

  // ════════════════════════════════════════════════════════ 2026 ══

  // ── Na_archieve — The Tower of Blood and Thirst ──────────────────
  {
    id: "na-archieve-2026",
    slug: "na-archieve-2026",
    title: "Na_archieve: The Tower of Blood and Thirst",
    year: 2026,
    venue: "Na_archieve (Korean Artist Archive)",
    location: "Online / Chicago, IL",
    dateStart: "2026-05-02",
    description:
      "Feature of Hyeyoon Jung's work 'The Tower of Blood and Thirst: 아픔과 갈증의 탑' in the Na_archieve Korean artist documentation series.",
    artworkSlugs: ["tower-of-blood-and-thirst"],
    category: "press",
  },

  // ── SARCASM — KSA Group Exhibition ───────────────────────────────
  {
    id: "sarcasm-2026",
    slug: "sarcasm-2026",
    title: "SARCASM",
    year: 2026,
    venue: "KSA Exhibition Space",
    location: "1029 W 35th St, 3rd Floor, Chicago, IL 60609",
    dateStart: "2026-05-01",
    dateEnd: "2026-05-10",
    coverImage: "/exhibition/2026_year_e/2026.05.01-2026.05.10_SARCASM/05.01.26-05.10.26_SARCASM.jpg",
    description:
      "Group exhibition organized by KSA (Korean Student Association) featuring works across ceramics and mixed media. Reception: May 1, 6–8pm.",
    artworkSlugs: ["ugly-duckling", "masked-up", "see-and-saw"],
  },

  // ── On Wanting — INCUBATOR Joint Exhibition ───────────────────────
  {
    id: "on-wanting-2026",
    slug: "on-wanting-2026",
    title: "On Wanting",
    year: 2026,
    venue: "INCUBATOR / Sharp Lobby, SAIC",
    location: "Chicago, IL",
    dateStart: "2026-04-24",
    dateEnd: "2026-05-22",
    coverImage: "/exhibition/2026_year_e/2026.04.24-05.22_OnWanting/04.24.26-05.22.26_OnWanting.jpg",
    images: makeExhibitionImages("2026_year/2026.04.24-05.22_OnWanting", [
      "04.24.26-05.22.26_OnWanting1.jpg",
      "04.24.26-05.22.26_OnWanting2.jpg",
      "04.24.26-05.22.26_OnWanting3.jpg",
      "04.24.26-05.22.26_OnWanting4.jpg",
      "04.24.26-05.22.26_OnWanting5.jpg",
      "04.24.26-05.22.26_OnWanting6.jpg",
      "04.24.26-05.22.26_OnWanting7.jpg",
    ]),
    description:
      "A joint exhibition between Hyeyoon Jung and Yeoreum Summer Shin that interrogates how ephemerality is shifted through individual consciousness. Reflecting on past tribulations and future hopes, both artists discuss the pursuit of safety through their work. Jung's bird-like figures and protective personas fight to control, dissolve, or coexist peacefully in psychologically warped landscapes. Opening reception: April 24, 4–6pm, Sharp Lobby.",
    artworkSlugs: ["house-searching-for-home", "birds-of-prey", "see-and-saw", "stars-in-our-palm"],
  },

  // ── Ghost Gallery at Kimpton Gray Hotel ──────────────────────────
  {
    id: "ghost-galleries-2026",
    slug: "ghost-galleries-2026",
    title: "Ghost Gallery at Kimpton Gray Hotel",
    year: 2026,
    venue: "Ghost Gallery / Kimpton Gray Hotel, 2nd Floor",
    location: "Chicago, IL",
    dateStart: "2026-04-17",
    coverImage: "/exhibition/2026_year_e/2026.04.17_GhostGalleries/04.17.26_GhostGalleries.jpg",
    description:
      "One-day pop-up exhibition organized by Ghost Gallery (@ghostgallerychi) featuring an incredible group of artists. Social hour 5–6pm.",
    artworkSlugs: ["house-searching-for-home", "stars-in-our-palm", "birds-of-prey"],
  },

  // ════════════════════════════════════════════════════════ 2025 ══

  // ── New Work 2025 — SAIC Galleries ───────────────────────────────
  {
    id: "new-work-2025",
    slug: "new-work-2025",
    title: "New Work 2025",
    year: 2025,
    venue: "SAIC Galleries",
    location: "33 E Washington St, Chicago, IL 60602",
    dateStart: "2025-06-20",
    dateEnd: "2025-07-19",
    coverImage: "/exhibition/2025_year_e/2025.06.20-07.19_New Work 2025/New Work 2025-exhibition-poster.jpg",
    description:
      "Participation in 'New Work 2025' at SAIC Galleries, showcasing one sculpture and two paintings. Public opening reception: June 20, 3–5pm. Open Monday–Saturday 11am–6pm. Free and open to the public.",
    artworkSlugs: ["right-person-wrong-location", "endless-pecking", "the-studio"],
  },

  // ── KSA Off-Campus Exhibition — Connection (Semicolon ;) ─────────
  {
    id: "ksa-off-campus-2025",
    slug: "ksa-off-campus-2025",
    title: "KSA Off-Campus Exhibition",
    year: 2025,
    venue: "OH Art Foundation / KSA",
    location: "1029 W 35th St, 3rd Floor, Chicago, IL 60609",
    dateStart: "2025-04-18",
    dateEnd: "2025-05-03",
    coverImage: "/exhibition/2025_year_e/2025.04.18-2025.05.03_KSA Off-Campus Exhibition/2025.04.18-2025.05.03_KSA Off-Campus Exhibition.jpg",
    description:
      "First off-campus exhibition in Chicago. Group exhibition at the OH Art Foundation featuring 'Speak to Coexistence' (metal sculpture) and 'Overlapped dreams with broken trust' (painting).",
    artworkSlugs: ["speak-to-coexistence", "overlapped-dreams"],
  },

  // ── JADE Gallery Artist Spotlight ────────────────────────────────
  {
    id: "jade-gallery-2025",
    slug: "jade-gallery-2025",
    title: "JADE Gallery — Artist Spotlight",
    year: 2025,
    venue: "JADE Gallery (@jadegallerybyoaap)",
    location: "Online",
    dateStart: "2025-05-16",
    coverImage: "/exhibition/2025_year_e/2025.05.16_JADE Gallery-Artist Spotlight/JADE Gallery-Artist Spotlight1.jpg",
    description:
      "Newsletter collaboration with JADE Gallery featuring Hyeyoon Jung's practice and recent works. Special thanks to the JADE Gallery team for making this possible and for the invitation.",
    artworkSlugs: [],
  },

  // ════════════════════════════════════════════════════════ 2024 ══

  // ── SAIC Graduate Exhibition 2024 ────────────────────────────────
  {
    id: "saic-thesis-2024",
    slug: "saic-thesis-2024",
    title: "SAIC Graduate Exhibition",
    year: 2024,
    venue: "School of the Art Institute of Chicago",
    location: "Chicago, IL",
    dateStart: "2024-05",
    description:
      "Annual graduate student exhibition at SAIC featuring installation, ceramic, and mixed-media works.",
    artworkSlugs: ["scribbles-on-the-wall", "see-and-saw", "birds-of-prey"],
  },

  // ── Ceramic Exhibition 2024 ───────────────────────────────────────
  {
    id: "2024-ceramic-exhibition",
    slug: "2024-ceramic-exhibition",
    title: "Ceramic Exhibition 2024",
    year: 2024,
    venue: "Gallery",
    location: "Chicago, IL",
    dateStart: "2024-03",
    description:
      "A group exhibition presenting Hyeyoon Jung's ceramic works alongside fellow artists. The exhibition explores material relationships between the body, domesticity, and identity.",
    artworkSlugs: [
      "pond-leathers",
      "stars-in-our-palm",
      "house-searching-for-home",
      "masked-up",
      "see-and-saw",
      "birds-of-prey",
      "ugly-duckling",
      "scribbles-on-the-wall",
    ],
  },

  // ════════════════════════════════════════════════════════ 2023 ══

  // ── SAIC Application Portfolio 2023 ─────────────────────────────
  {
    id: "saic-application-2023",
    slug: "saic-application-2023",
    title: "SAIC Application Portfolio",
    year: 2023,
    venue: "School of the Art Institute of Chicago",
    location: "Chicago, IL",
    dateStart: "2023-01",
    description:
      "Selected works submitted as part of the MFA application to the School of the Art Institute of Chicago.",
    artworkSlugs: ["no-no-place", "dimensions-of-our-stupidity", "confetti", "sense-of-hollow", "saic-portfolio", "individual"],
  },
];

// ── Query helpers ─────────────────────────────────────────────────

export function getArtworkBySlug(slug: string): Artwork | undefined {
  return artworks.find((a) => a.seriesSlug === slug);
}

export function getExhibitionBySlug(slug: string): Exhibition | undefined {
  return exhibitions.find((e) => e.slug === slug);
}

export function getArtworksForExhibition(exhibition: Exhibition): Artwork[] {
  return exhibition.artworkSlugs
    .map((slug) => artworks.find((a) => a.seriesSlug === slug))
    .filter((a): a is Artwork => a !== undefined);
}

export function getFeaturedArtworks(): Artwork[] {
  return artworks.filter((a) => a.featured);
}

export function getArtworksByCategory(category: Category | "all"): Artwork[] {
  if (category === "all") return artworks.filter((a) => a.category !== "press");
  return artworks.filter((a) => a.category === category);
}

export const exhibitionsByYear = (): Map<number, Exhibition[]> => {
  const map = new Map<number, Exhibition[]>();
  for (const ex of exhibitions) {
    if (ex.category === "press") continue;
    const list = map.get(ex.year) ?? [];
    list.push(ex);
    map.set(ex.year, list);
  }
  return map;
};

export const pressByYear = (): Map<number, Exhibition[]> => {
  const map = new Map<number, Exhibition[]>();
  for (const ex of exhibitions) {
    if (ex.category !== "press") continue;
    const list = map.get(ex.year) ?? [];
    list.push(ex);
    map.set(ex.year, list);
  }
  return map;
};
