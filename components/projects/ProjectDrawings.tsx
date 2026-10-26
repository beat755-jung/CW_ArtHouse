import DrawingViewer from "@/components/projects/DrawingViewer";
import { getDrawings } from "@/lib/drawings";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { imageId, type Project } from "@/lib/projects";
import type { DrawingKind } from "@/lib/drawing-types";

export default async function ProjectDrawings({ project, locale, only }: {
  project: Project; locale: Locale; only?: DrawingKind;
}) {
  const d = (await getDictionary(locale)).projectDetail;
  const drawings = getDrawings(project).filter(d => !only || d.kind === only);
  const photos = [...project.images.process, ...project.images.interior];
  const rooms = (project.drawingRooms ?? []).map(room => ({
    id: room.id, name: room.name[locale],
    images: room.imageIds.map(id => {
      const photo = photos.find(p => imageId(p.src) === id && p.kind === "photo" && p.view === "interior");
      if (!photo) throw new Error(`Missing interior room photo: ${id}`);
      return { src: photo.src, alt: photo.alt[locale] };
    }),
  }));
  return <DrawingViewer title={project.name?.[locale] ?? project.slug} drawings={drawings} rooms={only ? [] : rooms}
    labels={{ tabs: d.drawingTabs, categories: d.drawingCategories, tabsLabel: d.drawingsTabsLabel,
      pending: d.drawingPending, note: d.drawingNote, zoomIn: d.drawingZoomIn, zoomOut: d.drawingZoomOut,
      reset: d.drawingReset, hint: d.drawingHint, reading: d.drawingReading, overview: d.drawingOverview,
      readingHint: d.drawingReadingHint, roomHint: d.drawingRoomHint, photoNote: d.drawingPhotoNote,
      photoPending: d.drawingPhotoPending }} />;
}
