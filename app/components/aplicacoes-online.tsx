import Link from 'next/link';
import { Building, FileText, Mail, NotebookPen } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const onlineApps = [
  {
    name: 'DTE',
    description: 'Domicílio Tributário Eletrônico',
    href: 'https://dte.campogrande.ms.gov.br/dte/paginas/portal/#/',
    icon: Mail,
  },
  {
    name: 'NFS-e',
    description: 'Nota Fiscal Eletrônica de Serviços',
    href: 'https://nfse.campogrande.ms.gov.br/',
    icon: NotebookPen,
  },
  {
    name: 'DES-IF',
    description: 'Declaração Eletrônica de Serviços',
    href: 'https://desif.campogrande.ms.gov.br/',
    icon: Building,
  },
  {
    name: 'ITBI-e',
    description: 'Transferências e cessões de imóveis',
    href: 'https://itbi-r.campogrande.ms.gov.br/itbi/paginas/portal/index.html',
    icon: FileText,
  },
];

export default function AplicacoesOnline() {
  return (
    <section className='mt-8 flex w-full justify-start px-4 sm:px-6'>
      <Card className='w-full gap-0 border border-orange-500 bg-primary/5 py-0 md:w-1/3'>
        <CardHeader className='border-b border-primary/60 py-5'>
          <CardTitle className='text-xl font-semibold text-orange-500'>
            Aplicações Online
          </CardTitle>
          <CardDescription className='text-base'>
            Selecione a aplicação ou serviço online desejado para acesso
            específico.
          </CardDescription>
        </CardHeader>

        <CardContent className='px-0'>
          {onlineApps.map(({ name, description, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='group flex items-center gap-4 border-b border-primary/20 px-6 py-4 transition-colors hover:bg-primary/10'
            >
              <Icon
                className='h-6 w-6 shrink-0 text-primary'
                aria-hidden='true'
              />
              <div className='min-w-0'>
                <p className='text-lg font-semibold leading-tight text-foreground group-hover:text-primary'>
                  {name}
                </p>
                <p className='truncate text-sm text-muted-foreground'>
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
