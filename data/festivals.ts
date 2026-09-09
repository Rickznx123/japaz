export type FestivalCategory = {
  name: string
  items: FestivalItem[]
}

export type FestivalItem = {
  name: string
  items?: string[]
  image?: string
}

export type FestivalInformation = {
  schedule: string[]
  children: string[]
  rules: string[]
}

export type Festival = {
  id: string
  eyebrow: string
  name: string
  description: string
  price: string
  image: string
  imageAlt: string
  accent: string
  categories: FestivalCategory[]
  information: FestivalInformation
}

const dinnerInformation: FestivalInformation = {
  schedule: ['Disponível no jantar', 'De terça a domingo'],
  children: ['0 a 5 anos: isentos', '5 a 10 anos: 30% de desconto', 'A partir de 11 anos: valor integral'],
  rules: ['O festival é individual', 'Não compartilhável', 'Evite desperdício', 'Pratique o consumo consciente'],
}

export const festivals: Festival[] = [
  {
    id: 'executivo',
    eyebrow: '01 / seleção da casa',
    name: 'Festival Executivo',
    description: 'Uma experiência completa com entradas, sushi, sobremesas, bebidas e sucos.',
    price: 'R$ 109,99',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Seleção de sushi Japaz com salmão e atum',
    accent: '#e50909',
    categories: [
      { name: 'Entradas quentes', items: [{ name: 'Croquete de salmão' }, { name: 'Tilápia empanada' }, { name: 'Harumaki de queijo' }] },
      { name: 'Entradas frias', items: [{ name: 'Ceviche Salmão' }, { name: 'Sunomono tradicional' }] },
      { name: 'Temakis', items: [{ name: 'Hot Grill' }, { name: 'Salmão Grill' }] },
      { name: 'Hossomaki', items: [{ name: 'Salmão Grill' }, { name: 'Sakemaki (salmão)' }] },
      { name: 'Uramakis', items: [{ name: 'Filadélfia' }, { name: 'Crispy porco' }, { name: 'Crispy de couve' }, { name: 'Crispy de cebola' }] },
      { name: 'Hot Roll', items: [{ name: 'Hot Crispy couve' }, { name: 'Hot Crispy Batata Doce' }, { name: 'Hot Crispy cebola' }] },
      { name: 'Nigiris', items: [{ name: 'Salmão' }, { name: 'Salmão flambado' }] },
      { name: 'Sobremesa a vontade', items: [{ name: 'Harumaki doce de leite' }, { name: 'Sorvete', items: ['Creme', 'Morango', 'Chocolate'] }] },
      { name: 'Bebida a vontade', items: [{ name: 'Guaraná zero lata' }, { name: 'Guaraná lata' }, { name: 'Água sem gás' }] },
      { name: 'Sucos', items: [{ name: 'Maracujá' }, { name: 'Abacaxi' }] },
    ],
    information: dinnerInformation,
  },
  {
    id: 'salmao',
    eyebrow: '02 / edição especial',
    name: 'Festival Salmão',
    description: 'Uma seleção especial para quem ama salmão, com sushi, entradas, sobremesas, bebidas e drinks.',
    price: 'R$ 139,99',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Sushi de salmão em seleção especial',
    accent: '#ef5c4d',
    categories: [
      { name: 'Entradas quentes', items: [{ name: 'Croquete de salmão' }, { name: 'Tilápia empanada' }, { name: 'Harumaki de queijo' }] },
      { name: 'Entradas frias', items: [{ name: 'Ceviche Salmão' }, { name: 'Sunomono tradicional' }, { name: '4 sashimi de salmão' }, { name: 'Usuzukuri de salmão' }] },
      { name: 'Temakis', items: [{ name: 'Hot Grill' }, { name: 'Salmão Grill' }, { name: 'Filadélfia' }] },
      { name: 'Hossomaki', items: [{ name: 'Salmão Grill' }, { name: 'Sakemaki (salmão)' }] },
      { name: 'Uramakis', items: [{ name: 'Filadélfia' }, { name: 'Crispy porco' }, { name: 'Crispy de couve' }, { name: 'Crispy de cebola' }] },
      { name: 'Hot Roll', items: [{ name: 'Hot Crispy couve' }, { name: 'Hot Crispy Batata Doce' }, { name: 'Hot Crispy cebola' }] },
      { name: 'Nigiris', items: [{ name: 'Salmão' }, { name: 'Salmão flambado' }] },
      { name: 'Gunkan', items: [{ name: 'Filadélfia' }, { name: 'Crispy de Batata Doce' }, { name: 'Crispy de Couve' }, { name: 'Crispy de Alho Poró' }] },
      { name: 'Sobremesa a vontade', items: [{ name: 'Harumaki doce de leite' }, { name: 'Hot sensação' }, { name: 'Sorvete', items: ['Creme', 'Morango', 'Chocolate'] }] },
      { name: 'Sucos', items: [{ name: 'Maracujá' }, { name: 'Abacaxi com hortelã' }, { name: 'Frutas vermelhas' }] },
      { name: 'Bebidas a vontade', items: [{ name: 'Guaraná lata/zero' }, { name: 'Água sem gás' }] },
      { name: 'Drinks a vontade', items: [{ name: 'Soda Italiana', items: ['Maracujá', 'Morango', 'Maçã verde', 'Frutas vermelhas', 'Pink', 'Blue'] }, { name: 'Caipirinha de limão' }] },
    ],
    information: dinnerInformation,
  },
  {
    id: 'prime',
    eyebrow: '03 / experiência autoral',
    name: 'Festival Prime',
    description: 'A experiência mais completa do Japaz, com ampla variedade de entradas, sushi, sobremesas, bebidas, sucos e drinks.',
    price: 'R$ 169,99',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Barca de sushi premium com peças variadas',
    accent: '#c9a26a',
    categories: [
      { name: 'Entradas frias', items: [{ name: 'Ceviche Salmão' }, { name: 'Sunomono tradicional' }, { name: '4 sashimi de salmão' }, { name: '4 sashimi trufado' }, { name: 'Usuzukuri de salmão' }, { name: 'Usuzukuri selado' }] },
      { name: 'Entradas quentes', items: [{ name: 'Croquete de salmão' }, { name: 'Tilápia empanada' }, { name: 'Harumaki de queijo' }, { name: 'Ebbiten do chef' }, { name: 'Pipoca de camarão' }] },
      { name: 'Temakis', items: [{ name: 'Hot Grill' }, { name: 'Salmão Grill' }, { name: 'Filadélfia' }, { name: 'salmão e doritos' }] },
      { name: 'Hossomaki', items: [{ name: 'Salmão Grill' }, { name: 'Sakemaki (salmão)' }] },
      { name: 'Uramakis', items: [{ name: 'Filadélfia' }, { name: 'Crispy porco' }, { name: 'Crispy de couve' }, { name: 'Crispy de cebola' }] },
      { name: 'Hot Roll', items: [{ name: 'Hot Crispy couve' }, { name: 'Hot Crispy Batata Doce' }, { name: 'Hot Crispy cebola' }] },
      { name: 'Nigiris', items: [{ name: 'Salmão' }, { name: 'Salmão flambado' }] },
      { name: 'Gunkan', items: [{ name: 'Filadélfia' }, { name: 'Crispy de Batata Doce' }, { name: 'Crispy de Couve' }, { name: 'Crispy de Alho poró' }] },
      { name: 'Sobremesa a vontade', items: [{ name: 'Harumaki doce de leite' }, { name: 'Hot sensação' }, { name: 'Sorvete', items: ['Creme', 'Morango', 'Chocolate'] }] },
      { name: 'Bebidas a vontade', items: [{ name: 'Coca cola lata/zero' }, { name: 'Guaraná lata/zero' }, { name: 'Fanta uva / laranja lata' }, { name: 'Água com gás/sem gás' }] },
      { name: 'Sucos', items: [{ name: 'Maracujá' }, { name: 'Abacaxi / com Hortelã' }, { name: 'Frutas vermelhas' }, { name: 'Laranja' }] },
      { name: 'Drinks a vontade', items: [{ name: 'Soda Italiana', items: ['Maracujá', 'Morango', 'Maçã verde', 'Frutas vermelhas', 'Pink', 'Blue'] }, { name: 'Caipirinha de limão' }, { name: 'Sakerinha de frutas' }] },
    ],
    information: dinnerInformation,
  },
]
