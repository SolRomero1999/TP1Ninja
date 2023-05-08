import Game from "./assets/scenes/Game.js";
import GameOver from "./assets/scenes/GameOver.js";

// Create a new Phaser config object
const config = {
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Game, GameOver],
};

// Create a new Phaser game instance