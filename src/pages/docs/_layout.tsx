import { ReactNode } from 'react';
import { DocsLayout } from '../../components/DocsLayout';

interface DocsPageLayoutProps {
  children: ReactNode;
}

export default function DocsPageLayout({ children }: DocsPageLayoutProps) {
  return <DocsLayout>{children}</DocsLayout>;
}
