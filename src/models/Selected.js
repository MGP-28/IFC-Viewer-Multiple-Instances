export default class Selected{
    constructor(){
        this.props = undefined;
        this.modelIdx = undefined;
    }
    addProps(props, modelIdx){
        this.props = props
        this.modelIdx = modelIdx
    }
    reset(){
        this.props = undefined;
        this.modelIdx = undefined;
    }
    isValid(){
        return (this.props !== undefined)
    }
}