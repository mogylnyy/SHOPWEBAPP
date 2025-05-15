
import FaqClient from '@/components/FaqClient';
// No params needed here as FaqClient uses useTranslation which uses useParams
// import type { Locale } from '@/lib/i18n-config';

export default function HelpPage() {
  // FaqClient will pick up locale from URL via useTranslation -> useParams
  return (
    <div>
      <FaqClient />
    </div>
  );
}
