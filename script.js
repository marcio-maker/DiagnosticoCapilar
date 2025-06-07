
// Dados das perguntas

const questions = [
  {
    id: 1,
    question: "Qual é o seu tipo de cabelo?",
    options: [
      { id: 'a', text: "Liso", value: 'straight' },
      { id: 'b', text: "Ondulado", value: 'wavy' },
      { id: 'c', text: "Cacheado", value: 'curly' },
      { id: 'd', text: "Crespo", value: 'coily' }
    ]
  },
  {
    id: 2,
    question: "Como você descreveria a espessura do seu cabelo?",
    options: [
      { id: 'a', text: "Fino", value: 'thin' },
      { id: 'b', text: "Médio", value: 'medium' },
      { id: 'c', text: "Grosso", value: 'thick' }
    ]
  },
  {
    id: 3,
    question: "Qual é a condição atual do seu couro cabeludo?",
    options: [
      { id: 'a', text: "Normal", value: 'normal' },
      { id: 'b', text: "Oleoso", value: 'oily' },
      { id: 'c', text: "Seco", value: 'dry' },
      { id: 'd', text: "Sensível", value: 'sensitive' }
    ]
  },
  {
    id: 4,
    question: "Com que frequência você lava o cabelo?",
    options: [
      { id: 'a', text: "Todos os dias", value: 'daily' },
      { id: 'b', text: "Dia sim, dia não", value: 'alternate' },
      { id: 'c', text: "2-3 vezes por semana", value: 'twice_week' },
      { id: 'd', text: "1 vez por semana ou menos", value: 'weekly' }
    ]
  },
  {
    id: 5,
    question: "Seu cabelo está quimicamente tratado?",
    options: [
      { id: 'a', text: "Não", value: 'natural' },
      { id: 'b', text: "Colorido", value: 'colored' },
      { id: 'c', text: "Descolorido", value: 'bleached' },
      { id: 'd', text: "Alisado/Relaxado", value: 'chemically_treated' }
    ]
  },
  {
    id: 6,
    question: "Qual é a principal preocupação com seu cabelo?",
    options: [
      { id: 'a', text: "Falta de brilho", value: 'dull' },
      { id: 'b', text: "Frizz e volume excessivo", value: 'frizzy' },
      { id: 'c', text: "Quebra e queda", value: 'breakage' },
      { id: 'd', text: "Falta de volume", value: 'flat' }
    ]
  }
];

// Estado da aplicação
let currentQuestion = 0;
let answers = [];
let quizHistory = [];

// Elementos do DOM
const appElement = document.getElementById('app');
const quizContainer = document.getElementById('quiz-container');
const startQuizButton = document.getElementById('startQuizButton');
const heroSection = document.querySelector('.hero');

// Função para renderizar perguntas
function renderQuestionScreen() {
  const question = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion] || '';
  
  const optionsHtml = question.options.map(option => {
    const isSelected = selectedAnswer === option.value;
    const optionClass = isSelected ? 'option-button selected' : 'option-button';
    
    return `
      <button class="${optionClass}" data-value="${option.value}">
        <div class="option-content">
          <div class="option-radio ${isSelected ? 'selected' : ''}">
            ${isSelected ? '<div class="option-radio-dot"></div>' : ''}
          </div>
          <span class="option-text">${option.text}</span>
        </div>
      </button>
    `;
  }).join('');
  
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === questions.length - 1;
  
  appElement.innerHTML = `
    <div class="question-container">
      <div class="question-card">
        <h2 class="question-title">${question.question}</h2>
        <div class="options-grid">
          ${optionsHtml}
        </div>
        <div class="navigation-buttons">
          <button class="nav-button back" ${isFirstQuestion ? 'disabled' : ''}>
            <i data-lucide="chevron-left"></i>
            <span>Anterior</span>
          </button>
          <button class="nav-button next" ${!selectedAnswer ? 'disabled' : ''}>
            <span>${isLastQuestion ? 'Finalizar' : 'Próxima'}</span>
            <i data-lucide="chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Event listeners
  document.querySelectorAll('.option-button').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.dataset.value;
      answers[currentQuestion] = value;
      renderQuestionScreen();
    });
  });
  
  document.querySelector('.nav-button.next').addEventListener('click', () => {
    if (isLastQuestion) {
      const quizResult = {
        date: new Date().toISOString(),
        answers: [...answers],
        recommendations: getRecommendations(answers)
      };
      quizHistory.push(quizResult);
      localStorage.setItem('hairQuizHistory', JSON.stringify(quizHistory));
      renderResultScreen();
    } else {
      currentQuestion++;
      renderQuestionScreen();
    }
  });
  
  document.querySelector('.nav-button.back')?.addEventListener('click', () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestionScreen();
    }
  });
  
  lucide.createIcons();
}

// Função para gerar recomendações
function getRecommendations(answers) {
  const profile = {};
  answers.forEach((answer, index) => {
    profile[questions[index].id] = answer;
  });

  const recommendations = {
    kerastase: [],
    loreal: [],
    joico: []
  };

  // Função auxiliar para gerar links de afiliado (exemplo)
  const generateAffiliateLink = (brand, productName) => {
    const baseUrls = {
      kerastase: "https://mercadolivre.com.br/kerastase",
      loreal: "https://mercadolivre.com.br/loreal",
      joico: "https://mercadolivre.com.br/joico"
    };
    return `${baseUrls[brand]}/${encodeURIComponent(productName.toLowerCase().replace(/\s+/g, '-'))}`;
  };

  // Cabelos DANIFICADOS (quebra e queda)
  if (profile[6] === 'breakage') {
    // Kérastase
    recommendations.kerastase.push(
      {
        type: 'Shampoo',
        name: 'Kérastase Résistance Bain Force Architecte',
        description: 'Reconstrução para cabelos quebradiços',
        price: 'R$ 149,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Résistance Bain Force Architecte')
      },
      {
        type: 'Condicionador',
        name: 'Kérastase Résistance Fondant Force Architecte',
        description: 'Condicionador reconstrutor com ceramidas',
        price: 'R$ 169,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Résistance Fondant Force Architecte')
      },
      {
        type: 'Máscara',
        name: 'Kérastase Résistance Masque Force Architecte',
        description: 'Máscara de reconstrução intensiva',
        price: 'R$ 229,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Résistance Masque Force Architecte')
      },
      {
        type: 'Tratamento',
        name: 'Kérastase Résistance Thérapiste',
        description: 'Sérum reconstrutor para pontas duplas',
        price: 'R$ 199,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Résistance Thérapiste')
      }
    );

    // L'Oréal
    recommendations.loreal.push(
      {
        type: 'Shampoo',
        name: 'L\'Oréal Professionnel Absolut Repair Gold',
        description: 'Shampoo com proteínas e lipídios',
        price: 'R$ 89,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Absolut Repair Gold')
      },
      {
        type: 'Condicionador',
        name: 'L\'Oréal Professionnel Absolut Repair Gold Condicionador',
        description: 'Condicionador reconstrutor com queratina',
        price: 'R$ 99,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Absolut Repair Gold Condicionador')
      },
      {
        type: 'Máscara',
        name: 'L\'Oréal Professionnel Absolut Repair Gold Máscara',
        description: 'Máscara de reconstrução com óleo de cártamo',
        price: 'R$ 129,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Absolut Repair Gold Máscara')
      },
      {
        type: 'Ampola',
        name: 'L\'Oréal Professionnel Absolut Repair Cellular',
        description: 'Ampola reconstrutora com células-tronco',
        price: 'R$ 39,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Absolut Repair Cellular')
      }
    );

    // JOICO
    recommendations.joico.push(
      {
        type: 'Shampoo',
        name: 'JOICO K-PAK Shampoo',
        description: 'Reconstrução intensiva com queratina',
        price: 'R$ 120,00',
        link: generateAffiliateLink('joico', 'JOICO K-PAK Shampoo')
      },
      {
        type: 'Condicionador',
        name: 'JOICO K-PAK Conditioner',
        description: 'Condicionador reparador de danos profundos',
        price: 'R$ 130,00',
        link: generateAffiliateLink('joico', 'JOICO K-PAK Conditioner')
      },
      {
        type: 'Máscara',
        name: 'JOICO K-PAK Intense Hydrator',
        description: 'Máscara de hidratação e reconstrução',
        price: 'R$ 150,00',
        link: generateAffiliateLink('joico', 'JOICO K-PAK Intense Hydrator')
      },
      {
        type: 'Tratamento',
        name: 'JOICO Defy Damage Protective Masque',
        description: 'Proteção contra danos futuros',
        price: 'R$ 160,00',
        link: generateAffiliateLink('joico', 'JOICO Defy Damage Protective Masque')
      }
    );
  }

  // Cabelos COLORIDOS ou DESCOLORIDOS
  else if (profile[5] === 'colored' || profile[5] === 'bleached') {
    // Kérastase
    recommendations.kerastase.push(
      {
        type: 'Shampoo',
        name: 'Kérastase Chroma Absolu Bain Riche',
        description: 'Proteção de cor para cabelos coloridos',
        price: 'R$ 139,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Chroma Absolu Bain Riche')
      },
      {
        type: 'Condicionador',
        name: 'Kérastase Chroma Absolu Fondant Chromatique',
        description: 'Condicionador protetor de cor',
        price: 'R$ 159,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Chroma Absolu Fondant Chromatique')
      },
      {
        type: 'Máscara',
        name: 'Kérastase Chroma Absolu Masque Chromatique',
        description: 'Máscara nutritiva para cabelos coloridos',
        price: 'R$ 219,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Chroma Absolu Masque Chromatique')
      },
      {
        type: 'Finalizador',
        name: 'Kérastase Chroma Absolu Lait Chromatique',
        description: 'Leave-in protetor térmico e de cor',
        price: 'R$ 179,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Chroma Absolu Lait Chromatique')
      }
    );

    // L'Oréal
    recommendations.loreal.push(
      {
        type: 'Shampoo',
        name: 'L\'Oréal Professionnel Vitamino Color',
        description: 'Shampoo protetor de cor',
        price: 'R$ 79,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Vitamino Color')
      },
      {
        type: 'Condicionador',
        name: 'L\'Oréal Professionnel Vitamino Color Condicionador',
        description: 'Condicionador com filtro UV para cor',
        price: 'R$ 89,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Vitamino Color Condicionador')
      },
      {
        type: 'Máscara',
        name: 'L\'Oréal Professionnel Vitamino Color Máscara',
        description: 'Máscara de tratamento para cabelos coloridos',
        price: 'R$ 119,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Vitamino Color Máscara')
      },
      {
        type: 'Ampola',
        name: 'L\'Oréal Professionnel Vitamino Color A-Ox',
        description: 'Ampola antioxidante para cor',
        price: 'R$ 39,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Vitamino Color A-Ox')
      }
    );

    // JOICO
    recommendations.joico.push(
      {
        type: 'Shampoo',
        name: 'JOICO Color Balance',
        description: 'Neutraliza oxidação e prolonga a cor',
        price: 'R$ 110,00',
        link: generateAffiliateLink('joico', 'JOICO Color Balance')
      },
      {
        type: 'Condicionador',
        name: 'JOICO Color Endure',
        description: 'Condicionador fortalecedor para cabelos coloridos',
        price: 'R$ 120,00',
        link: generateAffiliateLink('joico', 'JOICO Color Endure')
      },
      {
        type: 'Máscara',
        name: 'JOICO Color Infuse Red',
        description: 'Máscara tonalizante para loiros e ruivos',
        price: 'R$ 140,00',
        link: generateAffiliateLink('joico', 'JOICO Color Infuse Red')
      },
      {
        type: 'Finalizador',
        name: 'JOICO Color Butter',
        description: 'Leave-in para cabelos coloridos ou descoloridos',
        price: 'R$ 95,00',
        link: generateAffiliateLink('joico', 'JOICO Color Butter')
      }
    );
  }

  // Cabelos com FRIZZ (ondulados/cacheados)
  else if (profile[6] === 'frizzy' && (profile[1] === 'wavy' || profile[1] === 'curly' || profile[1] === 'coily')) {
    // Kérastase
    recommendations.kerastase.push(
      {
        type: 'Shampoo',
        name: 'Kérastase Discipline Bain Fluidealiste',
        description: 'Shampoo anti-frizz para cabelos ondulados e cacheados',
        price: 'R$ 139,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Discipline Bain Fluidealiste')
      },
      {
        type: 'Condicionador',
        name: 'Kérastase Discipline Fondant Fluidealiste',
        description: 'Condicionador disciplinador com óleos nutritivos',
        price: 'R$ 159,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Discipline Fondant Fluidealiste')
      },
      {
        type: 'Máscara',
        name: 'Kérastase Curl Manifesto Masque',
        description: 'Máscara de hidratação para cachos definidos',
        price: 'R$ 219,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Curl Manifesto Masque')
      },
      {
        type: 'Finalizador',
        name: 'Kérastase Discipline Oléo-Relax',
        description: 'Óleo disciplinador anti-frizz',
        price: 'R$ 189,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Discipline Oléo-Relax')
      }
    );

    // L'Oréal
    recommendations.loreal.push(
      {
        type: 'Shampoo',
        name: 'L\'Oréal Professionnel Curl Expression Shampoo',
        description: 'Shampoo para controle de frizz e definição de cachos',
        price: 'R$ 89,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Curl Expression Shampoo')
      },
      {
        type: 'Condicionador',
        name: 'L\'Oréal Professionnel Curl Expression Condicionador',
        description: 'Condicionador para cachos mais definidos',
        price: 'R$ 99,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Curl Expression Condicionador')
      },
      {
        type: 'Creme',
        name: 'L\'Oréal Professionnel Curl Contour Cream',
        description: 'Creme de pentear para controle de frizz',
        price: 'R$ 119,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Curl Contour Cream')
      },
      {
        type: 'Finalizador',
        name: 'L\'Oréal Professionnel Tecni Art Fix Design',
        description: 'Gel fixador para cachos sem resíduo',
        price: 'R$ 79,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Tecni Art Fix Design')
      }
    );

    // JOICO
    recommendations.joico.push(
      {
        type: 'Shampoo',
        name: 'JOICO Moisture Recovery Shampoo',
        description: 'Shampoo hidratante para cabelos secos e frisados',
        price: 'R$ 120,00',
        link: generateAffiliateLink('joico', 'JOICO Moisture Recovery Shampoo')
      },
      {
        type: 'Condicionador',
        name: 'JOICO Moisture Recovery Conditioner',
        description: 'Condicionador ultra-hidratante',
        price: 'R$ 130,00',
        link: generateAffiliateLink('joico', 'JOICO Moisture Recovery Conditioner')
      },
      {
        type: 'Máscara',
        name: 'JOICO HydraCure Hydrating Treatment',
        description: 'Tratamento intensivo de hidratação',
        price: 'R$ 150,00',
        link: generateAffiliateLink('joico', 'JOICO HydraCure Hydrating Treatment')
      },
      {
        type: 'Óleo',
        name: 'JOICO Defy Damage Protective Oil',
        description: 'Óleo protetor anti-frizz',
        price: 'R$ 140,00',
        link: generateAffiliateLink('joico', 'JOICO Defy Damage Protective Oil')
      }
    );
  }

  // Cabelos LISOS com falta de volume
  else if (profile[6] === 'flat' && profile[1] === 'straight') {
    // Kérastase
    recommendations.kerastase.push(
      {
        type: 'Shampoo',
        name: 'Kérastase Densifique Bain Densité',
        description: 'Shampoo para volume e densidade',
        price: 'R$ 149,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Densifique Bain Densité')
      },
      {
        type: 'Condicionador',
        name: 'Kérastase Densifique Fondant Densité',
        description: 'Condicionador leve para volume',
        price: 'R$ 169,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Densifique Fondant Densité')
      },
      {
        type: 'Tratamento',
        name: 'Kérastase Densifique Masque Densité',
        description: 'Máscara para cabelos finos e sem volume',
        price: 'R$ 229,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Densifique Masque Densité')
      },
      {
        type: 'Sérum',
        name: 'Kérastase Densifique Follicle Serum',
        description: 'Sérum capilar para aumentar a densidade',
        price: 'R$ 299,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Densifique Follicle Serum')
      }
    );

    // L'Oréal
    recommendations.loreal.push(
      {
        type: 'Shampoo',
        name: 'L\'Oréal Professionnel Pro Longer Volume Shampoo',
        description: 'Shampoo para volume prolongado',
        price: 'R$ 89,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Pro Longer Volume Shampoo')
      },
      {
        type: 'Condicionador',
        name: 'L\'Oréal Professionnel Pro Longer Volume Condicionador',
        description: 'Condicionador leve para cabelos finos',
        price: 'R$ 99,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Pro Longer Volume Condicionador')
      },
      {
        type: 'Spray',
        name: 'L\'Oréal Professionnel Tecni Art Full Volume',
        description: 'Spray para volume instantâneo',
        price: 'R$ 109,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Tecni Art Full Volume')
      },
      {
        type: 'Máscara',
        name: 'L\'Oréal Professionnel Density Advanced Máscara',
        description: 'Máscara para aumentar a densidade capilar',
        price: 'R$ 129,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Density Advanced Máscara')
      }
    );

    // JOICO
    recommendations.joico.push(
      {
        type: 'Shampoo',
        name: 'JOICO Body Luxe Shampoo',
        description: 'Shampoo para volume e corpo',
        price: 'R$ 120,00',
        link: generateAffiliateLink('joico', 'JOICO Body Luxe Shampoo')
      },
      {
        type: 'Condicionador',
        name: 'JOICO Body Luxe Conditioner',
        description: 'Condicionador que não pesa',
        price: 'R$ 130,00',
        link: generateAffiliateLink('joico', 'JOICO Body Luxe Conditioner')
      },
      {
        type: 'Spray',
        name: 'JOICO JoiFull Volumizing Spray',
        description: 'Spray texturizador para volume',
        price: 'R$ 110,00',
        link: generateAffiliateLink('joico', 'JOICO JoiFull Volumizing Spray')
      },
      {
        type: 'Mousse',
        name: 'JOICO JoiFull Volumizing Mousse',
        description: 'Mousse para volume duradouro',
        price: 'R$ 115,00',
        link: generateAffiliateLink('joico', 'JOICO JoiFull Volumizing Mousse')
      }
    );
  }

  // Cabelos com FALTA DE BRILHO
  else if (profile[6] === 'dull') {
    // Kérastase
    recommendations.kerastase.push(
      {
        type: 'Shampoo',
        name: 'Kérastase Elixir Ultime Bain Oleo-Relax',
        description: 'Shampoo com óleos preciosos para brilho intenso',
        price: 'R$ 159,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Elixir Ultime Bain Oleo-Relax')
      },
      {
        type: 'Condicionador',
        name: 'Kérastase Elixir Ultime Fondant Oleo-Relax',
        description: 'Condicionador iluminador com óleos',
        price: 'R$ 179,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Elixir Ultime Fondant Oleo-Relax')
      },
      {
        type: 'Óleo',
        name: 'Kérastase Elixir Ultime Oleo-Relax',
        description: 'Óleo multitarefa para brilho extremo',
        price: 'R$ 219,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Elixir Ultime Oleo-Relax')
      },
      {
        type: 'Máscara',
        name: 'Kérastase Chronologiste Masque Reconstituant',
        description: 'Máscara reconstrutora com brilho',
        price: 'R$ 299,90',
        link: generateAffiliateLink('kerastase', 'Kérastase Chronologiste Masque Reconstituant')
      }
    );

    // L'Oréal
    recommendations.loreal.push(
      {
        type: 'Shampoo',
        name: 'L\'Oréal Professionnel Serie Expert Absolut Repair Crystal',
        description: 'Shampoo cristalizador para brilho',
        price: 'R$ 99,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Serie Expert Absolut Repair Crystal')
      },
      {
        type: 'Condicionador',
        name: 'L\'Oréal Professionnel Serie Expert Absolut Repair Crystal Condicionador',
        description: 'Condicionador que reflete a luz',
        price: 'R$ 109,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Serie Expert Absolut Repair Crystal Condicionador')
      },
      {
        type: 'Sérum',
        name: 'L\'Oréal Professionnel Mythic Oil Sérum',
        description: 'Sérum de brilho com óleo de argan',
        price: 'R$ 129,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Mythic Oil Sérum')
      },
      {
        type: 'Spray',
        name: 'L\'Oréal Professionnel Tecni Art Liss Control',
        description: 'Spray finalizador para brilho intenso',
        price: 'R$ 89,90',
        link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Tecni Art Liss Control')
      }
    );

    // JOICO
    recommendations.joico.push(
      {
        type: 'Shampoo',
        name: 'JOICO Color Endure Violet Shampoo',
        description: 'Shampoo tonalizante para loiros (remove amarelados)',
        price: 'R$ 125,00',
        link: generateAffiliateLink('joico', 'JOICO Color Endure Violet Shampoo')
      },
      {
        type: 'Condicionador',
        name: 'JOICO Color Endure Violet Conditioner',
        description: 'Condicionador tonalizante violeta',
        price: 'R$ 135,00',
        link: generateAffiliateLink('joico', 'JOICO Color Endure Violet Conditioner')
      },
      {
        type: 'Máscara',
        name: 'JOICO Blonde Life Brightening Masque',
        description: 'Máscara iluminadora para loiros',
        price: 'R$ 155,00',
        link: generateAffiliateLink('joico', 'JOICO Blonde Life Brightening Masque')
      },
      {
        type: 'Óleo',
        name: 'JOICO K-PAK Color Therapy Oil',
        description: 'Óleo de brilho para cabelos coloridos',
        price: 'R$ 140,00',
        link: generateAffiliateLink('joico', 'JOICO K-PAK Color Therapy Oil')
      }
    );
  }

  // Couro cabeludo OLEOSO
  if (profile[3] === 'oily') {
    // Adiciona produtos específicos para controle de oleosidade
    recommendations.kerastase.push({
      type: 'Shampoo',
      name: 'Kérastase Specifique Bain Divalent',
      description: 'Shampoo purificante para couro cabeludo oleoso',
      price: 'R$ 139,90',
      link: generateAffiliateLink('kerastase', 'Kérastase Specifique Bain Divalent')
    });

    recommendations.loreal.push({
      type: 'Shampoo',
      name: 'L\'Oréal Professionnel Pure Resource',
      description: 'Shampoo detox para couro cabeludo oleoso',
      price: 'R$ 89,90',
      link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Pure Resource')
    });

    recommendations.joico.push({
      type: 'Shampoo',
      name: 'JOICO Scalp Purifying Shampoo',
      description: 'Shampoo purificador para couro cabeludo oleoso',
      price: 'R$ 120,00',
      link: generateAffiliateLink('joico', 'JOICO Scalp Purifying Shampoo')
    });
  }

  // Couro cabeludo SECO
  if (profile[3] === 'dry') {
    // Adiciona produtos específicos para hidratação do couro cabeludo
    recommendations.kerastase.push({
      type: 'Tratamento',
      name: 'Kérastase Nutritive 8H Magic Night Serum',
      description: 'Tratamento noturno para couro cabeludo seco',
      price: 'R$ 199,90',
      link: generateAffiliateLink('kerastase', 'Kérastase Nutritive 8H Magic Night Serum')
    });

    recommendations.loreal.push({
      type: 'Máscara',
      name: 'L\'Oréal Professionnel Absolut Repair Gold Quinoa + Proteínas',
      description: 'Máscara nutritiva para couro cabeludo seco',
      price: 'R$ 129,90',
      link: generateAffiliateLink('loreal', 'L\'Oréal Professionnel Absolut Repair Gold Quinoa + Proteínas')
    });
  }

  return recommendations;
}
// Função para renderizar resultados
function renderResultScreen() {
  const recommendations = getRecommendations(answers);

  const resultsHtml = `
    <div class="result-container">
      <div class="result-header">
        <div class="result-icon">
          <i data-lucide="check-circle" class="w-16 h-16 text-green-500"></i>
        </div>
        <h1 class="result-title">Seu Diagnóstico Capilar</h1>
        <p class="result-subtitle">Baseado nas suas respostas, selecionamos os melhores produtos para você</p>
      </div>
      
      <div class="brand-tabs">
        <button class="tab-button active" data-brand="kerastase">Kérastase</button>
        <button class="tab-button" data-brand="loreal">L'Oréal Expert</button>
        <button class="tab-button" data-brand="joico">JOICO</button>
      </div>
      
      <div id="kerastase-results" class="brand-results active">
        ${renderBrandResults(recommendations.kerastase)}
      </div>
      <div id="loreal-results" class="brand-results">
        ${renderBrandResults(recommendations.loreal)}
      </div>
      <div id="joico-results" class="brand-results">
        ${renderBrandResults(recommendations.joico)}
      </div>
    </div>
  `;

  appElement.innerHTML = resultsHtml;

  // Event listeners para abas
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.brand-results').forEach(result => {
        result.classList.remove('active');
      });
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      document.getElementById(`${button.dataset.brand}-results`).classList.add('active');
    });
  });

  lucide.createIcons();
}

// Função auxiliar para renderizar produtos
function renderBrandResults(products) {
  if (products.length === 0) {
    return `<p class="text-center">Nenhum produto encontrado para este perfil.</p>`;
  }

  return products.map(product => `
    <div class="product-card">
      <div class="product-image">
        <i data-lucide="shampoo"></i>
      </div>
      <div class="product-content">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <span class="product-price">${product.price}</span>
        <a href="${product.link}" class="buy-button" target="_blank" rel="noopener noreferrer">Comprar Agora</a>
      </div>
    </div>
  `).join('');
}

// Iniciar quiz
function initQuiz() {
  const savedHistory = localStorage.getItem('hairQuizHistory');
  if (savedHistory) {
    quizHistory = JSON.parse(savedHistory);
  }
  currentQuestion = 0;
  answers = [];
  renderQuestionScreen();
}

// Event listeners
startQuizButton.addEventListener('click', () => {
  quizContainer.classList.remove('hidden');
  heroSection.style.display = 'none';
  initQuiz();
  window.scrollTo({
    top: quizContainer.offsetTop - 80,
    behavior: 'smooth'
  });
});

// Menu mobile
document.querySelector('.mobile-menu-button')?.addEventListener('click', () => {
  document.querySelector('.nav').classList.toggle('active');
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
});
// Voltar ao início ao clicar no logo
document.querySelector('.logo-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  
  // Esconde o quiz se estiver aberto
  quizContainer.classList.add('hidden');
  heroSection.style.display = 'block';
  startQuizButton.style.display = 'inline-block';
  
  // Rola suavemente para o topo
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // Atualiza o menu ativo
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector('.nav-link[href="#diagnostico"]').classList.add('active');
});