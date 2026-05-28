import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-setup-secret')
  if (!secret || secret !== process.env.SETUP_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Cria todas as tabelas via SQL (equivale ao migrate deploy)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Category" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "color" TEXT
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Author" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "bio" TEXT,
        "avatar" TEXT
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Tag" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "slug" TEXT NOT NULL UNIQUE
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Post" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "excerpt" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "coverImage" TEXT,
        "categoryId" INTEGER NOT NULL REFERENCES "Category"("id"),
        "authorId" INTEGER NOT NULL REFERENCES "Author"("id"),
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "publishedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "metaTitle" TEXT,
        "metaDesc" TEXT,
        "youtubeUrl" TEXT,
        "readingTime" INTEGER
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "_PostToTag" (
        "A" INTEGER NOT NULL REFERENCES "Post"("id") ON DELETE CASCADE,
        "B" INTEGER NOT NULL REFERENCES "Tag"("id") ON DELETE CASCADE,
        UNIQUE("A", "B")
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Video" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "youtubeId" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "publishedAt" TIMESTAMP,
        "thumbnail" TEXT
      );
    `)

    // Seed: categorias
    const categoryData = [
      { name: 'Multas', slug: 'multas', color: '#ffb86b' },
      { name: 'CNH', slug: 'cnh', color: '#b9c7e4' },
      { name: 'Radar', slug: 'radar', color: '#ffb86b' },
      { name: 'Fiscalização', slug: 'fiscalizacao', color: '#b6c6ed' },
      { name: 'Mobilidade Elétrica', slug: 'mobilidade-eletrica', color: '#b9c7e4' },
      { name: 'Leis de Trânsito', slug: 'leis-de-transito', color: '#c5c6cd' },
      { name: 'Direitos do Motorista', slug: 'direitos-do-motorista', color: '#b9c7e4' },
      { name: 'Casos Reais', slug: 'casos-reais', color: '#ffb86b' },
      { name: 'Opinião', slug: 'opiniao', color: '#b6c6ed' },
    ]

    for (const cat of categoryData) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    }

    // Seed: autores
    await prisma.author.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Erika Chagas',
        bio: 'Founder & CEO da Legal Drive. Advogada especialista em Direito de Trânsito.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5rBR1dEUjJhUatHWzRcA74c2CFVtk4rswGY_XMkw-vhfCSddFO5LNhny-rV18j13Xg_WYz6wIWlEOMOZLk08L-ZJEL2RvRGm93vIBmUcup0Enp9_YYTvoGD-eLXvVMeg9JqcoBnTk44p20MWlbTjfcZWWkJfoEb1Ud-baLbvKl848MR9qGNGu7_20isBfUqP_ulkIfSkgnjqiQA1v7qaKAa5Mp5QKBMWmRfAw3sKf7_MQBR-pwqQ9UeEiXCi7_6sSD5TIAXkrjA',
      },
    })

    await prisma.author.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Redação Legal Drive',
        bio: 'Equipe editorial especializada em Direito de Trânsito.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVv7GbbfABmEGwmDn3DA0G6i886Id_XrB65xVahJWNaVJkupGKPAaXQhXj9YUREtj8rPmYBDxUgNlZgd8sHFA9jzFABicqeFHhttpD-_cUbjxezwftsf_TQiD9P37cCIaXlqM5FloXuluNi4YmV7kt6438VPHxF-P90_EWjH0BoqTIW0Bkupv0wsDFnYg25wdiuXkc_GiqC2plZflrX9McINsZD71-bm8LfQrFUVxGSzkuyxXkNd9uEkznq7FE73pDzpZKUB9p7Q',
      },
    })

    // Seed: posts
    const radar = await prisma.category.findUnique({ where: { slug: 'radar' } })
    const cnh = await prisma.category.findUnique({ where: { slug: 'cnh' } })
    const multas = await prisma.category.findUnique({ where: { slug: 'multas' } })
    const fiscalizacao = await prisma.category.findUnique({ where: { slug: 'fiscalizacao' } })
    const eletrica = await prisma.category.findUnique({ where: { slug: 'mobilidade-eletrica' } })
    const casos = await prisma.category.findUnique({ where: { slug: 'casos-reais' } })
    const leis = await prisma.category.findUnique({ where: { slug: 'leis-de-transito' } })
    const opiniao = await prisma.category.findUnique({ where: { slug: 'opiniao' } })

    const posts = [
      {
        title: 'Novas Regras de Radares em 2024: O que você precisa saber para evitar multas indevidas',
        slug: 'novas-regras-radares-2024',
        excerpt: 'Em 2024, novas diretrizes entraram em vigor, alterando como os radares são operados e os critérios para validade das autuações.',
        content: '<p>O cenário do trânsito brasileiro está em constante evolução. Em 2024, novas diretrizes entraram em vigor, alterando não apenas como os radares são operados, mas também os critérios para a validade das autuações.</p><h2>A Transparência como Regra de Ouro</h2><p>A nova legislação prioriza o caráter educativo. Agora, todos os radares fixos devem estar visíveis e devidamente sinalizados com placas que indiquem a velocidade máxima permitida de forma clara.</p><h2>Tipos de Radares e suas Limitações</h2><p>É fundamental distinguir entre radares fixos, móveis, estáticos e portáteis. Cada um possui um protocolo de aferição anual obrigatório pelo INMETRO.</p>',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsSXrgevMcR1CmIcKcrNa2a3b3uRqTQa67bV77bZIL3GzDen5w8DEgqtSzUwf9X4Q1rhXUxX_LyJiJGihe4xa2M66rWo75yQL4NoRhGheiFRstihIWOAOYljJtquPakU0TbbBjIZXvPk6j6hJ6d0ugy49rN5-4iP4L6769nL4BkLl1OIQUqFWTOE7IKx0NykmIB3A2yWHpMVMJ3mzK9axA1-WYSM6cXk3O463aiBkTLiEzL0Yy6TEe_VwIVo6trxcqNSpmBOsqNw',
        categoryId: radar!.id, authorId: 2, featured: true,
        publishedAt: new Date('2024-10-24'), readingTime: 8,
      },
      {
        title: 'Como evitar a suspensão da CNH em 2024: Guia Definitivo',
        slug: 'como-evitar-suspensao-cnh-2024',
        excerpt: 'Entenda as novas margens de pontuação e quais infrações levam à suspensão direta da CNH.',
        content: '<p>A suspensão da CNH é uma das maiores preocupações dos motoristas brasileiros. Com as mudanças no CTB, é fundamental entender quais infrações podem levar à perda do direito de dirigir.</p><h2>Sistema de Pontos</h2><p>O sistema de pontos da CNH é cumulativo. Quando o total atinge o limite em 12 meses, a CNH é suspensa automaticamente.</p><h2>Infrações que Geram Suspensão Direta</h2><p>Algumas infrações levam à suspensão imediata: dirigir sob efeito de álcool, excesso de velocidade acima de 50% do limite e participação em rachas.</p>',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4hGmnsQtBaOEtcrjZZtnJ7mp5SozTcJ6e9ipYy2dejuRV0pPqcqH5VAtJ2WBDfGjRvxvi6y1N3NxBwT658PSPIYD35uXj7mnOYAYgxfYDl-Vlbt9D29gJ5OpYWx-Y3Lv2Gxpv4lPc7ApD7f9I8F54wUUTocxw4b3VUbOJMq45kT3Ng3b7piqsij5epqBwNlVFspSW1o7n1c8M-kFSkyCQG58a4pHMnhB5nqtnSJlxa4bvbvVOMa_6_EArCzxHbJPTsTz6xVzlBQ',
        categoryId: cnh!.id, authorId: 1, featured: true,
        publishedAt: new Date('2024-10-20'), readingTime: 12,
      },
      {
        title: 'Como recorrer de multa por bafômetro mesmo após a recusa do teste',
        slug: 'recorrer-multa-bafometro-recusa',
        excerpt: 'Entenda os argumentos jurídicos e as falhas procedimentais que podem anular o auto de infração em casos de recusa.',
        content: '<p>A recusa ao teste do bafômetro não significa condenação automática. Existem diversas falhas procedimentais que podem invalidar a autuação.</p><h2>Seus Direitos na Abordagem</h2><p>O condutor tem o direito de não soprar o bafômetro sem que isso configure crime. A infração administrativa existe, mas pode ser contestada com base em vícios formais.</p>',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjrvFowZzdQ1NHK8nct835n47x6WGI79iiBkVdH6gcxHp6ecXiIzU23yL8Fvtzl0QMWXuxCR9MBEh2LpNl0PvhfWOOiqANSSbDWPKu3K4GI8Hv1Jg554KwPOqrPsM8rn_uTemLDwu4KD7dF6HFNyFK1svYLB2ZJKh7LphHxKOsbFH7O0uC95cueUNww3nkNv-xQkPMC5aEnBGyNhSa6u0trCJ8lFd1HQTaf-MYtYvDrPwLm2e_CvpKcyzAkIgOb2K_Ts_5ZW0Tyw',
        categoryId: multas!.id, authorId: 1, featured: false,
        publishedAt: new Date('2024-10-18'), readingTime: 7,
      },
      {
        title: 'Blitz da Lei Seca: Seus direitos e deveres durante a abordagem policial',
        slug: 'blitz-lei-seca-direitos-deveres',
        excerpt: 'Um guia prático sobre como se comportar e o que a legislação permite durante uma fiscalização.',
        content: '<p>As blitz da Lei Seca são operações frequentes nas grandes cidades. Conhecer seus direitos durante a abordagem é fundamental para evitar situações constrangedoras ou multas indevidas.</p><h2>Como se Comportar</h2><p>Mantenha a calma e pare o veículo em local seguro. Tenha sempre os documentos em mãos: CNH, CRLV e documento de identidade.</p>',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnzC-kNCCbcrcR1tcF6Wr6qp_ox9VrIFcHdfGHsuDHdWPThW2ZRHTGVeoTKCyNogDIh5qHlqxRoggiNiyz7GGs3VyBn4Isnh_fuq5pehQMIzaKdZsqUedadpVh-fZrNKgKNHGng_hGQ0diU2ZVFES8HTK6sYqTmjRie78GPezvy4HX6Ru0dHluZKWp0D1TslTcHBYuuGHW-uWrxiU9Z5K2WvP_pgHIQC0-mH22aSYsu7DYw8gbAAbiyAXgXlgYuQXTaxJ_jCMlYA',
        categoryId: fiscalizacao!.id, authorId: 2, featured: false,
        publishedAt: new Date('2024-10-15'), readingTime: 6,
      },
      {
        title: 'IPVA para Carros Elétricos: Quais estados já aplicam a isenção total?',
        slug: 'ipva-carros-eletricos-isencao',
        excerpt: 'Entenda a legislação de cada estado sobre a isenção de IPVA para veículos elétricos em 2024.',
        content: '<p>A isenção de IPVA para veículos elétricos é uma realidade em vários estados brasileiros, mas as regras variam bastante.</p><h2>Estados com Isenção Total</h2><p>São Paulo, Rio de Janeiro e Minas Gerais possuem programas específicos de incentivo à mobilidade sustentável.</p>',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb5MMVq8c7CMdR9S-Zovk1lN1sjiKjvZU8ikeS56FRVbMW_AVbW3m6QZurQ7gtlcgA4DJsYrdD89grFhJ_fnpKVwDzM-eRREiLZGjv-5c3nee9JLJ7Cd_41VanH8D7zZYKYKjZ4nXcKQ86xE3uAWiJaCjyt9xSxyzm1kQ6rXfe6tbnyV--dE2fr0O4RwqLkG46LXAq_hAma9WLb87SoPvdnsLfAv6S-Fo3RQXXmnTuIR9djuMnR9w',
        categoryId: eletrica!.id, authorId: 2, featured: false,
        publishedAt: new Date('2024-10-12'), readingTime: 5,
      },
      {
        title: 'Anulação de multa por bafômetro irregular: Caso real',
        slug: 'anulacao-multa-bafometro-caso-real',
        excerpt: 'Caso real de anulação por falta de aferição obrigatória do INMETRO no equipamento de medição.',
        content: '<p>Em um caso recente atendido pela Legal Drive, conseguimos a anulação de uma multa por infração à Lei Seca através da comprovação de que o bafômetro estava com a aferição do INMETRO vencida.</p><h2>A Estratégia Jurídica</h2><p>Com base nessa falha formal, apresentamos recurso administrativo documentado perante a JARI, que acatou o argumento e anulou a infração.</p>',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoZKxEZBb0KuYPGK9DqO8PZ7NB9sKjexgwGvsswiF45gVcyaC2K4DnsBSL6hDd4ot7gPXHNtgTG58PEcC1hA9ikAvVFQdoOr1eXE1lghFkO6Uq6BMLBtf6HvItrpLMI_1vF8FgcOI6SS1ogGfjnoAJqh31OB0Ue2hkKUh52fs5pd1LtiqEnmQtSbWs2HRtYYbb5z9LDnoIf1QeeHyUMdmeOVEtOKEvQMPwJoBebuvTTCqkvrZTKBUujsY6HfsojPhgckk0ja4QAA',
        categoryId: casos!.id, authorId: 1, featured: false,
        publishedAt: new Date('2024-10-05'), readingTime: 5,
      },
      {
        title: 'Novas regras para o Exame Toxicológico de motoristas profissionais',
        slug: 'novas-regras-exame-toxicologico',
        excerpt: 'Os prazos mudaram e a fiscalização está mais rigorosa para categorias C, D e E.',
        content: '<p>Os motoristas profissionais das categorias C, D e E devem redobrar a atenção com o exame toxicológico. As novas regras trouxeram mudanças significativas nos prazos e no processo de fiscalização.</p>',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIjv_3W2IJ-h1FWUx64SJhwnwGHpmWygjeOIAakv7qNltPFBAUQ1YuihQ2M_XxrAhowZhA5mMaj3pNXXzG9DRZoRo6rWnl34uX_g1TEtbVjwhFRfOEuHSJOlNjYSTyTxJZapIn90wwpyof_fxNXyxFSyAU0VWKfgSnKC_FyCDsghN0MbxvZ3kc8HTimMgLS3sY5sPvzQiln0LWi-hXp9WSGjo4Vb-c6GNV9WFyoWqs0acLyk0alq8-qQ4vqdaj0WDz3PT0WSNi1Q',
        categoryId: leis!.id, authorId: 2, featured: false,
        publishedAt: new Date('2024-10-01'), readingTime: 6,
      },
      {
        title: 'Drones na fiscalização: A legalidade das multas aéreas',
        slug: 'drones-fiscalizacao-legalidade',
        excerpt: 'Como drones estão sendo usados para identificar infrações e o que a lei diz sobre a validade dessas autuações.',
        content: '<p>O uso de drones para fiscalização de trânsito já é uma realidade em algumas cidades brasileiras. Mas quais são os limites legais dessa tecnologia?</p><h2>Marco Legal para Drones</h2><p>A ANAC regula o uso de drones no Brasil, mas a legislação sobre fiscalização de trânsito ainda está em consolidação.</p>',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc-e5iwgTsXzm_OgpST6XTsgMoBGGlQUEp6w-5jeLSURgIEnrYwa6I-6XQ8OORdM4iKRS6ZFMipuugOYIRxo6IBiq5a86lYoRLPM46qaFiy3WM_pT6x7tkAE513TRapqJlTVwz9vc-NcC7sJqt1nu0irQ1pAo1_YFJPF4227nIIu1qFBoYWgYqWCm6a6QDOVLEjIe934HRPDaH1-piOshT1Nb6OeiYBhmnXdUAf8KHCUHjaeT9MxeQIve5x9Ir_mEkfOVYBGYxRA',
        categoryId: fiscalizacao!.id, authorId: 2, featured: false,
        publishedAt: new Date('2024-09-28'), readingTime: 8,
      },
      {
        title: "A 'Indústria da Multa': Análise Crítica do Sistema de Fiscalização Brasileiro",
        slug: 'industria-da-multa-analise-critica',
        excerpt: 'A fiscalização eletrônica deve servir à segurança, não ao orçamento. Uma análise sobre as arrecadações.',
        content: '<p>O debate sobre a indústria da multa no Brasil ganhou novos contornos com o aumento de radares eletrônicos.</p><h2>Os Números que Preocupam</h2><p>A arrecadação com multas superou R$ 10 bilhões, mas apenas uma fração é reinvestida em segurança viária.</p>',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHaffRjnEcn6gMeGcDXfgSjkHXR-1V333uxt8xFxB55_E8C6cy857eH95XSkWsC-SnluKuRiH9p2RUDC8t-K19VQV1Pr3bd-AgI3G5Nfngx09lecU4ofgcynynyNq3WIywjPXEzbLTvsItOYJLIjGhAcZVirIhsUGCFV4Mnc8ZX7sYosWxsx9lFI2616rk7IKqBqMJEiZEv_JZX-9fiwN5jd-lWbnxIvj0YsOzIoijUStq5VaLNa8fiILz-_hoFnM037FxVwcO7w',
        categoryId: opiniao!.id, authorId: 1, featured: false,
        publishedAt: new Date('2024-09-25'), readingTime: 9,
      },
    ]

    for (const post of posts) {
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: {},
        create: post,
      })
    }

    // Seed: vídeos
    await prisma.video.upsert({
      where: { youtubeId: 'dQw4w9WgXcQ' },
      update: {},
      create: {
        title: 'Entenda a Resolução 798 do CONTRAN em 5 minutos',
        youtubeId: 'dQw4w9WgXcQ',
        description: 'Análise técnica sobre as mudanças que a Resolução 798 trouxe para os radares.',
        publishedAt: new Date('2024-10-01'),
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      },
    })

    await prisma.video.upsert({
      where: { youtubeId: 'L_jWHffIx5E' },
      update: {},
      create: {
        title: 'Documentário: O Futuro da Mobilidade e o Direito de Ir e Vir',
        youtubeId: 'L_jWHffIx5E',
        description: 'Como as novas tecnologias transformam o transporte e os desafios jurídicos.',
        publishedAt: new Date('2024-09-15'),
        thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg',
      },
    })

    await prisma.video.upsert({
      where: { youtubeId: 'kJQP7kiw5Fk' },
      update: {},
      create: {
        title: 'Bastidores da Fiscalização: Como funcionam as blitz de lei seca',
        youtubeId: 'kJQP7kiw5Fk',
        description: 'Análise técnica e jurídica sobre os procedimentos padrão dos agentes de trânsito.',
        publishedAt: new Date('2024-09-01'),
        thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      },
    })

    return Response.json({
      success: true,
      message: 'Banco populado com sucesso! Categorias, autores, posts e vídeos criados.',
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return Response.json({ success: false, error: msg }, { status: 500 })
  }
}
