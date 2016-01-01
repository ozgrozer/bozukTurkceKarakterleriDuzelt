/*NodeJs'in 'network' modülünü 'net' değişkeninden çalıştırılmak üzere tanımlıyoruz*/
var net = require("net"),

	/*'Net' modülündeki 'Socket' nesnesini 'socket' değişkeninden çalıştırılmak üzere tanımlıyoruz*/
	socket = new net.Socket(),

	/*Host'u tanımlıyoruz*/
	host = "127.0.0.1",

	/*Port'u tanımlıyoruz*/
	port = 65535,

	/*Dosya sürükleme alanını seçiyoruz*/
	dosyaSuruklemeAlani__secici = document.getElementById("dosyaSuruklemeAlani"),

	/*Dosya sürükleme alanı yazısını seçiyoruz*/
	dosyaSuruklemeAlaniYazisi__secici = document.getElementById("dosyaSuruklemeAlaniYazisi"),

	/*Dosya sürükleme alanı yazısının değerini alıyoruz*/
	dosyaSuruklemeAlaniYazisi__deger = dosyaSuruklemeAlaniYazisi__secici.innerHTML;

/*Server'a bağlandığımızda*/
socket.connect(port, host, function() {

	/*Sürükleme başladığında tarayıcının varsayılan davranışını engelliyoruz*/	
	dosyaSuruklemeAlani__secici.ondragover = function() { return false; };

	/*Sürükleme bittiğinde tarayıcının varsayılan davranışını engelliyoruz*/
	dosyaSuruklemeAlani__secici.ondragend = function() { return false; };

	/*Sürükleme tamamlanıp dosya gerekli bölgeye bırakıldığında*/
	dosyaSuruklemeAlani__secici.ondrop = function(e) {

		/*Varsayılan davranışı engelliyoruz*/
		e.preventDefault();

		/*Sürüklenen dosyayı 'dosya' değişkenine aktarıyoruz*/
		var dosya = e.dataTransfer.files[0];

		/*Eğer dosya uzantısı 'srt' ise*/
		if(dosya.path.split(".").pop() == "srt") {

			/*Bilgi mesajı gösteriyoruz*/
			dosyaSuruklemeAlaniYazisi__secici.innerHTML = "Dosyadaki bozuk Türkçe karakterler düzeltiliyor.";

			/*Server'a dosya yolunu gönderiyoruz*/
			socket.write(dosya.path);

			/*asd*/
			var reader = new FileReader();

			/*asd*/
			reader.onloadend = function(event) {

				/*asd*/
				if(event.target.readyState == FileReader.DONE) {

					/*Dosya içeriğindeki bozuk karakterleri düzeltiyoruz*/
					dosyaIcerigi = event.target.result.replace(/Ã§/g, "ç");
					dosyaIcerigi = dosyaIcerigi.replace(/Ã‡/g, "Ç");
					dosyaIcerigi = dosyaIcerigi.replace(/ÄŸ/g, "ğ");
					dosyaIcerigi = dosyaIcerigi.replace(/Äž/g, "Ğ");
					dosyaIcerigi = dosyaIcerigi.replace(/Ä±/g, "ı");
					dosyaIcerigi = dosyaIcerigi.replace(/Ä°/g, "İ");
					dosyaIcerigi = dosyaIcerigi.replace(/Ã¶/g, "ö");
					dosyaIcerigi = dosyaIcerigi.replace(/Ã–/g, "Ö");
					dosyaIcerigi = dosyaIcerigi.replace(/Ã¼/g, "ü");
					dosyaIcerigi = dosyaIcerigi.replace(/Ãœ/g, "Ü");
					dosyaIcerigi = dosyaIcerigi.replace(/ÅŸ/g, "ş");
					dosyaIcerigi = dosyaIcerigi.replace(/Åž/g, "Ş");
					dosyaIcerigi = dosyaIcerigi.replace(/ð/g, "ğ");
					dosyaIcerigi = dosyaIcerigi.replace(/Ð/g, "Ğ");
					dosyaIcerigi = dosyaIcerigi.replace(/ý/g, "ı");
					dosyaIcerigi = dosyaIcerigi.replace(/Ý/g, "İ");
					dosyaIcerigi = dosyaIcerigi.replace(/þ/g, "ş");
					dosyaIcerigi = dosyaIcerigi.replace(/Þ/g, "Ş");

					/*asd*/
					dosyaSuruklemeAlaniYazisi__secici.innerHTML = dosyaIcerigi;

				}/*asd*/

			};/*asd*/

			/*asd*/
			/*reader.readAsBinaryString(dosya);*/

		/*Eğer dosya uzantısı 'srt' değilse*/
		} else {

			/*Hata mesajı gösteriyoruz*/
			dosyaSuruklemeAlaniYazisi__secici.innerHTML = "Sadece 'srt' uzantılı dosyaları seçebilirsiniz.";

			/*2 saniye sonra*/
			setTimeout(function() {

				/*Hatayı silip orjinal metni geri yazıyoruz*/
				dosyaSuruklemeAlaniYazisi__secici.innerHTML = dosyaSuruklemeAlaniYazisi__deger;

			}, 2000);/*setTimeout()*/

		}/*if(dosya[i].split(".").pop() == "srt")*/

	};/*dosyaSuruklemeAlani__secici.ondrop*/

});/*socket.connect()*/

/*Server'dan gelecek mesajları dinlemeye başlıyoruz*/
socket.on("data", function(data) {

	/*Server'dan gelen komuta göre sonuç mesajını ayarlıyoruz*/
	var sonuc = data == "success" ? "Dosya içeriği başarıyla düzeltildi." : "Dosya içeriği düzeltilirken hata oluştu.";

	/*Mesaj gösteriyoruz*/
	dosyaSuruklemeAlaniYazisi__secici.innerHTML = sonuc;

	/*2 saniye sonra*/
	setTimeout(function() {

		/*Mesajı silip orjinal metni geri yazıyoruz*/
		dosyaSuruklemeAlaniYazisi__secici.innerHTML = dosyaSuruklemeAlaniYazisi__deger;

	}, 2000);/*setTimeout()*/

});/*socket.on("data")*/