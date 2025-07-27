const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gereken dosyaları statik olarak sun
app.use(express.static(__dirname));

// Giriş API'si
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Örnek kullanıcı verileri (üretimde veritabanından alınmalı)
    const users = {
        admin: { username: 'admin', password: 'admin123', role: 'admin' },
        user: { username: 'user', password: 'user123', role: 'user' }
    };

    if (users[username] && users[username].password === password) {
        const token = generateToken();
        res.json({
            token,
            user: {
                username: users[username].username,
                role: users[username].role
            }
        });
    } else {
        res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }
});

// Admin API'si
app.get('/api/admin/istatistikler', (req, res) => {
    // Token kontrolü
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Yetkisiz erişim' });
    }

    // Örnek istatistikler (üretimde veritabanından alınmalı)
    const istatistikler = {
        gonulluSayisi: 50,
        canDostSayisi: 120,
        destekSayisi: 250,
        raporSayisi: 150
    };

    res.json(istatistikler);
});

app.get('/api/admin/gonulluler', (req, res) => {
    // Token kontrolü
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Yetkisiz erişim' });
    }

    // Örnek gönüllü verileri (üretimde veritabanından alınmalı)
    const gonulluler = [
        { id: 1, ad: 'Ahmet', email: 'ahmet@example.com', rol: 'admin', durum: 'aktif' },
        { id: 2, ad: 'Ayşe', email: 'ayse@example.com', rol: 'user', durum: 'aktif' },
        { id: 3, ad: 'Mehmet', email: 'mehmet@example.com', rol: 'user', durum: 'beklemede' }
    ];

    res.json(gonulluler);
});

// Token oluşturma fonksiyonu
function generateToken() {
    return Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
}

// HTTPS sertifikası
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// Sunucuyu başlat
const server = https.createServer(options, app);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Sunucu HTTPS üzerinden ${PORT} portunda çalışıyor`);
});
