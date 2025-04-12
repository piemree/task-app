# UVW Mühendislik - Full Stack Engineer

## Görev Tanımı
Bir "İleri Düzey Görev Yönetim ve İş Akışı Uygulaması" geliştirin. Uygulama, görevlerin yanı sıra projeleri ve kullanıcı rolleri yönetimini içermelidir.

## Genel Gereksinimler

### Kullanıcı Yönetimi
- Kayıt, giriş ve JWT tabanlı yetkilendirme işlemleri
- Roller: Admin, Manager, Developer (roller arası yetki kontrolleri yapılmalı)

### Proje Yönetimi
- Kullanıcıların projeler oluşturabilmesi ve her projenin birden fazla görevi barındırması

### Görev Yönetimi
- Her görev, ilgili bir projeye ait olmalıdır
- Görevler için zorunlu alanlar:
  - `title`
  - `description`
  - `status` (pending, in-progress, completed)
  - `priority` (low, medium, high)
  - `assignedTo` (ilgili kullanıcı bilgisi)
- Görevlerin geçmiş durum değişiklikleri (log) tutulmalı (bonus puan)

### Bildirim Sistemi (Bonus)
- Gerçek zamanlı bildirim (örneğin, WebSocket) ile görevlere atama veya durum güncelleme bildirimleri ekleyerek ekstra puan kazanılabilir

## Back-End (Express.js + MongoDB)

### 1. API Tasarımı
- RESTful API endpoint'leri oluşturun
- Önerilen ana endpoint'ler:
  - `POST /auth/register`: Kullanıcı kayıt
  - `POST /auth/login`: Kullanıcı girişi
  - `GET /projects`: Kullanıcının yetkisine göre projelerin listelenmesi
  - `POST /projects`: Yeni proje oluşturma
  - `GET /projects/:id/tasks`: Belirli bir projeye ait görevlerin listelenmesi
  - `POST /projects/:id/tasks`: Projeye yeni görev ekleme
  - `PUT /tasks/:id`: Görev güncelleme (durum, öncelik vb.)
  - `DELETE /tasks/:id`: Görev silme

### 2. Mimari ve Yapı
- Proje yapısı, aşağıdaki katmanlara bölünmeli:
  - `routes/`
  - `controllers/`
  - `services/`
  - `models/`
  - `middlewares/`
- Authentication Middleware: JWT doğrulama ve rol tabanlı erişim kontrolü

### 3. Veritabanı
- MongoDB ile kullanıcı, proje ve görev şemaları oluşturulmalı
- Log Sistemi (Bonus): Görevler üzerindeki durum değişikliklerinin veya önemli aksiyonların loglanması için ayrı bir koleksiyon veya yapı oluşturulabilir

### 4. Testler (bonus)
- API endpoint'leri için entegrasyon testleri (örn. Jest, Mocha/Chai) yazılması beklenir

## Front-End (Next.js + Tailwind CSS)

### 1. Sayfa ve Rotalar
- **Giriş/Kayıt Sayfaları**: Kullanıcı kimlik doğrulaması için
- **Dashboard**:
  - Kullanıcının projeleri ve proje altındaki görevler listelenecek
  - Sayfa, SSR kullanılarak başlangıç verileri ile yüklensin
- **Proje Detay Sayfası**:
  - Seçilen projenin görevlerinin detaylı listesi; filtreleme ve sıralama seçenekleri sunulmalı
  - Görev ekleme, güncelleme ve silme işlemleri için CSR (örn. React Hooks, useState, useEffect) kullanılmalı

### 2. UI ve Bileşenler
- Tailwind CSS ile modern, responsive ve temiz bir arayüz tasarımı yapılmalı
- Bileşen bazlı yaklaşım: Örneğin, giriş formu, görev kartı, bildirim bileşeni (bildirim sistemi bonus olarak uygulanabilir) ayrı bileşenler olarak geliştirilmelidir

### 3. Durum Yönetimi
- Global state yönetimi Redux ile kullanıcı oturumu ve genel uygulama state'i yönetilmeli

### 4. Ek Özellikler
- Dinamik Routing: Proje ve görev detay sayfalarında dinamik routing kullanılmalı
- Bildirim Sistemi (Bonus): Gerçek zamanlı güncellemeler veya bildirimler eklenerek ekstra puan kazanılabilir
- Log Görüntüleme (Bonus): Kullanıcıların, görevlerin geçmiş durum değişikliklerini görüntüleyebilmesi için ek bir sayfa veya modül eklenebilir

## Teslim Şekli
- Projeyi Github repository'sine yükleyin
- README dosyasında:
  - Projeyi canlıya alıp linki ile beraber gönderilmesi
  - Kullanılan teknolojiler ve mimari yapı
  - Ek özellikler ve varsa test senaryoları
  - (Opsiyonel) Kısa bir mimari diyagram


