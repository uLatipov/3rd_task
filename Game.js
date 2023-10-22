import select, { Separator } from "@inquirer/select";
import { log } from "console";
import crypto from "crypto";
import { createHmac } from "crypto";
export default class Game {
    #first;
    #second;
    #key;
    #aiChoice;
    constructor(variants) {
        this.variants = variants;
        this.#first = [];
        this.#second = [];
        this.#key = null;
        this.#aiChoice = null;
    }
    start = async () => {
        const HMAC = this.#computer();
        console.log(`HMAC: ${HMAC}`);
        const newarr = this.variants.map((value) => {
            return { name: value, value: value };
        });
        newarr.push({ name: "? - help", value: "help" });
        const user = await select({
            type: "rawlist",
            message: "Available moves:",
            choices: newarr,
            prefix: "Hello",
        });

        return user;
    };
    calculate = (choice) => {
        this.#action(choice);
        let result = {
            user: choice,
            computer: this.#aiChoice,
            result: null,
            key: this.#key,
        };
        if (choice == this.#aiChoice) {
            result.result = "draw";
        } else if (this.#first.includes(this.#aiChoice)) {
            result.result = "win";
        } else {
            result.result = "lose";
        }
        return result;
    };
    #action = (choice) => {
        const nRL = [...this.variants].length - 1;
        let first = [...this.variants];
        let second = first.splice(this.variants.indexOf(choice), nRL + 1);
        second.splice(second.indexOf(choice), 1);
        this.#first = first;
        this.#second = second;
        this.#arrayNormalize();
    };

    #arrayNormalize = () => {
        if (this.#first.length > this.#second.length) {
            this.#second.push(this.#first.shift());
            this.#arrayNormalize();
            return;
        } else if (this.#second.length > this.#first.length) {
            this.#first.push(this.#second.pop());

            this.#arrayNormalize();
            return;
        }
    };

    #computer = () => {
        this.#key = crypto.randomBytes(15).toString("hex");
        this.#aiChoice =
            this.variants[Math.floor(Math.random() * this.variants.length)];
        const hmac = createHmac("sha256", this.#key)
            .update(this.#aiChoice)
            .digest("hex");
        return hmac;
    };

    help = () => {
        let obj = {};
        for (let variant of this.variants) {
            let row = {};
            this.#aiChoice = variant;
            for (let x of this.variants) {
                row[x] = this.calculate(x).result;
            }
            obj[variant] = row;
        }

        console.table(obj);
    };
}
