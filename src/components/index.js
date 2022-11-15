import startInput from "./fileInput.js";
import startUserInputs from "./events/userInputs.js";
import startObjectDetail from "./objectDetail.js";

export default function render(){
    startInput()
    startUserInputs()
    startObjectDetail()
}