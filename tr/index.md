---
layout: index_tr
---

Bu uzantı, kelimelerinizi [LinguaLeo](http://lingualeo.com/)'dan CSV formatında dışa aktarmanıza olanak tanır, böylece onları başka yerde kullanabilirsin. Örneğin, bunnları [Anki](http://ankisrs.net/)'ye aktarabilirsin.

Eklenti, Lingualeo sitesindeki sözlük sayfalarına "Dışa aktar" butonu ekler. 


## Neler dışa aktarılır

- Tercümeler
- Resim URL'leri
- Transkripsiyon
- Örnek kullanım
- Telaffuz için ses dosyasının URL'i
- kelimenin dahil edildiği kelime kümeleri
- Anki'nin cloze kartları için metin
- çağrıştırma (varsa)

## Anki'ye aktar

### Bir deste ve kart türü oluşturma

Önce bir kart türü oluşturmanız gerekir

Basit yöntem: Anki içerisinden [boş kart destesi](../LingualeoWords.apkg) aç. Bu, boş bir kart destesi ve "Lingualeo Card" tipi yaratacak.

Gelişmiş yöntem: [kart tipini el ile yarat](card-template)

Bu adım sadece bir kez gereklidir.

### Kelimelerini ekle

Kelimelerini eklentiyi kullanarak indir. Her zaman tüm kelimelerini güvenli olarak dışa aktarabilirsin - Anti otomatik halledeceği için herhangi bir kopya oluşmayacaktır.
Sonra Anki içerisindeki "Dosyayı içe aktar" özelliğini aşağıdaki ayarlarda kullan.

- Tip: LinguaLeo Card
- "Allow HTML in fields" olarak ayarla
- "Update existing notes when first field matches" olarak ayarla

![Dosyayı içe aktar](/anki-leo/img/import.png)

Elinize geçtikten sonra haber kelimeleri eklemek için bu adımı tekrarlayın.
