---
layout: basic_en
---

# Create and configure Anki card type manually

1. Create Anki Card type:
  ```
Tools > Manage Note Types.. > Add
  ```

2. Create Fields for your new card type:
  ![Fields..](/anki-leo/img/fields.png)

3. Change Card template according to your taste, so that it uses new fields.
  
  Here are some examples.
  
#### Front template

  {% raw %}

  ```html
<div>{{Front}}</div>
<div class="transcription">{{Transcription}}</div>
{{Sound}}
  ```

  {% endraw %}

#### Back template

  {% raw %}

  ```html
<div>{{FrontSide}}</div>
<hr id=answer>
<div>{{Back}}</div>
<div>{{Image}}</div>
<div class="context">{{Context}}</div>
  ```

  {% endraw %}

#### Styling

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

#### All together

  ![Cards..](/anki-leo/img/cards.png)  