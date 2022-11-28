export default class Selected{
    constructor(){
        this.props = undefined;
        this.modelIdx = undefined;
        this.ids = [];
    }
    addProps(props, ids, modelIdx){
        this.props = props
        this.modelIdx = modelIdx
        this.ids = ids;
    }
    reset(){
        this.props = undefined;
        this.modelIdx = undefined;
        this.ids = undefined;
    }
    isValid(){
        return (this.modelIdx !== undefined)
    }
    isGroupSelection(){
        return (this.ids.length > 1)
    }
}