# flow kerja aplikasi

note:

- semua halaman selain "/" untuk akses read ataupun action harus connect wallet (wajib).
- user = (yang buat invoice / payee), client = (payer atau yang akan membayar invoicenya)

1. user ingin membuat invoice untuk client, pertama dia pergi ke "/create" disitu dia harus mengisi form yang sudah disedikan di frotnend mocknya, beberapa fieldnya disitu antara lain: "client_name", "description", "amount" in STRK native token, dan "client address" atau address wallet si client atau orang yang akan membayar invoice tersebut.

kemudian setelah mengisi semua fieldnya, beberapa data field tadi akan dijadikan satu compact bersama addresss si user (dapat dari dia connect wallet), kemudian diencyrpted jadi satu string dengan menggunakan address si user dan juga si client sebagai key/identifier jika mau decodenya balik, kemudian setelah stringnya jadi terus dipasing dan si
user akan memanggil fungsi write pada smart contract starknet untuk membuat invoice dan menggunakan encrypted string tadi sebagai parameter, disini invoice yang dibuat status defaultnya adalah pending atau belum dibayarkan.

2. setelah invoice dibuat initialnya oleh smart contract, nanti akan digenerate link berdasarkan random key number dari smart contract tadi dan encyrpted string tadi kemudian nanti si user akan copy link hasil generate tadi kemudian dikirim ke si client untuk dia bayar invoicenya.

3. pov client: setelah client dapat link url tadi dan dia buka linknya, maka akan masuk ke "/pay?invoice=[encrypted string]&keyid=[random key number dari smart contract]" karena harusnya encrypted string ini (bisa unik) dibuat dari payload semua field dari create form tadi (termasuk client address) + address si user (dari connected wallet), harusnya nanti bisa dilakukan decode untuk menampilkan nilai payloadnya berdasarkan address dari si client yang saat ini juga connected dengan walletnya.
   setelah client dapat membuka linknya, hal pertama yang akan dilakukan adalah memanggil fungsi read di smart contract (verifier) untuk memerika apakah ini invoice ini valid atau tidak berdasarkan status invoice dan address yang saat ini connected wallet, jika valid decode dan tampilkan nilainya.

remember: jika link ini didapatkan orang lain selain dari si client atau si user, dan kemudian mereka coba untuk decode dengan connect wallet mereka dan ternyata tidak sesuai karena addressnya bukan client ataupun user jadinya nilainya tidak akan bisa ditampilkan karena tidak bisa di decode.

4. pov client: setelah invoice valid untuk dibayar si client dan nilai hasil decodenya tampil kemudian si client bisa mengklik pay sebesar amount STRK yang tertera dan memanggil fungsi write dari smart contract untuk membayarnya dan melunasi invoice, setelah client membayar maka statusnya akan berubah jadi "PAID", dan invoice tadi akan masuk disave di event pada smart contract, tentunya nilainya akan diencrypt juga berdasarkan address dari si client dan si user untuk kedepannya bisa di query dan didecode juga untuk ditampikan di halaman history dan history detail.

5. pov user ataupu client: pada "/history" disini akan menampilkan semua history yang pernah ada atau setidaknya pernah terkait dengan address mereka (yang connected wallet), disini bakal query event invoice yang pernah ada berdasarkan connected address nya entah dia client atau user.

6. pov user ataupun client: pada "/history/[invoice id]" disini kurang lebib cuma read/nampilin detail invoicenya mirip seperti di "/pay" tadi bedanya mungkin ada beberapa detail seperti status invoice, created at dan payment at untuk memperjelas detail invoice ini, juga ada tombol untuk copy url bagi si user jika invoice belum dibayar

---

# tech stack untuk smart contract:

     - starknet foundry
     - garaga, untuk generate cairo contract verifier dari noir code
     - noir (kalo butuh sih untuk buat zk nya)



# architecture

karena ini untuk hackathon jadi saya prefer simple saja yang penting jalan, untuk deploy contractnya ada 2 yaitu main logic aplikasinya dan verifier contractnya yang nanti mungkin bakal dipake untuk consume verifier di main contractnya, untuk frontendnya nanti saya pake next js dan expectnya saya tinggal perlu berinteraksi langsung ke main contractnya tanpa harus nyentuh verifier contractnya karena itu harusnya jadi ranah antara main contract dan verifier contractnya.
