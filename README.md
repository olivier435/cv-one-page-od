# 🌐 CV — Olivier DEHEZ

Portfolio et CV en ligne développé en **HTML**, **CSS**, **JavaScript** et **PHP**, avec intégration de **PHPMailer** pour la gestion du formulaire de contact.  
Le site est automatiquement déployé sur **GitHub Pages** à chaque mise à jour de la branche `main`.

---

## 💡 Technologies utilisées
- **HTML5** — structure et sémantique  
- **CSS3** — mise en forme responsive simple  
- **JavaScript** — logique de vérification et interactions dynamiques  
- **PHP** — gestion du formulaire et envoi d'e-mails  
- **GitHub Pages** — hébergement statique gratuit  
- **Mailtrap + PHPMailer** — envoi sécurisé et testable des messages

---

## 🚀 Déploiement automatique
``` bash
.github/workflows/deploy-pages.yml
```

À chaque **push** sur la branche `main`, le workflow :
1. Récupère le code du dépôt. 
2. Configure l'environnement GitHub Pages.  
3. Transfère les fichiers statiques (`index.html`, `assets/`, `forms/`, etc.).  
4. Déploie le site en ligne sur l'URL publique fournie par GitHub. 

---

## 💻 Exécution en local
Pour lancer le site en local sans serveur Apache ni Nginx, tu peux utiliser le serveur intégré de PHP :

```bash
php -S localhost:8000
```

---

## 📧 Configuration de Mailtrap avec PHPMailer
Le projet utilise **PHPMailer** (voir composer.json) pour gérer l'envoi de messages via le formulaire de contact.

**Étapes de configuration**
1. **Création du fichier** `.env.local` à la racine du projet (non versionné, voir `.gitignore`) :

```bash
APP_ENV=dev
MAIL_TO=votre@email.com
MAIL_FROM=votre@email.com
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=XXXXXXXXXXXXXX
SMTP_PASS=XXXXXXXXXXXXXX
SMTP_SECURE=tls
SIMULATE_MAIL=0
```

2. **Récupérer vos identifiants Mailtrap**
- Connectez-vous à votre compte [Mailtrap](https://mailtrap.io/)
- Allez dans **Inboxes → Integration → PHPMailer**
- Copiez les paramètres d'intégration et collez-les dans `.env.local`

3. **Tester le formulaire de contact**
- Lancer le serveur local avec `php -S localhost:8000`
- Ouvrir la section **Contact** du site
- Remplir et soumettre le formulaire pour vérifier la réception dans Mailtrap

---

## 📦 Dépendances
- PHPMailer — Gestion de l'envoi d'e-mails
Installé via Composer :

```bash
composer install
```

---

## 🧱 Structure du projet

```pgsql
.
├── assets/
│   ├── css/
│   ├── img/
│   ├── doc/
│   ├── js/
│   └── vendor/
├── forms/
│   └── config.php
│   └── contact.php
├── index.html
├── .env
├── .env.local         # À créer avec vos identifiants Mailtrap
├── .gitignore
├── composer.json
├── composer.lock
└── .github/
    └── workflows/
        └── deploy-pages.yml
```
---

## 🌐 Démo en ligne
Projet déployé automatiquement sur **GitHub Pages** :