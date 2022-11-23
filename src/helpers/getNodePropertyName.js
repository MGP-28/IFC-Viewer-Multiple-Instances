import * as Models from "../stores/models";
import { clearString } from "../helpers/string";

/**
 *  Get node name by gettign the objects properties via expressID
 * @param {Object} node
 * @returns string
 */
export default async function getNodePropertyName(node, idx) {
    const model = Models.models[idx];
    const id = node.expressID;
    const props = await model.loader.ifcManager.getItemProperties(0, id);
    let name = node.type;
  
    if (props.LongName) name = props.LongName.value;
    else if (props.Name) {
      let _name = props.Name.value;
      if (props.Tag) {
        // Clears tag value from name and the preceding ':'
        _name = _name.replace(props.Tag.value, "");
        _name = _name.slice(0, -1);
      }
      name = _name;
    } else if (props.ObjectType) name = props.ObjectType.value;
  
    const text = clearString(name);
    return text;
  }