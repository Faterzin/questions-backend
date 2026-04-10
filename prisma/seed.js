const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  await prisma.question.deleteMany()
  await prisma.category.deleteMany()

  const html = await prisma.category.create({ data: { name: 'HTML' } })
  const css = await prisma.category.create({ data: { name: 'CSS' } })
  const js = await prisma.category.create({ data: { name: 'JavaScript' } })

  const questions = [
    // ─── HTML · easy ────────────────────────────────────────────────
    {
      title: 'O que significa a sigla HTML?',
      correctAnswer: 'HyperText Markup Language',
      incorrectAnswers: ['HyperText Machine Language', 'HighText Markup Language', 'HyperTool Markup Language'],
      difficulty: 'easy',
      categoryId: html.id,
    },
    {
      title: 'Qual tag é usada para criar um parágrafo em HTML?',
      correctAnswer: '<p>',
      incorrectAnswers: ['<paragraph>', '<text>', '<pg>'],
      difficulty: 'easy',
      categoryId: html.id,
    },
    {
      title: 'Qual tag define o título principal de uma página HTML?',
      correctAnswer: '<h1>',
      incorrectAnswers: ['<head>', '<title>', '<header>'],
      difficulty: 'easy',
      categoryId: html.id,
    },
    {
      title: 'Qual atributo da tag <img> define o texto alternativo da imagem?',
      correctAnswer: 'alt',
      incorrectAnswers: ['title', 'src', 'description'],
      difficulty: 'easy',
      categoryId: html.id,
    },
    {
      title: 'Qual tag é usada para criar um link em HTML?',
      correctAnswer: '<a>',
      incorrectAnswers: ['<link>', '<href>', '<nav>'],
      difficulty: 'easy',
      categoryId: html.id,
    },
    {
      title: 'Qual tag HTML é usada para criar uma lista não ordenada?',
      correctAnswer: '<ul>',
      incorrectAnswers: ['<ol>', '<list>', '<li>'],
      difficulty: 'easy',
      categoryId: html.id,
    },

    // ─── HTML · medium ──────────────────────────────────────────────
    {
      title: 'Qual atributo define para onde um formulário HTML envia os dados?',
      correctAnswer: 'action',
      incorrectAnswers: ['method', 'target', 'href'],
      difficulty: 'medium',
      categoryId: html.id,
    },
    {
      title: 'Qual é a tag correta para inserir um arquivo JavaScript externo?',
      correctAnswer: '<script src="file.js">',
      incorrectAnswers: ['<js src="file.js">', '<javascript href="file.js">', '<script href="file.js">'],
      difficulty: 'medium',
      categoryId: html.id,
    },
    {
      title: 'Qual tag HTML5 é usada para agrupar conteúdo de navegação?',
      correctAnswer: '<nav>',
      incorrectAnswers: ['<menu>', '<navigation>', '<header>'],
      difficulty: 'medium',
      categoryId: html.id,
    },
    {
      title: 'O que faz o atributo "defer" na tag <script>?',
      correctAnswer: 'Faz o script ser executado após o HTML ser completamente carregado',
      incorrectAnswers: [
        'Faz o script ser executado antes do HTML',
        'Desabilita o script',
        'Carrega o script de forma síncrona',
      ],
      difficulty: 'medium',
      categoryId: html.id,
    },
    {
      title: 'Qual atributo torna um campo de formulário obrigatório?',
      correctAnswer: 'required',
      incorrectAnswers: ['mandatory', 'validate', 'needed'],
      difficulty: 'medium',
      categoryId: html.id,
    },

    // ─── HTML · hard ────────────────────────────────────────────────
    {
      title: 'O que é o atributo "contenteditable" em HTML?',
      correctAnswer: 'Permite que o conteúdo do elemento seja editado pelo usuário diretamente no navegador',
      incorrectAnswers: [
        'Define que o elemento pode ser copiado',
        'Torna o elemento arrastável',
        'Permite editar o CSS do elemento pelo navegador',
      ],
      difficulty: 'hard',
      categoryId: html.id,
    },
    {
      title: 'Qual é a diferença entre os atributos "async" e "defer" em uma tag <script>?',
      correctAnswer: '"async" executa o script assim que é baixado; "defer" aguarda o HTML ser parseado',
      incorrectAnswers: [
        '"async" aguarda o HTML; "defer" executa imediatamente',
        'Ambos fazem a mesma coisa',
        '"async" é para módulos ES6; "defer" é para scripts comuns',
      ],
      difficulty: 'hard',
      categoryId: html.id,
    },
    {
      title: 'Para que serve o elemento <template> no HTML5?',
      correctAnswer: 'Armazena conteúdo HTML inerte que pode ser clonado e inserido no DOM via JavaScript',
      incorrectAnswers: [
        'Define o layout padrão da página',
        'Cria templates de e-mail',
        'Substitui o uso de iframes',
      ],
      difficulty: 'hard',
      categoryId: html.id,
    },

    // ─── CSS · easy ─────────────────────────────────────────────────
    {
      title: 'O que significa CSS?',
      correctAnswer: 'Cascading Style Sheets',
      incorrectAnswers: ['Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
      difficulty: 'easy',
      categoryId: css.id,
    },
    {
      title: 'Qual propriedade CSS define a cor do texto?',
      correctAnswer: 'color',
      incorrectAnswers: ['text-color', 'font-color', 'foreground'],
      difficulty: 'easy',
      categoryId: css.id,
    },
    {
      title: 'Qual propriedade CSS define a cor de fundo de um elemento?',
      correctAnswer: 'background-color',
      incorrectAnswers: ['bg-color', 'background', 'color-background'],
      difficulty: 'easy',
      categoryId: css.id,
    },
    {
      title: 'Como se seleciona um elemento com id "titulo" no CSS?',
      correctAnswer: '#titulo',
      incorrectAnswers: ['.titulo', 'titulo', '*titulo'],
      difficulty: 'easy',
      categoryId: css.id,
    },
    {
      title: 'Como se seleciona todos os elementos com a classe "card" no CSS?',
      correctAnswer: '.card',
      incorrectAnswers: ['#card', 'card', '*card'],
      difficulty: 'easy',
      categoryId: css.id,
    },

    // ─── CSS · medium ───────────────────────────────────────────────
    {
      title: 'Qual valor da propriedade "display" torna um elemento flexível?',
      correctAnswer: 'flex',
      incorrectAnswers: ['block', 'inline', 'grid'],
      difficulty: 'medium',
      categoryId: css.id,
    },
    {
      title: 'Qual propriedade CSS controla o espaço interno de um elemento?',
      correctAnswer: 'padding',
      incorrectAnswers: ['margin', 'spacing', 'border-spacing'],
      difficulty: 'medium',
      categoryId: css.id,
    },
    {
      title: 'Qual propriedade CSS é usada para tornar um elemento posicionado em relação ao elemento pai?',
      correctAnswer: 'position: absolute',
      incorrectAnswers: ['position: relative', 'position: fixed', 'position: static'],
      difficulty: 'medium',
      categoryId: css.id,
    },
    {
      title: 'O que faz a propriedade "z-index" no CSS?',
      correctAnswer: 'Controla a ordem de empilhamento dos elementos no eixo Z',
      incorrectAnswers: [
        'Define o zoom do elemento',
        'Controla a opacidade do elemento',
        'Define o índice de acessibilidade',
      ],
      difficulty: 'medium',
      categoryId: css.id,
    },
    {
      title: 'Qual unidade CSS é relativa ao tamanho da fonte do elemento raiz (<html>)?',
      correctAnswer: 'rem',
      incorrectAnswers: ['em', 'px', 'vh'],
      difficulty: 'medium',
      categoryId: css.id,
    },
    {
      title: 'Qual propriedade CSS é usada para criar animações?',
      correctAnswer: 'animation',
      incorrectAnswers: ['transition', 'transform', 'motion'],
      difficulty: 'medium',
      categoryId: css.id,
    },

    // ─── CSS · hard ─────────────────────────────────────────────────
    {
      title: 'O que é especificidade no CSS e como ela é calculada?',
      correctAnswer: 'É o peso de um seletor; calculado por (id, classe/atributo/pseudo-classe, elemento)',
      incorrectAnswers: [
        'É a ordem em que os estilos aparecem no arquivo',
        'É o número de propriedades que um seletor possui',
        'É definida pelo navegador automaticamente',
      ],
      difficulty: 'hard',
      categoryId: css.id,
    },
    {
      title: 'O que faz a função CSS "clamp(min, preferido, max)"?',
      correctAnswer: 'Restringe um valor entre um mínimo e um máximo, usando o valor preferido quando possível',
      incorrectAnswers: [
        'Fixa o tamanho do elemento independente da tela',
        'Cria um gradiente entre dois valores',
        'Limita o número de linhas de texto exibidas',
      ],
      difficulty: 'hard',
      categoryId: css.id,
    },
    {
      title: 'O que são CSS Custom Properties (variáveis CSS)?',
      correctAnswer: 'Variáveis definidas com -- que podem ser reutilizadas via var() em todo o stylesheet',
      incorrectAnswers: [
        'Propriedades exclusivas de navegadores específicos',
        'Funções JavaScript injetadas no CSS',
        'Classes geradas automaticamente pelo navegador',
      ],
      difficulty: 'hard',
      categoryId: css.id,
    },

    // ─── JavaScript · easy ──────────────────────────────────────────
    {
      title: 'Qual keyword é usada para declarar uma variável de escopo de bloco em JavaScript?',
      correctAnswer: 'let',
      incorrectAnswers: ['var', 'def', 'int'],
      difficulty: 'easy',
      categoryId: js.id,
    },
    {
      title: 'Como se escreve um comentário de linha única em JavaScript?',
      correctAnswer: '//',
      incorrectAnswers: ['#', '/* */', '<!-- -->'],
      difficulty: 'easy',
      categoryId: js.id,
    },
    {
      title: 'Qual método de array adiciona um elemento ao final?',
      correctAnswer: 'push()',
      incorrectAnswers: ['pop()', 'shift()', 'append()'],
      difficulty: 'easy',
      categoryId: js.id,
    },
    {
      title: 'Qual operador é usado para comparação estrita em JavaScript?',
      correctAnswer: '===',
      incorrectAnswers: ['==', '=', '!=='],
      difficulty: 'easy',
      categoryId: js.id,
    },
    {
      title: 'Como se converte uma string para número inteiro em JavaScript?',
      correctAnswer: 'parseInt()',
      incorrectAnswers: ['toInt()', 'Number.parse()', 'int()'],
      difficulty: 'easy',
      categoryId: js.id,
    },
    {
      title: 'Qual método é usado para imprimir algo no console do navegador?',
      correctAnswer: 'console.log()',
      incorrectAnswers: ['print()', 'log()', 'console.print()'],
      difficulty: 'easy',
      categoryId: js.id,
    },

    // ─── JavaScript · medium ────────────────────────────────────────
    {
      title: 'O que é hoisting em JavaScript?',
      correctAnswer: 'O comportamento de mover declarações de variáveis e funções para o topo do escopo antes da execução',
      incorrectAnswers: [
        'Uma forma de importar módulos dinamicamente',
        'O processo de converter tipos automaticamente',
        'Um método para elevar a prioridade de uma Promise',
      ],
      difficulty: 'medium',
      categoryId: js.id,
    },
    {
      title: 'O que retorna typeof null em JavaScript?',
      correctAnswer: '"object"',
      incorrectAnswers: ['"null"', '"undefined"', '"boolean"'],
      difficulty: 'medium',
      categoryId: js.id,
    },
    {
      title: 'Qual método de array retorna um novo array com os elementos que passam em um teste?',
      correctAnswer: 'filter()',
      incorrectAnswers: ['find()', 'map()', 'reduce()'],
      difficulty: 'medium',
      categoryId: js.id,
    },
    {
      title: 'O que é uma closure em JavaScript?',
      correctAnswer: 'Uma função que mantém acesso ao escopo da função onde foi criada mesmo após ela ter retornado',
      incorrectAnswers: [
        'Uma função sem parâmetros',
        'Um método para fechar conexões assíncronas',
        'Uma função que não pode ser reatribuída',
      ],
      difficulty: 'medium',
      categoryId: js.id,
    },
    {
      title: 'Qual a diferença entre "==" e "===" em JavaScript?',
      correctAnswer: '"==" compara valores com coerção de tipo; "===" compara valor e tipo sem coerção',
      incorrectAnswers: [
        'Não há diferença',
        '"===" é apenas para strings',
        '"==" é mais seguro que "==="',
      ],
      difficulty: 'medium',
      categoryId: js.id,
    },
    {
      title: 'O que faz o método Array.prototype.reduce()?',
      correctAnswer: 'Acumula todos os valores de um array em um único resultado usando uma função callback',
      incorrectAnswers: [
        'Remove duplicatas de um array',
        'Ordena os elementos do array',
        'Retorna o menor elemento do array',
      ],
      difficulty: 'medium',
      categoryId: js.id,
    },

    // ─── JavaScript · hard ──────────────────────────────────────────
    {
      title: 'O que é o Event Loop em JavaScript?',
      correctAnswer: 'Mecanismo que monitora a call stack e a callback queue, executando callbacks quando a stack está vazia',
      incorrectAnswers: [
        'Um loop infinito que escuta eventos do DOM',
        'Uma fila de Promises pendentes',
        'O ciclo de vida de componentes no React',
      ],
      difficulty: 'hard',
      categoryId: js.id,
    },
    {
      title: 'Qual é a diferença entre Promise e async/await em JavaScript?',
      correctAnswer: 'async/await é açúcar sintático sobre Promises, tornando código assíncrono mais legível e síncrono visualmente',
      incorrectAnswers: [
        'Promises são mais rápidas que async/await',
        'async/await não pode tratar erros',
        'São implementações completamente diferentes sem relação',
      ],
      difficulty: 'hard',
      categoryId: js.id,
    },
    {
      title: 'O que é o prototype chain em JavaScript?',
      correctAnswer: 'Mecanismo pelo qual objetos herdam propriedades e métodos de outros objetos através de uma cadeia de protótipos',
      incorrectAnswers: [
        'Uma lista de métodos nativos do JavaScript',
        'A ordem de execução das funções no call stack',
        'Um padrão de design para encadeamento de funções',
      ],
      difficulty: 'hard',
      categoryId: js.id,
    },
    {
      title: 'O que são Generators em JavaScript e para que servem?',
      correctAnswer: 'Funções que podem pausar e retomar sua execução usando yield, úteis para iteração lazy e controle de fluxo',
      incorrectAnswers: [
        'Funções que geram números aleatórios',
        'Construtores automáticos de classes',
        'Métodos para gerar IDs únicos',
      ],
      difficulty: 'hard',
      categoryId: js.id,
    },
  ]

  await prisma.question.createMany({ data: questions })

  console.log(`✔ ${questions.length} questões criadas com sucesso.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
