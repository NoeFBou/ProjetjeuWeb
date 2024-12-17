# Projet jeu Web

## Liens du jeu
Jouer ici:
https://projetjeuweb.netlify.app/

## Description du Projet
Ce projet a été réalisé par moi dans le cadre du cours de Programmation Web à l'Université de Nice.
Le but du jeu est de permettre au(x) joueur(s) d'atteindre la sortie du labyrinthe en évitant les divers obstacles. 
Le jeu comprend 20 niveaux et peut se jouer en solo ou en multijoueur local (de 1 à 4 joueurs sur la même machine).

## Language et Technologies 
Le jeu a été developpé en Type Script et fonctionne sur navigateur. j'ai utilisé vite pour le déployement. 

## Installation
Pour lancer le projet en local, cloner le répertoire et utilisé la commande 'npm run dev'.

## Fonctionnalités du jeu

### Paramètres d'une partie
- Les joueurs peuvent sélectionner le nombre de participants (entre 1 et 4).
- Chaque joueur choisit son avatar parmi 8 couleurs différentes.
- Chaque joueur définit ses propres touches de déplacement.
- Toutes les configurations (avatar, touches) doivent être uniques pour chaque joueur.

### Déroulement d'une Partie
- Les joueurs doivent atteindre la sortie du labyrinthe (un portail) en évitant les obstacles.
- Le premier joueur à atteindre la sortie marque 1 point, puis le niveau suivant est chargé.
- La partie se termine au bout de 20 niveaux.
- Chaque joueur possède 3 points de vie. S'il perd toutes ses vies, il revient au point de départ du niveau.
- Les joueurs peuvent également choisir le niveau à tout moment grâce à un menu déroulant.


### Obstacles
Au fur et à mesure de la progression, différents types d'obstacles apparaissent :
- Murs : Infranchissables.
- Trous et "lave": Le joueur qui tombe dedans retourne au début du niveau.
- Potions (météorites) : Des potions tombent du ciel. Si un joueur se fait toucher ou marche dans le poison laissé par la potion, il perd 1 point de vie. Les potions ne tombent pas sur une case infranchissable. Le poison reste sur la case pendant 5 secondes.
- Éclairs : Ils frappent le sol, et un joueur touché perd 1 point de vie. Les éclairs apparaissent à intervalles réguliers ou aléatoires.
- Boules électriques : Elles se déplacent le long d'un chemin prédéfini dans le labyrinthe. Un joueur touché perd 1 point de vie.
- Monstres : Ils se déplacent en rebondissant sur les murs. Un joueur touché perd 2 points de vie.

### Items
Pour aider les joueurs, certains items apparaissent dans les niveaux. Lorsqu'un joueur marche sur un item, celui-ci est consommé et réapparaît 4 secondes plus tard. Il existe deux types d'items :
- Un item qui restaure un point de vie (sans dépasser le maximum de 3).
- Un item qui rend le joueur invincible pendant 4 secondes.

## Graphismes 
Un style pixel art a été adopté pour les éléments graphiques afin de donner au jeu une esthétique rétro et cohérente.

