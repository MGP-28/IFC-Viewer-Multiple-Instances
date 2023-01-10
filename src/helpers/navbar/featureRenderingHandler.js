import NavbarItem from "../../models/navbar/NavbarItemData";

/**
 *
 * @param {NavbarItem} item
 * @param {boolean} isShowing
 * @param {boolean} isRendered
 */
export default function featureRenderingHandler(item, isShowing, isRendered) {
  if (!isRendered) {
    isRendered = true;
    item.build();
  }

  if (isShowing) item.load();
  else item.unload();
}
