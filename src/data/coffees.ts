import arabeImg from '../assets/coffees/arabe.svg'
import cafeComLeiteImg from '../assets/coffees/cafe-com-leite.svg'
import capuccinoImg from '../assets/coffees/capuccino.svg'
import chocolateQuenteImg from '../assets/coffees/chocolate-quente.svg'
import cubanoImg from '../assets/coffees/cubano.svg'
import expressoAmericanoImg from '../assets/coffees/expresso-americano.svg'
import expressoCremosoImg from '../assets/coffees/expresso-cremoso.svg'
import expressoGeladoImg from '../assets/coffees/expresso-gelado.svg'
import expressoTradicionalImg from '../assets/coffees/expresso-tradicional.svg'
import havaianoImg from '../assets/coffees/havaiano.svg'
import irlandesImg from '../assets/coffees/irlandes.svg'
import latteImg from '../assets/coffees/latte.svg'
import macchiatoImg from '../assets/coffees/macchiato.svg'
import mocaccinoImg from '../assets/coffees/mocaccino.svg'
import type { Coffee } from '../types'

export const coffees: Coffee[] = [
  {
    id: 'expresso-tradicional',
    name: 'Expresso Tradicional',
    description: 'O tradicional café feito com água quente e grãos moídos',
    priceInCents: 990,
    image: expressoTradicionalImg,
    tags: ['tradicional'],
  },
  {
    id: 'expresso-americano',
    name: 'Expresso Americano',
    description: 'Expresso diluído, menos intenso que o tradicional',
    priceInCents: 990,
    image: expressoAmericanoImg,
    tags: ['tradicional'],
  },
  {
    id: 'expresso-cremoso',
    name: 'Expresso Cremoso',
    description: 'Café expresso tradicional com espuma cremosa',
    priceInCents: 990,
    image: expressoCremosoImg,
    tags: ['tradicional'],
  },
  {
    id: 'expresso-gelado',
    name: 'Expresso Gelado',
    description: 'Bebida preparada com café expresso e cubos de gelo',
    priceInCents: 990,
    image: expressoGeladoImg,
    tags: ['tradicional', 'gelado'],
  },
  {
    id: 'cafe-com-leite',
    name: 'Café com Leite',
    description: 'Meio a meio de expresso tradicional com leite vaporizado',
    priceInCents: 990,
    image: cafeComLeiteImg,
    tags: ['tradicional', 'com leite'],
  },
  {
    id: 'latte',
    name: 'Latte',
    description: 'Uma dose de café expresso com o dobro de leite e espuma cremosa',
    priceInCents: 990,
    image: latteImg,
    tags: ['tradicional', 'com leite'],
  },
  {
    id: 'capuccino',
    name: 'Capuccino',
    description: 'Bebida com canela feita de doses iguais de café, leite e espuma',
    priceInCents: 990,
    image: capuccinoImg,
    tags: ['tradicional', 'com leite'],
  },
  {
    id: 'macchiato',
    name: 'Macchiato',
    description: 'Café expresso misturado com um pouco de leite quente e espuma',
    priceInCents: 990,
    image: macchiatoImg,
    tags: ['tradicional', 'com leite'],
  },
  {
    id: 'mocaccino',
    name: 'Mocaccino',
    description: 'Café expresso com calda de chocolate, pouco leite e espuma',
    priceInCents: 990,
    image: mocaccinoImg,
    tags: ['tradicional', 'com leite'],
  },
  {
    id: 'chocolate-quente',
    name: 'Chocolate Quente',
    description: 'Bebida feita com chocolate dissolvido no leite quente e café',
    priceInCents: 990,
    image: chocolateQuenteImg,
    tags: ['especial', 'com leite'],
  },
  {
    id: 'cubano',
    name: 'Cubano',
    description: 'Drink gelado de café expresso com rum, creme de leite e hortelã',
    priceInCents: 990,
    image: cubanoImg,
    tags: ['especial', 'alcoólico', 'gelado'],
  },
  {
    id: 'havaiano',
    name: 'Havaiano',
    description: 'Bebida adocicada preparada com café e leite de coco',
    priceInCents: 990,
    image: havaianoImg,
    tags: ['especial'],
  },
  {
    id: 'arabe',
    name: 'Árabe',
    description: 'Bebida preparada com grãos de café árabe e especiarias',
    priceInCents: 990,
    image: arabeImg,
    tags: ['especial'],
  },
  {
    id: 'irlandes',
    name: 'Irlandês',
    description: 'Bebida a base de café, uísque irlandês, açúcar e chantilly',
    priceInCents: 990,
    image: irlandesImg,
    tags: ['especial', 'alcoólico'],
  },
]
