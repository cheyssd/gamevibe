<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\Developpeur;
use App\Models\Jeu;
use App\Models\Plateforme;
use Illuminate\Database\Seeder;

class JeuSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            'Action', 'Aventure', 'RPG', 'Sport', 'Combat', 'FPS',
            'Simulation', 'Horreur', 'Multijoueur', 'Open World',
            'Stratégie', 'Beat Them All', 'Course', 'Plateforme',
            'Super-héros', 'Science-fiction', 'Stealth',
        ])->mapWithKeys(fn ($nom) => [$nom => Categorie::firstOrCreate(['nom' => $nom])]);

        $plateformes = collect([
            'PC', 'PlayStation 5', 'PlayStation 4',
            'Xbox Series X', 'Xbox One', 'Nintendo Switch', 'Nintendo Switch 2', 'Mobile',
        ])->mapWithKeys(fn ($nom) => [strtolower($nom) => Plateforme::firstOrCreate(['nom' => $nom])]);

        // Images : bannières Steam (header.jpg) pour les jeux disponibles sur Steam,
        // sinon images officielles hébergées sur des CDN stables.
        $jeux = [
            [
                'titre'       => 'God of War Ragnarök',
                'date_sortie' => '2022-11-09',
                'developpeur' => 'Santa Monica Studio',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/171711/1717109795-2790-jaquette-avant.jpg',
                'plateformes' => ['PlayStation 5', 'PlayStation 4'],
                'categories'  => ['Action', 'Aventure', 'RPG'],
            ],
            [
                'titre'       => '007 First Light',
                'date_sortie' => '2026-05-27',
                'developpeur' => 'IO Interactive',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/175697/1756970796-7140-jaquette-avant.jpg',
                'plateformes' => ['PlayStation 5', 'Xbox Series X', 'PC'],
                'categories'  => ['Action', 'FPS', 'Multijoueur'],
            ],
            [
                'titre'       => 'The Witcher 3: Wild Hunt',
                'date_sortie' => '2015-05-19',
                'developpeur' => 'CD Projekt Red',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch'],
                'categories'  => ['RPG', 'Aventure', 'Open World'],
            ],
            [
                'titre'       => 'Avatar Legends: The Fighting Game',
                'date_sortie' => '2024-07-26',
                'developpeur' => 'Ubisoft',
                'image'       => 'https://m.media-amazon.com/images/M/MV5BZDdkZjU1MjEtYjEzMi00MjgzLWIyZTAtMjFiOGQ4NWE0ZTkwXkEyXkFqcGc@._V1_.jpg',
                'plateformes' => ['PlayStation 5', 'Xbox Series X', 'PC'],
                'categories'  => ['Combat', 'Multijoueur'],
            ],
            [
                'titre'       => 'Black Myth: Wukong',
                'date_sortie' => '2024-08-20',
                'developpeur' => 'Game Science',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X'],
                'categories'  => ['Action', 'RPG', 'Aventure'],
            ],
            [
                'titre'       => 'Bleach: Rebirth of Souls',
                'date_sortie' => '2024-06-13',
                'developpeur' => 'Nexon',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/172042/1720423489-7655-jaquette-avant.jpg',
                'plateformes' => ['PC'],
                'categories'  => ['Combat', 'Multijoueur'],
            ],
            [
                'titre'       => 'Captain Tsubasa: Rise of New Champions',
                'date_sortie' => '2020-08-28',
                'developpeur' => 'Bandai Namco',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/159050/1590502863-6656-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Nintendo Switch'],
                'categories'  => ['Sport', 'Simulation', 'Multijoueur'],
            ],
            [
                'titre'       => 'Clair Obscur: Expedition 33',
                'date_sortie' => '2025-04-24',
                'developpeur' => 'Sandfall Interactive',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/171803/1718033257-8476-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5'],
                'categories'  => ['Aventure', 'RPG', 'Action'],
            ],
            [
                'titre'       => 'Cyberpunk 2077',
                'date_sortie' => '2020-12-10',
                'developpeur' => 'CD Projekt Red',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One'],
                'categories'  => ['Action', 'RPG', 'Open World'],
            ],
            [
                'titre'       => 'The Dark Pictures: Directive 8020',
                'date_sortie' => '2024-10-04',
                'developpeur' => 'Supermassive Games',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/174654/1746536451-3178-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X'],
                'categories'  => ['Horreur', 'Aventure'],
            ],
            [
                'titre'       => 'Dragon Ball: Sparking! ZERO',
                'date_sortie' => '2024-10-11',
                'developpeur' => 'Bandai Namco',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1790600/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X'],
                'categories'  => ['Combat', 'Multijoueur'],
            ],
            [
                'titre'       => 'Dragon Ball Xenoverse 3',
                'date_sortie' => '2027-10-25',
                'developpeur' => 'Bandai Namco',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/177667/1776671033-6000-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch'],
                'categories'  => ['Combat', 'RPG', 'Multijoueur'],
            ],
            [
                'titre'       => 'UFC 5',
                'date_sortie' => '2023-10-27',
                'developpeur' => 'EA',
                'image'       => 'https://www.geekzone.ci/wp-content/uploads/2025/01/EA-Sports-UFC-5-PS5-4.jpg',
                'plateformes' => ['PlayStation 5', 'Xbox Series X'],
                'categories'  => ['Sport', 'Simulation'],
            ],
            [
                'titre'       => 'EA Sports FC 26',
                'date_sortie' => '2025-09-27',
                'developpeur' => 'EA ',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/175268/1752682779-9893-jaquette-avant.png',
                'plateformes' => ['PlayStation 5', 'Xbox Series X', 'PC'],
                'categories'  => ['Sport', 'Simulation', 'Multijoueur'],
            ],
            [
                'titre'       => 'Elden Ring',
                'date_sortie' => '2022-02-25',
                'developpeur' => 'FromSoftware',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One'],
                'categories'  => ['Action', 'RPG', 'Open World'],
            ],
            [
                'titre'       => 'Final Fantasy XVI',
                'date_sortie' => '2023-06-22',
                'developpeur' => 'Square Enix',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/2515020/header.jpg',
                'plateformes' => ['PlayStation 5', 'PC'],
                'categories'  => ['RPG', 'Action', 'Aventure'],
            ],
            [
                'titre'       => 'Fortnite',
                'date_sortie' => '2017-07-21',
                'developpeur' => 'Epic Games',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/163162/1631620218-5546-jaquette-avant.gif',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Mobile'],
                'categories'  => ['Action', 'Multijoueur', 'Simulation'],
            ],
            [
                'titre'       => 'Genshin Impact',
                'date_sortie' => '2020-09-28',
                'developpeur' => 'miHoYo',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/163299/1632994028-1028-jaquette-avant.png',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Mobile'],
                'categories'  => ['RPG', 'Action', 'Aventure'],
            ],
            [
                'titre'       => 'Hell Is Us',
                'date_sortie' => '2025-03-04',
                'developpeur' => 'Rogue Factor',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/164976/1649764329-874-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X'],
                'categories'  => ['Horreur', 'Aventure'],
            ],
            [
                'titre'       => 'Hitman III',
                'date_sortie' => '2021-01-20',
                'developpeur' => 'IO Interactive',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1659040/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One'],
                'categories'  => ['Action', 'Stratégie', 'Stealth'],
            ],
            [
                'titre'       => 'Grand Theft Auto VI',
                'date_sortie' => '2025-05-26',
                'developpeur' => 'Rockstar Games',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/170230/1702303334-1969-jaquette-avant.jpeg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X'],
                'categories'  => ['Action', 'Open World', 'Aventure'],
            ],
            [
                'titre'       => 'Jujutsu Kaisen: Cursed Clash',
                'date_sortie' => '2024-02-01',
                'developpeur' => 'Bandai Namco',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/170427/1704270157-7158-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X'],
                'categories'  => ['Combat', 'Multijoueur'],
            ],
            [
                'titre'       => 'Mario Kart World',
                'date_sortie' => '2025-06-05',
                'developpeur' => 'Nintendo',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/174773/1747733351-6826-jaquette-avant.jpg',
                'plateformes' => ['Nintendo Switch 2', 'Mobile'],
                'categories'  => ['Course', 'Multijoueur'],
            ],
            [
                'titre'       => 'Call of Duty: Black Ops 6',
                'date_sortie' => '2024-10-25',
                'developpeur' => 'Treyarch',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/2933620/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X'],
                'categories'  => ['FPS', 'Multijoueur'],
            ],
            [
                'titre'       => 'My Hero Academia: One\'s Justice',
                'date_sortie' => '2018-10-26',
                'developpeur' => 'Bandai Namco',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/177003/1770028215-9939-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch'],
                'categories'  => ['Combat', 'Action'],
            ],
            [
                'titre'       => 'Resident Evil 4 Remake',
                'date_sortie' => '2023-03-24',
                'developpeur' => 'Capcom',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X'],
                'categories'  => ['Horreur', 'Action'],
            ],
            [
                'titre'       => 'NBA 2K26',
                'date_sortie' => '2024-09-06',
                'developpeur' => 'Visual Concepts',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/175581/1755805735-9560-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X'],
                'categories'  => ['Sport', 'Simulation'],
            ],
            [
                'titre'       => 'Marvel\'s Spider-Man 2',
                'date_sortie' => '2023-10-20',
                'developpeur' => 'Insomniac Games',
                'image'       => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuF7wynG-hgHNJPzp29H6ndB1SNU5OZLCP-g&s',
                'plateformes' => ['PlayStation 5'],
                'categories'  => ['Action', 'Aventure', 'Super-héros'],
            ],
            [
                'titre'       => 'Crimson Desert',
                'date_sortie' => '2024-12-17',
                'developpeur' => 'Pearl Abyss',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/177376/1773757034-3785-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X'],
                'categories'  => ['Action', 'RPG', 'Open World'],
            ],
            [
                'titre'       => 'Naruto Shippuden: Ultimate Ninja Storm 4',
                'date_sortie' => '2016-02-04',
                'developpeur' => 'CyberConnect2',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/349040/header.jpg',
                'plateformes' => ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch'],
                'categories'  => ['Combat', 'Action'],
            ],
            [
                'titre'       => 'The Last of Us Part II',
                'date_sortie' => '2020-06-19',
                'developpeur' => 'Naughty Dog',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/174282/1742821255-8773-jaquette-avant.png',
                'plateformes' => ['PlayStation 4'],
                'categories'  => ['Action', 'Aventure', 'Horreur'],
            ],
            [
                'titre'       => 'The Sims 4',
                'date_sortie' => '2014-09-02',
                'developpeur' => 'Maxis',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222670/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One'],
                'categories'  => ['Simulation'],
            ],
            [
                'titre'       => 'The Legend of Zelda: Tears of the Kingdom',
                'date_sortie' => '2023-05-12',
                'developpeur' => 'Nintendo',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/166323/1663231496-4522-jaquette-avant.jpg',
                'plateformes' => ['Nintendo Switch'],
                'categories'  => ['Aventure', 'Action', 'Open World'],
            ],
            [
                'titre'       => 'Warframe',
                'date_sortie' => '2013-03-25',
                'developpeur' => 'Digital Extremes',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/230410/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch'],
                'categories'  => ['Action', 'Multijoueur', 'FPS'],
            ],
            [
                'titre'       => 'Tekken 8',
                'date_sortie' => '2024-01-26',
                'developpeur' => 'Bandai Namco',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1778820/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series X'],
                'categories'  => ['Combat', 'Multijoueur'],
            ],
            [
                'titre'       => 'WWE 2K26',
                'date_sortie' => '2025-03-14',
                'developpeur' => 'Visual Concepts',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/177308/1773075587-6247-jaquette-avant.jpg',
                'plateformes' => ['PlayStation 5', 'Xbox Series X', 'PC'],
                'categories'  => ['Sport', 'Simulation'],
            ],
            [
                'titre'       => 'Ghost of Tsushima',
                'date_sortie' => '2020-07-17',
                'developpeur' => 'Sucker Punch Productions',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/header.jpg',
                'plateformes' => ['PlayStation 5'],
                'categories'  => ['Action', 'Aventure'],
            ],
            [
                'titre'       => 'Forza Horizon 6',
                'date_sortie' => '2021-11-09',
                'developpeur' => 'Playground Games',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/177366/1773655138-629-jaquette-avant.jpg',
                'plateformes' => ['Xbox Series X', 'PC'],
                'categories'  => ['Course', 'Simulation'],
            ],
        ];

        foreach ($jeux as $jeuData) {
            $devel = Developpeur::firstOrCreate(['nom' => $jeuData['developpeur']]);

            $jeu = Jeu::create([
                'titre'          => $jeuData['titre'],
                'description'    => 'Description du jeu ' . $jeuData['titre'] . '.',
                'image'          => $jeuData['image'],
                'date_sortie'    => $this->normalizeDate($jeuData['date_sortie']),
                'developpeur_id' => $devel->id,
            ]);

            $jeu->plateformes()->sync(
                collect($jeuData['plateformes'])->map(fn ($nom) => $plateformes[strtolower($nom)]->id)->all()
            );
            $jeu->categories()->sync(
                collect($jeuData['categories'])->map(fn ($nom) => $categories[$nom]->id)->all()
            );
        }
    }

    private function normalizeDate(string $date): string
    {
        if (str_contains($date, 'XX') || str_contains($date, '??')) {
            return str_replace(['XX', '??'], '01', $date);
        }
        return $date;
    }
}
