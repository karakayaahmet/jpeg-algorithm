/* -*- sekme genişliği: 2; girinti sekmeleri modu: nil; c-temel ofset: 2 -*- /
/* vim: shiftwidth'i ayarla=2 sekme durağı=2 otomatik girinti cindent genişletme sekmesi: */
/*
   Telif hakkı 2011 notmasteryet

   Apache Lisansı, Sürüm 2.0 ("Lisans");
   Bu dosyayı Lisansa uygun olmadıkça kullanamazsınız.
   Lisansın bir kopyasını şu adresten edinebilirsiniz:

       http://www.apache.org/licenses/LICENSE-2.0

   Yürürlükteki yasalarca gerekli görülmedikçe veya yazılı olarak kabul edilmedikçe, yazılım
   Lisans kapsamında dağıtılan bir "OLDUĞU GİBİ" TEMELİNDE dağıtılır,
   Açık veya zımni HİÇBİR TÜRDE GARANTİ VEYA KOŞUL OLMAKSIZIN.
   Belirli bir dili yöneten izinler için Lisansa bakın ve
   Lisans kapsamındaki sınırlamalar.
*/

// - JPEG özelliği, ITU CCITT Tavsiyesi T.81'de bulunabilir.
// (www.w3.org/Graphics/JPEG/itu-t81.pdf)
// - JFIF özelliği, JPEG Dosya Değişim Formatında bulunabilir
// (www.w3.org/Graphics/JPEG/jfif3.pdf)
// - DCT Filtrelerini Desteklemedeki Adobe Uygulamasına Özel JPEG işaretçileri
// PostScript Düzey 2'de, Teknik Not #5116
// (partners.adobe.com/public/developer/en/ps/sdk/5116.DCT_Filter.pdf)

var JpegImage = (işlev jpegImage() {
  "katı kullan";
  var dctZigZag = new Int32Array([
     0,
     1, 8,
    16, 9, 2,
     3, 10, 17, 24,
    32, 25, 18, 11, 4,
     5, 12, 19, 26, 33, 40,
    48, 41, 34, 27, 20, 13, 6,
     7, 14, 21, 28, 35, 42, 49, 56,
    57, 50, 43, 36, 29, 22, 15,
    23, 30, 37, 44, 51, 58,
    59, 52, 45, 38, 31,
    39, 46, 53, 60,
    61, 54, 47,
    55, 62,
    63
  ]);

  var dctCos1 = 4017 // cos(pi/16)
  var dctSin1 = 799 // günah(pi/16)
  var dctCos3 = 3406 // çünkü(3*pi/16)
  var dctSin3 = 2276 // günah(3*pi/16)
  var dctCos6 = 1567 // cos(6*pi/16)
  var dctSin6 = 3784 // günah(6*pi/16)
  var dctSqrt2 = 5793 // sqrt(2)
  var dctSqrt1d2 = 2896 // sqrt(2) / 2

  işlev oluşturucu() {
  }

  function buildHuffmanTable(codeLengths, değerler) {
    var k = 0, kod = [], i, j, uzunluk = 16;
    while (uzunluk > 0 && !codeLengths[uzunluk - 1])
      uzunluk--;
    code.push({çocuklar: [], dizin: 0});
    var p = kod[0], q;
    for (i = 0; i < uzunluk; i++) {
      for (j = 0; j < kodUzunlukları[i]; j++) {
        p = kod.pop();
        p.children[p.index] = değerler[k];
        while (p.index > 0) {
          if (kod.uzunluk === 0)
            throw new Error('Huffman Tablosu yeniden oluşturulamadı');
          p = kod.pop();
        }
        p.index++;
        kod.push(p);
        while (kod.uzunluk <= i) {
          code.push(q = {çocuklar: [], dizin: 0});
          p.children[p.index] = q.children;
          p = q;
        }
        k++;
      }
      if (i + 1 < uzunluk) {
        // p burada son kodu gösterir
        code.push(q = {çocuklar: [], dizin: 0});
        p.children[p.index] = q.children;
        p = q;
      }
    }
    dönüş kodu[0].children;
  }

  fonksiyon decodeScan(veri, ofset,
                      çerçeve, bileşenler, resetInterval,
                      spektralBaşlangıç, spektralSon,
                      ardışıkÖnceki, ardışık, tercihler) {
    var kesinlik = frame.precision;
    var samplePerLine = frame.samplesPerLine;
    var scanLines = frame.scanLines;
    var mcusPerLine = frame.mcusPerLine;
    var progresif = frame.progressive;
    var maxH = frame.maxH, maxV = frame.maxV;

    var startOffset = offset, bitsData = 0, bitsCount = 0;
    fonksiyon readBit() {
      if (bitsCount > 0) {
        bitCount--;
        dönüş (bitsData >> bitsCount) & 1;
      }
      bitsData = veri[offset++];
      if (bitsData == 0xFF) {
        var nextByte = data[offset++];
        if (sonrakiByte) {
          throw new Error("beklenmeyen işaretçi: " + ((bitsData << 8) | nextByte).toString(16));
        }
        // 0'ı boşalt
      }
      bitSayısı = 7;
      bitsData >>> 7 döndür;
    }
    function decodeHuffman(ağaç) {
      var düğüm = ağaç, bit;
      while ((bit = readBit()) !== boş) {
        düğüm = düğüm[bit];
        if (tür düğümü === 'sayı')
          dönüş düğümü;
        if (tür düğümü !== 'nesne')
          yeni Error("geçersiz huffman dizisi");
      }
      null döndür;
    }
    fonksiyon alma(uzunluk) {
      var n = 0;
      while (uzunluk > 0) {
        var bit = readBit();
        if (bit === boş) döndürme;
        n = (n << 1) | bit;
        uzunluk--;
      }
      dönüş n;
    }
    function ReceiveAndExtend(uzunluk) {
      var n = alma(uzunluk);
      if (n >= 1 << (uzunluk - 1))
        dönüş n;
      dönüş n + (-1 << uzunluk) + 1;
    }
    function decodeBaseline(bileşen, zz) {
      var t = decodeHuffman(component.huffmanTableDC);
      var diff = t === 0 ? 0 : almaAndExtend(t);
      zz[0]= (bileşen.pred += fark);
      var k = 1;
      süre (k < 64) {
        var rs = decodeHuffman(component.huffmanTableAC);
        var s = rs & 15, r = rs >> 4;
        if (s === 0) {
          eğer (r < 15)
            kırmak;
          k += 16;
          devam et;
        }
        k += r;
        var z = dctZigZag[k];
        zz[z] = almaAndExtend(ler);
        k++;
      }
    }
    function decodeDCFirst(bileşen, zz) {
      var t = decodeHuffman(component.huffmanTableDC);
      var diff = t === 0 ? 0 : (receiveAndExtend(t) << ardışık);
      zz[0] = (bileşen.pred += fark);
    }
    function decodeDCSuccessive(bileşen, zz) {
      zz[0] |= readBit() << ardışık;
    }
    var eobrun = 0;
    function decodeACFirst(bileşen, zz) {
      if (eobrun > 0) {
        eobrun--;
        dönüş;
      }
      var k = spectralStart, e = spectralEnd;
      süre (k <= e) {
        var rs = decodeHuffman(component.huffmanTableAC);
        var s = rs & 15, r = rs >> 4;
        if (s === 0) {
          eğer (r < 15) {
            eobrun = alma(r) + (1 << r) - 1;
            kırmak;
          }
          k += 16;
          devam et;
        }
        k += r;
        var z = dctZigZag[k];
        zz[z] = alıcıAndExtend(s) * (1 << ardışık);
        k++;
      }
    }
    var ardışıkACState = 0, ardışıkACNextValue;
    function decodeACSuccessive(bileşen, zz) {
      var k = spectralStart, e = spectralEnd, r = 0;
      süre (k <= e) {
        var z = dctZigZag[k];
        var yön = zz[z] < 0 ? -1: 1;
        geçiş (ardışık ACState) {
        durum 0: // ilk durum
          var rs = decodeHuffman(component.huffmanTableAC);
          var s = rs & 15, r = rs >> 4;
          if (s === 0) {
            eğer (r < 15) {
              eobrun = alma(r) + (1 << r);
              ardışıkACState = 4;
            } Başka {
              r = 16;
              ardışıkACState = 1;
            }
          } Başka {
            eğer (s !== 1)
              yeni Hata ("geçersiz ACn kodlaması");
            ardışıkACNextValue = alıcıAndExtend(ler);
            ardışıkACState = r ? 2: 3;
          }
          devam et;
        durum 1: // r sıfır öğe atlanıyor
        durum 2:
          eğer (zz[z])
            zz[z] += (readBit() << ardışık) * yön;
          Başka {
            r--;
            eğer (r === 0)
              ardışıkACState = ardışıkACState == 2 ? 3: 0;
          }
          kırmak;
        durum 3: // sıfır öğe için değer ayarla
          eğer (zz[z])
            zz[z] += (readBit() << ardışık) * yön;
          Başka {
            zz[z] = ardışıkACNextValue << ardışık;
            ardışıkACState = 0;
          }
          kırmak;
        durum 4: // eob
          eğer (zz[z])
            zz[z] += (readBit() << ardışık) * yön;
          kırmak;
        }
        k++;
      }
      if (successiveACState === 4) {
        eobrun--;
        eğer (eobrun === 0)
          ardışıkACState = 0;
      }
    }
    function decodeMcu(bileşen, kod çözme, mcu, satır, sütun) {
      var mcuRow = (mcu / mcusPerLine) | 0;
      var mcuCol = mcu % mcusPerLine;
      var blockRow = mcuRow * component.v + satır;
      var blockCol = mcuCol * component.h + col;
      // Blok eksikse ve tolerans modundaysak, atlayın.
      if (component.blocks[blockRow] === undefined && opts.tolerantDecoding)
        dönüş;
      decode(bileşen, component.blocks[blockRow][blockCol]);
    }
    function decodeBlock(bileşen, kod çözme, mcu) {
      var blockRow = (mcu / component.blocksPerLine) | 0;
      var blockCol = mcu % component.blocksPerLine;
      // Blok eksikse ve tolerans modundaysak, atlayın.
      if (component.blocks[blockRow] === undefined && opts.tolerantDecoding)
        dönüş;
      decode(bileşen, component.blocks[blockRow][blockCol]);
    }

    var componentLength = component.length;
    var bileşen, i, j, k, n;
    var decodeFn;
    if (aşamalı) {
      if (spectralStart === 0)
        decodeFn = ardışıkÖnceki === 0 ? decodeDCFirst : decodeDCSuccessive;
      Başka
        decodeFn = ardışıkÖnceki === 0 ? decodeACFirst : decodeACSuccessive;
    } Başka {
      decodeFn = decodeBaseline;
    }

    var mcu = 0, işaretçi;
    var mcuExpected;
    if (bileşenlerUzunluk == 1) {
      mcuExpected = component[0].blocksPerLine * component[0].blocksPerColumn;
    } Başka {
      mcuExpected = mcusPerLine * frame.mcusPerColumn;
    }
    if (!resetInterval) resetInterval = mcuExpected;

    var h, v;
    while (mcu < mcuBeklenen) {
      // aralık öğelerini sıfırla
      for (i = 0; i < componentLength; i++)
        bileşenler[i].pred = 0;
      eobrun = 0;

      if (bileşenlerUzunluk == 1) {
        bileşen = bileşenler[0];
        for (n = 0; n < resetInterval; n++) {
          decodeBlock(bileşen, decodeFn, mcu);
          mcu++;
        }
      } Başka {
        for (n = 0; n < resetInterval; n++) {
          for (i = 0; i < componentLength; i++) {
            bileşen = bileşenler[i];
            h = bileşen.h;
            v = bileşen.v;
            for (j = 0; j < v; j++) {
              for (k = 0; k < h; k++) {
                decodeMcu(bileşen, decodeFn, mcu, j, k);
              }
            }
          }
          mcu++;

          // Beklenen MCU'larımıza ulaştıysak, kod çözmeyi durdurun
          if (mcu === mcuExpected) sonu;
        }
      }

      if (mcu === mcuBeklenen) {
        // Taramanın sonunda sondaki baytları atla - bir sonraki işaretçiye ulaşana kadar
        yapmak {
          if (veri[ofset] === 0xFF) {
            if (veri[ofset + 1] !== 0x00) {
              kırmak;
            }
          }
          ofset += 1;
        } while (ofset < data.length - 2);
      }

      // işaretçiyi bul
      bitSayısı = 0;
      işaretleyici = (veri[ofset] << 8) | veri[ofset + 1];
      if (işaretçi < 0xFF00) {
        throw new Error("işaretleyici bulunamadı");
      }

      if (işaretçi >= 0xFFD0 && işaretleyici <= 0xFFD7) { // RSTx
        ofset += 2;
      }
      Başka
        kırmak;
    }

    dönüş ofseti - startOffset;
  }

  function buildComponentData(çerçeve, bileşen) {
    var satırlar = [];
    varblocksPerLine = component.blocksPerLine;
    varblocksPerColumn = component.blocksPerColumn;
    var samplePerLine = bloklarPerLine << 3;
    // Bu işlevin her çağrısı için yalnızca 1 kullanılır ve çağrıdan sonra çöp toplanır, bu nedenle bellek ayak izini hesaba katmaya gerek yoktur.
    var R = new Int32Array(64), r = new Uint8Array(64);

    // Poppler'ın IDCT yönteminin bir bağlantı noktası, bu da şuradan alınır:
    // Christoph Loeffler, Adriaan Ligtenberg, George S. Moschytz,
    // "11 Çarpma ile Pratik Hızlı 1-D DCT Algoritmaları",
    // IEEE Uluslararası Konf. Akustik, Konuşma ve Sinyal İşleme, 1989,
    // 988-991.
    function quantizeAndInverse(zz, dataOut, dataIn) {
      var qt = component.quantizationTable;
      var v0, v1, v2, v3, v4, v5, v6, v7, t;
      var p = dataIn;
      var i;

      // dekuantı
      için (i = 0; i < 64; i++)
        p[i] = zz[i] * qt[i];

      // satırlarda ters DCT
      for (i = 0; ben < 8; ++i) {
        var satır = 8 * i;

        // tamamen sıfır AC katsayılarını kontrol et
        if (p[1 + satır] == 0 && p[2 + satır] == 0 && p[3 + satır] == 0 &&
            p[4 + satır] == 0 && p[5 + satır] == 0 && p[6 + satır] == 0 &&
            p[7 + satır] == 0) {
          t = (dctSqrt2 * p[0 + satır] + 512) >> 10;
          p[0 + satır] = t;
          p[1 + satır] = t;
          p[2 + satır] = t;
          p[3 + satır] = t;
          p[4 + satır] = t;
          p[5 + satır] = t;
          p[6 + satır] = t;
          p[7 + satır] = t;
          devam et;
        }

        // 4. aşama
        v0 = (dctSqrt2 * p[0 + satır] + 128) >> 8;
        v1 = (dctSqrt2 * p[4 + satır] + 128) >> 8;
        v2 = p[2 + satır];
        v3 = p[6 + satır];
        v4 = (dctSqrt1d2 * (p[1 + satır] - p[7 + satır]) + 128) >> 8;
        v7 = (dctSqrt1d2 * (p[1 + satır] + p[7 + satır]) + 128) >> 8;
        v5 = p[3 + satır] << 4;
        v6 = p[5 + satır] << 4;

        // sahne 3
        t = (v0 - v1+ 1) >> 1;
        v0 = (v0 + v1 + 1) >> 1;
        v1 = t;
        t = (v2 * dctSin6 + v3 * dctCos6 + 128) >> 8;
        v2 = (v2 * dctCos6 - v3 * dctSin6 + 128) >> 8;
        v3 = t;
        t = (v4 - v6 + 1) >> 1;
        v4 = (v4 + v6 + 1) >> 1;
        v6 = t;
        t = (v7 + v5 + 1) >> 1;
        v5 = (v7 - v5 + 1) >> 1;
        v7 = t;

        // 2. aşama
        t = (v0 - v3 + 1) >> 1;
        v0 = (v0 + v3 + 1) >> 1;
        v3 = t;
        t = (v1 - v2 + 1) >> 1;
        v1 = (v1 + v2 + 1) >> 1;
        v2 = t;
        t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
        v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
        v7 = t;
        t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
        v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
        v6 = t;

        // 1. Aşama
        p[0 + satır] = v0 + v7;
        p[7 + satır] = v0 - v7;
        p[1 + satır] = v1 + v6;
        p[6 + satır] = v1 - v6;
        p[2 + satır] = v2 + v5;
        p[5 + satır] = v2 - v5;
        p[3 + satır] = v3 + v4;
        p[4 + satır] = v3 - v4;
      }

      // sütunlarda ters DCT
      for (i = 0; ben < 8; ++i) {
        var col = i;

        // tamamen sıfır AC katsayılarını kontrol et
        if (p[1*8 + sütun] == 0 && p[2*8 + sütun] == 0 && p[3*8 + sütun] == 0 &&
            p[4*8 + sütun] == 0 && p[5*8 + sütun] == 0 && p[6*8 + sütun] == 0 &&
            p[7*8 + sütun] == 0) {
          t = (dctSqrt2 * dataIn[i+0] + 8192) >> 14;
          p[0*8 + sütun] = t;
          p[1*8 + sütun] = t;
          p[2*8 + sütun] = t;
          p[3*8 + sütun] = t;
          p[4*8 + sütun] = t;
          p[5*8 + sütun] = t;
          p[6*8 + sütun] = t;
          p[7*8 + sütun] = t;
          devam et;
        }

        // 4. aşama
        v0 = (dctSqrt2 * p[0*8 + sütun] + 2048) >> 12;
        v1 = (dctSqrt2 * p[4*8 + sütun] + 2048) >> 12;
        v2 = p[2*8 + sütun];
        v3 = p[6*8 + sütun];
        v4 = (dctSqrt1d2 * (p[1*8 + sütun] - p[7*8 + sütun]) + 2048) >> 12;
        v7 = (dctSqrt1d2 * (p[1*8 + sütun] + p[7*8 + sütun]) + 2048) >> 12;
        v5 = p[3*8 + sütun];
        v6 = p[5*8 + sütun];

        // sahne 3
        t = (v0 - v1 + 1) >> 1;
        v0 = (v0 + v1 + 1) >> 1;
        v1 = t;
        t = (v2 * dctSin6 + v3 * dctCos6 + 2048) >> 12;
        v2 = (v2 * dctCos6 - v3 * dctSin6 + 2048) >> 12;
        v3 = t;
        t = (v4 - v6 + 1) >> 1;
        v4 = (v4 + v6 + 1) >> 1;
        v6 = t;
        t = (v7 + v5 + 1) >> 1;
        v5 = (v7 - v5 + 1) >> 1;
        v7 = t;

        // 2. aşama
        t = (v0 - v3 + 1) >> 1;
        v0 = (v0 + v3 + 1) >> 1;
        v3 = t;
        t = (v1 - v2 + 1) >> 1;
        v1 = (v1 + v2 + 1) >> 1;
        v2 = t;
        t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
        v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
        v7 = t;
        t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
        v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
        v6 = t;

        // 1. Aşama
        p[0*8 + sütun] = v0 + v7;
        p[7*8 + sütun] = v0 - v7;
        p[1*8 + sütun] = v1 + v6;
        p[6*8 + sütun] = v1 - v6;
        p[2*8 + sütun] = v2 + v5;
        p[5*8 + sütun] = v2 - v5;
        p[3*8 + sütun] = v3 + v4;
        p[4*8 + sütun] = v3 - v4;
      }

      // 8 bit tam sayılara dönüştür
      for (i = 0; i < 64; ++i) {
        var örnek = 128 + ((p[i] + 8) >> 4);
        dataOut[i] = örnek < 0 ? 0 : örnek > 0xFF ? 0xFF : örnek;
      }
    }

    requestMemoryAllocation(samplesPerLine * bloklarPerColumn * 8);

    var i, j;
    for (var blockRow = 0; blockRow <blocksPerColumn;blockRow++) {
      var scanLine = blockRow << 3;
      için (i = 0; i < 8; i++)
        line.push(yeni Uint8Array(samplesPerLine));
      for (var blockCol = 0; blockCol <blocksPerLine;blockCol++) {
        quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);

        var offset = 0, örnek = blokCol << 3;
        for (j = 0; j < 8; j++) {
          var satır = satırlar[scanLine + j];
          için (i = 0; i < 8; i++)
            satır[örnek + i] = r[ofset++];
        }
      }
    }
    dönüş hatları;
  }

  function clipTo8bit(a) {
    bir <0 döndürür mü? 0 : bir > 255 ? 255 : bir;
  }

  yapıcı.prototip = {
    yük: işlev yükü(yol) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", yol, doğru);
      xhr.responseType = "arraybuffer";
      xhr.onload = (function() {
        // TODO yakalama ayrıştırma hatası
        var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
        this.parse(veri);
        if (this.onload)
          this.onload();
      }).bind(bu);
      xhr.send(boş);
    },
    ayrıştırma: işlev ayrıştırma(veri) {
      var maxResolutionInPixels = this.opts.maxResolutionInMP * 1000 * 1000;
      var offset = 0, uzunluk = data.length;
      işlev readUint16() {
        var değeri = (veri[ofset] << 8) | veri[ofset + 1];
        ofset += 2;
        geri dönüş değeri;
      }
      işlev readDataBlock() {
        var uzunluk = readUint16();
        var dizi = data.subarray(offset, offset + uzunluk - 2);
        ofset += dizi.uzunluk;
        dönüş dizisi;
      }
      function hazırlaBileşenler(çerçeve) {
        var maxH = 0, maxV = 0;
        var component, componentId;
        for (frame.components içindeki componentId) {
          if (frame.components.hasOwnProperty(componentId)) {
            bileşen = çerçeve.bileşenler[bileşenId];
            if (maxH < component.h) maxH = component.h;
            if (maxV < component.v) maxV = component.v;
          }
        }
        var mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / maxH);
        var mcusPerColumn = Math.ceil(frame.scanLines / 8 / maxV);
        for (frame.components içindeki componentId) {
          if (frame.components.hasOwnProperty(componentId)) {
            bileşen = çerçeve.bileşenler[bileşenId];
            var blockPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / maxH);
            var blockPerColumn = Math.ceil(Math.ceil(frame.scanLines / 8) * component.v / maxV);
            var blockPerLineForMcu = mcusPerLine * component.h;
            var blockPerColumnForMcu = mcusPerColumn * component.v;
            varblockToAllocate =blocksPerColumnForMcu *blocksPerLineForMcu;
            var bloklar = [];

            // Her blok 64 (4 x 64 = 256 bayt) uzunluğunda bir Int32Array'dir
            requestMemoryAllocation(blocksToAllocate * 256);

            for (var i = 0; i <blocksPerColumnForMcu; i++) {
              var satır = [];
              for (var j = 0; j <blocksPerLineForMcu; j++)
                satır.push(yeni Int32Array(64));
              bloklar.push(satır);
            }
            component.blocksPerLine =blocksPerLine;
            component.blocksPerColumn =blocksPerColumn;
            component.blocks = bloklar;
          }
        }
        frame.maxH = maxH;
        çerçeve.maxV = maxV;
        frame.mcusPerLine = mcusPerLine;
        frame.mcusPerColumn = mcusPerColumn;
      }
      var jfif = null;
      var adobe = null;
      var piksel = boş;
      var frame, resetInterval;
      var quantizationTables = [], çerçeveler = [];
      var huffmanTablesAC = [], huffmanTablesDC = [];
      var fileMarker = readUint16();
      var malformedDataOffset = -1;
      this.comments = [];
      if (fileMarker != 0xFFD8) { // SOI (Görüntünün Başlangıcı)
        yeni Error("SOI bulunamadı");
      }

      fileMarker = readUint16();
      while (fileMarker != 0xFFD9) { // EOI (Görüntünün sonu)
        var i, j, l;
        switch(fileMarker) {
          durum 0xFF00: ara;
          case 0xFFE0: // APP0 (Uygulamaya Özel)
          durum 0xFFE1: // APP1
          durum 0xFFE2: // APP2
          durum 0xFFE3: // APP3
          durum 0xFFE4: // APP4
          durum 0xFFE5: // APP5
          durum 0xFFE6: // APP6
          durum 0xFFE7: // APP7
          durum 0xFFE8: // APP8
          durum 0xFFE9: // APP9
          durum 0xFFEA: // APP10
          durum 0xFFEB: // UYGULAMA11
          durum 0xFFEC: // APP12
          durum 0xFFED: // UYGULAMA13
          durum 0xFFEE: // UYGULAMA14
          durum 0xFFEF: // APP15
          case 0xFFFE: // COM (Yorum)
            var appData = readDataBlock();

            if (fileMarker === 0xFFFE) {
              var yorum = String.fromCharCode.apply(null, appData);
              this.comments.push(yorum);
            }

            if (fileMarker === 0xFFE0) {
              if (appData[0] === 0x4A && appData[1] === 0x46 && appData[2] === 0x49 &&
                appData[3] === 0x46 && appData[4] === 0) { // 'JFIF\x00'
                jfi = {
                  sürüm: { majör: appData[5], minör: appData[6] },
                  yoğunlukBirimleri: appData[7],
                  xDensity: (appData[8] << 8) | appData[9],
                  yYoğunluk: (appData[10] << 8) | appData[11],
                  thumbWidth: appData[12],
                  thumbHeight: appData[13],
                  thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                };
              }
            }
            // YAPILACAK UYGULAMA1 - Exif
            if (fileMarker === 0xFFE1) {
              if (appData[0] === 0x45 &&
                appData[1] === 0x78 &&
                appData[2] === 0x69 &&
                appData[3] === 0x66 &&
                appData[4] === 0) { // 'EXIF\x00'
                this.exifBuffer = appData.subarray(5, appData.length);
              }
            }

            if (fileMarker === 0xFFEE) {
              if (appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6F &&
                appData[3] === 0x62 && appData[4] === 0x65 && appData[5] === 0) { // 'Adobe\x00'
                kerpiç = {
                  sürüm: appData[6],
                  flags0: (appData[7] << 8) | appData[8],
                  flags1: (appData[9] << 8) | appData[10],
                  transformCode: appData[11]
                };
              }
            }
            kırmak;

          case 0xFFDB: // DQT (Kantizasyon Tablolarını Tanımlayın)
            var quantizationTablesLength = readUint16();
            var quantizationTablesEnd = quantizationTablesLength + offset - 2;
            while (ofset < quantizationTablesEnd) {
              var quantizationTableSpec = data[offset++];
              requestMemoryAllocation(64 * 4);
              var tableData = new Int32Array(64);
              if ((quantizationTableSpec >> 4) === 0) { // 8 bitlik değerler
                for (j = 0; j < 64; j++) {
                  var z = dctZigZag[j];
                  tableData[z] = veri[offset++];
                }
              } else if ((quantizationTableSpec >> 4) === 1) { //16 bit
                for (j = 0; j < 64; j++) {
                  var z = dctZigZag[j];
                  tableData[z] = readUint16();
                }
              } Başka
                yeni Error("DQT: geçersiz tablo özelliği");
              quantizationTables[quantizationTableSpec & 15] = tableData;
            }
            kırmak;

          case 0xFFC0: // SOF0 (Çerçevenin Başlangıcı, Temel DCT)
          case 0xFFC1: // SOF1 (Çerçevenin Başlangıcı, Genişletilmiş DCT)
          case 0xFFC2: // SOF2 (Çerçevenin Başlangıcı, Aşamalı DCT)
            readUint16(); // veri uzunluğunu atla
            çerçeve = {};
            frame.extended = (fileMarker === 0xFFC1);
            frame.progressive = (fileMarker === 0xFFC2);
            frame.precision = veri[offset++];
            frame.scanLines = readUint16();
            frame.samplesPerLine = readUint16();
            çerçeve.bileşenler = {};
            frame.componentsOrder = [];

            var pikselInFrame = frame.scanLines * frame.samplesPerLine;
            if (pixelsInFrame > maxResolutionInPixels) {
              var abusedAmount = Math.ceil((pixelsInFrame - maxResolutionInPixels) / 1e6);
              throw new Error(`maxResolutionInMP limiti ${exceededAmount}MP` tarafından aşıldı);
            }

            var componentCount = data[offset++], componentId;
            var maxH = 0, maxV = 0;
            for (i = 0; i < componentCount; i++) {
              componentId = veri[ofset];
              var h = veri[ofset + 1] >> 4;
              var v = veri[ofset + 1] & 15;
              var qId = veri[ofset + 2];
              frame.componentsOrder.push(bileşenId);
              frame.components[componentId] = {
                h: h,
                v: v,
                nicelemeIdx: qId
              };
              ofset += 3;
            }
            hazırlaBileşenler(çerçeve);
            çerçeveler.push(çerçeve);
            kırmak;

          case 0xFFC4: // DHT (Huffman Tablolarını Tanımlayın)
            var huffmanLength = readUint16();
            for (i = 2; i < huffmanLength;) {
              var huffmanTableSpec = data[offset++];
              var codeLengths = new Uint8Array(16);
              var codeLengthSum = 0;
              for (j = 0; j < 16; j++, offset++) {
                codeLengthSum += (codeLengths[j] = veri[ofset]);
              }
              requestMemoryAllocation(16 + codeLengthSum);
              var huffmanValues ​​= new Uint8Array(codeLengthSum);
              için (j = 0; j < codeLengthSum; j++, offset++)
                huffmanValues[j] = veri[ofset];
              ben += 17 + kodLengthSum;

              ((huffmanTableSpec >> 4) === 0 ?
                huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] =
                buildHuffmanTable(codeLengths, huffmanValues);
            }
            kırmak;

          case 0xFFDD: // DRI (Yeniden Başlatma Aralığını Tanımla)
            readUint16(); // veri uzunluğunu atla
            resetInterval = readUint16();
            kırmak;

          case 0xFFDC: // Satır Sayısı işaretçisi
            readUint16() // veri uzunluğunu atla
            readUint16() // Görüntü yüksekliğini temsil ettiği için bu verileri yoksay
            kırmak;
            
          case 0xFFDA: // SOS (Taramanın Başlangıcı)
            var scanLength = readUint16();
            var selectorsCount = data[offset++];
            var component = [], component;
            for (i = 0; i < selectorsCount; i++) {
              bileşen = çerçeve.bileşenler[veri[offset++]];
              var tableSpec = data[offset++];
              component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
              component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
              component.push(bileşen);
            }
            var spectralStart = data[offset++];
            var spectralEnd = veri[offset++];
            var ardışıkYaklaşım = veri[offset++];
            var işlenmiş = decodeScan(veri, ofset,
              çerçeve, bileşenler, resetInterval,
              spektralBaşlangıç, spektralSon,
              ardışıkYaklaşım >> 4, ardışıkYaklaşım & 15, this.opts);
            ofset += işlendi;
            kırmak;

          case 0xFFFF: // Baytları doldur
            if (data[offset] !== 0xFF) { // Geçerli bir işaretçiyi atlamaktan kaçının.
              ofset--;
            }
            kırmak;
          varsayılan:
            if (veri[ofset - 3] == 0xFF &&
                data[offset - 2] >= 0xC0 && data[ofset - 2] <= 0xFE) {
              // yanlış kodlama olabilir -- öncekinin son 0xFF baytı
              // blok kodlayıcı tarafından yenildi
              ofset -= 3;
              kırmak;
            }
            else if (fileMarker === 0xE0 || fileMarker == 0xE1) {
              // Bazı telefon modellerinde popüler olan hatalı biçimlendirilmiş APP1 işaretçilerinden kurtarın.
              // Bkz. https://github.com/eugeneware/jpeg-js/issues/82
              if (malformedDataOffset !== -1) {
                yeni Hata (`ilk bilinmeyen JPEG işaretçisi ${malformedDataOffset.toString(16)}, ikinci bilinmeyen JPEG işaretçisi ${fileMarker.toString(16)} ofset ${(offset - 1).toString(16)}` );
              }
              malformedDataOffset = offset - 1;
              const nextOffset = readUint16();
              if (veri[ofset + nextOffset - 2] === 0xFF) {
                ofset += nextOffset - 2;
                kırmak;
              }
            }
            yeni Error("bilinmeyen JPEG işaretçisi" + fileMarker.toString(16));
        }
        fileMarker = readUint16();
      }
      if (çerçeveler.uzunluk != 1)
        yeni Error("yalnızca tek kare JPEG'ler desteklenir");

      // her çerçevenin bileşenleri niceleme tablosunu ayarla
      for (var i = 0; i < frame.length; i++) {
        var cp = çerçeveler[i].bileşenler;
        for (cp'deki var j) {
          cp[j].quantizationTable = nicelemeTables[cp[j].quantizationIdx];
          cp[j].quantizationIdx'i silin;
        }
      }

      this.width = frame.samplesPerLine;
      this.height = frame.scanLines;
      this.jfif = jfif;
      this.adobe = adobe;
      this.bileşenler = [];
      for (var i = 0; i < frame.componentsOrder.length; i++) {
        var component = frame.components[frame.componentsOrder[i]];
        this.components.push({
          satırlar: buildComponentData(çerçeve, bileşen),
          scaleX: component.h / frame.maxH,
          scaleY: component.v / frame.maxV
        });
      }
    },
    getData: function getData(genişlik, yükseklik) {
      var ölçekX = bu.genişlik / genişlik, ölçekY = bu.yükseklik / yükseklik;

      var component1, component2, component3, component4;
      var component1Line, component2Line, component3Line, component4Line;
      var x, y;
      var ofset = 0;
      var Y, Cb, Cr, K, C, M, Ye, R, G, B;
      var colorTransform;
      var dataLength = genişlik * yükseklik * this.components.length;
      requestMemoryAllocation(dataLength);
      var data = new Uint8Array(dataLength);
      anahtarı (this.components.length) {
        dava 1:
          component1 = this.components[0];
          for (y = 0; y < yükseklik; y++) {
            component1Line = component1.lines[0 | (y * bileşen1.ölçekY * ölçekY)];
            for (x = 0; x < genişlik; x++) {
              Y = component1Line[0 | (x * component1.scaleX * scaleX)];

              veri[offset++] = Y;
            }
          }
          kırmak;
        durum 2:
          // PDF, özel renk alanında iki bileşenli veriyi sıkıştırabilir
          component1 = this.components[0];
          component2 = this.components[1];
          for (y = 0; y < yükseklik; y++) {
            component1Line = component1.lines[0 | (y * bileşen1.ölçekY * ölçekY)];
            component2Line = component2.lines[0 | (y * bileşen2.ölçekY * ölçekY)];
            for (x = 0; x < genişlik; x++) {
              Y = component1Line[0 | (x * component1.scaleX * scaleX)];
              veri[offset++] = Y;
              Y = component2Line[0 | (x * component2.scaleX * scaleX)];
              veri[offset++] = Y;
            }
          }
          kırmak;
        durum 3:
          // Üç bileşen için varsayılan dönüşüm true
          colorTransform = doğru;
          // Adobe dönüştürme işaretçisi, önceki tüm ayarları geçersiz kılar
          if (this.adobe && this.adobe.transformCode)
            colorTransform = doğru;
          else if (typeof this.opts.colorTransform !== 'tanımsız')
            colorTransform = !!this.opts.colorTransform;

          component1 = this.components[0];
          component2 = this.components[1];
          component3 = this.components[2];
          for (y = 0; y < yükseklik; y++) {
            component1Line = component1.lines[0 | (y * bileşen1.ölçekY * ölçekY)];
            component2Line = component2.lines[0 | (y * bileşen2.ölçekY * ölçekY)];
            component3Line = component3.lines[0 | (y * bileşen3.ölçekY * ölçekY)];
            for (x = 0; x < genişlik; x++) {
              if (!colorTransform) {
                R = component1Line[0 | (x * component1.scaleX * scaleX)];
                G = component2Line[0 | (x * component2.scaleX * scaleX)];
                B = component3Line[0 | (x * component3.scaleX * scaleX)];
              } Başka {
                Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                Cr = component3Line[0 | (x * component3.scaleX * scaleX)];

                R = klempTo8bit(Y + 1.402 * (Cr - 128));
                G = klempTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                B = klempTo8bit(Y + 1.772 * (Cb - 128));
              }

              veri[offset++] = R;
              veri[offset++] = G;
              veri[offset++] = B;
            }
          }
          kırmak;
        durum 4:
          if (!this.adobe)
            throw new Error('Desteklenmeyen renk modu (4 bileşen)');
          // Dört bileşen için varsayılan dönüşüm false
          colorTransform = yanlış;
          // Adobe dönüştürme işaretçisi, önceki tüm ayarları geçersiz kılar
          if (this.adobe && this.adobe.transformCode)
            colorTransform = doğru;
          else if (typeof this.opts.colorTransform !== 'tanımsız')
            colorTransform = !!this.opts.colorTransform;

          component1 = this.components[0];
          component2 = this.components[1];
          component3 = this.components[2];
          component4 = this.components[3];
          for (y = 0; y < yükseklik; y++) {
            component1Line = component1.lines[0 | (y * bileşen1.ölçekY * ölçekY)];
            component2Line = component2.lines[0 | (y * bileşen2.ölçekY * ölçekY)];
            component3Line = component3.lines[0 | (y * bileşen3.ölçekY * ölçekY)];
            component4Line = component4.lines[0 | (y * bileşen4.ölçekY * ölçekY)];
            for (x = 0; x < genişlik; x++) {
              if (!colorTransform) {
                C = component1Line[0 | (x * component1.scaleX * scaleX)];
                M = component2Line[0 | (x * component2.scaleX * scaleX)];
                Ye = component3Line[0 | (x * component3.scaleX * scaleX)];
                K = component4Line[0 | (x * component4.scaleX * scaleX)];
              } Başka {
                Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                Cr = component3Line[0 | (x * component3.scaleX * scaleX)];
                K = component4Line[0 | (x * component4.scaleX * scaleX)];

                C = 255 - klempTo8bit(Y + 1.402 * (Cr - 128));
                M = 255 - klempTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                Ye = 255 - klempTo8bit(Y + 1.772 * (Cb - 128));
              }
              veri[offset++] = 255-C;
              veri[offset++] = 255-M;
              veri[offset++] = 255-Ye;
              veri[offset++] = 255-K;
            }
          }
          kırmak;
        varsayılan:
          yeni Error('Desteklenmeyen renk modu');
      }
      dönüş verileri;
    },
    copyToImageData: function copyToImageData(imageData, formatAsRGBA) {
      var genişlik = imageData.width, height = imageData.height;
      var imageDataArray = imageData.data;
      var data = this.getData(genişlik, yükseklik);
      var i = 0, j = 0, x, y;
      var Y, K, C, M, R, G, B;
      anahtarı (this.components.length) {
        dava 1:
          for (y = 0; y < yükseklik; y++) {
            for (x = 0; x < genişlik; x++) {
              Y = veri[i++];

              imageDataArray[j++] = Y;
              imageDataArray[j++] = Y;
              imageDataArray[j++] = Y;
              if (formatAsRGBA) {
                imageDataArray[j++] = 255;
              }
            }
          }
          kırmak;
        durum 3:
          for (y = 0; y < yükseklik; y++) {
            for (x = 0; x < genişlik; x++) {
              R = veri[i++];
              G = veri[i++];
              B = veri[i++];

              imageDataArray[j++] = R;
              imageDataArray[j++] = G;
              imageDataArray[j++] = B;
              if (formatAsRGBA) {
                imageDataArray[j++] = 255;
              }
            }
          }
          kırmak;
        durum 4:
          for (y = 0; y < yükseklik; y++) {
            for (x = 0; x < genişlik; x++) {
              C = veri[i++];
              M = veri[i++];
              Y = veri[i++];
              K = veri[i++];

              R = 255 - klempTo8bit(C * (1 - K / 255) + K);
              G = 255 - klempTo8bit(M * (1 - K / 255) + K);
              B = 255 - klempTo8bit(Y * (1 - K / 255) + K);

              imageDataArray[j++] = R;
              imageDataArray[j++] = G;
              imageDataArray[j++] = B;
              if (formatAsRGBA) {
                imageDataArray[j++] = 255;
              }
            }
          }
          kırmak;
        varsayılan:
          yeni Error('Desteklenmeyen renk modu');
      }
    }
  };


  // Güvenilmeyen içerikten beklenmeyen OOM'ları önlemek için jpeg-js tarafından kullanılan bellek miktarını sınırlıyoruz.
  var totalBytesAllocated = 0;
  var maxMemoryUsageBytes = 0;
  function requestMemoryAllocation(increaseAmount = 0) {
    var totalMemoryImpactBytes = totalBytesAllocated + boostAmount;
    if (totalMemoryImpactBytes > maxMemoryUsageBytes) {
      var exceededAmount = Math.ceil((totalMemoryImpactBytes - maxMemoryUsageBytes) / 1024 / 1024);
      throw new Error(`maxMemoryUsageInMB limit exceeded by at least ${exceededAmount}MB`);
    }

    totalBytesAllocated = totalMemoryImpactBytes;
  }

  constructor.resetMaxMemoryUsage = function (maxMemoryUsageBytes_) {
    totalBytesAllocated = 0;
    maxMemoryUsageBytes = maxMemoryUsageBytes_;
  };

  constructor.getBytesAllocated = function () {
    return totalBytesAllocated;
  };

  constructor.requestMemoryAllocation = requestMemoryAllocation;

  return constructor;
})();

if (typeof module !== 'undefined') {
	module.exports = decode;
} else if (typeof window !== 'undefined') {
	window['jpeg-js'] = window['jpeg-js'] || {};
	window['jpeg-js'].decode = decode;
}

function decode(jpegData, userOpts = {}) {
  var defaultOpts = {
    // "undefined" means "Choose whether to transform colors based on the image’s color model."
    colorTransform: undefined,
    useTArray: false,
    formatAsRGBA: true,
    tolerantDecoding: true,
    maxResolutionInMP: 100, // Don't decode more than 100 megapixels
    maxMemoryUsageInMB: 512, // Don't decode if memory footprint is more than 512MB
  };

  var opts = {...defaultOpts, ...userOpts};
  var arr = new Uint8Array(jpegData);
  var decoder = new JpegImage();
  decoder.opts = opts;
  // If this constructor ever supports async decoding this will need to be done differently.
  // Until then, treating as singleton limit is fine.
  JpegImage.resetMaxMemoryUsage(opts.maxMemoryUsageInMB * 1024 * 1024);
  decoder.parse(arr);

  var channels = (opts.formatAsRGBA) ? 4 : 3;
  var bytesNeeded = decoder.width * decoder.height * channels;
  try {
    JpegImage.requestMemoryAllocation(bytesNeeded);
    var image = {
      width: decoder.width,
      height: decoder.height,
      exifBuffer: decoder.exifBuffer,
      data: opts.useTArray ?
        new Uint8Array(bytesNeeded) :
        Buffer.alloc(bytesNeeded)
    };
    if(decoder.comments.length > 0) {
      image["comments"] = decoder.comments;
    }
  } catch (err){
    if (err instanceof RangeError){
      throw new Error("Could not allocate enough memory for the image. " +
                      "Required: " + bytesNeeded);
    } else {
      throw err;
    }
  }

  decoder.copyToImageData(image, opts.formatAsRGBA);

  return image;
}
