/**
 *
 * @param {NavbarItem} item
 */
export default async function featureRenderingHandler(item) {
  if (!item.isRendered) {
    item.isRendered = true;
    await item.build();
  }

  if (item.isActive) item.load();
  else item.unload();
}
