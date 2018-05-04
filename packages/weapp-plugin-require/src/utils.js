export const addExt = (lib, ext) => {
  if (lib.match(new RegExp(`${ext}$`))) {
    return lib;
  }
  return lib + ext;
};
