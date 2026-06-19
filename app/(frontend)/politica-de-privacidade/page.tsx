import { buildMetadata } from '@/lib/seo'
import LegalPage from '@/components/LegalPage'

export const metadata = buildMetadata({
  title: 'Política de Privacidade',
  description:
    'Saiba como a Legal Drive coleta, usa, armazena e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
  slug: 'politica-de-privacidade',
})

export default function PoliticaDePrivacidadePage() {
  return (
    <LegalPage
      label="Privacidade"
      title="Política de Privacidade"
      intro="A Legal Drive valoriza a sua privacidade. Esta política explica, de forma transparente, quais dados coletamos, por que coletamos e como você pode exercer seus direitos, sempre em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)."
      updatedAt="19 de junho de 2026"
    >
      <h2>1. Quem somos (Controlador dos dados)</h2>
      <p>
        Este site é mantido pela <strong>Legal Drive Inteligência Jurídica</strong>, inscrita no CNPJ
        58.389.187/0001-47, com sede na Avenida Ordem e Progresso, 157, sala 1104 — Barra Funda, São
        Paulo/SP, CEP 01141-030. Para fins da LGPD, a Legal Drive atua como <strong>controladora</strong> dos
        dados pessoais tratados no domínio <strong>legaldrivemultas.com.br</strong>.
      </p>

      <h2>2. Quais dados coletamos</h2>
      <p>Coletamos apenas os dados necessários para oferecer e melhorar nossos serviços:</p>
      <ul>
        <li>
          <strong>Dados fornecidos por você:</strong> nome e e-mail ao assinar a newsletter, enviar mensagem
          pelo formulário de contato ou publicar comentários nas notícias.
        </li>
        <li>
          <strong>Dados de navegação:</strong> endereço IP, tipo de dispositivo e navegador, páginas
          visitadas e tempo de permanência, coletados de forma agregada para fins estatísticos.
        </li>
        <li>
          <strong>Cookies e tecnologias semelhantes:</strong> pequenos arquivos usados para lembrar
          preferências e medir o desempenho do site (ver item 7).
        </li>
      </ul>
      <p>
        Não coletamos intencionalmente dados sensíveis nem dados de crianças e adolescentes. Os comentários
        são públicos e não exigem cadastro — evite informar dados pessoais nesse campo.
      </p>

      <h2>3. Para que usamos seus dados</h2>
      <ul>
        <li>Responder a contatos, dúvidas e solicitações;</li>
        <li>Enviar a newsletter e comunicações que você solicitou;</li>
        <li>Exibir e moderar comentários nas notícias;</li>
        <li>Entender como o site é utilizado e aprimorar conteúdo e experiência;</li>
        <li>Cumprir obrigações legais e regulatórias.</li>
      </ul>

      <h2>4. Base legal do tratamento</h2>
      <p>
        Tratamos seus dados com fundamento nas hipóteses do art. 7º da LGPD, especialmente:{' '}
        <strong>consentimento</strong> (newsletter e comentários), <strong>execução de procedimentos
        preliminares a seu pedido</strong> (formulário de contato), <strong>legítimo interesse</strong>{' '}
        (melhoria do site e segurança) e <strong>cumprimento de obrigação legal</strong>.
      </p>

      <h2>5. Compartilhamento de dados</h2>
      <p>
        A Legal Drive <strong>não vende</strong> seus dados pessoais. Podemos compartilhá-los apenas com:
      </p>
      <ul>
        <li>Prestadores de serviço que operam a infraestrutura do site (hospedagem, e-mail, analytics), sob obrigação de confidencialidade;</li>
        <li>Autoridades públicas, quando exigido por lei ou ordem judicial.</li>
      </ul>

      <h2>6. Por quanto tempo guardamos</h2>
      <p>
        Mantemos os dados apenas pelo tempo necessário às finalidades descritas ou conforme exigido por lei.
        Você pode solicitar a exclusão a qualquer momento (ver item 8), ressalvadas as hipóteses de guarda
        obrigatória, como os registros de acesso previstos no Marco Civil da Internet (Lei nº 12.965/2014).
      </p>

      <h2>7. Cookies</h2>
      <p>
        Utilizamos cookies essenciais (para o funcionamento do site) e cookies de desempenho (para
        estatísticas de uso). Você pode bloquear ou apagar cookies nas configurações do seu navegador, mas
        algumas funcionalidades podem ser afetadas.
      </p>

      <h2>8. Seus direitos como titular</h2>
      <p>Nos termos do art. 18 da LGPD, você pode, a qualquer momento, solicitar:</p>
      <ul>
        <li>Confirmação da existência de tratamento e acesso aos seus dados;</li>
        <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
        <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
        <li>Portabilidade dos dados;</li>
        <li>Informação sobre com quem compartilhamos seus dados;</li>
        <li>Revogação do consentimento.</li>
      </ul>
      <p>
        Para exercer esses direitos, escreva para{' '}
        <a href="mailto:contato@legaldrivemultas.com.br">contato@legaldrivemultas.com.br</a>. Responderemos no
        menor prazo possível, observado o limite legal. Você também pode peticionar à Autoridade Nacional de
        Proteção de Dados (ANPD).
      </p>

      <h2>9. Segurança</h2>
      <p>
        Adotamos medidas técnicas e administrativas razoáveis para proteger seus dados contra acessos não
        autorizados, perda ou alteração. Nenhum sistema é 100% infalível, mas tratamos a segurança da
        informação com seriedade.
      </p>

      <h2>10. Alterações nesta política</h2>
      <p>
        Esta política pode ser atualizada para refletir mudanças legais ou em nossos serviços. A data da
        última atualização é sempre indicada no topo desta página. Recomendamos a revisão periódica.
      </p>
    </LegalPage>
  )
}
