import { definirEjemplo } from '../../ejemplos'
import { rumania } from './mapas/rumania'
import { crearProblemaGrafo } from './modelo'
import { MundoGrafo } from './MundoGrafo'

export const ejemplosGrafo = [
  definirEjemplo({
    id: 'rumania-arad-bucharest',
    titulo: 'Rumanía: de Arad a Bucharest',
    descripcion:
      'Mapa clásico de Russell & Norvig. Los sucesores se generan en orden alfabético y no se controlan los estados repetidos, así que la misma ciudad puede aparecer varias veces en el árbol.',
    algoritmoId: 'amplitud',
    problema: crearProblemaGrafo(rumania, 'arad', 'bucharest'),
    Mundo: (props) => <MundoGrafo {...props} mapa={rumania} inicio="arad" destino="bucharest" />,
  }),
]
