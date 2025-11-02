import { config } from '../config'

const TOTAL_SEGMENTS = 1440 // 24 часа по 60 сек
const SEGMENTS_PER_PLAYLIST = 60

/**
 * Генерирует M3U8-плейлист на 60 файлов (1 час),
 * начиная с `startSegment`. По достижении 1440 -> берем % 1440.
 * В конце ставим #EXT-X-ENDLIST, чтобы Hls считал это конечной выдачей (VOD).
 */
export async function generatePlaylist(mode: string, startSegment: number): Promise<string> {
  startSegment = startSegment % TOTAL_SEGMENTS
  const baseUrl = `${ config.cdnUrl }/audio/${ mode }`

  let playlist = `#EXTM3U
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:60
#EXT-X-MEDIA-SEQUENCE:${ startSegment }
`

  for (let i = 0; i < SEGMENTS_PER_PLAYLIST; i++) {
    const index = (startSegment + i) % TOTAL_SEGMENTS
    playlist += `#EXTINF:60,\n${ baseUrl }/${ mode }_60s_${ String(index).padStart(4, '0') }.aac\n`
  }

  playlist += '#EXT-X-ENDLIST\n'
  return playlist
}
