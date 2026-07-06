# Rapport d'audit — Vulnérabilités des dépendances (composer/npm)

## Objectif et méthodologie

Cet audit répond au point du brief : *« Installer des outils d'analyse des risques de sécurité (npm audit, Dependabot, Trivy, OWASP ZAP…) »* (compétence 4.1) et *« Réaliser un audit de sécurité »* (compétence 4.2).

**Outils utilisés** :
- `composer audit` — scanner de vulnérabilités pour les dépendances PHP du backend Laravel.
- `npm audit` — scanner de vulnérabilités pour les dépendances JavaScript du frontend React.

**Principe** : ces outils comparent les versions exactes des packages installés (fichiers `composer.lock` / `package-lock.json`) à une base de données publique de vulnérabilités connues (CVE — *Common Vulnerabilities and Exposures*, un identifiant unique par faille documentée). Chaque correspondance trouvée est remontée avec : le package concerné, la plage de versions vulnérables, la gravité, et une référence vers l'avis de sécurité complet.

**Date de l'audit** : 06/07/2026.
**Environnement testé** : conteneurs Docker `backend` (PHP 8.2 / Laravel 12) et `frontend` (Node / Vite), environnement de développement local.

## Commandes exécutées

```
docker compose exec backend composer audit
docker compose exec frontend npm audit
```

## Résultat initial — 4 vulnérabilités trouvées

| # | Package | Écosystème | Version installée | Version corrigée | Gravité | CVE / Avis |
|---|---|---|---|---|---|---|
| 1 | `guzzlehttp/guzzle` | Composer | 7.10.5 | ≥7.12.1 | Moyenne | CVE-2026-55767 — les domaines de cookies avec un point en préfixe (`.example.com`) correspondent à tous les sous-domaines de façon trop permissive |
| 2 | `guzzlehttp/guzzle` | Composer | 7.10.5 | ≥7.12.1 | Moyenne | CVE-2026-55568 — un proxy HTTPS peut être silencieusement rétrogradé en clair (HTTP), exposant le trafic |
| 3 | `guzzlehttp/psr7` | Composer | 2.10.4 | ≥2.12.1 | Moyenne | CVE-2026-55766 — injection CRLF possible dans la ligne de démarrage d'une requête/réponse HTTP sérialisée |
| 4 | `laravel/framework` | Composer | 12.61.0 | ≥12.61.1 | Moyenne | GHSA-crmm-hgp2-wgrp (pas de CVE attribué) — confusion possible sur le chemin d'une URL signée temporaire (`Signed URL`) |
| 5 | `form-data` | npm | 4.0.0 – 4.0.5 | ≥4.0.6 | **Élevée** | GHSA-hmw2-7cc7-3qxx — injection CRLF via des noms de champs/fichiers non échappés dans une requête `multipart/form-data` |

*(`form-data` n'est pas une dépendance directe du projet : elle est installée transitivement par `axios` et par `cypress`.)*

## Analyse de risque

- **CVE-2026-55568** (downgrade HTTPS→HTTP silencieux sur Guzzle) est la plus préoccupante fonctionnellement : si le backend appelle un service externe via un proxy HTTPS mal configuré, le trafic pourrait circuler en clair sans erreur visible. Impact direct sur la confidentialité des données transmises.
- **form-data** (gravité élevée) : le risque réel pour GameVibe est limité car ce package est utilisé uniquement en dépendance transitive de `axios`/`cypress`, pas directement pour construire des requêtes multipart avec des données utilisateur non filtrées côté frontend — mais la faille reste corrigée par précaution, le correctif étant gratuit (mise à jour mineure).
- **laravel/framework** (URLs signées) : GameVibe n'utilise pas de génération d'URLs signées (`Route::signedUrl`) dans son code actuel — impact limité en l'état, mais correction appliquée pour éviter tout risque futur si la fonctionnalité est ajoutée.
- Aucune vulnérabilité **critique** trouvée. Aucune donnée n'a été compromise (audit statique sur les dépendances, pas d'incident constaté).

## Correctifs appliqués

```
docker compose exec backend composer update laravel/framework guzzlehttp/guzzle guzzlehttp/psr7 --with-all-dependencies
docker compose exec frontend npm audit fix
```

Mise à jour ciblée (uniquement les packages concernés, pas un `update` global) pour limiter le risque de régression et garder un changement facilement explicable/traçable.

| Package | Avant | Après |
|---|---|---|
| `guzzlehttp/guzzle` | 7.10.5 | 7.13.2 |
| `guzzlehttp/psr7` | 2.10.4 | 2.12.3 |
| `laravel/framework` | 12.61.0 | 12.62.0 |
| `form-data` | 4.0.5 | ≥4.0.6 (résolu par npm) |

## Vérification post-correctif

- `composer audit` → `No security vulnerability advisories found.`
- `npm audit` → `found 0 vulnerabilities`
- Non-régression fonctionnelle :
  - `curl http://localhost/api/jeux` → `200 OK`
  - `php artisan test` → **62 tests passés / 103 assertions, 0 échec**

## Recommandations

1. Ré-exécuter `composer audit` et `npm audit` **régulièrement** (idéalement à chaque build CI, pas seulement ponctuellement) pour détecter les nouvelles CVE dès leur publication.
2. Envisager **Dependabot** (GitHub) pour automatiser l'ouverture de PR de mise à jour dès qu'une CVE est publiée sur une dépendance du repo.
3. Compléter cet audit de dépendances par un audit applicatif **OWASP Top 10** (injections, authentification, configuration serveur) — non couvert ici, ces outils ne scannent que des bibliothèques tierces, pas le code métier de GameVibe.

## Statut

🟢 **Résolu et vérifié** le 06/07/2026. 0 vulnérabilité restante sur les deux écosystèmes (Composer / npm).
