import { buildMetadata } from '@/lib/seo'
import LegalPage from '@/components/LegalPage'

export const metadata = buildMetadata({
  title: 'Compliance e Integridade',
  description:
    'Conheça o compromisso da Legal Drive com a ética, a integridade e a conformidade legal — Lei Anticorrupção, LGPD e canal de denúncias.',
  slug: 'compliance',
})

export default function CompliancePage() {
  return (
    <LegalPage
      label="Compliance"
      title="Compliance e Integridade"
      intro="A Legal Drive atua com base em princípios de ética, transparência e respeito à legislação. Esta página resume nosso compromisso com a integridade e os canais disponíveis para relatar condutas inadequadas."
      updatedAt="19 de junho de 2026"
    >
      <h2>1. Nosso compromisso</h2>
      <p>
        Acreditamos que credibilidade se constrói com conduta. A Legal Drive mantém um compromisso permanente
        com a <strong>ética</strong>, a <strong>transparência</strong> e a <strong>conformidade legal</strong>{' '}
        em todas as suas atividades, relacionamentos e publicações.
      </p>

      <h2>2. Princípios de integridade</h2>
      <ul>
        <li><strong>Legalidade:</strong> cumprimento das leis e regulamentos aplicáveis;</li>
        <li><strong>Transparência:</strong> informação clara, honesta e baseada em fontes;</li>
        <li><strong>Imparcialidade:</strong> conteúdo livre de conflitos de interesse;</li>
        <li><strong>Respeito:</strong> tratamento digno e não discriminatório a todos;</li>
        <li><strong>Responsabilidade:</strong> compromisso com a correção de eventuais erros.</li>
      </ul>

      <h2>3. Conformidade legal</h2>
      <p>A Legal Drive orienta suas práticas, entre outras, pelas seguintes normas:</p>
      <ul>
        <li>
          <strong>Lei Anticorrupção (Lei nº 12.846/2013):</strong> repúdio a qualquer forma de corrupção,
          suborno ou vantagem indevida, pública ou privada;
        </li>
        <li>
          <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD):</strong> tratamento responsável
          de dados pessoais (ver nossa <a href="/politica-de-privacidade">Política de Privacidade</a>);
        </li>
        <li>
          <strong>Marco Civil da Internet (Lei nº 12.965/2014):</strong> uso responsável da internet e dos
          registros de acesso;
        </li>
        <li>
          <strong>Código de Defesa do Consumidor (Lei nº 8.078/1990):</strong> respeito aos direitos de quem
          consome nosso conteúdo e serviços.
        </li>
      </ul>

      <h2>4. Prevenção a fraudes e conflitos de interesse</h2>
      <p>
        Não toleramos fraudes, propaganda enganosa ou a publicação de conteúdo com o objetivo de induzir o
        leitor a erro. Eventuais conteúdos patrocinados são identificados como tal. Decisões editoriais são
        tomadas com independência em relação a interesses comerciais.
      </p>

      <h2>5. Proteção de dados</h2>
      <p>
        A segurança da informação é parte central do nosso programa de integridade. Adotamos medidas técnicas
        e organizacionais para proteger os dados de usuários, colaboradores e parceiros, conforme detalhado na
        nossa Política de Privacidade.
      </p>

      <h2>6. Canal de ética e denúncias</h2>
      <p>
        Se você presenciou ou suspeita de qualquer conduta que viole estes princípios — internamente ou em
        nossas publicações —, conte para a gente. As manifestações são recebidas pelo e-mail{' '}
        <a href="mailto:contato@legaldrivemultas.com.br">contato@legaldrivemultas.com.br</a> e tratadas com{' '}
        <strong>confidencialidade</strong>. Não toleramos retaliação contra quem reporta de boa-fé.
      </p>

      <h2>7. Atualizações</h2>
      <p>
        Este documento pode ser revisado periodicamente para refletir a evolução das boas práticas e da
        legislação. A data da última atualização consta no topo desta página.
      </p>
    </LegalPage>
  )
}
