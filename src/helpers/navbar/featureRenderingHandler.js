import NavbarItem from "../../models/navbar/NavbarItemData";

/**
 *
 * @param {NavbarItem} item
 */
export default function featureRenderingHandler(item) {
  if (!item.isRendered) {
    item.isRendered = true;
    item.build();
  }

  if (item.isActive) item.load();
  else item.unload();
}
