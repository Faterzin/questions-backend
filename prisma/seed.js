const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const subjects = [
  {
    name: 'Matemática',
    color: '#3b82f6',
    icon: 'calculator',
    topics: {
      'Álgebra': [
        {
          title: 'Qual é o valor de x na equação 2x + 5 = 13?',
          correctAnswer: '4',
          incorrectAnswers: ['3', '5', '9'],
          difficulty: 'easy',
        },
        {
          title: 'Qual é a solução da equação x² - 5x + 6 = 0?',
          correctAnswer: 'x = 2 ou x = 3',
          incorrectAnswers: ['x = 1 ou x = 6', 'x = -2 ou x = -3', 'x = 0 ou x = 5'],
          difficulty: 'medium',
        },
        {
          title: 'Qual o valor de log₂(32)?',
          correctAnswer: '5',
          incorrectAnswers: ['4', '6', '16'],
          difficulty: 'medium',
        },
        {
          title: 'Se f(x) = 2x² - 3x + 1, qual o valor de f(2)?',
          correctAnswer: '3',
          incorrectAnswers: ['5', '7', '9'],
          difficulty: 'hard',
        },
      ],
      'Geometria': [
        {
          title: 'Qual a soma dos ângulos internos de um triângulo?',
          correctAnswer: '180°',
          incorrectAnswers: ['90°', '360°', '270°'],
          difficulty: 'easy',
        },
        {
          title: 'A área de um círculo de raio 5 cm é aproximadamente:',
          correctAnswer: '78,5 cm²',
          incorrectAnswers: ['31,4 cm²', '25 cm²', '15,7 cm²'],
          difficulty: 'medium',
        },
        {
          title: 'Num triângulo retângulo com catetos 3 e 4, a hipotenusa mede:',
          correctAnswer: '5',
          incorrectAnswers: ['6', '7', '12'],
          difficulty: 'easy',
        },
        {
          title: 'Qual o volume de uma esfera de raio 3 cm? (use π ≈ 3,14)',
          correctAnswer: '113,04 cm³',
          incorrectAnswers: ['28,26 cm³', '84,78 cm³', '56,52 cm³'],
          difficulty: 'hard',
        },
      ],
      'Estatística': [
        {
          title: 'Qual a média aritmética de 4, 6, 8 e 10?',
          correctAnswer: '7',
          incorrectAnswers: ['6', '8', '28'],
          difficulty: 'easy',
        },
        {
          title: 'A mediana do conjunto {3, 7, 2, 8, 5} é:',
          correctAnswer: '5',
          incorrectAnswers: ['3', '7', '4,5'],
          difficulty: 'medium',
        },
        {
          title: 'A moda do conjunto {2, 4, 4, 6, 8, 4, 10} é:',
          correctAnswer: '4',
          incorrectAnswers: ['6', '2', '10'],
          difficulty: 'easy',
        },
        {
          title: 'Qual o desvio padrão de um conjunto com variância 16?',
          correctAnswer: '4',
          incorrectAnswers: ['8', '2', '16'],
          difficulty: 'hard',
        },
      ],
    },
  },
  {
    name: 'Português',
    color: '#ef4444',
    icon: 'book-text',
    topics: {
      'Gramática': [
        {
          title: 'Qual é o plural correto de "cidadão"?',
          correctAnswer: 'cidadãos',
          incorrectAnswers: ['cidadões', 'cidadães', 'cidadões'],
          difficulty: 'easy',
        },
        {
          title: 'Em "Os livros estão sobre a mesa", qual é o sujeito?',
          correctAnswer: 'Os livros',
          incorrectAnswers: ['a mesa', 'estão sobre', 'sobre a mesa'],
          difficulty: 'easy',
        },
        {
          title: 'Qual alternativa contém apenas palavras oxítonas?',
          correctAnswer: 'café, sofá, jacaré',
          incorrectAnswers: ['útil, fácil, ágil', 'lâmpada, pássaro, médico', 'casa, mesa, livro'],
          difficulty: 'medium',
        },
        {
          title: 'A oração "Espero que você venha" tem uma oração subordinada:',
          correctAnswer: 'substantiva objetiva direta',
          incorrectAnswers: ['adjetiva restritiva', 'adverbial causal', 'coordenada aditiva'],
          difficulty: 'hard',
        },
      ],
      'Interpretação': [
        {
          title: 'O que significa a expressão "chorar sobre o leite derramado"?',
          correctAnswer: 'Lamentar algo que já aconteceu e não tem solução',
          incorrectAnswers: [
            'Desperdiçar alimento',
            'Reclamar de coisas pequenas',
            'Cozinhar sem atenção',
          ],
          difficulty: 'easy',
        },
        {
          title: 'Em um texto dissertativo-argumentativo, a tese é:',
          correctAnswer: 'A ideia principal que o autor defende',
          incorrectAnswers: [
            'O resumo do texto',
            'As citações de outros autores',
            'A conclusão do texto',
          ],
          difficulty: 'medium',
        },
        {
          title: 'Qual figura de linguagem há em "Seus olhos são estrelas"?',
          correctAnswer: 'Metáfora',
          incorrectAnswers: ['Metonímia', 'Hipérbole', 'Antítese'],
          difficulty: 'medium',
        },
        {
          title: '"Li Machado" no sentido de "li as obras de Machado" é exemplo de:',
          correctAnswer: 'Metonímia',
          incorrectAnswers: ['Metáfora', 'Eufemismo', 'Pleonasmo'],
          difficulty: 'hard',
        },
      ],
      'Literatura': [
        {
          title: 'Quem escreveu "Dom Casmurro"?',
          correctAnswer: 'Machado de Assis',
          incorrectAnswers: ['José de Alencar', 'Graciliano Ramos', 'Jorge Amado'],
          difficulty: 'easy',
        },
        {
          title: 'O movimento literário do Romantismo no Brasil teve início em:',
          correctAnswer: '1836, com "Suspiros Poéticos e Saudades" de Gonçalves de Magalhães',
          incorrectAnswers: [
            '1922, com a Semana de Arte Moderna',
            '1881, com "Memórias Póstumas de Brás Cubas"',
            '1902, com "Os Sertões" de Euclides da Cunha',
          ],
          difficulty: 'medium',
        },
        {
          title: 'Qual obra é representante do Modernismo brasileiro?',
          correctAnswer: 'Macunaíma, de Mário de Andrade',
          incorrectAnswers: [
            'Iracema, de José de Alencar',
            'O Guarani, de José de Alencar',
            'A Moreninha, de Joaquim Manuel de Macedo',
          ],
          difficulty: 'medium',
        },
        {
          title: 'A obra "Grande Sertão: Veredas" pertence a qual autor?',
          correctAnswer: 'João Guimarães Rosa',
          incorrectAnswers: ['Clarice Lispector', 'Carlos Drummond de Andrade', 'Euclides da Cunha'],
          difficulty: 'hard',
        },
      ],
    },
  },
  {
    name: 'História',
    color: '#f59e0b',
    icon: 'landmark',
    topics: {
      'Brasil Colônia': [
        {
          title: 'Em que ano Pedro Álvares Cabral chegou ao Brasil?',
          correctAnswer: '1500',
          incorrectAnswers: ['1498', '1502', '1492'],
          difficulty: 'easy',
        },
        {
          title: 'Qual foi o primeiro ciclo econômico do Brasil Colônia?',
          correctAnswer: 'Pau-brasil',
          incorrectAnswers: ['Açúcar', 'Ouro', 'Café'],
          difficulty: 'easy',
        },
        {
          title: 'O sistema de capitanias hereditárias foi criado em:',
          correctAnswer: '1534',
          incorrectAnswers: ['1500', '1549', '1580'],
          difficulty: 'medium',
        },
        {
          title: 'A Inconfidência Mineira (1789) teve como principal motivação:',
          correctAnswer: 'A Derrama, cobrança atrasada do quinto do ouro pela Coroa',
          incorrectAnswers: [
            'A abolição da escravatura',
            'A independência dos Estados Unidos',
            'A invasão holandesa no Nordeste',
          ],
          difficulty: 'hard',
        },
      ],
      'Brasil República': [
        {
          title: 'Em que ano foi proclamada a República no Brasil?',
          correctAnswer: '1889',
          incorrectAnswers: ['1888', '1891', '1822'],
          difficulty: 'easy',
        },
        {
          title: 'Quem foi o primeiro presidente civil eleito pelo voto direto no Brasil?',
          correctAnswer: 'Prudente de Morais',
          incorrectAnswers: ['Deodoro da Fonseca', 'Floriano Peixoto', 'Getúlio Vargas'],
          difficulty: 'medium',
        },
        {
          title: 'A Era Vargas durou de:',
          correctAnswer: '1930 a 1945',
          incorrectAnswers: ['1920 a 1930', '1945 a 1964', '1964 a 1985'],
          difficulty: 'medium',
        },
        {
          title: 'O golpe militar no Brasil ocorreu em:',
          correctAnswer: '1964',
          incorrectAnswers: ['1930', '1945', '1985'],
          difficulty: 'easy',
        },
      ],
      'História Geral': [
        {
          title: 'A Revolução Francesa começou em:',
          correctAnswer: '1789',
          incorrectAnswers: ['1776', '1799', '1815'],
          difficulty: 'easy',
        },
        {
          title: 'Qual evento marca o fim da Idade Média?',
          correctAnswer: 'Queda de Constantinopla em 1453',
          incorrectAnswers: [
            'Descoberta da América em 1492',
            'Reforma Protestante em 1517',
            'Revolução Francesa em 1789',
          ],
          difficulty: 'medium',
        },
        {
          title: 'A Segunda Guerra Mundial terminou em:',
          correctAnswer: '1945',
          incorrectAnswers: ['1918', '1939', '1948'],
          difficulty: 'easy',
        },
        {
          title: 'O Tratado de Versalhes (1919) foi assinado após:',
          correctAnswer: 'A Primeira Guerra Mundial',
          incorrectAnswers: [
            'A Segunda Guerra Mundial',
            'A Guerra Fria',
            'As Guerras Napoleônicas',
          ],
          difficulty: 'hard',
        },
      ],
    },
  },
  {
    name: 'Geografia',
    color: '#10b981',
    icon: 'globe',
    topics: {
      'Geografia do Brasil': [
        {
          title: 'Qual é a capital do Brasil?',
          correctAnswer: 'Brasília',
          incorrectAnswers: ['Rio de Janeiro', 'São Paulo', 'Salvador'],
          difficulty: 'easy',
        },
        {
          title: 'Quantos estados tem o Brasil?',
          correctAnswer: '26',
          incorrectAnswers: ['25', '27', '24'],
          difficulty: 'easy',
        },
        {
          title: 'Qual o maior bioma brasileiro em extensão?',
          correctAnswer: 'Amazônia',
          incorrectAnswers: ['Cerrado', 'Caatinga', 'Mata Atlântica'],
          difficulty: 'easy',
        },
        {
          title: 'A região Sudeste do Brasil é composta por:',
          correctAnswer: 'SP, RJ, MG e ES',
          incorrectAnswers: ['SP, RJ, MG e BA', 'SP, RJ, PR e ES', 'MG, ES, GO e DF'],
          difficulty: 'medium',
        },
      ],
      'Geografia Mundial': [
        {
          title: 'Qual é o maior oceano do mundo?',
          correctAnswer: 'Pacífico',
          incorrectAnswers: ['Atlântico', 'Índico', 'Ártico'],
          difficulty: 'easy',
        },
        {
          title: 'Qual o país mais populoso do mundo (dados recentes)?',
          correctAnswer: 'Índia',
          incorrectAnswers: ['China', 'Estados Unidos', 'Indonésia'],
          difficulty: 'medium',
        },
        {
          title: 'A Cordilheira dos Andes está localizada em qual continente?',
          correctAnswer: 'América do Sul',
          incorrectAnswers: ['América do Norte', 'Ásia', 'Europa'],
          difficulty: 'easy',
        },
        {
          title: 'O fenômeno climático conhecido como El Niño ocorre principalmente no:',
          correctAnswer: 'Oceano Pacífico equatorial',
          incorrectAnswers: [
            'Oceano Atlântico Norte',
            'Mar Mediterrâneo',
            'Oceano Índico',
          ],
          difficulty: 'hard',
        },
      ],
    },
  },
  {
    name: 'Biologia',
    color: '#22c55e',
    icon: 'dna',
    topics: {
      'Citologia': [
        {
          title: 'Qual é a unidade básica da vida?',
          correctAnswer: 'Célula',
          incorrectAnswers: ['Tecido', 'Órgão', 'Molécula'],
          difficulty: 'easy',
        },
        {
          title: 'A organela responsável pela produção de energia na célula é:',
          correctAnswer: 'Mitocôndria',
          incorrectAnswers: ['Ribossomo', 'Lisossomo', 'Complexo de Golgi'],
          difficulty: 'medium',
        },
        {
          title: 'Qual a principal diferença entre células procariontes e eucariontes?',
          correctAnswer: 'Procariontes não possuem núcleo organizado',
          incorrectAnswers: [
            'Eucariontes não possuem membrana',
            'Procariontes são maiores',
            'Eucariontes não possuem DNA',
          ],
          difficulty: 'medium',
        },
        {
          title: 'O processo pelo qual as células realizam fotossíntese ocorre em:',
          correctAnswer: 'Cloroplastos',
          incorrectAnswers: ['Mitocôndrias', 'Ribossomos', 'Núcleo'],
          difficulty: 'easy',
        },
      ],
      'Genética': [
        {
          title: 'Quem é considerado o pai da genética?',
          correctAnswer: 'Gregor Mendel',
          incorrectAnswers: ['Charles Darwin', 'Louis Pasteur', 'James Watson'],
          difficulty: 'easy',
        },
        {
          title: 'Qual a molécula que carrega a informação genética?',
          correctAnswer: 'DNA',
          incorrectAnswers: ['ATP', 'Glicose', 'Proteína'],
          difficulty: 'easy',
        },
        {
          title: 'Um indivíduo Aa é classificado como:',
          correctAnswer: 'Heterozigoto',
          incorrectAnswers: [
            'Homozigoto dominante',
            'Homozigoto recessivo',
            'Haplóide',
          ],
          difficulty: 'medium',
        },
        {
          title: 'Qual o resultado do cruzamento Aa x Aa em termos de genótipo?',
          correctAnswer: '1 AA : 2 Aa : 1 aa',
          incorrectAnswers: ['100% Aa', '3 AA : 1 aa', '1 AA : 1 aa'],
          difficulty: 'hard',
        },
      ],
      'Ecologia': [
        {
          title: 'O conjunto de seres vivos de uma mesma espécie numa mesma área é:',
          correctAnswer: 'População',
          incorrectAnswers: ['Comunidade', 'Ecossistema', 'Bioma'],
          difficulty: 'easy',
        },
        {
          title: 'Em uma cadeia alimentar, quem são os produtores?',
          correctAnswer: 'Organismos fotossintetizantes como plantas e algas',
          incorrectAnswers: [
            'Herbívoros',
            'Carnívoros de topo',
            'Decompositores',
          ],
          difficulty: 'easy',
        },
        {
          title: 'O que é uma relação de mutualismo?',
          correctAnswer: 'Interação em que ambas as espécies se beneficiam',
          incorrectAnswers: [
            'Uma espécie se beneficia e a outra é prejudicada',
            'Ambas as espécies são prejudicadas',
            'Uma espécie se beneficia e a outra é neutra',
          ],
          difficulty: 'medium',
        },
        {
          title: 'O ciclo biogeoquímico do carbono envolve principalmente:',
          correctAnswer: 'Fotossíntese, respiração, decomposição e combustão',
          incorrectAnswers: [
            'Apenas fotossíntese e respiração',
            'Apenas combustão de combustíveis fósseis',
            'Apenas decomposição de matéria orgânica',
          ],
          difficulty: 'hard',
        },
      ],
    },
  },
  {
    name: 'Física',
    color: '#8b5cf6',
    icon: 'atom',
    topics: {
      'Mecânica': [
        {
          title: 'A unidade de força no Sistema Internacional é:',
          correctAnswer: 'Newton',
          incorrectAnswers: ['Joule', 'Watt', 'Pascal'],
          difficulty: 'easy',
        },
        {
          title: 'A fórmula correta da segunda lei de Newton é:',
          correctAnswer: 'F = m · a',
          incorrectAnswers: ['F = m / a', 'F = m + a', 'F = m · v'],
          difficulty: 'easy',
        },
        {
          title: 'Um corpo cai em queda livre a partir do repouso. Após 2 s, sua velocidade é: (g = 10 m/s²)',
          correctAnswer: '20 m/s',
          incorrectAnswers: ['10 m/s', '40 m/s', '5 m/s'],
          difficulty: 'medium',
        },
        {
          title: 'A energia cinética de um corpo de massa 2 kg a 3 m/s é:',
          correctAnswer: '9 J',
          incorrectAnswers: ['6 J', '18 J', '3 J'],
          difficulty: 'hard',
        },
      ],
      'Eletricidade': [
        {
          title: 'A unidade de corrente elétrica é:',
          correctAnswer: 'Ampère',
          incorrectAnswers: ['Volt', 'Ohm', 'Watt'],
          difficulty: 'easy',
        },
        {
          title: 'Pela lei de Ohm, se V = 12 V e R = 4 Ω, qual a corrente?',
          correctAnswer: '3 A',
          incorrectAnswers: ['48 A', '16 A', '0,33 A'],
          difficulty: 'medium',
        },
        {
          title: 'Dois resistores de 6 Ω em paralelo têm resistência equivalente de:',
          correctAnswer: '3 Ω',
          incorrectAnswers: ['12 Ω', '6 Ω', '0,5 Ω'],
          difficulty: 'medium',
        },
        {
          title: 'A potência dissipada em um resistor de 10 Ω sujeito a uma corrente de 2 A é:',
          correctAnswer: '40 W',
          incorrectAnswers: ['20 W', '10 W', '100 W'],
          difficulty: 'hard',
        },
      ],
      'Termologia': [
        {
          title: 'A unidade de temperatura no Sistema Internacional é:',
          correctAnswer: 'Kelvin',
          incorrectAnswers: ['Celsius', 'Fahrenheit', 'Joule'],
          difficulty: 'easy',
        },
        {
          title: '0 °C equivale, em Kelvin, a:',
          correctAnswer: '273 K',
          incorrectAnswers: ['0 K', '100 K', '373 K'],
          difficulty: 'easy',
        },
        {
          title: 'O processo de transferência de calor por contato direto entre corpos é:',
          correctAnswer: 'Condução',
          incorrectAnswers: ['Convecção', 'Radiação', 'Irradiação'],
          difficulty: 'medium',
        },
        {
          title: 'Em uma transformação isobárica de um gás ideal, o que permanece constante?',
          correctAnswer: 'A pressão',
          incorrectAnswers: ['A temperatura', 'O volume', 'A massa'],
          difficulty: 'hard',
        },
      ],
    },
  },
  {
    name: 'Química',
    color: '#ec4899',
    icon: 'flask',
    topics: {
      'Química Geral': [
        {
          title: 'Qual é o símbolo químico do sódio?',
          correctAnswer: 'Na',
          incorrectAnswers: ['So', 'S', 'Nd'],
          difficulty: 'easy',
        },
        {
          title: 'Quantos prótons tem o átomo de oxigênio?',
          correctAnswer: '8',
          incorrectAnswers: ['6', '10', '16'],
          difficulty: 'easy',
        },
        {
          title: 'A fórmula química da água é:',
          correctAnswer: 'H₂O',
          incorrectAnswers: ['HO', 'H₂O₂', 'OH'],
          difficulty: 'easy',
        },
        {
          title: 'Um átomo com 11 prótons e 12 nêutrons tem número de massa:',
          correctAnswer: '23',
          incorrectAnswers: ['11', '12', '1'],
          difficulty: 'medium',
        },
      ],
      'Química Orgânica': [
        {
          title: 'O elemento principal da química orgânica é:',
          correctAnswer: 'Carbono',
          incorrectAnswers: ['Oxigênio', 'Nitrogênio', 'Hidrogênio'],
          difficulty: 'easy',
        },
        {
          title: 'A fórmula C₂H₆ corresponde a qual hidrocarboneto?',
          correctAnswer: 'Etano',
          incorrectAnswers: ['Metano', 'Propano', 'Eteno'],
          difficulty: 'medium',
        },
        {
          title: 'O grupo funcional —OH caracteriza:',
          correctAnswer: 'Álcool',
          incorrectAnswers: ['Ácido carboxílico', 'Éter', 'Aldeído'],
          difficulty: 'medium',
        },
        {
          title: 'Qual composto é um exemplo de hidrocarboneto aromático?',
          correctAnswer: 'Benzeno',
          incorrectAnswers: ['Etano', 'Etanol', 'Acetileno'],
          difficulty: 'hard',
        },
      ],
      'Físico-Química': [
        {
          title: 'O pH de uma solução neutra é:',
          correctAnswer: '7',
          incorrectAnswers: ['0', '14', '1'],
          difficulty: 'easy',
        },
        {
          title: 'Qual a relação entre concentração em quantidade de matéria e volume?',
          correctAnswer: 'M = n / V',
          incorrectAnswers: ['M = V / n', 'M = n · V', 'M = n + V'],
          difficulty: 'medium',
        },
        {
          title: 'A reação em que há liberação de calor é chamada:',
          correctAnswer: 'Exotérmica',
          incorrectAnswers: ['Endotérmica', 'Isotérmica', 'Adiabática'],
          difficulty: 'easy',
        },
        {
          title: 'Na equação termoquímica H₂ + ½O₂ → H₂O, ΔH = -286 kJ/mol. Isso indica:',
          correctAnswer: 'Uma reação exotérmica que libera 286 kJ por mol de água formada',
          incorrectAnswers: [
            'Uma reação endotérmica que absorve 286 kJ',
            'Uma reação em equilíbrio',
            'Uma reação espontânea sem troca de calor',
          ],
          difficulty: 'hard',
        },
      ],
    },
  },
  {
    name: 'Inglês',
    color: '#06b6d4',
    icon: 'languages',
    topics: {
      'Vocabulário': [
        {
          title: 'What is the English word for "livro"?',
          correctAnswer: 'book',
          incorrectAnswers: ['pen', 'table', 'chair'],
          difficulty: 'easy',
        },
        {
          title: 'Qual é a tradução de "yesterday"?',
          correctAnswer: 'Ontem',
          incorrectAnswers: ['Hoje', 'Amanhã', 'Depois'],
          difficulty: 'easy',
        },
        {
          title: 'Complete: "I _____ coffee every morning."',
          correctAnswer: 'drink',
          incorrectAnswers: ['drinks', 'drinking', 'drank'],
          difficulty: 'medium',
        },
        {
          title: '"Break a leg" é uma expressão que significa:',
          correctAnswer: 'Boa sorte',
          incorrectAnswers: ['Quebrar uma perna', 'Ter cuidado', 'Ficar em casa'],
          difficulty: 'hard',
        },
      ],
      'Gramática': [
        {
          title: 'Qual o passado do verbo "to go"?',
          correctAnswer: 'went',
          incorrectAnswers: ['goed', 'gone', 'going'],
          difficulty: 'easy',
        },
        {
          title: 'Complete: "She has _____ to Paris three times."',
          correctAnswer: 'been',
          incorrectAnswers: ['be', 'being', 'was'],
          difficulty: 'medium',
        },
        {
          title: 'Which sentence is in the Present Continuous?',
          correctAnswer: 'I am studying English',
          incorrectAnswers: ['I study English', 'I studied English', 'I will study English'],
          difficulty: 'easy',
        },
        {
          title: '"If I had studied, I would have passed" é um exemplo de:',
          correctAnswer: 'Third conditional',
          incorrectAnswers: [
            'Zero conditional',
            'First conditional',
            'Second conditional',
          ],
          difficulty: 'hard',
        },
      ],
    },
  },
]

async function main() {
  console.log('🧹 Limpando dados antigos...')
  await prisma.question.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.user.deleteMany()

  console.log('👤 Criando admin...')
  const hashedPassword = await bcrypt.hash('AbacateTunado2000#@', 10)
  await prisma.user.create({
    data: {
      name: 'Zenix Code',
      email: 'suporte@zenixcode.com.br',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('   ✔ suporte@zenixcode.com.br')

  let totalQuestions = 0
  for (const subjectData of subjects) {
    const subject = await prisma.subject.create({
      data: {
        name: subjectData.name,
        slug: slugify(subjectData.name),
        color: subjectData.color,
        icon: subjectData.icon,
      },
    })
    console.log(`📚 ${subject.name}`)

    for (const [topicName, questions] of Object.entries(subjectData.topics)) {
      const topic = await prisma.topic.create({
        data: {
          name: topicName,
          slug: slugify(topicName),
          subjectId: subject.id,
        },
      })

      await prisma.question.createMany({
        data: questions.map((q) => ({
          ...q,
          topicId: topic.id,
          status: 'approved',
        })),
      })
      totalQuestions += questions.length
      console.log(`   └─ ${topicName}: ${questions.length} questões`)
    }
  }

  console.log(`\n✔ Seed completo: ${subjects.length} matérias, ${totalQuestions} questões.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
