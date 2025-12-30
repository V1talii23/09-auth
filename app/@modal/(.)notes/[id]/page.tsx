import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from '@tanstack/react-query';
import { getNoteByIdServer } from '@/lib/api/serverApi';
import NotePreviewClient from './NotePreview.client';

interface NotePreviewProps {
  params: Promise<{ id: string }>;
}

async function NotePreview({ params }: NotePreviewProps) {
  const queryClient = new QueryClient();

  const { id } = await params;

  queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => getNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}

export default NotePreview;
