---
layout: basic
---

# Создание карточек вручную

1. Создайте новый тип карточки в Anki через меню:
  ```
Tools > Manage Note Types.. > Add
  ```

2. Создайте поля (Fields..) для этого типа карточки:
  ![Fields..](/ankileo/img/fields.png)

3. Измените шаблон карточки (Cards..) по вкусу, чтобы в нём использовались новые поля.  
  
  Вот примеры шаблонов для основы.  
  
#### Шаблон лицевой стороны

  {% raw %}

  ```html
<div>{{Front}}</div>
<div class="transcription">{{Transcription}}</div>
{{Sound}}
  ```

  {% endraw %}

#### Шаблон обратной стороны

  {% raw %}

  ```html
<div>{{FrontSide}}</div>
<hr id=answer>
<div>{{Back}}</div>
<div>{{Image}}</div>
<div class="context">{{Context}}</div>
  ```

  {% endraw %}

#### Таблица стилей

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

#### Всё вместе

  ![Cards..](/ankileo/img/cards.png)  