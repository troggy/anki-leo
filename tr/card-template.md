---
layout: basic_tr
---

# Anki kart türünü el ile oluşturun ve yapılandırın

1. Anki kart türü yarat:
  ```
Tools > Manage Note Types.. > Add
  ```

2. Yeni kart türünüz için alanlar oluşturun:
  ![Fields..](/anki-leo/img/fields.png)

3. Yeni alanları kullanması için Kart şablonunu zevkinize göre değiştirin
  
  İşte bazı örnekler.
  
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

#### Şekillendirme

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

#### Hepsi birden

  ![Cards..](/anki-leo/img/cards.png)  