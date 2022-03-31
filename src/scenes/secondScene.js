//@ts-check
import StartScene from "./startScene";

export default class SecondScene extends StartScene {

    constructor(config){
        super(config)

        this.mapPath = "assets/tiledmap/testmap.json";
    }
}