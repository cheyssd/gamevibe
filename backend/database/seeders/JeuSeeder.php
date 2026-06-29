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
            'Xbox Series', 'Xbox One', 'Nintendo Switch', 'Nintendo Switch 2', 'Mobile',
        ])->mapWithKeys(fn ($nom) => [strtolower($nom) => Plateforme::firstOrCreate(['nom' => $nom])]);

        $jeux = [
            [
                'titre'       => 'God of War Ragnarök',
                'description' => "Kratos et Atreus affrontent les neuf royaumes nordiques alors que l'hiver Fimbulvetr annonce l'arrivée du Ragnarök. Une épopée mêlant combats viscéraux et relation père-fils bouleversante.",
                'date_sortie' => '2022-11-09',
                'developpeur' => 'Santa Monica Studio',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/171711/1717109795-2790-jaquette-avant.jpg',
                'plateformes' => ['PlayStation 5', 'PlayStation 4'],
                'categories'  => ['Action', 'Aventure', 'RPG'],
            ],
            [
                'titre'       => '007 First Light',
                'description' => "Une réinvention de l'agent secret britannique dans une aventure d'espionnage moderne, mêlant infiltration, gadgets emblématiques et action cinématographique signée IO Interactive.",
                'date_sortie' => '2026-05-27',
                'developpeur' => 'IO Interactive',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/175697/1756970796-7140-jaquette-avant.jpg',
                'plateformes' => ['PlayStation 5', 'Xbox Series', 'PC'],
                'categories'  => ['Action', 'FPS', 'Multijoueur'],
            ],
            [
                'titre'       => 'The Witcher 3: Wild Hunt',
                'description' => "Geralt de Riv parcourt un monde ouvert riche en quêtes et créatures fantastiques à la recherche de sa fille adoptive, traquée par la mystérieuse Chasse Sauvage.",
                'date_sortie' => '2015-05-19',
                'developpeur' => 'CD Projekt Red',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series', 'Nintendo Switch'],
                'categories'  => ['RPG', 'Aventure', 'Open World'],
            ],
            [
                'titre'       => 'Avatar Legends: The Fighting Game',
                'description' => "Un jeu de combat rassemblant les héros emblématiques de l'univers Avatar, où maîtrise des éléments et techniques martiales s'affrontent dans des duels spectaculaires.",
                'date_sortie' => '2024-07-26',
                'developpeur' => 'Ubisoft',
                'image'       => 'https://m.media-amazon.com/images/M/MV5BZDdkZjU1MjEtYjEzMi00MjgzLWIyZTAtMjFiOGQ4NWE0ZTkwXkEyXkFqcGc@._V1_.jpg',
                'plateformes' => ['PlayStation 5', 'Xbox Series', 'PC'],
                'categories'  => ['Combat', 'Multijoueur'],
            ],
            [
                'titre'       => 'Black Myth: Wukong',
                'description' => "Inspiré du roman classique chinois La Pérégrination vers l'Ouest, ce action-RPG suit un singe guerrier affrontant divinités et démons dans un monde mythologique somptueux.",
                'date_sortie' => '2024-08-20',
                'developpeur' => 'Game Science',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series'],
                'categories'  => ['Action', 'RPG', 'Aventure'],
            ],
            [
                'titre'       => 'Bleach: Rebirth of Souls',
                'description' => "Adaptation du manga culte, ce jeu de combat met en scène Ichigo Kurosaki et les Shinigami dans des affrontements spectaculaires entre mondes des vivants et des esprits.",
                'date_sortie' => '2024-06-13',
                'developpeur' => 'Nexon',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/172042/1720423489-7655-jaquette-avant.jpg',
                'plateformes' => ['PC'],
                'categories'  => ['Combat', 'Multijoueur'],
            ],
            [
                'titre'       => 'Captain Tsubasa: Rise of New Champions',
                'description' => "Le football arcade signé Captain Tsubasa revient avec des tirs surpuissants et des dribbles dignes des plus grands animes sportifs.",
                'date_sortie' => '2020-08-28',
                'developpeur' => 'Bandai Namco',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/159050/1590502863-6656-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Nintendo Switch'],
                'categories'  => ['Sport', 'Simulation', 'Multijoueur'],
            ],
            [
                'titre'       => 'Clair Obscur: Expedition 33',
                'description' => "Une expédition française dans un monde peint à l'aquarelle où des héros affrontent une entité mystérieuse qui efface les habitants chaque année selon un compte à rebours implacable.",
                'date_sortie' => '2025-04-24',
                'developpeur' => 'Sandfall Interactive',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/171803/1718033257-8476-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5'],
                'categories'  => ['Aventure', 'RPG', 'Action'],
            ],
            [
                'titre'       => 'Cyberpunk 2077',
                'description' => "Dans la mégalopole tentaculaire de Night City, V cherche à percer le secret d'un implant capable d'offrir l'immortalité, dans un monde ouvert gangrené par le crime et la technologie.",
                'date_sortie' => '2020-12-10',
                'developpeur' => 'CD Projekt Red',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series', 'Xbox One'],
                'categories'  => ['Action', 'RPG', 'Open World'],
            ],
            [
                'titre'       => 'The Dark Pictures: Directive 8020',
                'description' => "Un huis clos horrifique dans l'espace où chaque choix narratif influence le destin de l'équipage face à une menace extraterrestre insidieuse.",
                'date_sortie' => '2024-10-04',
                'developpeur' => 'Supermassive Games',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/174654/1746536451-3178-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series'],
                'categories'  => ['Horreur', 'Aventure'],
            ],
            [
                'titre'       => 'Dragon Ball: Sparking! ZERO',
                'description' => "Le retour très attendu de la série Budokai Tenkaichi propose des combats aériens dévastateurs reprenant des décennies de Dragon Ball avec un casting de personnages immense.",
                'date_sortie' => '2024-10-11',
                'developpeur' => 'Bandai Namco',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1790600/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series'],
                'categories'  => ['Combat', 'Multijoueur'],
            ],
            [
                'titre'       => 'Dragon Ball Xenoverse 3',
                'description' => "Un nouveau voyage temporel permet de créer son propre combattant et de revivre les arcs emblématiques de Dragon Ball aux côtés de Goku et ses alliés.",
                'date_sortie' => '2027-10-25',
                'developpeur' => 'Bandai Namco',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/177667/1776671033-6000-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series', 'Xbox One', 'Nintendo Switch'],
                'categories'  => ['Combat', 'RPG', 'Multijoueur'],
            ],
            [
                'titre'       => 'UFC 5',
                'description' => "La simulation officielle d'arts martiaux mixtes offre des combats réalistes avec un système de dégâts détaillé et le roster complet de l'UFC.",
                'date_sortie' => '2023-10-27',
                'developpeur' => 'EA',
                'image'       => 'https://www.geekzone.ci/wp-content/uploads/2025/01/EA-Sports-UFC-5-PS5-4.jpg',
                'plateformes' => ['PlayStation 5', 'Xbox Series'],
                'categories'  => ['Sport', 'Simulation'],
            ],
            [
                'titre'       => 'EA Sports FC 26',
                'description' => "La référence du football virtuel revient avec des licences officielles, un gameplay affiné et des modes compétitifs en ligne pour les fans du ballon rond.",
                'date_sortie' => '2025-09-27',
                'developpeur' => 'EA ',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/175268/1752682779-9893-jaquette-avant.png',
                'plateformes' => ['PlayStation 5', 'Xbox Series', 'PC'],
                'categories'  => ['Sport', 'Simulation', 'Multijoueur'],
            ],
            [
                'titre'       => 'Elden Ring',
                'description' => "Dans les Terres Intermédiaires dévastées, un Sans-Éclat part à la conquête de fragments de l'Anneau Elden, à travers un monde ouvert impitoyable signé FromSoftware.",
                'date_sortie' => '2022-02-25',
                'developpeur' => 'FromSoftware',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series', 'Xbox One'],
                'categories'  => ['Action', 'RPG', 'Open World'],
            ],
            [
                'titre'       => 'Final Fantasy XVI',
                'description' => "Clive Rosfield mène une quête de vengeance dans le royaume de Valisthea, où les Eikons, divinités gigantesques, transforment chaque affrontement en spectacle dévastateur.",
                'date_sortie' => '2023-06-22',
                'developpeur' => 'Square Enix',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/2515020/header.jpg',
                'plateformes' => ['PlayStation 5', 'PC'],
                'categories'  => ['RPG', 'Action', 'Aventure'],
            ],
            [
                'titre'       => 'Fortnite',
                'description' => "Le battle royale phénomène mondial mêle construction, action effrénée et événements culturels constants dans un univers coloré en perpétuelle évolution.",
                'date_sortie' => '2017-07-21',
                'developpeur' => 'Epic Games',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/163162/1631620218-5546-jaquette-avant.gif',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series', 'Nintendo Switch', 'Mobile'],
                'categories'  => ['Action', 'Multijoueur', 'Simulation'],
            ],
            [
                'titre'       => 'Genshin Impact',
                'description' => "Un voyageur explore le monde fantastique de Teyvat à la recherche de son frère ou sa sœur perdu, en maîtrisant sept éléments aux côtés de personnages charismatiques.",
                'date_sortie' => '2020-09-28',
                'developpeur' => 'miHoYo',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/163299/1632994028-1028-jaquette-avant.png',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Mobile'],
                'categories'  => ['RPG', 'Action', 'Aventure'],
            ],
            [
                'titre'       => 'Hell Is Us',
                'description' => "Un soldat revient dans son pays natal ravagé par la guerre civile et des créatures surnaturelles, dans une aventure d'exploration dénuée de carte ou de marqueur de quête.",
                'date_sortie' => '2025-03-04',
                'developpeur' => 'Rogue Factor',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/164976/1649764329-874-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series'],
                'categories'  => ['Horreur', 'Aventure'],
            ],
            [
                'titre'       => 'Hitman III',
                'description' => "L'Agent 47 conclut la trilogie World of Assassination avec des contrats d'élimination sur mesure dans des décors somptueux à travers le monde.",
                'date_sortie' => '2021-01-20',
                'developpeur' => 'IO Interactive',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1659040/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series', 'Xbox One'],
                'categories'  => ['Action', 'Stratégie', 'Stealth'],
            ],
            [
                'titre'       => 'Grand Theft Auto VI',
                'description' => "Retour à Vice City pour cette nouvelle ère de la saga culte, mêlant criminalité, satire sociale et monde ouvert d'une ampleur inédite.",
                'date_sortie' => '2025-05-26',
                'developpeur' => 'Rockstar Games',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/170230/1702303334-1969-jaquette-avant.jpeg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series'],
                'categories'  => ['Action', 'Open World', 'Aventure'],
            ],
            [
                'titre'       => 'Jujutsu Kaisen: Cursed Clash',
                'description' => "Les sorciers de l'anime Jujutsu Kaisen s'affrontent dans des combats survitaminés mêlant techniques maudites et énergie spectrale.",
                'date_sortie' => '2024-02-01',
                'developpeur' => 'Bandai Namco',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/170427/1704270157-7158-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series'],
                'categories'  => ['Combat', 'Multijoueur'],
            ],
            [
                'titre'       => 'Mario Kart World',
                'description' => "La série de karting culte de Nintendo s'ouvre sur un monde interconnecté où les circuits se découvrent en roue libre entre les courses.",
                'date_sortie' => '2025-06-05',
                'developpeur' => 'Nintendo',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/174773/1747733351-6826-jaquette-avant.jpg',
                'plateformes' => ['Nintendo Switch 2', 'Mobile'],
                'categories'  => ['Course', 'Multijoueur'],
            ],
            [
                'titre'       => 'Call of Duty: Black Ops 6',
                'description' => "Un thriller d'espionnage en pleine Guerre du Golfe mêle missions solo intenses et multijoueur compétitif emblématique de la licence.",
                'date_sortie' => '2024-10-25',
                'developpeur' => 'Treyarch',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/2933620/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series'],
                'categories'  => ['FPS', 'Multijoueur'],
            ],
            [
                'titre'       => 'My Hero Academia: All\'s Justice',
                'description' => "Les héros et vilains de l'académie Yuei s'affrontent dans des combats spectaculaires mettant en valeur leurs Alters uniques.",
                'date_sortie' => '2018-10-26',
                'developpeur' => 'Bandai Namco',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/177003/1770028215-9939-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch'],
                'categories'  => ['Combat', 'Action'],
            ],
            [
                'titre'       => 'Resident Evil 4 Remake',
                'description' => "Leon S. Kennedy part secourir la fille du président dans un village espagnol infesté, dans cette refonte saluée d'un classique de l'horreur-action.",
                'date_sortie' => '2023-03-24',
                'developpeur' => 'Capcom',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series'],
                'categories'  => ['Horreur', 'Action'],
            ],
            [
                'titre'       => 'NBA 2K26',
                'description' => "La simulation basketball la plus complète propose un gameplay réaliste, un mode carrière approfondi et des compétitions en ligne contre joueurs du monde entier.",
                'date_sortie' => '2024-09-06',
                'developpeur' => 'Visual Concepts',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/175581/1755805735-9560-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series'],
                'categories'  => ['Sport', 'Simulation'],
            ],
            [
                'titre'       => 'Marvel\'s Spider-Man 2',
                'description' => "Peter Parker et Miles Morales unissent leurs forces pour affronter Venom et Kraven le Chasseur dans un New York plus vaste et vertical que jamais.",
                'date_sortie' => '2023-10-20',
                'developpeur' => 'Insomniac Games',
                'image'       => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuF7wynG-hgHNJPzp29H6ndB1SNU5OZLCP-g&s',
                'plateformes' => ['PlayStation 5'],
                'categories'  => ['Action', 'Aventure', 'Super-héros'],
            ],
            [
                'titre'       => 'Crimson Desert',
                'description' => "Une fresque medieval-fantastique à monde ouvert mêlant combats viscéraux, survie et une histoire de vengeance entre clans rivaux.",
                'date_sortie' => '2024-12-17',
                'developpeur' => 'Pearl Abyss',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/177376/1773757034-3785-jaquette-avant.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series'],
                'categories'  => ['Action', 'RPG', 'Open World'],
            ],
            [
                'titre'       => 'Naruto Shippuden: Ultimate Ninja Storm 4',
                'description' => "L'arc final de Naruto reprend vie dans des combats ninja spectaculaires retraçant la Quatrième Grande Guerre Ninja.",
                'date_sortie' => '2016-02-04',
                'developpeur' => 'CyberConnect2',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/349040/header.jpg',
                'plateformes' => ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch'],
                'categories'  => ['Combat', 'Action'],
            ],
            [
                'titre'       => 'The Last of Us Part II',
                'description' => "Cinq ans après les événements du premier opus, Ellie part en quête de vengeance dans un monde post-apocalyptique où chaque choix a des conséquences morales lourdes.",
                'date_sortie' => '2020-06-19',
                'developpeur' => 'Naughty Dog',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/174282/1742821255-8773-jaquette-avant.png',
                'plateformes' => ['PlayStation 4'],
                'categories'  => ['Action', 'Aventure', 'Horreur'],
            ],
            [
                'titre'       => 'The Sims 4',
                'description' => "Le simulateur de vie culte permet de créer, personnaliser et diriger le destin de Sims dans des quartiers vivants remplis de possibilités infinies.",
                'date_sortie' => '2014-09-02',
                'developpeur' => 'Maxis',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222670/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series', 'Xbox One'],
                'categories'  => ['Simulation'],
            ],
            [
                'titre'       => 'The Legend of Zelda: Tears of the Kingdom',
                'description' => "Link explore Hyrule et les îles célestes flottantes pour percer le mystère d'un mal ancien réveillé sous le royaume.",
                'date_sortie' => '2023-05-12',
                'developpeur' => 'Nintendo',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/166323/1663231496-4522-jaquette-avant.jpg',
                'plateformes' => ['Nintendo Switch'],
                'categories'  => ['Aventure', 'Action', 'Open World'],
            ],
            [
                'titre'       => 'Warframe',
                'description' => "Des guerriers spatiaux appelés Tenno pilotent des exosquelettes biomécaniques dans un univers de science-fiction coopératif en constante extension.",
                'date_sortie' => '2013-03-25',
                'developpeur' => 'Digital Extremes',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/230410/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series', 'Xbox One', 'Nintendo Switch'],
                'categories'  => ['Action', 'Multijoueur', 'FPS'],
            ],
            [
                'titre'       => 'Tekken 8',
                'description' => "La saga de combat légendaire revient avec un roster impressionnant et un système de combat misant sur l'agressivité et les enchaînements spectaculaires.",
                'date_sortie' => '2024-01-26',
                'developpeur' => 'Bandai Namco',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/1778820/header.jpg',
                'plateformes' => ['PC', 'PlayStation 5', 'Xbox Series'],
                'categories'  => ['Combat', 'Multijoueur'],
            ],
            [
                'titre'       => 'WWE 2K26',
                'description' => "La simulation officielle de catch professionnel offre un roster complet, des modes carrière approfondis et une mise en scène fidèle aux shows télévisés.",
                'date_sortie' => '2025-03-14',
                'developpeur' => 'Visual Concepts',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/177308/1773075587-6247-jaquette-avant.jpg',
                'plateformes' => ['PlayStation 5', 'Xbox Series', 'PC'],
                'categories'  => ['Sport', 'Simulation'],
            ],
            [
                'titre'       => 'Ghost of Tsushima',
                'description' => "Jin Sakai, dernier samouraï de son clan, doit abandonner le code du bushido pour libérer l'île de Tsushima de l'invasion mongole.",
                'date_sortie' => '2020-07-17',
                'developpeur' => 'Sucker Punch Productions',
                'image'       => 'https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/header.jpg',
                'plateformes' => ['PlayStation 5'],
                'categories'  => ['Action', 'Aventure'],
            ],
            [
                'titre'       => 'Forza Horizon 6',
                'description' => "Un festival de course automobile à monde ouvert offrant des centaines de véhicules et des paysages somptueux à explorer en liberté totale.",
                'date_sortie' => '2021-11-09',
                'developpeur' => 'Playground Games',
                'image'       => 'https://image.jeuxvideo.com/medias-sm/177366/1773655138-629-jaquette-avant.jpg',
                'plateformes' => ['Xbox Series', 'PC'],
                'categories'  => ['Course', 'Simulation'],
            ],
        ];

        foreach ($jeux as $jeuData) {
            $devel = Developpeur::firstOrCreate(['nom' => $jeuData['developpeur']]);

            $jeu = Jeu::firstOrCreate(
                ['titre' => $jeuData['titre']],
                [
                    'description'    => $jeuData['description'],
                    'image'          => $jeuData['image'],
                    'date_sortie'    => $this->normalizeDate($jeuData['date_sortie']),
                    'developpeur_id' => $devel->id,
                ]
            );

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
