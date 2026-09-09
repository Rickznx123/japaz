import { getMediaLibrary } from '@/lib/media'
import { MediaLibraryClient } from '@/components/MediaLibraryClient'

export default async function ImagesPage() {
	const media = await getMediaLibrary()
	return <MediaLibraryClient initialMedia={media} />
}
