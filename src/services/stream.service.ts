import { config } from '../config'

const TOTAL_SEGMENTS = 1440 // 24 часа по 60 сек
const SEGMENTS_PER_PLAYLIST = 60

export async function generatePlaylist(mode: string, hour: number): Promise<string> {
  // В одной выдаче 60 сегментов (1 час). По истечении 55 мин фронт спрашивает снова.
  // Циклим по ~ 1440 трекам через modulo.

  const startSegment = (hour * SEGMENTS_PER_PLAYLIST) % TOTAL_SEGMENTS
  const baseUrl = `${ config.cdnUrl }/audio`

  let playlist = `#EXTM3U
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:60
#EXT-X-MEDIA-SEQUENCE:${startSegment}
`

  for (let i = 0; i < SEGMENTS_PER_PLAYLIST; i++) {
    const index = (startSegment + i) % TOTAL_SEGMENTS
    const segmentFile = `${mode}_60s_${index.toString().padStart(4, '0')}.aac`
    playlist += `#EXTINF:60,\n${baseUrl}/${mode}/${segmentFile}\n`
  }

  playlist += `#EXT-X-ENDLIST\n`
  return playlist
}
