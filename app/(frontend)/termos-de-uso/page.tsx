import { buildMetadata } from '@/lib/seo'
import LegalPage from '@/components/LegalPage'

export const metadata = buildMetadata({
  title: 'Termos de Uso',
  description:
    'Conheça as regras de uso do portal Legal Drive: caráter informativo do conteúdo, propriedade intelectual, comentários, responsabilidades e foro.',
  slug: 'termos-de-uso',
})

export default function TermosDeUsoPage() {
  return (
    <LegalPage
      label="Legal"
      title="Termos de Uso"
      intro="Estes Termos de Uso regulam o acesso e a navegação no portal Legal Drive. Ao utilizar o site, você concorda com as condições abaixo. Leia com atenção."
      updatedAt="19 de junho de 2026"
    >
      <h2>1. Aceitação dos termos</h2>
      <p>
        O acesso e o uso do site <strong>legaldrivemultas.com.br</strong> implicam a aceitação integral
        destes Termos de Uso e da nossa{' '}
        <a href="/politica-de-privacidade">Política de Privacidade</a>. Caso não concorde com qualquer
        condição, pedimos que não utilize o portal.
      </p>

      <h2>2. Sobre o conteúdo (caráter informativo)</h2>
      <p>
        A Legal Drive é um <strong>portal de notícias e conteúdo jurídico</strong> sobre Direito de Trânsito
        (multas, CNH, radar, bafômetro e legislação). Todo o material tem finalidade{' '}
        <strong>informativa e educativa</strong> e <strong>não constitui aconselhamento jurídico</strong>,
        parecer ou recomendação para casos concretos.
      </p>
      <p>
        Cada situação possui particularidades. Antes de tomar qualquer decisão, consulte um profissional
        habilitado. A Legal Drive não se responsabiliza por decisões tomadas exclusivamente com base no
        conteúdo do site.
      </p>

      <h2>3. Propriedade intelectual</h2>
      <p>
        Os textos, a marca, o logotipo, o layout e os demais elementos do portal são protegidos por direitos
        autorais e de propriedade intelectual, pertencendo à Legal Drive ou a seus licenciantes. É permitido
        compartilhar links e citar trechos com a devida atribuição e indicação da fonte. É vedada a
        reprodução integral, a cópia ou o uso comercial sem autorização prévia e por escrito.
      </p>

      <h2>4. Conduta do usuário</h2>
      <p>Ao utilizar o site, você se compromete a não:</p>
      <ul>
        <li>Publicar conteúdo ilícito, ofensivo, difamatório, discriminatório ou que viole direitos de terceiros;</li>
        <li>Disseminar spam, vírus ou qualquer código malicioso;</li>
        <li>Tentar acessar áreas restritas, comprometer a segurança ou a disponibilidade do site;</li>
        <li>Utilizar o conteúdo para finalidades ilegais.</li>
      </ul>

      <h2>5. Comentários</h2>
      <p>
        As notícias podem permitir comentários públicos. As opiniões expressas são de responsabilidade
        exclusiva de seus autores e não refletem a posição da Legal Drive. Em conformidade com o art. 19 da
        Lei nº 12.965/2014 (Marco Civil da Internet), reservamo-nos o direito de{' '}
        <strong>moderar e remover</strong> comentários que violem estes Termos ou a legislação, a qualquer
        tempo.
      </p>

      <h2>6. Links externos e fontes</h2>
      <p>
        O portal pode citar fontes e direcionar a sites de terceiros. Não controlamos nem nos
        responsabilizamos pelo conteúdo, políticas ou práticas desses sites. O acesso a links externos é de
        responsabilidade do usuário.
      </p>

      <h2>7. Limitação de responsabilidade</h2>
      <p>
        Empenhamo-nos para manter as informações corretas e atualizadas, mas não garantimos que o conteúdo
        esteja livre de erros, omissões ou desatualização. O site é fornecido "no estado em que se encontra".
        Na máxima extensão permitida em lei, a Legal Drive não responde por danos decorrentes do uso, da
        impossibilidade de uso ou da interpretação das informações aqui publicadas.
      </p>

      <h2>8. Disponibilidade</h2>
      <p>
        Podemos alterar, suspender ou descontinuar funcionalidades do site, total ou parcialmente, sem aviso
        prévio, por motivos técnicos, de manutenção ou de força maior.
      </p>

      <h2>9. Alterações nos termos</h2>
      <p>
        Estes Termos podem ser atualizados a qualquer momento. A versão vigente é sempre a publicada nesta
        página, com a data de atualização indicada no topo. O uso contínuo do site após mudanças representa a
        sua concordância.
      </p>

      <h2>10. Legislação e foro</h2>
      <p>
        Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de São Paulo/SP para
        dirimir eventuais controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.
      </p>
    </LegalPage>
  )
}
