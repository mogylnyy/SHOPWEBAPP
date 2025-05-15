
import { redirect } from 'next/navigation';
import { i18n } from '@/lib/i18n-config';
import { PATHS } from '@/lib/constants';

// This page will redirect to the default localized homepage.
// All actual content is now under src/app/[locale]/
export default function RootPage() {
  redirect(`/${i18n.defaultLocale}${PATHS.HOME}`);
  // Next.js redirect will stop rendering here, so no need to return JSX.
  // If for some reason it didn't, you'd return null or a loading indicator.
  // return null; 
}
