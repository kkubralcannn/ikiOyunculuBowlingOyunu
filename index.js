let oyuncu1 = [];
let oyuncu2 = [];

// atisları kullanıcıdan alma fonksiyonu

function oyuncuAtisAl(oyuncuAdi, dizi) {
    for (let frame = 1; frame <= 10; frame++) {
        let ilkAtis = parseInt(prompt(`${oyuncuAdi} - ${frame}.Frame - İlk atiş:`));

        if (ilkAtis === 10 && frame < 10) {
            dizi.push([10]); // Strike
        } else {
            let ikinciAtis = parseInt(prompt(`${oyuncuAdi} - ${frame}. Frame - İkinci atis:`));
            if (frame < 10) {
                dizi.push([ilkAtis, ikinciAtis]); //frame toplama durumunu burda ısın ıcıne katmıyoruz.SPARE DURUMU
            } else {
                // 10. Frame özel durumu
                if (ilkAtis === 10) {
                    let ikinciAtis = parseInt(prompt(`${oyuncuAdi} - 10. Frame - İkinci atis:`));
                    let ucuncuAtis = parseInt(prompt(`${oyuncuAdi} - 10. Frame - Üçüncü atis:`));
                    dizi.push([ilkAtis, ikinciAtis, ucuncuAtis]);
                } else if (ilkAtis + ikinciAtis === 10) {
                    let ucuncuAtis = parseInt(prompt(`${oyuncuAdi} - 10. Frame - Üçüncü atis:`));
                    dizi.push([ilkAtis, ikinciAtis, ucuncuAtis]); // Spare
                } else {
                    dizi.push([ilkAtis, ikinciAtis]);
                }
            }
        }
    }
}

// Oyuncunun atışlarına göre her frame'in puanını hesaplayan fonksiyon
function puanHesapla(dizi) {

    let toplam = 0; // O ana kadarki toplam skoru tutar
    let framePuanlari = []; // Her frame’in skor bilgisini tutacak dizi

    // Bowling 10 frame'den oluşur
    for (let i = 0; i < 10; i++) {
        let atislar = dizi[i]; // O anki frame’de yapılan atışlar (örnek: [10] ya da [4,6])
        let framePuan = 0;             // Bu frame’in puanı
        let aciklama = "Normal";       // Varsayılan açıklama: normal (strike veya spare değil)

        // STRIKE durumu (ilk atış 10 puan ise)
        if (atislar[0] === 10) {

            // Sonraki 2 atış bonus olarak eklenecek, bu yüzden sonraki frame'lere bakıyoruz

            let sonraki1 = dizi[i + 1] || [0]; // Sonraki frame yoksa 0 al
            let sonraki2 = dizi[i + 2] || [0];  // 2 sonraki frame de strike olursa bu lazım
            let bonus = 0; // Strike bonusu için toplam 2 atış gerekir

            // Eğer sonraki frame tek atış yaptıysa (örnek: [10]), sonra2’den bir atış daha alınır
            if (sonraki1.length === 1) {
                bonus = sonraki1[0] + (sonraki2[0] || 0);
            } else {
                // Yoksa sonraki frame'den iki atışı birden alırız
                bonus = sonraki1[0] + sonraki1[1];
            }

            framePuan = 10 + bonus; // Strike puanı: 10 + sonraki iki atış
            aciklama = "Strike"; // Açıklamaya Strike yazılır

        }
        // SPARE durumu (iki atış toplamı 10 ise)
        else if (atislar[0] + atislar[1] === 10) {
            let sonraki1 = dizi[i + 1] || [0]; // Sonraki frame yoksa 0
            framePuan = 10 + (sonraki1[0] || 0); // Spare puanı: 10 + sonraki ilk atış
            aciklama = "Spare";

        }
        // NORMAL durum (strike veya spare değil)
        else {
            framePuan = atislar[0] + atislar[1]; // Toplam iki atışın puanı bulundugu frame ın ılk ve 2. atısını topla
        }

        // 10. FRAME için özel işlem yapılır (çünkü ekstra atış olabilir)
        if (i === 9) {
            framePuan = 0; // Baştan frame puan sıfırlanır çünkü atış sayısı 2-3 olabilir
            for (let j = 0; j < atislar.length; j++) {
                framePuan += atislar[j]; // Tüm atışlar toplanır
            }

            // Açıklama tekrar belirlenir
            if (atislar[0] === 10) aciklama = "Strike";
            else if (atislar[0] + atislar[1] === 10) aciklama = "Spare";
            else aciklama = "Normal";
        }

        toplam += framePuan; // Genel toplam güncellenir

        // Frame bilgisini objeye  ekledim  (detaylı nesne olarak) aslında bu da bır array.
        framePuanlari.push({
            frame: i + 1,              // Frame numarası (1-10)
            atislar: atislar,          // O frame’deki atışlar (örnek: [10], [4,6])
            aciklama: aciklama,        // "Strike", "Spare", "Normal"
            framePuan: framePuan,      // O frame'in skoru
            toplam: toplam             // Bu frame sonunda ulaşılan toplam skor
        });
    }

    return framePuanlari; // Frame puanlarının olduğu dizi döndürülür
}

// Her bir oyuncunun frame bazlı puanlarını tablo halinde ekrana yazdırır
function tabloYazdir(oyuncuAdi, oyuncuPuanlari) {
    // Oyuncu adını ve başlıkları yazdır
    console.log(oyuncuAdi + " Skor Tablosu:");
    console.log("FRAME\tATIŞLAR\t\tAÇIKLAMA\tFRAME SKORU\tTOPLAM");

    for (let i = 0; i < oyuncuPuanlari.length; i++) {
        let frame = oyuncuPuanlari[i];              // O anki frame bilgisi (puan, atışlar, açıklama)
        let atisYazisi = "";                 // Ekrana yazılacak atış gösterimi

        for (let j = 0; j < frame.atislar.length; j++) {
            let atis = frame.atislar[j];     // O anki atış puanı

            // STRIKE durumu (ilk atış ise ve ilk 10 ise)
            if (j === 0 && atis === 10) {
                atisYazisi = "X";
            }

            // SPARE durumu (ilk atış + ikinci atış = 10)
            else if (j === 1 && frame.atislar[0] + frame.atislar[1] === 10) {
                atisYazisi += " /";
            }

            // Normal atış (strike veya spare değil)
            else {
                if (j > 0) atisYazisi += " ";
                atisYazisi += atis;
            }
        }


        // Her bir frame için tablo satırı bastır
        // objelerı bu sekılde cagırıp ekrana bastırdım.
        console.log(frame.frame + "\t" + atisYazisi + "\t\t" + frame.aciklama + "\t\t" + frame.framePuan + "\t\t" + frame.toplam);
    }
}

function kazananBelirle(oyuncuPuanlari1, oyuncuPuanlari2) {
    // Her iki oyuncunun 10. frame'den sonra oluşan toplam skorunu alıyoruz
    let toplam1 = oyuncuPuanlari1[9].toplam;
    let toplam2 = oyuncuPuanlari2[9].toplam;

    // Skorları ekrana yazdır
    console.log(`Oyuncu 1 Toplam: ${toplam1}`);
    console.log(`Oyuncu 2 Toplam: ${toplam2}`);

    // Skorlara göre sonucu yaz
    if (toplam1 > toplam2) {
        console.log(" Oyuncu 1 Kazandi!");
    } else if (toplam2 > toplam1) {
        console.log(" Oyuncu 2 Kazandi!");
    } else {
        console.log(" Berabere kaldiniz!");
    }
}


//OYUN AKIŞI

oyuncuAtisAl("OYUNCU 1", oyuncu1);
oyuncuAtisAl("OYUNCU 2", oyuncu2);


// Her oyuncunun frame puanlarını hesapla
let oyuncuPuanlari1 = puanHesapla(oyuncu1); // oyuncu1 dizisine göre puanlar hesaplanır.
//  Return olarak puan dondugu ıcın fonks sonucu yine puanlar dızısıne attım tabloya aktarıcam.
let oyuncuPuanlari2 = puanHesapla(oyuncu2); // oyuncu2 dizisine göre puanlar hesaplanır.
//  Return olarak puan dondugu ıcın fonks sonucu yine puanlar dızısıne attım tabloya aktarıcam.


// Skor tablolarını ekrana yazdır
tabloYazdir("Oyuncu 1", oyuncuPuanlari1);
tabloYazdir("Oyuncu 2", oyuncuPuanlari2);

kazananBelirle(oyuncuPuanlari1, oyuncuPuanlari2);


