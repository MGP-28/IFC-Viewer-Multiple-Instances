export default class Axles {
    constructor(x = undefined, y = undefined, z = undefined){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    reset(){
        this.x = undefined;
        this.y = undefined;
        this.z = undefined;
    }
}