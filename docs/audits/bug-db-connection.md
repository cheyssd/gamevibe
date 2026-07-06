# Anomalie — Backend sert les requêtes API sur SQLite au lieu de MySQL

## Résumé
En environnement de développement (`docker compose up -d`), tous les endpoints API qui touchent la base de données échouent en `500 Internal Server Error`, alors que les migrations semblent s'exécuter avec succès au démarrage du conteneur.

## Reproduction
1. `cp backend/.env.example backend/.env`
2. `docker compose up -d`
3. Les logs du conteneur `backend` montrent les migrations passer (`... DONE`) sans erreur.
4. `curl -i http://localhost/api/jeux` → `HTTP/1.1 500 Internal Server Error`

## Cause racine
- `backend/.env.example` définit `DB_CONNECTION=sqlite` et `DB_DATABASE=:memory:`.
- `docker-compose.yml` (et `docker-compose.prod.yml`) injectent au service `backend` les variables `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` pour pointer vers le conteneur MySQL — **mais oublient `DB_CONNECTION`**.
- Résultat : Laravel reste sur le driver `sqlite` (hérité du `.env`), tandis que `DB_DATABASE` est écrasé par la valeur Docker Compose (`gamevibe`), interprétée comme un **chemin de fichier SQLite relatif** (`/var/www/gamevibe`) et non comme le nom d'une base MySQL.
- Vérifié avec `php artisan config:show database.default` → `sqlite`, et `database.connections.sqlite.database` → `gamevibe`.
- `php artisan migrate --force` (lancé au démarrage du conteneur) crée donc les tables dans ce fichier SQLite. Mais les requêtes suivantes échouent avec :
  ```
  PDOException: SQLSTATE[HY000]: General error: 1 no such table: jeux
  ```
- Le conteneur MySQL (`gamevibe_db`), lui, reste vide de tout schéma — les migrations ne l'ont jamais atteint.
- Aggravant probable : le service `backend` monte le code en bind-mount depuis l'hôte Windows (`./backend:/var/www`) ; SQLite sur ce type de volume (Docker Desktop / WSL2) est connu pour un comportement instable (verrouillage de fichier, cohérence des écritures), ce qui peut expliquer pourquoi une table qui vient d'être créée n'est plus vue par la requête suivante.

## Impact
- **Critique** : l'intégralité de l'API applicative (jeux, avis, utilisateurs, admin) est inutilisable en l'état sur un environnement fraîchement cloné.
- Masque également d'autres anomalies : impossible de tester le reste de l'application (perf, sécurité fonctionnelle) tant que ce bug n'est pas corrigé.

## Complément — le fix docker-compose seul ne suffit pas
En ajoutant `DB_CONNECTION: mysql` (+ `DB_PORT: 3306`) aux `environment:` du service `backend` dans `docker-compose.yml`, `docker compose exec backend php artisan config:show database.default` répond bien `mysql`, et `php artisan tinker` interroge correctement MySQL. **Pourtant `curl http://localhost/api/jeux` continuait de renvoyer la même erreur SQLite.**

Investigation plus poussée (`/proc/<pid>/environ` sur les process du conteneur) :
- Le process `php artisan serve` (PID wrapper) hérite bien de `DB_CONNECTION=mysql`.
- Mais le **vrai** process qui traite les requêtes HTTP, `php -S 0.0.0.0:8000 .../server.php` (lancé en sous-processus par `artisan serve`), a un environnement **vide de toute variable `DB_*`**.

En clair : `php artisan serve` ne propage pas fidèlement l'environnement du conteneur à son serveur web interne. Résultat, ce process retombe entièrement sur les valeurs du fichier `backend/.env` (sqlite/:memory:), quelles que soient les variables définies dans `docker-compose.yml`. C'est un piège classique de `php artisan serve` utilisé comme serveur "de production" dans un `CMD` Docker — il n'est pas conçu pour ça (la doc Laravel le présente uniquement comme serveur de dev local).

## Correctif appliqué localement (pour débloquer l'audit, non commité)
Plutôt que de compter sur les variables Docker Compose, le fichier `backend/.env` a été mis à jour directement :
```
DB_CONNECTION=mysql
DB_HOST=database
DB_PORT=3306
DB_DATABASE=gamevibe
DB_USERNAME=gamevibe_user
DB_PASSWORD=gamevibe_pass
```
(`backend/.env` est gitignoré — ce changement reste local, aucun commit.)

Après `docker compose restart backend`, `curl http://localhost/api/jeux` renvoie bien `200` avec un JSON paginé.

## Correctif définitif recommandé (à appliquer en phase corrective, cf. tâche dédiée)
1. Committer un `backend/.env.docker` (ou équivalent) avec les bonnes valeurs MySQL, copié par le `Dockerfile`/entrypoint au lieu de `.env.example`, **et/ou**
2. Remplacer `php artisan serve` par un vrai stack `php-fpm` + Nginx (ou `Dockerfile.prod` s'il existe déjà en prod — à vérifier) pour l'environnement Docker, `artisan serve` n'étant pas fiable pour cet usage.
3. Garder `DB_CONNECTION` dans les `environment:` de `docker-compose.yml` en documentation/fallback, mais ne pas s'y fier seul tant que `artisan serve` est utilisé.

## Statut
🔴 Reproduit et root-causé (double cause) le 2026-07-06. Contournement local appliqué pour permettre la suite des audits. Correctif définitif **non commité** — prévu en phase 4 (tâche #1).
