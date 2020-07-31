---
layout: basic_es
---

# Crear y configurar el tipo de carta Anki manualmente

1. Crear tipo de carta Anki:
  ```
Herramientas > Gestionar tipos de notas.. > Añadir
  ```

2. Crea campos para tu nuevo tipo de carta:
  ![Campos..](/anki-leo/img/fields.png)

3. Cambia la plantilla de la carta de acuerdo a tu gusto, para que use nuevos campos.
  
  Aquí hay algunos ejemplos.
  
#### Plantilla frontal

  {% raw %}

  ```html
<div>{{Front}}</div>
<div class="transcription">{{Transcription}}</div>
{{Sound}}
  ```

  {% endraw %}

#### Plantilla trasera

  {% raw %}

  ```html
<div>{{FrontSide}}</div>
<hr id=answer>
<div>{{Back}}</div>
<div>{{Image}}</div>
<div class="context">{{Context}}</div>
  ```

  {% endraw %}

#### Estilo

  {% raw %}

  ```css
.card {
  font-family: arial;
  font-size: 16pt;
  text-align: center;
  color: black;
  background-color: white;
}

.transcription {
  font-size: 12pt;
}

.context {
  font-style: italic;
  font-size: 12pt;
}
  ```

  {% endraw %}

#### Todo junto

  ![Cartas..](/anki-leo/img/cards.png)  