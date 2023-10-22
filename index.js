import Game from "./Game.js";

const options = process.argv.slice(2, process.argv.length);

if (options.length > 1 && options.length % 2 == 1) {
    const game = new Game(options);
    const user = await game.start();
    if (user == "help") {
        game.help();
    } else {
        const result = game.calculate(user);
        console.log(
            `Your Move: ${result.user}\nComputer Move: ${
                result.computer
            }\n${result.result.toUpperCase()}\nKey: ${result.key}`
        );
    }
} else {
    console.log("wrong arguments, please relaunch app");
}
