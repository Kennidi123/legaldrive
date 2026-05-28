import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'multas' }, update: {}, create: { name: 'Multas', slug: 'multas', color: '#ffb86b' } }),
    prisma.category.upsert({ where: { slug: 'cnh' }, update: {}, create: { name: 'CNH', slug: 'cnh', color: '#b9c7e4' } }),
    prisma.category.upsert({ where: { slug: 'radar' }, update: {}, create: { name: 'Radar', slug: 'radar', color: '#ffb86b' } }),
    prisma.category.upsert({ where: { slug: 'fiscalizacao' }, update: {}, create: { name: 'Fiscalização', slug: 'fiscalizacao', color: '#b6c6ed' } }),
    prisma.category.upsert({ where: { slug: 'mobilidade-eletrica' }, update: {}, create: { name: 'Mobilidade Elétrica', slug: 'mobilidade-eletrica', color: '#b9c7e4' } }),
    prisma.category.upsert({ where: { slug: 'leis-de-transito' }, update: {}, create: { name: 'Leis de Trânsito', slug: 'leis-de-transito', color: '#c5c6cd' } }),
    prisma.category.upsert({ where: { slug: 'direitos-do-motorista' }, update: {}, create: { name: 'Direitos do Motorista', slug: 'direitos-do-motorista', color: '#b9c7e4' } }),
    prisma.category.upsert({ where: { slug: 'casos-reais' }, update: {}, create: { name: 'Casos Reais', slug: 'casos-reais', color: '#ffb86b' } }),
    prisma.category.upsert({ where: { slug: 'opiniao' }, update: {}, create: { name: 'Opinião', slug: 'opiniao', color: '#b6c6ed' } }),
  ])

  const [catMultas, catCNH, catRadar, catFisc, catEletrica, catLeis, catDireitos, catCasos, catOpiniao] = categories

  // Authors
  const erika = await prisma.author.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Erika Chagas',
      bio: 'Founder & CEO da Legal Drive. Advogada especialista em Direito de Trânsito com mais de 15 anos de experiência.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5rBR1dEUjJhUatHWzRcA74c2CFVtk4rswGY_XMkw-vhfCSddFO5LNhny-rV18j13Xg_WYz6wIWlEOMOZLk08L-ZJEL2RvRGm93vIBmUcup0Enp9_YYTvoGD-eLXvVMeg9JqcoBnTk44p20MWlbTjfcZWWkJfoEb1Ud-baLbvKl848MR9qGNGu7_20isBfUqP_ulkIfSkgnjqiQA1v7qaKAa5Mp5QKBMWmRfAw3sKf7_MQBR-pwqQ9UeEiXCi7_6sSD5TIAXkrjA',
    },
  })

  const redacao = await prisma.author.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Redação Legal Drive',
      bio: 'Equipe editorial da Legal Drive, composta por especialistas em Direito de Trânsito.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVv7GbbfABmEGwmDn3DA0G6i886Id_XrB65xVahJWNaVJkupGKPAaXQhXj9YUREtj8rPmYBDxUgNlZgd8sHFA9jzFABicqeFHhttpD-_cUbjxezwftsf_TQiD9P37cCIaXlqM5FloXuluNi4YmV7kt6438VPHxF-P90_EWjH0BoqTIW0Bkupv0wsDFnYg25wdiuXkc_GiqC2plZflrX9McINsZD71-bm8LfQrFUVxGSzkuyxXkNd9uEkznq7FE73pDzpZKUB9p7Q',
    },
  })

  // Tags
  const tagCTB = await prisma.tag.upsert({ where: { slug: 'ctb' }, update: {}, create: { name: 'CTB', slug: 'ctb' } })
  const tagSNE = await prisma.tag.upsert({ where: { slug: 'sne' }, update: {}, create: { name: 'SNE', slug: 'sne' } })
  const tagINMETRO = await prisma.tag.upsert({ where: { slug: 'inmetro' }, update: {}, create: { name: 'INMETRO', slug: 'inmetro' } })
  const tagDETRAN = await prisma.tag.upsert({ where: { slug: 'detran' }, update: {}, create: { name: 'DETRAN', slug: 'detran' } })
  const tagJARI = await prisma.tag.upsert({ where: { slug: 'jari' }, update: {}, create: { name: 'JARI', slug: 'jari' } })

  // Posts
  const posts = [
    {
      title: 'Novas Regras de Radares em 2024: O que você precisa saber para evitar multas indevidas',
      slug: 'novas-regras-radares-2024',
      excerpt: 'Em 2024, novas diretrizes entraram em vigor, alterando como os radares são operados e os critérios para validade das autuações.',
      content: `<p>O cenário do trânsito brasileiro está em constante evolução, e as atualizações nas normas de fiscalização eletrônica são um dos pontos que mais geram dúvidas e insegurança nos motoristas.</p>

<h2>A Transparência como Regra de Ouro</h2>
<p>Diferente de anos anteriores, onde a "indústria da multa" era frequentemente citada por radares ocultos ou mal sinalizados, a nova legislação prioriza o caráter educativo. Agora, todos os radares fixos devem estar visíveis e devidamente sinalizados com placas que indiquem a velocidade máxima permitida de forma clara.</p>

<blockquote>O objetivo do radar na plataforma Legal Drive é sempre a segurança e a conformidade legal. Se a fiscalização foge às normas de visibilidade, o condutor tem o direito de contestar.</blockquote>

<h2>Tipos de Radares e suas Limitações</h2>
<p>É fundamental distinguir entre radares fixos, móveis, estáticos e portáteis. Cada um possui um protocolo de aferição anual obrigatório pelo INMETRO. Na Legal Drive, monitoramos essas aferições para garantir defesas técnicas sólidas.</p>

<ul>
<li><strong>Radares Fixos:</strong> Devem ter visibilidade garantida e sinalização prévia por placas R-19.</li>
<li><strong>Aferição do INMETRO:</strong> Deve ser realizada rigorosamente a cada 12 meses.</li>
<li><strong>Tolerância:</strong> O erro máximo permitido segue a tabela oficial de velocidade medida vs. velocidade considerada.</li>
</ul>`,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsSXrgevMcR1CmIcKcrNa2a3b3uRqTQa67bV77bZIL3GzDen5w8DEgqtSzUwf9X4Q1rhXUxX_LyJiJGihe4xa2M66rWo75yQL4NoRhGheiFRstihIWOAOYljJtquPakU0TbbBjIZXvPk6j6hJ6d0ugy49rN5-4iP4L6769nL4BkLl1OIQUqFWTOE7IKx0NykmIB3A2yWHpMVMJ3mzK9axA1-WYSM6cXk3O463aiBkTLiEzL0Yy6TEe_VwIVo6trxcqNSpmBOsqNw',
      categoryId: catRadar.id,
      authorId: redacao.id,
      featured: true,
      publishedAt: new Date('2024-10-24'),
      readingTime: 8,
      metaTitle: 'Novas Regras de Radares 2024 | Legal Drive',
      metaDesc: 'Entenda as novas regras de radares em 2024 e como evitar multas indevidas. Análise técnica da Resolução 798 do CONTRAN.',
      tags: { connect: [{ slug: 'inmetro' }, { slug: 'ctb' }] },
    },
    {
      title: 'Como evitar a suspensão da CNH em 2024: Guia Definitivo',
      slug: 'como-evitar-suspensao-cnh-2024',
      excerpt: 'Entenda as novas margens de pontuação e quais infrações levam à suspensão direta, independentemente da soma de pontos no prontuário do condutor.',
      content: `<p>A suspensão da CNH é uma das maiores preocupações dos motoristas brasileiros. Com as mudanças no Código de Trânsito Brasileiro, é fundamental entender quais infrações podem levar à perda do direito de dirigir.</p>

<h2>Sistema de Pontos: Como Funciona</h2>
<p>O sistema de pontos da CNH é cumulativo. Cada infração de trânsito gera pontos que são somados ao prontuário do condutor. Quando o total atinge o limite estabelecido em um período de 12 meses, a CNH é suspensa automaticamente.</p>

<h2>Limites de Pontuação por Categoria</h2>
<p>Os limites variam conforme a categoria da habilitação e o histórico do condutor. Motoristas profissionais possuem limites diferenciados e processos administrativos específicos.</p>

<h2>Infrações que Geram Suspensão Direta</h2>
<p>Algumas infrações levam à suspensão imediata da CNH, independentemente da pontuação acumulada. Entre elas estão: dirigir sob efeito de álcool, excesso de velocidade acima de 50% do limite e participação em rachas.</p>`,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4hGmnsQtBaOEtcrjZZtnJ7mp5SozTcJ6e9ipYy2dejuRV0pPqcqH5VAtJ2WBDfGjRvxvi6y1N3NxBwT658PSPIYD35uXj7mnOYAYgxfYDl-Vlbt9D29gJ5OpYWx-Y3Lv2Gxpv4lPc7ApD7f9I8F54wUUTocxw4b3VUbOJMq45kT3Ng3b7piqsij5epqBwNlVFspSW1o7n1c8M-kFSkyCQG58a4pHMnhB5nqtnSJlxa4bvbvVOMa_6_EArCzxHbJPTsTz6xVzlBQ',
      categoryId: catCNH.id,
      authorId: erika.id,
      featured: true,
      publishedAt: new Date('2024-10-20'),
      readingTime: 12,
      metaTitle: 'Como Evitar Suspensão da CNH 2024 | Legal Drive',
      metaDesc: 'Guia definitivo para evitar a suspensão da CNH em 2024. Entenda as novas margens de pontuação e defenda seus direitos.',
      tags: { connect: [{ slug: 'ctb' }, { slug: 'detran' }] },
    },
    {
      title: 'Como recorrer de multa por bafômetro mesmo após a recusa do teste',
      slug: 'recorrer-multa-bafometro-recusa',
      excerpt: 'Entenda os argumentos jurídicos e as falhas procedimentais que podem anular o auto de infração em casos de recusa ao bafômetro.',
      content: `<p>A recusa ao teste do bafômetro é prevista no Código de Trânsito Brasileiro, mas isso não significa que o condutor está automaticamente condenado. Existem diversas falhas procedimentais que podem invalidar a autuação.</p>

<h2>Seus Direitos na Abordagem</h2>
<p>O condutor tem o direito de não soprar o bafômetro sem que isso configure crime. A infração administrativa existe, mas pode ser contestada com base em vícios formais do processo.</p>

<h2>Falhas Procedimentais Comuns</h2>
<p>Entre as falhas mais frequentes que permitem a anulação da multa estão: ausência de testemunhas, equipamento sem aferição válida do INMETRO, e vícios na lavratura do auto de infração.</p>`,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjrvFowZzdQ1NHK8nct835n47x6WGI79iiBkVdH6gcxHp6ecXiIzU23yL8Fvtzl0QMWXuxCR9MBEh2LpNl0PvhfWOOiqANSSbDWPKu3K4GI8Hv1Jg554KwPOqrPsM8rn_uTemLDwu4KD7dF6HFNyFK1svYLB2ZJKh7LphHxKOsbFH7O0uC95cueUNww3nkNv-xQkPMC5aEnBGyNhSa6u0trCJ8lFd1HQTaf-MYtYvDrPwLm2e_CvpKcyzAkIgOb2K_Ts_5ZW0Tyw',
      categoryId: catMultas.id,
      authorId: erika.id,
      featured: false,
      publishedAt: new Date('2024-10-18'),
      readingTime: 7,
      tags: { connect: [{ slug: 'ctb' }, { slug: 'jari' }] },
    },
    {
      title: 'Blitz da Lei Seca: Seus direitos e deveres durante a abordagem policial',
      slug: 'blitz-lei-seca-direitos-deveres',
      excerpt: 'Um guia prático sobre como se comportar e o que a legislação permite durante uma fiscalização de trânsito urbana.',
      content: `<p>As blitz da Lei Seca são operações frequentes nas grandes cidades brasileiras. Conhecer seus direitos durante a abordagem é fundamental para evitar situações constrangedoras ou multas indevidas.</p>

<h2>Como se Comportar Durante a Abordagem</h2>
<p>Mantenha a calma e pare o veículo em local seguro quando solicitado. Tenha sempre os documentos em mãos: CNH, CRLV e documento de identidade.</p>

<h2>O que os Agentes Podem e Não Podem Fazer</h2>
<p>Os agentes de trânsito têm poderes definidos em lei. Qualquer abuso de autoridade pode e deve ser registrado e contestado por meios legais adequados.</p>`,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnzC-kNCCbcrcR1tcF6Wr6qp_ox9VrIFcHdfGHsuDHdWPThW2ZRHTGVeoTKCyNogDIh5qHlqxRoggiNiyz7GGs3VyBn4Isnh_fuq5pehQMIzaKdZsqUedadpVh-fZrNKgKNHGng_hGQ0diU2ZVFES8HTK6sYqTmjRie78GPezvy4HX6Ru0dHluZKWp0D1TslTcHBYuuGHW-uWrxiU9Z5K2WvP_pgHIQC0-mH22aSYsu7DYw8gbAAbiyAXgXlgYuQXTaxJ_jCMlYA',
      categoryId: catFisc.id,
      authorId: redacao.id,
      featured: false,
      publishedAt: new Date('2024-10-15'),
      readingTime: 6,
      tags: { connect: [{ slug: 'ctb' }] },
    },
    {
      title: 'IPVA para Carros Elétricos: Quais estados já aplicam a isenção total?',
      slug: 'ipva-carros-eletricos-isencao',
      excerpt: 'A tecnologia a favor do motorista e o que diz a lei sobre a obrigatoriedade da isenção de IPVA para veículos elétricos.',
      content: `<p>A isenção de IPVA para veículos elétricos é uma realidade em vários estados brasileiros, mas as regras variam bastante. Entender a legislação de cada estado é fundamental para quem planeja adquirir um carro elétrico.</p>

<h2>Estados com Isenção Total</h2>
<p>Alguns estados já oferecem isenção total de IPVA para veículos elétricos, como parte de políticas de incentivo à mobilidade sustentável. São Paulo, Rio de Janeiro e Minas Gerais possuem programas específicos.</p>

<h2>Como Solicitar a Isenção</h2>
<p>O processo para solicitar a isenção varia por estado, mas geralmente envolve apresentar documentação do veículo junto ao DETRAN local e comprovar que o veículo se enquadra nos critérios estabelecidos pela legislação estadual.</p>`,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb5MMVq8c7CMdR9S-Zovk1lN1sjiKjvZU8ikeS56FRVbMW_AVbW3m6QZurQ7gtlcgA4DJsYrdD89grFhJ_fnpKVwDzM-eRREiLZGjv-5c3nee9JLJ7Cd_41VanH8D7zZYKYKjZ4nXcKQ86xE3uAWiJaCjyt9xSxyzm1kQ6rXfe6tbnyV--dE2fr0O4RwqLkG46LXAq_hAma9WLb87SoPvdnsLfAv6S-Fo3RQXXmnTuIR9djuMnR9w',
      categoryId: catEletrica.id,
      authorId: redacao.id,
      featured: false,
      publishedAt: new Date('2024-10-12'),
      readingTime: 5,
      tags: { connect: [{ slug: 'detran' }] },
    },
    {
      title: 'Suspensão da CNH: O guia definitivo para recursos administrativos',
      slug: 'suspensao-cnh-guia-recursos',
      excerpt: 'A estratégia jurídica correta para reverter a perda do direito de dirigir através dos recursos administrativos disponíveis.',
      content: `<p>Quando a CNH é suspensa, o motorista possui um prazo determinado para apresentar recurso administrativo. Entender o processo e montar uma defesa sólida é fundamental para reverter a decisão.</p>

<h2>Instâncias de Recurso</h2>
<p>O processo de recurso passa por diferentes instâncias: JARI (Junta Administrativa de Recursos de Infrações), CETRAN/CONTRANDIFE e, em última instância, o Poder Judiciário.</p>

<h2>Documentação Necessária</h2>
<p>Uma defesa eficaz requer documentação completa, incluindo o auto de infração, notificações recebidas, comprovantes de infrações anteriores e qualquer evidência técnica que possa contestar a validade da autuação.</p>`,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6c2vloeTdAy3Uy-S8ovx2dFMGhqikE3pgzfJ-IfdxIcJFOrt1AKHSve8cqJ4KDRlGVIUmBkOK3GLl9uj59GjzI5N26s6IxioLZUShGmvheIxNzYFUhfdlHh4W6KXCWF1dbm0qvElfJt4bbFx2aiRh6GxN-sGA6A8dZazEDaqU0efyDsFVW__kIIq0M2GUQ5l2ePY4Cs-aRffri5Q-bBjLY1mBZCx0ix-CQbNAJ5ELo7RDG-MpVsVdce_pZFM3SWnyjifyEpEuEw',
      categoryId: catCNH.id,
      authorId: erika.id,
      featured: false,
      publishedAt: new Date('2024-10-08'),
      readingTime: 10,
      tags: { connect: [{ slug: 'jari' }, { slug: 'ctb' }] },
    },
    {
      title: 'Anulação de multa por bafômetro irregular: Caso real',
      slug: 'anulacao-multa-bafometro-caso-real',
      excerpt: 'Caso real de anulação por falta de aferição obrigatória do INMETRO no equipamento de medição de álcool.',
      content: `<p>Em um caso recente atendido pela Legal Drive, conseguimos a anulação de uma multa por infração à Lei Seca através da comprovação de que o equipamento bafômetro utilizado estava com a aferição do INMETRO vencida.</p>

<h2>Os Fatos do Caso</h2>
<p>O condutor foi abordado em uma blitz e se recusou ao teste do bafômetro. Ao analisarmos o auto de infração, identificamos que o equipamento utilizado para o teste ostensivo estava com certificação do INMETRO vencida há 3 meses.</p>

<h2>A Estratégia Jurídica</h2>
<p>Com base nessa falha formal, apresentamos recurso administrativo documentado perante a JARI, que acatou o argumento e anulou a infração. O condutor teve seus pontos devolvidos e a multa cancelada.</p>`,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoZKxEZBb0KuYPGK9DqO8PZ7NB9sKjexgwGvsswiF45gVcyaC2K4DnsBSL6hDd4ot7gPXHNtgTG58PEcC1hA9ikAvVFQdoOr1eXE1lghFkO6Uq6BMLBtf6HvItrpLMI_1vF8FgcOI6SS1ogGfjnoAJqh31OB0Ue2hkKUh52fs5pd1LtiqEnmQtSbWs2HRtYYbb5z9LDnoIf1QeeHyUMdmeOVEtOKEvQMPwJoBebuvTTCqkvrZTKBUujsY6HfsojPhgckk0ja4QAA',
      categoryId: catCasos.id,
      authorId: erika.id,
      featured: false,
      publishedAt: new Date('2024-10-05'),
      readingTime: 5,
      tags: { connect: [{ slug: 'inmetro' }, { slug: 'jari' }] },
    },
    {
      title: 'Novas regras para o Exame Toxicológico de motoristas profissionais',
      slug: 'novas-regras-exame-toxicologico',
      excerpt: 'Os prazos mudaram e a fiscalização está mais rigorosa para categorias C, D e E. Entenda o que muda e como se adequar.',
      content: `<p>Os motoristas profissionais das categorias C, D e E devem redobrar a atenção com o exame toxicológico. As novas regras trouxeram mudanças significativas nos prazos e no processo de fiscalização.</p>

<h2>Novos Prazos e Periodicidade</h2>
<p>A periodicidade do exame toxicológico foi alterada. Agora, motoristas profissionais devem realizar o exame com maior frequência, e o não cumprimento pode resultar em cassação da CNH profissional.</p>

<h2>Consequências do Descumprimento</h2>
<p>Motoristas flagrados com CNH irregular por falta do exame toxicológico estão sujeitos a multas severas, apreensão do veículo e suspensão imediata do direito de dirigir.</p>`,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIjv_3W2IJ-h1FWUx64SJhwnwGHpmWygjeOIAakv7qNltPFBAUQ1YuihQ2M_XxrAhowZhA5mMaj3pNXXzG9DRZoRo6rWnl34uX_g1TEtbVjwhFRfOEuHSJOlNjYSTyTxJZapIn90wwpyof_fxNXyxFSyAU0VWKfgSnKC_FyCDsghN0MbxvZ3kc8HTimMgLS3sY5sPvzQiln0LWi-hXp9WSGjo4Vb-c6GNV9WFyoWqs0acLyk0alq8-qQ4vqdaj0WDz3PT0WSNi1Q',
      categoryId: catLeis.id,
      authorId: redacao.id,
      featured: false,
      publishedAt: new Date('2024-10-01'),
      readingTime: 6,
      tags: { connect: [{ slug: 'ctb' }, { slug: 'detran' }] },
    },
    {
      title: 'Drones na fiscalização: A legalidade das multas aéreas',
      slug: 'drones-fiscalizacao-legalidade',
      excerpt: 'Como algoritmos e drones estão sendo usados para identificar infrações e o que a lei diz sobre a validade dessas autuações.',
      content: `<p>O uso de drones para fiscalização de trânsito já é uma realidade em algumas cidades brasileiras. Mas quais são os limites legais dessa tecnologia e como contestar multas geradas por esse tipo de monitoramento?</p>

<h2>Marco Legal para Drones</h2>
<p>A ANAC regula o uso de drones no Brasil, mas a legislação sobre o uso de aeronaves não tripuladas para fiscalização de trânsito ainda está em consolidação. Existem lacunas importantes que podem ser exploradas na defesa do condutor.</p>

<h2>Contestando Multas de Drone</h2>
<p>Para contestar uma multa gerada por drone, é necessário verificar se o órgão fiscalizador possui autorização da ANAC, se o equipamento está homologado e se as imagens possuem validade probatória reconhecida pelo órgão de trânsito.</p>`,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc-e5iwgTsXzm_OgpST6XTsgMoBGGlQUEp6w-5jeLSURgIEnrYwa6I-6XQ8OORdM4iKRS6ZFMipuugOYIRxo6IBiq5a86lYoRLPM46qaFiy3WM_pT6x7tkAE513TRapqJlTVwz9vc-NcC7sJqt1nu0irQ1pAo1_YFJPF4227nIIu1qFBoYWgYqWCm6a6QDOVLEjIe934HRPDaH1-piOshT1Nb6OeiYBhmnXdUAf8KHCUHjaeT9MxeQIve5x9Ir_mEkfOVYBGYxRA',
      categoryId: catFisc.id,
      authorId: redacao.id,
      featured: false,
      publishedAt: new Date('2024-09-28'),
      readingTime: 8,
      tags: { connect: [{ slug: 'ctb' }] },
    },
    {
      title: "A 'Indústria da Multa': Análise Crítica do Sistema de Fiscalização Brasileiro",
      slug: 'industria-da-multa-analise-critica',
      excerpt: 'A fiscalização eletrônica deve servir à segurança, não ao orçamento público. Uma análise crítica sobre o destino das arrecadações.',
      content: `<p>O debate sobre a "indústria da multa" no Brasil não é novo, mas ganhou novos contornos com o aumento significativo de radares eletrônicos nas vias urbanas e rodovias federais nos últimos anos.</p>

<h2>Os Números que Preocupam</h2>
<p>Dados do DENATRAN mostram que a arrecadação com multas de trânsito superou R$ 10 bilhões nos últimos anos, mas apenas uma fração desse valor é efetivamente reinvestida em segurança viária e manutenção de vias.</p>

<h2>A Questão da Finalidade</h2>
<p>A Constituição Federal e o CTB são claros: os recursos arrecadados com multas devem ser destinados à melhoria da segurança no trânsito. A discrepância entre o que é arrecadado e o que é investido levanta questões legítimas sobre a finalidade real da fiscalização eletrônica.</p>

<h2>O Papel do Advogado de Trânsito</h2>
<p>Nesse contexto, o advogado especializado em Direito de Trânsito tem um papel fundamental: garantir que cada autuação seja legítima, tecnicamente correta e respeite o devido processo legal administrativo.</p>`,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHaffRjnEcn6gMeGcDXfgSjkHXR-1V333uxt8xFxB55_E8C6cy857eH95XSkWsC-SnluKuRiH9p2RUDC8t-K19VQV1Pr3bd-AgI3G5Nfngx09lecU4ofgcynynyNq3WIywjPXEzbLTvsItOYJLIjGhAcZVirIhsUGCFV4Mnc8ZX7sYosWxsx9lFI2616rk7IKqBqMJEiZEv_JZX-9fiwN5jd-lWbnxIvj0YsOzIoijUStq5VaLNa8fiILz-_hoFnM037FxVwcO7w',
      categoryId: catOpiniao.id,
      authorId: erika.id,
      featured: false,
      publishedAt: new Date('2024-09-25'),
      readingTime: 9,
      tags: { connect: [{ slug: 'ctb' }] },
    },
  ]

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }

  // Videos
  await Promise.all([
    prisma.video.upsert({
      where: { youtubeId: 'dQw4w9WgXcQ' },
      update: {},
      create: {
        title: 'Entenda a Resolução 798 do CONTRAN em 5 minutos',
        youtubeId: 'dQw4w9WgXcQ',
        description: 'Análise técnica e acessível sobre as mudanças que a Resolução 798 trouxe para os radares e fiscalização eletrônica.',
        publishedAt: new Date('2024-10-01'),
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      },
    }),
    prisma.video.upsert({
      where: { youtubeId: 'L_jWHffIx5E' },
      update: {},
      create: {
        title: 'Documentário: O Futuro da Mobilidade e o Direito de Ir e Vir',
        youtubeId: 'L_jWHffIx5E',
        description: 'Uma análise profunda sobre como as novas tecnologias estão transformando o transporte e os desafios jurídicos que emergem.',
        publishedAt: new Date('2024-09-15'),
        thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg',
      },
    }),
    prisma.video.upsert({
      where: { youtubeId: 'kJQP7kiw5Fk' },
      update: {},
      create: {
        title: 'Bastidores da Fiscalização: Como funcionam as blitz de lei seca',
        youtubeId: 'kJQP7kiw5Fk',
        description: 'Uma análise técnica e jurídica sobre os procedimentos padrão dos agentes de trânsito durante as blitz da lei seca.',
        publishedAt: new Date('2024-09-01'),
        thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      },
    }),
  ])

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
