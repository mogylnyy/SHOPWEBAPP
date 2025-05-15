
import { redirect } from 'next/navigation';
import { i18n } from '@/lib/i18n-config';
import { PATHS } from '@/lib/constants';

// This page will redirect to the default localized help page.
export default function RootHelpPage() {
  redirect(`/${i18n.defaultLocale}${PATHS.HELP}`);
  // Next.js redirect will stop rendering here, so no need to return JSX.
}
