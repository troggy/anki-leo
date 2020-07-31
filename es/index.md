---
layout: index_es
---
Esta extensión permite exportar tus palabras de [LinguaLeo](http://lingualeo.com/) en formato CSV para que puedas usarlas en cualquier otro sitio. Por ejemlpo, puedes importarlas en [Anki](http://ankisrs.net/).

La extensión añade el botón "Exportar" a la página del diccionario en la web de Lingualeo.

## Lo que se exporta

- traducción
- URL de la imagen
- transcripción
- ejemplo de uso (contexto)
- URL del archivo de sonido con la pronunciación
- conjuntos de palabras en las que la palabra está incluida
- texto para carta cloze Anki
- asociación (si la hay)

## Importar en Anki

### Crea un mazo y un tipo de carta
Primero tienes que crear un tipo de carta.

El método simple: abre [fichero de mazo vacío](../LingualeoWords.apkg) en Anki. Esto creará un mazo vacío y un tipo de carta "carta Lingualeo".

Método avanzado: [crear un tipo de carta manualmente](card-template)

Este paso solo es necesario una vez.

### Añade tus palabras

Descarga tus palabras usando la extensión. Puedes exportar de forma segura todas las palabras cada vez - no habrá duplicados, ya que Anki se encarga de ello automáticamente.
Luego usa "importar archivo" en Anki con las siguientes opciones:

- Tipo: Carta LinguaLeo
- Marca "Permitir HTML en campos"
- Marca "Actualizar notas existentes cuando el primer campo coincida" 

![Importar archivo](/anki-leo/img/import.png)

Repita este paso para agregar palabras nuevas una vez que las tenga.