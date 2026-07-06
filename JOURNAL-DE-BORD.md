# Journal de bord — Projet 4 : Audit, sécurisation et maintenance de GameVibe

Ce document existe pour une seule raison : que tu puisses comprendre et réexpliquer avec tes mots, devant le jury, tout ce qui a été fait sur ce projet — pas juste "ça a été fait", mais **pourquoi** et **comment**.

---

## 1. Le contexte : c'est quoi ce projet, au juste ?

C'est ton **dernier bloc de certification** (Développeur Multimédia, bloc A4 : "Maintenance et optimisation des systèmes numériques").

Le scénario : tu as **hérité du projet d'un autre élève** (GameVibe, une app de jeux vidéo avec un backend Laravel/PHP et un frontend React). Tu ne l'as pas codé toi-même — ton rôle n'est pas de construire, c'est de **reprendre un code existant et prouver que tu sais** :

1. Le **surveiller** en continu (supervision)
2. Trouver ce qui cloche dedans (**audit**)
3. **Réparer** sans tout casser
4. **Documenter** pour que quelqu'un d'autre (ou le jury) puisse comprendre après toi

C'est le travail réel d'un dev en maintenance, pas d'un dev qui part de zéro.

### Ce que tu dois rendre à la fin
1. Le repo GitHub avec tes commits de correctifs
2. Des rapports d'audit
3. Une documentation technique (architecture + déploiement + tests)
4. Des slides pour ta soutenance orale (20 min)

### Les 3 compétences notées par le jury

| Compétence | Ce qu'elle vérifie |
|---|---|
| **4.1** Supervision & sécurisation | As-tu mis en place des outils qui surveillent l'appli **en continu**, avec des alertes et des protections ? |
| **4.2** Diagnostiquer & corriger | Sais-tu **trouver** une anomalie (perf, sécurité, conformité), comprendre sa cause, et la **corriger sans régression** ? |
| **4.3** Documentation | Sais-tu écrire une doc claire, structurée, utile à quelqu'un d'autre ? |

Tout ce qu'on fait depuis le début se range dans une de ces 3 cases. C'est le fil conducteur.

---

## 2. Ce qu'on a fait, dans l'ordre chronologique

### Étape 1 — Sentry : l'outil de supervision (compétence 4.1)

**Le besoin** : le brief demande de "configurer des outils de supervision (Grafana, Kibana, Prometheus, **Sentry**, Datadog…)". Sentry est un service qui capte automatiquement les erreurs de l'application (backend ET frontend) **en temps réel**, dès qu'elles arrivent en production ou en dev — sans que personne n'ait à regarder des logs manuellement.

**Ce qui a été installé/branché :**
- **Backend (Laravel)** : le package `sentry/sentry-laravel` a été ajouté à `backend/composer.json`. Un fichier de config a été généré (`backend/config/sentry.php`). Et dans `backend/bootstrap/app.php`, une ligne (`Sentry\Laravel\Integration::handles($exceptions)`) a été ajoutée pour dire à Laravel "à chaque exception non gérée, envoie-la à Sentry en plus de la logguer normalement".
- **Frontend (React)** : le package `@sentry/react` a été ajouté à `frontend/package.json`. Dans `frontend/src/main.jsx`, `Sentry.init(...)` initialise la connexion à Sentry (seulement si une clé `VITE_SENTRY_DSN` est présente), et toute l'application (`<App />`) a été entourée d'un `<Sentry.ErrorBoundary>` : si un composant React plante pendant l'affichage, on voit un message propre au lieu d'un écran blanc, **et** l'erreur remonte à Sentry.
- **Docker** : `docker-compose.yml` (dev) et `docker-compose.prod.yml` (prod) ont été modifiés pour transmettre les clés Sentry (`SENTRY_LARAVEL_DSN`, `VITE_SENTRY_DSN`) aux conteneurs.

**Le DSN, c'est quoi ?** DSN = "Data Source Name". C'est l'adresse unique qui dit à ton code "envoie tes erreurs à CE projet précis sur Sentry.io". Chaque projet Sentry (on en a créé 2 : un "Laravel" et un "React") a son propre DSN.

**Où sont rangées les clés (DSN) concrètement :**

| Fichier | Qui le lit | Rôle |
|---|---|---|
| `backend/.env` | Laravel (PHP), au runtime | `SENTRY_LARAVEL_DSN=...` |
| `frontend/.env` | Vite, **au moment du build** | `VITE_SENTRY_DSN=...` |
| `.env` (racine) | `docker-compose`, pour injecter les 2 variables dans les conteneurs | les deux DSN |

Ces 3 fichiers `.env` sont dans le `.gitignore` → **rien n'est jamais poussé sur GitHub en clair**. Pour la prod (ex: Railway), il faudra recopier ces mêmes valeurs directement dans les variables d'environnement du service d'hébergement (pas dans un fichier commité).

Point important à retenir : côté React, le DSN est **inline dans le JavaScript compilé** au moment du build (ce n'est pas un vrai secret runtime). C'est normal et sans danger pour un DSN Sentry : il permet seulement d'envoyer des erreurs, pas de lire quoi que ce soit.

**Comment on a vérifié que ça marche pour de vrai** (et pas juste "configuré sur le papier") :
1. On a rebuild les conteneurs Docker (`docker compose down && docker compose up -d --build`) pour que le frontend récupère bien le DSN au build.
2. **Backend** : on a ajouté une route temporaire `GET /api/test-sentry` qui fait juste `throw new Exception(...)`. On l'a appelée avec `curl`, elle a répondu `500` (normal, c'est voulu), et on a vérifié dans les logs (`storage/logs/laravel.log`) que l'exception passait bien par toute la chaîne Sentry (`Sentry\Laravel\Tracing\...`, `FlushEventsMiddleware`, etc.) avant d'être logguée.
3. **Frontend** : dans la console du navigateur (F12), on a exécuté `throw new Error('Test Sentry frontend')`. Le SDK Sentry intercepte automatiquement les erreurs JS non catchées.
4. **Toi**, tu es allé vérifier sur sentry.io que les deux erreurs de test apparaissaient bien dans les deux projets (Laravel et React) → **preuve concrète pour l'oral**.
5. On a ensuite **supprimé** la route de test (`/api/test-sentry`), elle n'avait plus d'utilité.

➡️ **Ce qui reste à faire sur Sentry pour boucler complètement la compétence 4.1** : configurer des **alertes** (ex: "si plus de X erreurs en Y minutes → notifie par email"), pas juste capter les erreurs silencieusement. Pas encore fait.

---

### Étape 2 — Scanners de vulnérabilités : `composer audit` et `npm audit` (toujours compétence 4.1)

**Le besoin** : le brief demande aussi (toujours dans le point 1) d'"installer des outils d'analyse des risques de sécurité (**npm audit**, Dependabot, Trivy, OWASP ZAP…)". `npm audit` est cité **mot pour mot**. `composer audit` est son équivalent côté PHP.

**Ce que fait cet outil** : ton application dépend de centaines de "packages" (bibliothèques de code écrites par d'autres) — Laravel, Guzzle, React, etc. `composer audit` et `npm audit` comparent la liste exacte des versions que tu utilises avec une base de données mondiale de failles de sécurité connues, et te disent "ta version de tel package est vulnérable, mets à jour".

**Résultat obtenu (première exécution)** : 4 vulnérabilités trouvées :

| Package | Version installée | Version corrigée | Le problème |
|---|---|---|---|
| `guzzlehttp/guzzle` | 7.10.5 | ≥7.12.1 | gestion des cookies + downgrade HTTPS→HTTP silencieux |
| `guzzlehttp/psr7` | 2.10.4 | ≥2.12.1 | injection CRLF dans les en-têtes HTTP |
| `laravel/framework` | 12.61.0 | ≥12.61.1 | confusion sur les URLs signées temporaires |
| `form-data` (npm, via axios/cypress) | 4.0.5 | ≥4.0.6 | injection CRLF dans les noms de champs multipart |

**C'est qui/quoi, ces packages ?**
- **`guzzlehttp/guzzle`** : une bibliothèque PHP qui sert à faire des requêtes HTTP **sortantes** (appeler une API externe, télécharger un fichier...). GameVibe ne l'appelle pas forcément lui-même directement — c'est une dépendance utilisée en coulisses par d'autres packages (par exemple Sentry l'utilise pour envoyer les erreurs vers sentry.io).
- **`laravel/framework`** : c'est **Laravel lui-même**, le cœur du backend de GameVibe — routage (`Route::get(...)`), accès à la base de données (Eloquent), contrôleurs, authentification, etc. Une faille dedans, ce n'est pas une dépendance annexe : c'est le moteur central de l'application qui est concerné.

**C'est quoi un "CVE" ?** *Common Vulnerabilities and Exposures*. Un identifiant unique et public (ex: `CVE-2026-55766`) donné à chaque faille de sécurité **connue et documentée**. Le format est `CVE-` + année + numéro. Ça sert de "nom de code" universel reconnu par tous les outils de sécurité du monde — c'est ce qui permet à `composer audit` de savoir instantanément que ta version est concernée.

**Pourquoi c'est important de le dire clairement à l'oral** : ces 4 lignes ne sont pas des suppositions ou des "bonnes pratiques génériques" — ce sont des failles **réelles, publiées, documentées publiquement**, qui concernaient vraiment ton projet. C'est exactement la matière attendue pour l'audit sécurité de la compétence 4.2.

---

### Étape 3 — Corriger les CVE (compétence 4.2, la partie "corriger")

**Commande backend** :
```
docker compose exec backend composer update laravel/framework guzzlehttp/guzzle guzzlehttp/psr7 --with-all-dependencies
```
- `docker compose exec backend` : exécute la commande **à l'intérieur du conteneur Docker** `backend` (c'est là que PHP et Composer sont installés, pas sur ta machine Windows directement).
- `composer update <package1> <package2> <package3>` : met à jour **seulement ces 3 packages précis** (pas tout le projet d'un coup — plus sûr, et plus facile à justifier à l'oral qu'un `update` global qui bougerait tout le lockfile sans qu'on sache pourquoi).
- `--with-all-dependencies` : autorise Composer à mettre à jour aussi les dépendances internes de ces 3 packages si nécessaire pour que tout reste compatible (c'est pour ça que des packages `symfony/*` ont bougé aussi dans les logs — ce sont des dépendances de Laravel).

**Un blocage rencontré** : la première tentative a échoué avec `Could not resolve host: repo.packagist.org` — le conteneur Docker n'avait temporairement pas accès à internet (pas un bug du projet, un souci réseau ponctuel). Une fois le réseau revenu, la commande a réussi.

**Résultat** : `guzzlehttp/psr7` 2.10.4→2.12.3, `guzzlehttp/guzzle` 7.10.5→7.13.2, `laravel/framework` 12.61.0→12.62.0. Un nouveau `composer audit` derrière confirme : **"No security vulnerability advisories found."**

**Commande frontend** :
```
docker compose exec frontend npm audit fix
```
- Regarde les CVE trouvées par `npm audit` et met à jour automatiquement les packages concernés vers une version corrigée, **sans faire de mise à jour majeure/breaking** (contrairement à `npm audit fix --force`, qu'on n'a volontairement pas utilisé).
- Résultat : `form-data` mis à jour, **0 vulnérabilités** restantes.

---

### Étape 4 — Vérifier qu'on n'a rien cassé (non-régression)

Le brief est explicite : *"La solution mise en œuvre corrige l'anomalie **sans introduire de régression** dans les fonctionnalités existantes."* Une mise à jour de dépendances peut toujours casser un comportement existant — il faut le prouver, pas juste l'espérer.

- `curl http://localhost/api/jeux` → toujours `200 OK`.
- `php artisan test` (la suite de tests automatisés du backend) → **62 tests passés, 103 assertions**, aucun échec.

➡️ Preuve concrète que la correction des CVE n'a rien cassé.

---

### Étape 5 — Trivy : scanner l'image Docker (compétence 4.1)

Le brief cite Trivy explicitement (« Installer des outils d'analyse des risques de sécurité ... Trivy ... »). Trivy scanne une image Docker construite (pas juste les dépendances applicatives comme composer/npm) et regarde les CVE du **système d'exploitation** à l'intérieur de l'image.

**Commande** :
```
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL gamevibe-backend
```
(sur Windows/Git Bash, il faut préfixer avec `MSYS_NO_PATHCONV=1` sinon le chemin du socket Docker est mal interprété.)

**Résultat initial** : 72 vulnérabilités HIGH/CRITICAL, toutes dans la couche système **Debian** de l'image de base (`php:8.2-fpm`) — 0 côté dépendances PHP (`composer-vendor`), confirmant que le travail de l'étape 3 avait bien nettoyé cette couche-là.

**Analyse** : la plupart de ces CVE Debian n'ont pas encore de correctif disponible côté Debian lui-même, et certaines (ex: le noyau Linux, `linux-libc-dev`) ne sont même pas exploitables dans un conteneur (le noyau n'y tourne pas, il est partagé avec l'hôte) — un point important à savoir nuancer à l'oral plutôt que de paniquer sur "72 CRITICAL".

**Correctif appliqué** : changement de l'image de base dans `backend/Dockerfile`, de `php:8.2-fpm` (Debian) vers `php:8.2-fpm-alpine` (Alpine, une distribution Linux beaucoup plus minimaliste = moins de paquets = moins de failles). Ça a demandé de réécrire aussi les lignes d'installation système : `apt-get` (Debian) n'existe pas sur Alpine, remplacé par `apk`, avec les noms de paquets équivalents (ex: `libonig-dev` → `oniguruma-dev`).

**Vérifié sans régression** : build OK, `curl /api/jeux` → 200, 62/62 tests passés.

**Résultat final** : **0 vulnérabilité HIGH/CRITICAL** (contre 72 avant) sur la couche système.

➡️ Committé séparément (`fix: passer l'image backend sur Alpine...`), poussé sur le fork.

---

### Étape 6 — OWASP ZAP : scanner l'application en conditions réelles (compétence 4.2, audit OWASP Top 10)

ZAP fait un scan **dynamique** : contrairement à composer/npm audit ou Trivy (qui regardent des fichiers/images statiquement), ZAP envoie de vraies requêtes HTTP contre l'application qui tourne, ici directement contre l'URL de prod Railway.

**Commande** (image à jour, l'ancienne `owasp/zap2docker-stable` citée dans certains tutos n'existe plus) :
```
docker run --rm -v "$(pwd)":/zap/wrk zaproxy/zap-stable zap-baseline.py -t https://remarkable-generosity-production.up.railway.app/ -r zap-report.html
```
Un scan "baseline" = passif seulement (il observe les réponses, il n'essaie pas d'exploiter activement) — safe à lancer sur une URL de prod.

**Résultat** : **0 FAIL, 10 WARN, 57 PASS**. Rapport complet dans `zap-report.html` (racine du projet). Aucune faille critique, mais 10 avertissements — presque tous des **en-têtes de sécurité HTTP manquants** :

| En-tête manquant | Risque |
|---|---|
| `X-Frame-Options` | Clickjacking (site tiers qui affiche GameVibe en iframe invisible) |
| `X-Content-Type-Options` | Le navigateur peut mal interpréter un type de fichier (renforce XSS via upload) |
| `Strict-Transport-Security` (HSTS) | Pas de forçage HTTPS strict côté navigateur |
| `Content-Security-Policy` (CSP) | Pas de restriction sur les scripts/ressources chargeables — la protection anti-XSS la plus efficace, absente |
| `Permissions-Policy` | Pas de restriction sur les API navigateur sensibles |
| `Cross-Origin-Embedder-Policy` | Fuite cross-origin possible (type Spectre) |
| Cache-Control / contenu cacheable | Des réponses pourraient être mises en cache alors qu'elles ne devraient pas |
| Sub Resource Integrity (SRI) | Les fichiers JS/CSS chargés n'ont pas de hash d'intégrité vérifiable |

**⚠️ Décision prise avec l'utilisateur : ne pas corriger tout de suite.** Ces 10 points sont **réservés pour une session dédiée au durcissement** (ajout des en-têtes de sécurité, côté Nginx et/ou middleware Laravel) — à ne pas oublier, ça compte à la fois pour 4.1 (protocoles de sécurité) et 4.2 (corriger les anomalies OWASP).

---

### Étape 7 — Prometheus + Grafana + cAdvisor : le CPU/RAM en temps réel (compétence 4.1, dernier point)

La grille de notation de la 4.1 demande explicitement des métriques **CPU/RAM**, pas seulement les erreurs/temps de réponse que Sentry fournit déjà. Il fallait un outil dédié.

**Pourquoi 3 services et pas juste "Grafana"** : Grafana ne sait pas lire les métriques brutes de cAdvisor tout seul — il a besoin d'une source de données interrogeable dans le temps. La chaîne complète :
1. **cAdvisor** collecte le CPU/RAM/réseau de chaque conteneur.
2. **Prometheus** interroge cAdvisor toutes les 15s (`monitoring/prometheus.yml`) et stocke l'historique.
3. **Grafana** interroge Prometheus et affiche des dashboards.

Ajoutés dans `docker-compose.yml`. Source de données Prometheus branchée automatiquement dans Grafana via son API (`POST /api/datasources`), pas besoin de le faire à la main dans l'interface.

**Deux incidents rencontrés et corrigés en cours de route** :
1. Le disque C: de la machine était plein à 100% (0 octet libre) → ça a corrompu le cache interne de Docker Desktop (`input/output error` jusque dans sa base de métadonnées). Résolu en libérant de l'espace puis en redémarrant Docker Desktop proprement.
2. L'image `grafana/grafana:latest` plantait systématiquement au démarrage (`SIGSEGV`, code de sortie 139) — une build cassée sur Docker Hub au moment du test, pas un problème du projet. Corrigé en épinglant une version stable : `grafana/grafana:11.2.0`.

**Accès** : Grafana → http://localhost:3000 (`admin`/`admin`) · Prometheus → http://localhost:9090 · cAdvisor → http://localhost:8081. Dashboard communautaire recommandé pour visualiser tout de suite : import de l'ID `19792` dans Grafana.

➡️ Committé et poussé (`feat: ajouter supervision CPU/RAM avec cAdvisor, Prometheus et Grafana`).

**Ça boucle la compétence 4.1 dans son ensemble** (sous réserve du durcissement des en-têtes, reporté — voir étape 6).

---

### Étape 8 — Durcissement des en-têtes de sécurité (compétences 4.1 et 4.2, correctif du diagnostic ZAP)

Retour sur les 10 avertissements trouvés à l'étape 6 : presque tous des en-têtes HTTP manquants. On les corrige enfin.

**Où ça se corrige** : pas dans le code métier, mais dans la couche qui répond en dernier au navigateur. `docker-compose.yml` et `frontend/Dockerfile` montrent que Nginx est devant tout (dev ET prod Railway) — c'est donc là que les en-têtes s'ajoutent, avec la directive `add_header ... always;`. Le `always` compte : sans lui, l'en-tête n'est ajouté que sur les réponses 200-399, pas sur les pages d'erreur.

**Comment on sait quoi mettre** : le rapport `zap-report.html` donne, pour chaque alerte, un champ **Description**, **Solution** et parfois **Parameter** qui nomme le header exact. Exemple réel, copié du rapport :
> *Missing Anti-clickjacking Header* → Parameter : `x-frame-options` → solution directe, valeur universelle (`X-Frame-Options: DENY`).
> *CSP Header Not Set* → solution vague (« configurez le header ») car **la valeur n'est pas universelle** — elle dépend de ce que l'appli charge réellement. Trouvé par `grep` dans le code : `fonts.googleapis.com` (police) et `via.placeholder.com` (images de secours), ajoutés explicitement dans le CSP.

**En-têtes ajoutés** (`frontend/nginx.conf` pour la prod, `nginx/default.conf` pour le dev, + un nouveau middleware Laravel `SecurityHeaders` pour l'API) :
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security`
- `Content-Security-Policy` (sur mesure pour GameVibe)
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

**Volontairement pas fait** :
- `Cross-Origin-Embedder-Policy` : dépend des en-têtes envoyés par des domaines tiers (Google Fonts, via.placeholder.com) non maîtrisables — risque de casser le chargement de ressources externes sans pouvoir le garantir.
- Réglage fin du `Cache-Control` par route.
- Sub Resource Integrity (SRI) : ne se fait pas via un header, mais au moment du build (hash des fichiers JS/CSS) — nécessite un plugin Vite dédié.

**Incidents rencontrés et corrigés en le faisant** :
1. **502 après rebuild** : nginx n'avait pas redémarré après que backend/frontend aient été recréés (nouvelles IP internes) — `docker compose restart nginx` a réglé ça.
2. **En-têtes en double sur `/api/`** : Nginx et Laravel les ajoutaient tous les deux — restreint Nginx à la partie frontend uniquement.
3. **Page blanche en dev** : le CSP bloquait les scripts inline du serveur de dev Vite (HMR/React Fast Refresh). CSP relâchée (`'unsafe-inline' 'unsafe-eval'`) **uniquement** dans `nginx/default.conf` (dev) — le build de prod n'a aucun script inline donc reste strict.
4. **2 alertes ratées au premier passage** : j'avais tronqué la sortie du terminal (`tail -200`) en lisant les résultats ZAP, ce qui a fait sauter `Cross-Origin-Opener-Policy` et `Cross-Origin-Resource-Policy` du résumé — repérées en relisant le `zap-report.html` complet, puis ajoutées.

**Vérifié sans régression** : 62/62 tests backend passés, build de prod testé en standalone (headers présents, page charge), page rechargée en dev par l'utilisateur → OK.

➡️ Committé et poussé (`fix: durcir les en-tetes de securite HTTP (audit OWASP ZAP)`).

---

### Récap express — Compétence 4.1, tout ce qu'on a installé et pourquoi

| Outil | Ça sert à quoi | Ce qu'on a récolté grâce à lui |
|---|---|---|
| **Sentry** (backend + frontend) | Capter chaque erreur et le temps de réponse, en continu | Les erreurs de test remontent bien dans les 2 dashboards — supervision confirmée en vrai |
| **composer audit / npm audit** | Scanner les bibliothèques tierces (PHP + JS) contre une base de CVE connues | 4 vulnérabilités trouvées : `guzzlehttp/guzzle`, `guzzlehttp/psr7`, `laravel/framework`, `form-data` |
| **Trivy** | Scanner l'image Docker entière (le système dedans, pas juste le code) | 72 vulnérabilités HIGH/CRITICAL dans l'image Debian de base → 0 après passage sur Alpine |
| **Dependabot** (GitHub) | Surveillance continue des dépendances directement sur GitHub | Activé — GitHub confirme de lui-même les mêmes failles trouvées |
| **OWASP ZAP** | Scanner l'appli en conditions réelles (vraies requêtes HTTP contre la prod) | 0 faille critique, 12 avertissements (en-têtes manquants) → 7 corrigés, 3 volontairement laissés de côté (voir étape 8) |
| **cAdvisor + Prometheus + Grafana** | Voir le CPU/RAM en temps réel de chaque conteneur | Dashboard fonctionnel sur `localhost:3000` |

**En une phrase pour l'oral** : *"6 outils, chacun sur une couche différente — supervision continue (Sentry), dépendances (composer/npm audit + Dependabot), image Docker (Trivy), application vivante (ZAP), infrastructure (Prometheus/Grafana)."*

---

## 3. Où on en est réellement, objectif par objectif

| Point du brief | Sous-point | Statut |
|---|---|---|
| 1. Supervision | Outil de supervision temps réel | ✅ Sentry installé, branché, testé (backend + frontend) |
| 1. Supervision | Scanner de vulnérabilités (composer/npm audit) | ✅ fait |
| 1. Supervision | Trivy (scan image Docker) | ✅ fait — 72 → 0 vulnérabilités HIGH/CRITICAL après passage Alpine |
| 1. Supervision | Dependabot (GitHub) | ✅ activé par l'utilisateur directement dans les settings GitHub |
| 1. Supervision | Alertes Sentry (seuils sur erreurs/perf) | Selon l'utilisateur : fait de son côté (non vérifié dans cette session) |
| 1. Supervision | CPU/RAM temps réel (cAdvisor + Prometheus + Grafana) | ✅ fait, committé et poussé — http://localhost:3000 |
| 1. Supervision | Protocoles de sécurité (en-têtes HTTP, durcissement) | ✅ fait, committé et poussé — 7/12 en-têtes corrigés, 3 laissés de côté volontairement (voir étape 8) |
| 2. Diagnostiquer | Audit de sécurité — CVE des dépendances | ✅ fait (composer/npm audit) |
| 2. Diagnostiquer | Audit de sécurité — OWASP (scan dynamique ZAP) | ✅ fait — 0 FAIL, 12 WARN (voir étape 6) |
| 2. Diagnostiquer | Audit de sécurité — image Docker (Trivy) | ✅ fait (voir étape 5) |
| 2. Diagnostiquer | Audit de performance (API, SQL) | ❌ pas encore fait |
| 2. Diagnostiquer | Audit de conformité (RGAA, RGPD) | ❌ pas encore fait |
| 2. Diagnostiquer | Reproduire un bug existant | ✅ fait — voir `docs/audits/bug-db-connection.md` (bug de connexion SQLite/MySQL en Docker) |
| 2. Corriger | Corriger les CVE trouvées (composer/npm) | ✅ fait, vérifié, **committé et poussé** |
| 2. Corriger | Corriger l'image Docker (Trivy → Alpine) | ✅ fait, vérifié, **committé et poussé** |
| 2. Corriger | Corriger les en-têtes de sécurité (ZAP) | ✅ fait, vérifié, **committé et poussé** (7/12 ; COEP/Cache-Control/SRI restants, voir étape 8) |
| 2. Corriger | Corriger le bug DB définitivement | 🟡 contournement local appliqué, le vrai correctif (remplacer `artisan serve`) n'est pas encore fait |
| 3. Documentation | Doc technique finale (archi, déploiement, tests) | ❌ pas encore fait |
| 3. Documentation | Rapport d'audit sécurité (CVE) | ✅ rédigé — `docs/audits/audit-securite-dependances.md` |
| 3. Documentation | Rapport d'audit Trivy / ZAP | ❌ pas encore rédigé formellement |

## 4. Prochaines étapes possibles

1. Finir le durcissement : Cross-Origin-Embedder-Policy (si les domaines tiers le permettent), Cache-Control par route, Sub Resource Integrity (plugin Vite).
2. Rédiger un rapport d'audit pour Trivy et pour ZAP (même format que celui des CVE).
3. Continuer les audits manquants : perf/SQL, RGAA, RGPD.
4. Corriger le bug DB définitivement (pas juste le contournement).
6. Committer `docs/`, `JOURNAL-DE-BORD.md`, et nettoyer `backend/gamevibe` (fichier SQLite parasite à ignorer/supprimer, jamais committer).
7. Rédiger la documentation technique finale et préparer les slides de soutenance.
