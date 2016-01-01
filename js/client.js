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