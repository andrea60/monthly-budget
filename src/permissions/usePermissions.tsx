import { atom, useAtom } from "jotai";

const permissionAtom = atom(true);

export const usePermissions = () => {
  const [hasPermission, setHasPermission] = useAtom(permissionAtom);

  return {
    hasPermission,
    setHasPermission,
  };
};
