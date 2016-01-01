/*'Electron' modülünü 'electron' değişkeninden çalıştırılmak üzere tanımlıyoruz*/
var electron = require("electron"),

	/*Uygulamayı kontrol edebilmek için 'app' modülünü tanımlıyoruz*/
	app = electron.app,

	/*Native tarayıcı penceresi oluşturabilmek için 'BrowserWindow' modülünü tanımlıyoruz*/
	browserWindow = electron.BrowserWindow,

	/*NodeJs'in 'fileSystem' modülünü 'fs' değişkeninden çalıştırılmak üzere tanımlıyoruz*/
	fs = require("fs"),

	/*NodeJs'in 'network' modülünü 'net' değişkeninden çalıştırılmak üzere tanımlıyoruz*/
	net = require("net"),

	/*Host'u tanımlıyoruz*/
	host = "127.0.0.1",

	/*Port'u tanımlıyoruz*/
	port = 65535,

	/*Pencere nesnesi için boş bir değişken oluşturuyoruz, aksi takdirde Javascript nesnesinde çöp biriktiğinde pencere otomatik kapanabilir*/
	pencere = null;

/*Tüm pencereler kapandığında*/
app.on("window-all-closed", function() {

	/*İşletim sistemi Darwin(OS X) değilse*/
	if(process.platform != "darwin") {

		/*Uygulamadan çıkış yapıyoruz*/
		app.quit();

	}/*if(process.platform != "darwin")*/

});/*app.on("window-all-closed")*/

/*Electron ve tarayıcı pencereleri hazır olduğunda*/
app.on("ready", function() {

	/*Bir server oluşturuyoruz ve onu dinlemeye başlıyoruz*/
	net.createServer(function(socket) {

		/*Client'tan data geldiğinde*/
		socket.on("data", function(data) {

			/*Electron içerisindeki bir bug yüzünden data'yı string'e çeviriyoruz yoksa hata alıyoruz*/
			data = data.toString();

			/*Dosyayı okuyoruz*/
			fs.readFile(data, "utf8", function(hata1, dosyaIcerigi) {

				/*Hata varsa gösteriyoruz*/
				if(hata1) throw hata1;

				/*Dosya içeriğindeki bozuk karakterleri düzeltiyoruz*/
				dosyaIcerigi = dosyaIcerigi.replace(/Ã§/g, "ç");
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

				/*Dosyaya yazıyoruz*/
				fs.writeFile(data, dosyaIcerigi, "utf8", function(hata2) {

					/*Hata varsa gösteriyoruz*/
					if(hata2) throw hata2;

					/*Client'a dosya yolunu gönderiyoruz*/
					socket.write(hata2 ? "error" : "success");

				});/*fs.writeFile()*/

			});/*fs.readFile()*/

		});/*socket.on("data")*/

	}).listen(port, host);/*net.createServer()*/

	/*Tarayıcı penceresini oluşturuyoruz*/
	pencere = new browserWindow({width: 640, height: 440, center: true, resizable: true});

	/*Pencereye belirlediğimiz URL'yi yüklüyoruz*/
	pencere.loadURL("file://" + __dirname + "/../index.html");

	/*Pencere kapandığında*/
	pencere.on("closed", function() {

		/*Pencere değişkenini boşaltıyoruz*/
		pencere = null;

	});/*pencere.on("closed")*/

	/*Developer Tools'u açıyoruz*/
	/*pencere.webContents.openDevTools();*/

});/*app.on("ready")*/