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

	/*NodeJs için yapılmış 'iconv-lite' modülünü 'iconvlite' değişkeninden çalıştırılmak üzere tanımlıyoruz*/
	iconvlite = require("iconv-lite"),

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

			/*Dosyayı iconvlite ile okuyoruz*/
			dosyaIcerigi = iconvlite.decode(fs.readFileSync(data), "win1252");

			/*Dosya içerisindeki karakterleri düzeltiyoruz*/
			dosyaIcerigi = dosyaIcerigi.replace(/ð/g, "ğ");
			dosyaIcerigi = dosyaIcerigi.replace(/Ð/g, "Ğ");
			dosyaIcerigi = dosyaIcerigi.replace(/ý/g, "ı");
			dosyaIcerigi = dosyaIcerigi.replace(/Ý/g, "İ");
			dosyaIcerigi = dosyaIcerigi.replace(/þ/g, "ş");
			dosyaIcerigi = dosyaIcerigi.replace(/Þ/g, "Ş");

			/*Değiştirilmiş içeriği dosyaya utf-8 formatında yazıyoruz*/
			fs.writeFile(data, dosyaIcerigi, "utf8", function(hata2) {

				/*Hata varsa gösteriyoruz*/
				if(hata2) throw hata2;

				/*Client'a sonuç durumunu gönderiyoruz*/
				socket.write(hata2 ? "error" : "success");

			});/*fs.writeFile()*/

		});/*socket.on("data")*/

	}).listen(port, host);/*net.createServer()*/

	/*Tarayıcı penceresini oluşturuyoruz*/
	pencere = new browserWindow({width: 640, height: 400, center: true, resizable: false});

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