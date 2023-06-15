# interactive-gpio-node


# 🏗 Architecture du code

## 🔴 GPIO - Entrées :

### 🎛️ Bouton:

Gère différents types de boutons (GPIO, Web ou CLI) selon un mode spécifié.
- Entrées : instances de boutons, configuration, activation/désactivation de la LED, mode spécifique.
- Sorties : observables des événements de pression, numéros de broches, contrôle des LED.

### 🖥️ BoutonCLI:

Écoute les événements de pression de touches sur stdin (entrée standard) et renvoie un Observable avec les informations sur les touches pressées.
- Entrées : boutons de clavier configurés.
- Sortie : Observable pour les touches pressées.

### 📌 BoutonGPIO:

Gère plusieurs boutons GPIO connectés.
- Entrées : configurations des boutons GPIO.
- Sortie : observables pour les pressions de bouton.

### 🌐 BoutonWeb:

Serveur web qui gère des boutons virtuels.
- Entrées : configurations des boutons (broches et étiquettes).
- Sorties : messages lors de la pression d'un bouton via une requête HTTP, émission de valeurs booléennes.

### 👥 Presence:

Système de détection de présence utilisant un capteur ultrasonique.
- Entrées : broches GPIO du capteur, paramètres de distance.
- Sortie : état de présence (Observable avec true pour présence détectée, false sinon).

## 🟢 GPIO - Sortie :

### 🕹️ IGpio_control:

Interface pour contrôler un GPIO.

Méthodes pour modifier l'état du GPIO, obtenir l'état actuel et le numéro de broche associé.

### 🔀 gpio_Controle_Analogique:

Contrôle un relais en utilisant des signaux PWM sur un GPIO spécifique.
- Entrées : durée et étape pour les opérations sur le relais, état actuel.
- Sorties : allumer, éteindre ou effectuer des impulsions sur le relais avec PWM.

###  ⚡ gpio_Controle_Numerique:

Abstraction d'un relais connecté à un Raspberry Pi.
- Entrées : commandes pour allumer/éteindre le relais.
- Sortie : état actuel du relais (allumé ou éteint).

## 🖥 motherboard :

### 🧪 temperature :

Le code présenté est une classe appelée "Temperature" qui surveille la température d'un système. Elle utilise une bibliothèque appelée "rxjs" pour gérer les flux de données asynchrones. L'entrée de la classe est l'intervalle de vérification de la température et la température dangereuse (par défaut, 70 degrés Celsius), et la sortie est un flux d'objets contenant la température actuelle et un indicateur indiquant si la température est dangereuse ou non.
