# Projet jeu Web

## Liens du jeu
Jouer ici:

## Description du Projet
Ce projet a été réaliser par moi meme dans le cadre du cours de Programmation Web à l'Université de Nice.
Le but du jeu est de faire en sorte que le joueur puisse atteindre la sortie du labyrinthe en évitant les obstacles.
Le jeu se compose de 20 niveaux et peut etre joué en solo ou à plusieurs sur une meme machine.

## Fonctionnalités du jeu

### Paramètres d'une partie
- Les peuvent choisir le nombre de joueurs entre 1 et 4 qui participeront à la partie.
- Les joueurs peuvent choisir leur avatar parmi une de 8 couleurs différentes.
- Les joueurs peuvent également chosir les touches de déplacement de leur avatar.
- Il faut que les paramètres soient uniques pour chaque joueur.

### Déroulement d'une partie
- Les joueurs doivent atteindre la sortie du labyrinthe (le portail) en évitant les obstacles.
- Le joueur qui atteint la sortie en premier gagne 1 point et le niveau suivant est chargé.
- La partie se termine au bout de 20 niveaux.
- Chaques joueurs a 3 points de vie. Si un joueur perd tous ses points de vie, il revient au début du niveau.
- Les joueurs peuvent également choisir le niveau en cours de jeu via un menu déroulant.

### Obstacles
Il y plusieurs types d'obstacles dans le jeu pour rendre la partie plus difficile qui apparaissent au fur et à mesure que le niveau augmente:
- Les murs: les joueurs ne peuvent pas les traverser.
- Les trous: les joueurs tombent dedans et reviennent au début du niveau.
- les "potions" (météorites): des "potions" tombent du ciel et les joueurs perdent un point de vie s'ils se font toucher ou s'ils marchent dans le poison laissé par la potion. Les potions ne peuvent pas tomber sur une case infranchissable. Le poison reste sur la case pendant 5 secondes.
- les éclairs: des éclais frappent le sol et les joueurs perdent un point de vie s'ils se font toucher. Les cases tombe sur une case suivant un intervalle de temps aléatoire ou défini.
- Les boules électriques: les boules électriques se déplacent dans le labyrinthe en suivant un chemin prédéfini et les joueurs perdent un point de vie s'ils se font toucher.
- Les monstres: les monstres se déplacents dans le labyrinthe en rebondissant sur les murs et les joueurs perdent deux points de vie s'ils se font toucher.
