# gamevibe

Application composée d'un backend Laravel, d'un frontend React et d'une base MySQL, orchestrés via Docker Compose.

## Prérequis

- Docker et Docker Compose installés
- Copier le fichier d'environnement backend si absent : `cp backend/.env.example backend/.env`

## Développement

Démarrer tous les services (base de données, phpMyAdmin, backend, frontend, nginx) :

```bash
docker compose up -d
```

Voir les logs :

```bash
docker compose logs -f
```

Arrêter les services :

```bash
docker compose down
```
Reconstruire les images après une modification des Dockerfiles :

```bash
docker compose up -d --build
```

Accès :
- Frontend : http://localhost
- Backend API : http://localhost/api (via nginx)
- phpMyAdmin : http://localhost:8080
- MySQL : localhost:3307

## Production

Utiliser le fichier `docker-compose.prod.yml` :

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Arrêter les services :

```bash
docker compose -f docker-compose.prod.yml down
```

Accès :
- Frontend : http://localhost:8090
- Backend API : http://localhost:8000

## Commandes utiles

Exécuter une commande dans le conteneur backend (ex. artisan) :

```bash
docker compose exec backend php artisan migrate
```


Supprimer les conteneurs, réseaux et volumes (⚠️ supprime les données de la base) :

```bash
docker compose down -v
```

lancer l'application sur le navigateur a partir de localhost:80
