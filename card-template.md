---
layout: index
---

# Создание карточк вручную

1. Создайте новый тип карточки в Anki:

    Tools > Manage Note Types.. > Add

2. Создайте поля (Fields..) для этого типа карточки:

    ![Fields..](img/fields.png)

3. Измените шаблон карточки (Cards..) по вкусу, чтобы в нём использовались новые поля.  

    За основу можно использовать следующие шаблоны:  

    **Front template**

    {% raw %}

    ```html
    <div>{{Front}}</div>
    <div class="transcription">{{Transcription}}</div>
    {{Sound}}
    ```

    {% endraw %}

    **Back template**

    {% raw %}

    ```html
    <div>{{FrontSide}}</div>
    <hr id=answer>
    <div>{{Back}}</div>
    <div>{{Image}}</div>
    <div class="context">{{Context}}</div>
    ```

    {% endraw %}

    **Styling**

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

    ![Cards..](img/cards.png)  