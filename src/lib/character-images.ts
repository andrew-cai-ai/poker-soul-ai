/** Maps internal soul type id → static asset under /public/characters */
export const characterImages: Record<string, string> = {
  cold_reaper: "/characters/cold-harvester.png",
  mad_dog: "/characters/mad-dog.png",
  turtle_keeper: "/characters/turtle-guardian.png",
  fox_schemer: "/characters/fox-trickster.png",
  river_hunter: "/characters/river-hunter.png",
  tilt_asura: "/characters/tilt-asura.png",
  flop_alchemist: "/characters/flop-alchemist.png",
  silent_reader: "/characters/mind-reader.png",
};

export function getCharacterImagePath(soulTypeId: string): string | undefined {
  return characterImages[soulTypeId];
}
