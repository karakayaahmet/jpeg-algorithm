/*
  Telif hakkı (c) 2008, Adobe Systems Incorporated
  Tüm hakları Saklıdır.

  Kaynak ve ikili biçimlerde yeniden dağıtım ve kullanım, 
  değişiklik, aşağıdaki koşulların sağlanması koşuluyla izin verilir:
  tanışmak:

  * Kaynak kodunun yeniden dağıtımları, yukarıdaki telif hakkı bildirimini korumalıdır, 
    bu koşullar listesi ve aşağıdaki sorumluluk reddi.
  
  * İkili biçimde yeniden dağıtımlar, yukarıdaki telif hakkını yeniden üretmelidir
    bildirim, bu koşullar listesi ve aşağıdaki sorumluluk reddi 
    dağıtımla birlikte sağlanan belgeler ve/veya diğer materyaller.
  
  * Ne Adobe Systems Incorporated'ın adı ne de şirketlerinin adları 
    katkıda bulunanlar, aşağıdakilerden türetilen ürünleri desteklemek veya tanıtmak için kullanılabilir. 
    bu yazılım önceden yazılı izin alınmadan

  BU YAZILIM, TELİF HAKKI SAHİPLERİ VE KATILIMCILAR TARAFINDAN SAĞLANMAKTADIR.
  VE DAHİL ANCAK BUNLARLA SINIRLI OLMAYAN HERHANGİ BİR AÇIK VEYA ZIMNİ GARANTİLER,
  SATILABİLİRLİK VE BELİRLİ BİR ŞEKİLDE UYGUNLUK İÇİN ZIMNİ GARANTİLER
  AMAÇ REDDEDİLMİŞTİR. HİÇBİR DURUMDA TELİF HAKKI SAHİBİ VEYA
  KATKIDA BULUNANLAR DOĞRUDAN, DOLAYLI, ARIZİ, ÖZEL,
  ÖRNEK VEYA DOLAYLI ZARARLAR (ŞUNLAR DAHİL, ANCAK BUNLARLA SINIRLI DEĞİLDİR,
  İKAME MAL VEYA HİZMET SATIN ALMA; KULLANIM, VERİ KAYBI VEYA
  KÂRLAR; VEYA İŞ KESİNTİSİ) NEDEN OLURSA OLSUN VE HERHANGİ BİR TEORİDE
  YÜKÜMLÜLÜK, SÖZLEŞMEDE, KESİN SORUMLULUK VEYA HAKSIZ FİİLDE
  HERHANGİ BİR ŞEKİLDE BU KULLANIMDAN KAYNAKLANAN İHMAL VEYA BAŞKA BİR ŞEKİLDE
  YAZILIM, BU TÜR HASAR OLASILIĞI BİLDİRİLMİŞ OLSA BİLE.
*/
/*
JavaScript'e aktarılan ve Andreas Ritter tarafından optimize edilen JPEG kodlayıcı, www.bytestrom.eu, 11/2009

Temel GUI engelleme jpeg kodlayıcı
*/

var btoa = btoa || işlev(tampon) {
  Buffer.from(buf).toString('base64');
};

işlev JPEGEncoder(kalite) {
  var self = this;
	var fround = Math.round;
	var ffloor = Math.floor;
	var YTable = new Array(64);
	var UVTable = new Array(64);
	var fdtbl_Y = new Array(64);
	var fdtbl_UV = new Array(64);
	var YDC_HT;
	var UVDC_HT;
	var YAC_HT;
	var UVAC_HT;
	
	var bitcode = new Array(65535);
	var kategori = new Array(65535);
	var outputfDCTQuant = new Array(64);
	var DU = new Array(64);
	var byteout = [];
	var bytenew = 0;
	var bytepos = 7;
	
	var YDU = new Array(64);
	var UDU = new Array(64);
	var VDU = new Array(64);
	var clt = new Array(256);
	var RGB_YUV_TABLE = new Array(2048);
	var currentQuality;
	
	var ZigZag = [
			 0, 1, 5, 6,14,15,27,28,
			 2, 4, 7,13,16,26,29,42,
			 3, 8,12,17,25,30,41,43,
			 9,11,18,24,31,40,44,53,
			10,19,23,32,39,45,52,54,
			20,22,33,38,46,51,55,60,
			21,34,37,47,50,56,59,61,
			35,36,48,49,57,58,62,63
		];
	
	var std_dc_luminance_nrcodes = [0,0,1,5,1,1,1,1,1,1,1,0,0,0,0,0,0,0];
	var std_dc_luminance_values ​​= [0,1,2,3,4,5,6,7,8,9,10,11];
	var std_ac_luminance_nrcodes = [0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,0x7d];
	var std_ac_luminance_values ​​= [
			0x01,0x02,0x03,0x00,0x04,0x11,0x05,0x12,
			0x21,0x31,0x41,0x06,0x13,0x51,0x61,0x07,
			0x22,0x71,0x14,0x32,0x81,0x91,0xa1,0x08,
			0x23,0x42,0xb1,0xc1,0x15,0x52,0xd1,0xf0,
			0x24,0x33,0x62,0x72,0x82,0x09,0x0a,0x16,
			0x17,0x18,0x19,0x1a,0x25,0x26,0x27,0x28,
			0x29,0x2a,0x34,0x35,0x36,0x37,0x38,0x39,
			0x3a,0x43,0x44,0x45,0x46,0x47,0x48,0x49,
			0x4a,0x53,0x54,0x55,0x56,0x57,0x58,0x59,
			0x5a,0x63,0x64,0x65,0x66,0x67,0x68,0x69,
			0x6a,0x73,0x74,0x75,0x76,0x77,0x78,0x79,
			0x7a,0x83,0x84,0x85,0x86,0x87,0x88,0x89,
			0x8a,0x92,0x93,0x94,0x95,0x96,0x97,0x98,
			0x99,0x9a,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,
			0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,0xb5,0xb6,
			0xb7,0xb8,0xb9,0xba,0xc2,0xc3,0xc4,0xc5,
			0xc6,0xc7,0xc8,0xc9,0xca,0xd2,0xd3,0xd4,
			0xd5,0xd6,0xd7,0xd8,0xd9,0xda,0xe1,0xe2,
			0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,0xea,
			0xf1,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
			0xf9,0xfa
		];
	
	var std_dc_chrominance_nrcodes = [0,0,3,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0];
	var std_dc_chrominance_values ​​= [0,1,2,3,4,5,6,7,8,9,10,11];
	var std_ac_chrominance_nrcodes = [0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,0x77];
	var std_ac_chrominance_values ​​= [
			0x00,0x01,0x02,0x03,0x11,0x04,0x05.0x21,
			0x31,0x06,0x12,0x41,0x51,0x07,0x61,0x71,
			0x13,0x22,0x32,0x81,0x08,0x14,0x42,0x91,
			0xa1,0xb1,0xc1,0x09,0x23,0x33,0x52,0xf0,
			0x15,0x62,0x72.0xd1,0x0a,0x16,0x24,0x34,
			0xe1,0x25.0xf1,0x17,0x18,0x19,0x1a,0x26,
			0x27,0x28,0x29,0x2a,0x35,0x36,0x37,0x38,
			0x39.0x3a,0x43,0x44,0x45,0x46,0x47,0x48,
			0x49,0x4a,0x53,0x54,0x55,0x56,0x57,0x58,
			0x59,0x5a,0x63,0x64,0x65,0x66,0x67,0x68,
			0x69,0x6a,0x73,0x74,0x75,0x76,0x77,0x78,
			0x79.0x7a,0x82,0x83,0x84,0x85,0x86,0x87,
			0x88,0x89,0x8a,0x92,0x93,0x94,0x95,0x96,
			0x97,0x98,0x99,0x9a,0xa2,0xa3,0xa4,0xa5,
			0xa6,0xa7,0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,
			0xb5,0xb6,0xb7,0xb8,0xb9,0xba,0xc2,0xc3,
			0xc4,0xc5,0xc6,0xc7,0xc8,0xc9,0xca,0xd2,
			0xd3,0xd4,0xd5,0xd6,0xd7,0xd8,0xd9,0xda,
			0xe2,0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,
			0xea,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
			0xf9,0xfa
		];
	
	function initQuantTables(sf){
			var YQT = [
				16, 11, 10, 16, 24, 40, 51, 61,
				12, 12, 14, 19, 26, 58, 60, 55,
				14, 13, 16, 24, 40, 57, 69, 56,
				14, 17, 22, 29, 51, 87, 80, 62,
				18, 22, 37, 56, 68,109,103, 77,
				24, 35, 55, 64, 81,104,113, 92,
				49, 64, 78, 87,103,121,120,101,
				72, 92, 95, 98,112,100,103, 99
			];
			
			for (var i = 0; i < 64; i++) {
				var t = ffloor((YQT[i]*sf+50)/100);
				eğer (t < 1) {
					t=1;
				} else if (t > 255) {
					t = 255;
				}
				YTable[ZigZag[i]] = t;
			}
			var UVQT = [
				17, 18, 24, 47, 99, 99, 99, 99,
				18, 21, 26, 66, 99, 99, 99, 99,
				24, 26, 56, 99, 99, 99, 99, 99,
				47, 66, 99, 99, 99, 99, 99, 99,
				99, 99, 99, 99, 99, 99, 99, 99,
				99, 99, 99, 99, 99, 99, 99, 99,
				99, 99, 99, 99, 99, 99, 99, 99,
				99, 99, 99, 99, 99, 99, 99, 99
			];
			for (var j = 0; j < 64; j++) {
				var u = ffloor((UVQT[j]*sf+50)/100);
				eğer (u < 1) {
					u = 1;
				} else if (u > 255) {
					u = 255;
				}
				UVTable[ZigZag[j]] = u;
			}
			var aasf = [
				1.0, 1.387039845, 1.306562965, 1.175875602,
				1.0, 0.785694958, 0.541196100, 0.275899379
			];
			var k = 0;
			for (var satır = 0; satır < 8; satır++)
			{
				for (var col = 0; col < 8; col++)
				{
					fdtbl_Y[k] = (1.0 / (YTable [ZigZag[k]] * aasf[satır] * aasf[col] * 8.0));
					fdtbl_UV[k] = (1.0 / (UVTable[ZigZag[k]] * aasf[satır] * aasf[col] * 8.0));
					k++;
				}
			}
		}
		
		function hesaplamaHuffmanTbl(nrcodes, std_table){
			var kod değeri = 0;
			var pos_in_table = 0;
			var HT = new Array();
			for (var k = 1; k <= 16; k++) {
				for (var j = 1; j <= nrcodes[k]; j++) {
					HT[std_table[pos_in_table]] = [];
					HT[std_table[pos_in_table]][0] = kod değeri;
					HT[std_table[pos_in_table]][1] = k;
					pos_in_table++;
					kod değeri++;
				}
				kod değeri*=2;
			}
			HT'ye dönüş;
		}
		
		işlev initHuffmanTbl()
		{
			YDC_HT = hesaplamaHuffmanTbl(std_dc_luminance_nrcodes,std_dc_luminance_values);
			UVDC_HT = hesaplamaHuffmanTbl(std_dc_chrominance_nrcodes,std_dc_chrominance_values);
			YAC_HT = hesaplamaHuffmanTbl(std_ac_luminance_nrcodes,std_ac_luminance_values);
			UVAC_HT = hesaplamaHuffmanTbl(std_ac_chrominance_nrcodes,std_ac_chrominance_values);
		}
	
		işlev initCategoryNumber()
		{
			var nrlow = 1;
			var nrupper = 2;
			for (var cat = 1; cat <= 15; cat++) {
				//Pozitif sayılar
				for (var nr = nrlower; nr<nrupper; nr++) {
					kategori[32767+nr] = kedi;
					bit kodu[32767+nr] = [];
					bit kodu[32767+nr][1] = kedi;
					bit kodu[32767+nr][0] = nr;
				}
				//Negatif sayılar
				for (var nrneg =-(nrupper-1); nrneg<=-nrlower; nrneg++) {
					kategori[32767+nrneg] = kedi;
					bit kodu[32767+nrneg] = [];
					bit kodu[32767+nrneg][1] = kedi;
					bit kodu[32767+nrneg][0] = sayı dizisi-1+nrneg;
				}
				daha küçük <<= 1;
				bölücü <<= 1;
			}
		}
		
		function initRGBYUVTable() {
			for(var i = 0; i < 256;i++) {
				RGB_YUV_TABLE[i] = 19595 * ben;
				RGB_YUV_TABLE[(i+ 256)>>0] = 38470 * i;
				RGB_YUV_TABLE[(i+ 512>>0] = 7471 * i + 0x8000;
				RGB_YUV_TABLE[(i+ 768)>>0] = -11059 * i;
				RGB_YUV_TABLE[(i+1024)>>0] = -21709 * ben;
				RGB_YUV_TABLE[(i+1280)>>0] = 32768 * i + 0x807FFF;
				RGB_YUV_TABLE[(i+1536)>>0] = -27439 * i;
				RGB_YUV_TABLE[(i+1792)>>0] = - 5329 * i;
			}
		}
		
		// IO işlevleri
		fonksiyon writeBits(bs)
		{
			var değeri = bs[0];
			var posval = bs[1]-1;
			while ( posval >= 0 ) {
				if (değer & (1 << posval)) {
					bytenew |= (1 << bayt);
				}
				posval--;
				bayt--;
				if (bayt < 0) {
					if (bytenew == 0xFF) {
						writeByte(0xFF);
						writeByte(0);
					}
					Başka {
						writeByte(bytennew);
					}
					bayt sayısı=7;
					baytnew=0;
				}
			}
		}
	
		fonksiyon writeByte(değer)
		{
			//byteout.push(clt[değer]); // daha sonra dönüştürmek yerine doğrudan char yaz
      byteout.push(değer);
		}
	
		fonksiyon writeWord(değer)
		{
			writeByte((değer>>8)&0xFF);
			writeByte((değer )&0xFF);
		}
		
		// DCT ve niceleme çekirdeği
		işlev fDCTQuant(veri, fdtbl)
		{
			var d0, d1, d2, d3, d4, d5, d6, d7;
			/* 1 geçişi: satırları işle. */
			var dataOff=0;
			var i;
			var I8 = 8;
			var I64 = 64;
			(i=0; i<I8; ++i) için
			{
				d0 = veri[veriKapalı];
				d1 = veri[veriKapalı+1];
				d2 = veri[veriKapalı+2];
				d3 = veri[veriKapalı+3];
				d4 = veri[veriKapalı+4];
				d5 = veri[veriKapalı+5];
				d6 = veri[veriKapalı+6];
				d7 = veri[veriKapalı+7];
				
				var tmp0 = d0 + d7;
				var tmp7 = d0 - d7;
				var tmp1 = d1 + d6;
				var tmp6 = d1 - d6;
				var tmp2 = d2 + d5;
				var tmp5 = d2 - d5;
				var tmp3 = d3 + d4;
				var tmp4 = d3 - d4;
	
				/* Çift kısım */
				var tmp10 = tmp0 + tmp3; /* Faz 2 */
				var tmp13 = tmp0 - tmp3;
				var tmp11 = tmp1 + tmp2;
				var tmp12 = tmp1 - tmp2;
	
				veri[veriKapalı] = tmp10 + tmp11; /* 3. aşama */
				veri[veriKapalı+4] = tmp10 - tmp11;
	
				var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
				veri[veriKapalı+2] = tmp13 + z1; /* 5. aşama */
				veri[veriKapalı+6] = tmp13 - z1;
	
				/* Tek kısım */
				tmp10 = tmp4 + tmp5; /* Faz 2 */
				tmp11 = tmp5 + tmp6;
				tmp12 = tmp6 + tmp7;
	
				/* Ek olumsuzlamalardan kaçınmak için döndürücü şekil 4-8'den değiştirildi. */
				var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
				var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
				var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
				var z3 = tmp11 * 0.707106781; /* c4 */
	
				var z11 = tmp7 + z3; /* 5. aşama */
				var z13 = tmp7 - z3;
	
				veri[veriKapalı+5] = z13 + z2; /* 6. aşama */
				veri[veriKapalı+3] = z13 - z2;
				veri[veriKapalı+1] = z11 + z4;
				veri[veriKapalı+7] = z11 - z4;
	
				dataOff += 8; /* işaretçiyi bir sonraki satıra ilerlet */
			}
	
			/* Geçiş 2: sütunları işle. */
			veriKapalı = 0;
			(i=0; i<I8; ++i) için
			{
				d0 = veri[veriKapalı];
				d1 = veri[veriKapalı + 8];
				d2 = veri[veriKapalı + 16];
				d3 = veri[veriKapalı + 24];
				d4 = veri[veriKapalı + 32];
				d5 = veri[veriKapalı + 40];
				d6 = veri[veriKapalı + 48];
				d7 = veri[veriKapalı + 56];
				
				var tmp0p2 = d0 + d7;
				var tmp7p2 = d0 - d7;
				var tmp1p2 = d1 + d6;
				var tmp6p2 = d1 - d6;
				var tmp2p2 = d2 + d5;
				var tmp5p2 = d2 - d5;
				var tmp3p2 = d3 + d4;
				var tmp4p2 = d3 - d4;
	
				/* Çift kısım */
				var tmp10p2 = tmp0p2 + tmp3p2; /* Faz 2 */
				var tmp13p2 = tmp0p2 - tmp3p2;
				var tmp11p2 = tmp1p2 + tmp2p2;
				var tmp12p2 = tmp1p2 - tmp2p2;
	
				veri[veriKapalı] = tmp10p2 + tmp11p2; /* 3. aşama */
				veri[veriKapalı+32] = tmp10p2 - tmp11p2;
	
				var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
				veri[veriKapalı+16] = tmp13p2 + z1p2; /* 5. aşama */
				veri[veriKapalı+48] = tmp13p2 - z1p2;
	
				/* Tek kısım */
				tmp10p2 = tmp4p2 + tmp5p2; /* Faz 2 */
				tmp11p2 = tmp5p2 + tmp6p2;
				tmp12p2 = tmp6p2 + tmp7p2;
	
				/* Ek olumsuzlamalardan kaçınmak için döndürücü şekil 4-8'den değiştirildi. */
				var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
				var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
				var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
				var z3p2 = tmp11p2 * 0.707106781; /* c4 */
	
				var z11p2 = tmp7p2 + z3p2; /* 5. aşama */
				var z13p2 = tmp7p2 - z3p2;
	
				veri[veriKapalı+40] = z13p2 + z2p2; /* 6. aşama */
				veri[veriKapalı+24] = z13p2 - z2p2;
				veri[veriKapalı+ 8] = z11p2 + z4p2;
				veri[veriKapalı+56] = z11p2 - z4p2;
	
				veriKapalı++; /* işaretçiyi bir sonraki sütuna ilerlet */
			}
	
			// Katsayıları nicelleştir/ölçeklerini azalt
			var fDCTQuant;
			(i=0; i<I64; ++i) için
			{
				// Niceleme ve ölçekleme faktörünü uygula & En yakın tam sayıya yuvarla
				fDCTQuant = veri[i]*fdtbl[i];
				outputfDCTQuant[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5)|0) : ((fDCTQuant - 0.5)|0);
				//outputfDCTQuant[i] = froround(fDCTQuant);

			}
			çıktı fDCTQuant;
		}
		
		işlev writeAPP0()
		{
			writeWord(0xFFE0); // işaretleyici
			WriteWord(16); // uzunluk
			writeByte(0x4A); // J
			writeByte(0x46); // F
			writeByte(0x49); // BEN
			writeByte(0x46); // F
			writeByte(0); // = "JFIF",'\0'
			writeByte(1); // sürüm
			writeByte(1); // sürümlo
			writeByte(0); // ksiyunitler
			yazmaKelime(1); // x yoğunluk
			yazmaKelime(1); // yoğunluk
			writeByte(0); // başparmak genişliği
			writeByte(0); // küçük yükseklik
		}

		function writeAPP1(exifBuffer) {
			(!exifBuffer) dönerse;

			writeWord(0xFFE1); // APP1 işaretçisi

			if (exifBuffer[0] === 0x45 &&
					exifBuffer[1] === 0x78 &&
					exifBuffer[2] === 0x69 &&
					exifBuffer[3] === 0x66) {
				// Tampon zaten EXIF ​​ile başlıyor, doğrudan kullanın
				writeWord(exifBuffer.length + 2); // uzunluk, arabellek + uzunluğun kendisidir!
			} Başka {
				// Buffer EXIF ​​ile başlamıyor, onlar için yazın
				writeWord(exifBuffer.length + 5 + 2); // uzunluk, arabellek + EXIF\0 + uzunluğun kendisidir!
				writeByte(0x45); // E
				writeByte(0x78); // X
				writeByte(0x69); // BEN
				writeByte(0x66); // F
				writeByte(0); // = "EXIF",'\0'
			}

			for (var i = 0; i < exifBuffer.length; i++) {
				writeByte(exifBuffer[i]);
			}
		}

		fonksiyon writeSOF0(genişlik, yükseklik)
		{
			writeWord(0xFFC0); // işaretleyici
			WriteWord(17); // uzunluk, gerçek renkli YUV JPG
			writeByte(8); // hassas
			writeWord(yükseklik);
			writeWord(genişlik);
			writeByte(3); // nrofbileşenleri
			writeByte(1); // IdY
			writeByte(0x11); // HVY
			writeByte(0); // ADET
			writeByte(2); // IDU
			writeByte(0x11); // HVU
			writeByte(1); // QTU
			writeByte(3); // IdV
			writeByte(0x11); // HVV
			writeByte(1); // QTV
		}
	
		işlev yazmaDQT()
		{
			writeWord(0xFFDB); // işaretleyici
			writeWord(132); // uzunluk
			writeByte(0);
			for (var i=0; i<64; i++) {
				writeByte(YTable[i]);
			}
			writeByte(1);
			for (var j=0; j<64; j++) {
				writeByte(UVTable[j]);
			}
		}
	
		işlev writeDHT()
		{
			writeWord(0xFFC4); // işaretleyici
			writeWord(0x01A2); // uzunluk
	
			writeByte(0); // HTYDCbilgisi
			for (var i=0; i<16; i++) {
				writeByte(std_dc_luminance_nrcodes[i+1]);
			}
			for (var j=0; j<=11; j++) {
				writeByte(std_dc_luminance_values[j]);
			}
	
			writeByte(0x10); // HTYABilgi
			for (var k=0; k<16; k++) {
				writeByte(std_ac_luminance_nrcodes[k+1]);
			}
			for (var l=0; l<=161; l++) {
				writeByte(std_ac_luminance_values[l]);
			}
	
			writeByte(1); // HTUDCbilgisi
			for (var m=0; m<16; m++) {
				writeByte(std_dc_chrominance_nrcodes[m+1]);
			}
			for (var n=0; n<=11; n++) {
				writeByte(std_dc_chrominance_values[n]);
			}
	
			writeByte(0x11); // HTUACbilgisi
			for (var o=0; o<16; o++) {
				writeByte(std_ac_chrominance_nrcodes[o+1]);
			}
			for (var p=0; p<=161; p++) {
				writeByte(std_ac_chrominance_values[p]);
			}
		}
		
		fonksiyon writeCOM(yorumlar)
		{
			if (typeof yorum === "tanımsız" || comments.constructor !== Dizi) dönüş;
			yorumlar.forEach(e => {
				if (typeof e !== "string") return;
				writeWord(0xFFFE); // işaretleyici
				var l = e.uzunluk;
				writeWord(l + 2); // kendisi de uzunluk
				var i;
				için (i = 0; i < l; i++)
					writeByte(e.charCodeAt(i));
			});
		}
	
		fonksiyon writeSOS()
		{
			writeWord(0xFFDA); // işaretleyici
			yazmaKelime(12); // uzunluk
			writeByte(3); // nrofbileşenleri
			writeByte(1); // IdY
			writeByte(0); // HTY
			writeByte(2); // IDU
			writeByte(0x11); // HTU
			writeByte(3); // IdV
			writeByte(0x11); // HTV
			writeByte(0); // Ss
			writeByte(0x3f); // Gör
			writeByte(0); //Şşşşşşşşşşşxşx
		}
		
		işlev süreciDU(CDU, fdtbl, DC, HTDC, HTAC){
			var EOB = HTAC[0x00];
			var M16zeroes = HTAC[0xF0];
			var poz;
			var I16 = 16;
			var I63 = 63;
			var I64 = 64;
			var DU_DCT = fDCTQuant(CDU, fdtbl);
			//ZigZag yeniden sıralama
			for (var j=0;j<I64;++j) {
				DU[ZigZag[j]]=DU_DCT[j];
			}
			var Fark = DU[0] - DC; DC = DU[0];
			//DC'yi kodla
			if (Fark==0) {
				writeBits(HTDC[0]); // Fark 0 olabilir
			} Başka {
				konum = 32767+Fark;
				writeBits(HTDC[kategori[konum]]);
				writeBits(bitkodu[konum]);
			}
			//AC'leri kodla
			var end0pos = 63; // const... ki bu çılgınca
			for (; (end0pos>0)&&(DU[end0pos]==0); end0pos--) {};
			//end0pos = ters sırada ilk eleman !=0
			if ( end0pos == 0) {
				writeBits(EOB);
				DC'ye dönüş;
			}
			var i = 1;
			var lng;
			while ( ben <= end0pos ) {
				var startpos = i;
				for (; (DU[i]==0) && (i<=end0pos); ++i) {}
				var nrzeroes = i-startpos;
				if ( nrzeroes >= I16 ) {
					lng = nrsıfır>>4;
					için (var nrmarker=1; nrmarker <= lng; ++nrmarker)
						writeBits(M16sıfır);
					nrzeroes = nrzeroes&0xF;
				}
				konum = 32767+DU[i];
				writeBits(HTAC[(nrzeroes<<4)+category[konum]]);
				writeBits(bitkodu[konum]);
				ben++;
			}
			if ( end0pos != I63 ) {
				writeBits(EOB);
			}
			DC'ye dönüş;
		}

		function initCharLookupTable(){
			var sfcc = String.fromCharCode;
			for(var i=0; i < 256; i++){ ///// ACHTUNG // 255
				clt[i] = sfcc(i);
			}
		}
		
		this.encode = fonksiyon(görüntü,kalite) // görüntü verisi nesnesi
		{
			var time_start = new Date().getTime();
			
			if(kalite) setQuality(kalite);
			
			// Bit yazıcısını başlat
			byteout = yeni Dizi();
			baytnew=0;
			bayt sayısı=7;
	
			// JPEG başlıklarını ekle
			writeWord(0xFFD8); // YANİ BEN
			writeAPP0();
			writeCOM(resim.yorumlar);
			writeAPP1(image.exifBuffer);
			writeDQT();
			writeSOF0(görüntü.genişlik,görüntü.yükseklik);
			writeDHT();
			yazSOS();

	
			// 8x8 makro blokları kodla
			var DCY=0;
			var DCU=0;
			var DCV=0;
			
			baytnew=0;
			bayt sayısı=7;
			
			
			this.encode.displayName = "_encode_";

			var imageData = image.data;
			var genişlik = resim.genişlik;
			var yükseklik = resim.yükseklik;

			var quadWidth = genişlik*4;
			var tripleWidth = genişlik*3;
			
			var x, y = 0;
			var r, g, b;
			var start,p, col,row,pos;
			while(y <yükseklik){
				x = 0;
				while(x < dörtgenlik){
				başlangıç ​​= dörtgenlik * y + x;
				p = başlangıç;
				sütun = -1;
				satır = 0;
				
				for(konum=0; konum < 64; konum++){
					satır = konum >> 3;// /8
					sütun = (konum & 7) * 4; // %8
					p = başlangıç ​​+ ( satır * dörtgenlik ) + sütun;		
					
					if(y+satır >= yükseklik){ // alt dolgu
						p-= (dörtGenişlik*(y+1+satır yüksekliği));
					}

					if(x+col >= quadWidth){ // sağa dolgu	
						p-= ((x+col) - dörtgenlik +4)
					}
					
					r = imageData[ p++ ];
					g = imageData[ p++ ];
					b = imageData[ p++ ];
					
					
					/* // YUV değerlerini dinamik olarak hesapla
					YDU[konum]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
					UDU[konum]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
					VDU[konum]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
					*/
					
					// arama tablosunu kullan (biraz daha hızlı)
					YDU[pos] = ((RGB_YUV_TABLE[r] + RGB_YUV_TABLE[(g + 256)>>0] + RGB_YUV_TABLE[(b + 512>>0]) >> 16)-128;
					UDU[pos] = ((RGB_YUV_TABLE[(r + 768)>>0] + RGB_YUV_TABLE[(g + 1024)>>0] + RGB_YUV_TABLE[(b + 1280)>>0]) >> 16)-128;
					VDU[pos] = ((RGB_YUV_TABLE[(r + 1280)>>0] + RGB_YUV_TABLE[(g + 1536)>>0] + RGB_YUV_TABLE[(b + 1792)>>0]) >> 16)-128;

				}
				
				DCY = prosesDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
				DCU = prosesDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
				DCV = prosesDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
				x+=32;
				}
				y+=8;
			}
			
			
			///////////////////////////////////////////// /////////////
	
			// EOI işaretçisinin bit hizalamasını yapın
			if ( bytepos >= 0 ) {
				var fillbits = [];
				fillbits[1] = bytepos+1;
				fillbits[0] = (1<<(bytepos+1))-1;
				writeBits(dolgu bitleri);
			}
	
			writeWord(0xFFD9); //EOI

			if (typeof module === 'undefined') yeni Uint8Array(byteout);
      Buffer.from(byteout);

			var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));
			
			bayt çıkışı = [];
			
			// kıyaslama
			var süre = new Date().getTime() - time_start;
    		//console.log('Kodlama zamanı: '+ süre + 'ms');
    		//
			
			jpegDataUri döndür			
	}
	
	function setQuality(kalite){
		if (kalite <= 0) {
			kalite = 1;
		}
		if (kalite > 100) {
			kalite = 100;
		}
		
		if(currentQuality == kalite) return // değişmediyse yeniden hesaplama
		
		var sf = 0;
		if (kalite < 50) {
			sf = Math.floor(5000 / kalite);
		} Başka {
			sf = Math.floor(200 - kalite*2);
		}
		
		initQuantTables(sf);
		mevcutKalite = kalite;
		//console.log('Kalite ayarlandı: '+kalite +'%');
	}
	
	işlev başlat(){
		var time_start = new Date().getTime();
		if(!quality) kalite = 50;
		// tablolar oluştur
		initCharLookupTable()
		initHuffmanTbl();
		initCategoryNumber();
		initRGBYUVTable();
		
		setQuality(kalite);
		var süre = new Date().getTime() - time_start;
    	//console.log('Başlatma '+ süre + 'ms');
	}
	
	içinde();
	
};

if (typeof module !== 'tanımsız') {
	modül.exports = kodlamak;
} else if (typeof pencere !== 'tanımsız') {
	pencere['jpeg-js'] = pencere['jpeg-js'] || {};
	pencere['jpeg-js'].encode = kodlamak;
}

fonksiyon kodlaması(imgData, qu) {
  if (typeof qu === 'tanımsız') qu = 50;
  var encoder = new JPEGEncoder(qu);
	var data = encoder.encode(imgData, qu);
  dönüş {
    veri: veri,
    genişlik: imgData.width,
    yükseklik: imgData.height,
  };
}

// mevcut sayfadaki mevcut bir görüntünün imageData'sını almak için yardımcı fonksiyon.
function getImageDataFromImage(idOrElement){
	var theImg = (typeof(idOrElement)=='string')? document.getElementById(idOrElement):idOrElement;
	var cvs = document.createElement('canvas');
	cvs.width = theImg.width;
	cvs.height = theImg.height;
	var ctx = cvs.getContext("2d");
	ctx.drawImage(theImg,0,0);
	
	dönüş (ctx.getImageData(0, 0, cvs.width, cvs.height));
}
